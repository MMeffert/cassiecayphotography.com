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

exports.handler = async function (event, context) {
    console.log('Received event:', JSON.stringify(event));

    // Parse body if it's a string (from Function URL)
    let body = event;
    if (typeof event.body === 'string') {
        body = JSON.parse(event.body);
    } else if (event.body) {
        body = event.body;
    }

    // Verify reCAPTCHA token
    try {
        const apiKey = await getRecaptchaApiKey();
        const recaptchaResult = await verifyRecaptcha(body.recaptchaToken, 'contact_submit', apiKey);

        if (!recaptchaResult.success) {
            console.log('reCAPTCHA verification failed:', recaptchaResult.reason);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: 'Failed', reason: 'reCAPTCHA verification failed' })
            };
        }

        if (recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
            console.log('reCAPTCHA score too low:', recaptchaResult.score);
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ result: 'Failed', reason: 'Submission blocked' })
            };
        }

        console.log('reCAPTCHA passed with score:', recaptchaResult.score);

    } catch (error) {
        console.error('reCAPTCHA error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'reCAPTCHA service error' })
        };
    }

    // Send email
    try {
        console.log('Attempting to send email to:', RECEIVER);
        const emailResult = await sendEmail(body);
        console.log('Email sent successfully:', JSON.stringify(emailResult));
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Success' })
        };
    } catch (error) {
        console.error('Email error:', error.message);
        console.error('Email error stack:', error.stack);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ result: 'Failed', reason: 'Email service error' })
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
                expectedAction
            }
        })
    });

    if (!response.ok) {
        throw new Error(`reCAPTCHA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('reCAPTCHA response:', JSON.stringify(data));

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
    const command = new SendEmailCommand({
        Destination: { ToAddresses: [RECEIVER] },
        Message: {
            Body: {
                Text: {
                    Data: `From: ${name}\n\nEmail: ${email}\n\nSubject: ${subject}\n\nMessage: ${message}`,
                    Charset: 'UTF-8'
                }
            },
            Subject: { Data: SUBJECT, Charset: 'UTF-8' }
        },
        Source: SENDER
    });

    return ses.send(command);
}
