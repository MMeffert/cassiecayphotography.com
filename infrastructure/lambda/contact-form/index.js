const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const ses = new SESClient({ region: 'us-east-1' });
const secretsManager = new SecretsManagerClient({ region: 'us-east-1' });

// Configuration from environment variables
const SENDER = process.env.SENDER_EMAIL;
const RECEIVER = process.env.RECEIVER_EMAIL;
const SUBJECT = process.env.EMAIL_SUBJECT || 'Contact Form Submission';

// reCAPTCHA Enterprise configuration
const RECAPTCHA_API_KEY_SECRET_NAME = process.env.RECAPTCHA_API_KEY_SECRET_NAME;
const RECAPTCHA_PROJECT_ID = process.env.RECAPTCHA_PROJECT_ID;
const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
const RECAPTCHA_SCORE_THRESHOLD = parseFloat(process.env.RECAPTCHA_SCORE_THRESHOLD || '0.5');

// Input validation constraints
const VALIDATION = {
    name: { minLength: 2, maxLength: 100 },
    email: { maxLength: 254 },  // RFC 5321 max email length
    subject: { maxLength: 200 },
    message: { minLength: 10, maxLength: 5000 },
};

// Cache the API key to avoid fetching on every request
let cachedApiKey = null;

async function getRecaptchaApiKey() {
    if (cachedApiKey) {
        return cachedApiKey;
    }
    const command = new GetSecretValueCommand({ SecretId: RECAPTCHA_API_KEY_SECRET_NAME });
    const response = await secretsManager.send(command);
    cachedApiKey = response.SecretString;
    return cachedApiKey;
}

/**
 * Validate and sanitize input fields
 * @returns {{ valid: boolean, errors?: string[], data?: object }}
 */
function validateInput(body) {
    const errors = [];

    // Check required fields exist
    if (!body || typeof body !== 'object') {
        return { valid: false, errors: ['Invalid request body'] };
    }

    const { name, email, subject, message, recaptchaToken } = body;

    // Validate name
    if (typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required');
    } else if (name.trim().length < VALIDATION.name.minLength) {
        errors.push(`Name must be at least ${VALIDATION.name.minLength} characters`);
    } else if (name.length > VALIDATION.name.maxLength) {
        errors.push(`Name must be less than ${VALIDATION.name.maxLength} characters`);
    }

    // Validate email format
    if (typeof email !== 'string' || email.trim().length === 0) {
        errors.push('Email is required');
    } else if (email.length > VALIDATION.email.maxLength) {
        errors.push(`Email must be less than ${VALIDATION.email.maxLength} characters`);
    } else if (!isValidEmail(email)) {
        errors.push('Invalid email format');
    }

    // Validate subject (optional but has max length)
    if (subject !== undefined && subject !== null) {
        if (typeof subject !== 'string') {
            errors.push('Subject must be a string');
        } else if (subject.length > VALIDATION.subject.maxLength) {
            errors.push(`Subject must be less than ${VALIDATION.subject.maxLength} characters`);
        }
    }

    // Validate message
    if (typeof message !== 'string' || message.trim().length === 0) {
        errors.push('Message is required');
    } else if (message.trim().length < VALIDATION.message.minLength) {
        errors.push(`Message must be at least ${VALIDATION.message.minLength} characters`);
    } else if (message.length > VALIDATION.message.maxLength) {
        errors.push(`Message must be less than ${VALIDATION.message.maxLength} characters`);
    }

    // Validate reCAPTCHA token
    if (typeof recaptchaToken !== 'string' || recaptchaToken.trim().length === 0) {
        errors.push('reCAPTCHA token is required');
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    // Return sanitized data
    return {
        valid: true,
        data: {
            name: sanitizeString(name.trim()),
            email: email.trim().toLowerCase(),
            subject: subject ? sanitizeString(subject.trim()) : '',
            message: sanitizeString(message.trim()),
            recaptchaToken: recaptchaToken.trim(),
        },
    };
}

/**
 * Basic email format validation
 */
function isValidEmail(email) {
    // Simple but effective email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitize string to prevent email header injection and clean up input
 */
function sanitizeString(str) {
    // Remove control characters and normalize whitespace
    return str
        .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
        .replace(/\r\n/g, '\n')           // Normalize line endings
        .replace(/\r/g, '\n');            // Normalize line endings
}

exports.handler = async function (event, context) {
    // Log only safe metadata (no PII)
    console.log('Contact form request received', {
        requestId: context.awsRequestId,
        sourceIp: event.requestContext?.http?.sourceIp ? '[REDACTED]' : 'unknown',
        userAgent: event.requestContext?.http?.userAgent ? '[PRESENT]' : 'unknown',
    });

    // Parse body with error handling
    let body;
    try {
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else if (event.body) {
            body = event.body;
        } else {
            body = event;
        }
    } catch (parseError) {
        console.log('JSON parse error');
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'Invalid JSON body' }),
        };
    }

    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
        console.log('Validation failed:', validation.errors.length, 'errors');
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'Validation failed', errors: validation.errors }),
        };
    }

    const { name, email, subject, message, recaptchaToken } = validation.data;

    // Verify reCAPTCHA token
    try {
        const apiKey = await getRecaptchaApiKey();
        const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'contact_submit', apiKey);

        if (!recaptchaResult.success) {
            console.log('reCAPTCHA verification failed:', recaptchaResult.reason);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: 'Failed', reason: 'reCAPTCHA verification failed' }),
            };
        }

        if (recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
            console.log('reCAPTCHA score below threshold:', recaptchaResult.score);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: 'Failed', reason: 'Submission blocked' }),
            };
        }

        console.log('reCAPTCHA passed, score:', recaptchaResult.score);
    } catch (error) {
        console.error('reCAPTCHA error:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'reCAPTCHA service error' }),
        };
    }

    // Send email
    try {
        await sendEmail({ name, email, subject, message });
        console.log('Email sent successfully');
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Success' }),
        };
    } catch (error) {
        console.error('Email error:', error.message);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'Email service error' }),
        };
    }
};

async function verifyRecaptcha(token, expectedAction, apiKey) {
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event: {
                token,
                siteKey: RECAPTCHA_SITE_KEY,
                expectedAction,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`reCAPTCHA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    // Log only non-sensitive reCAPTCHA response data
    console.log('reCAPTCHA assessment:', {
        valid: data.tokenProperties?.valid,
        action: data.tokenProperties?.action,
        score: data.riskAnalysis?.score,
    });

    if (data.error) {
        return { success: false, reason: data.error.message };
    }

    const tokenValid = data.tokenProperties?.valid === true;
    const actionMatch = data.tokenProperties?.action === expectedAction;
    const score = data.riskAnalysis?.score ?? 0;

    if (!tokenValid) {
        return { success: false, reason: 'Invalid token', score: 0 };
    }

    if (!actionMatch) {
        return { success: false, reason: 'Action mismatch', score };
    }

    return { success: true, score };
}

async function sendEmail({ name, email, subject, message }) {
    const emailBody = [
        `From: ${name}`,
        `Email: ${email}`,
        subject ? `Subject: ${subject}` : null,
        '',
        'Message:',
        message,
    ].filter(Boolean).join('\n\n');

    const command = new SendEmailCommand({
        Destination: { ToAddresses: [RECEIVER] },
        Message: {
            Body: {
                Text: {
                    Data: emailBody,
                    Charset: 'UTF-8',
                },
            },
            Subject: { Data: SUBJECT, Charset: 'UTF-8' },
        },
        Source: SENDER,
    });

    return ses.send(command);
}
