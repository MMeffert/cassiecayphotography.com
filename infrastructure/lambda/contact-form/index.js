const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const https = require('https');

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

function verifyRecaptcha(token, expectedAction, apiKey) {
    return new Promise((resolve, reject) => {
        const requestBody = JSON.stringify({
            event: {
                token: token,
                siteKey: RECAPTCHA_SITE_KEY,
                expectedAction: expectedAction
            }
        });

        const options = {
            hostname: 'recaptchaenterprise.googleapis.com',
            port: 443,
            path: `/v1/projects/${RECAPTCHA_PROJECT_ID}/assessments?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    console.log('reCAPTCHA response:', JSON.stringify(response));

                    if (response.error) {
                        resolve({ success: false, reason: response.error.message });
                        return;
                    }

                    const tokenValid = response.tokenProperties?.valid === true;
                    const actionMatch = response.tokenProperties?.action === expectedAction;
                    const score = response.riskAnalysis?.score || 0;

                    if (!tokenValid) {
                        resolve({ success: false, reason: 'Invalid token', score: 0 });
                    } else if (!actionMatch) {
                        resolve({ success: false, reason: 'Action mismatch', score: score });
                    } else {
                        resolve({ success: true, score: score });
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(requestBody);
        req.end();
    });
}

async function sendEmail(event) {
    const params = {
        Destination: {
            ToAddresses: [RECEIVER]
        },
        Message: {
            Body: {
                Text: {
                    Data: 'From: ' + event.name + '\n\nEmail: ' + event.email + '\n\nSubject: ' + event.subject + '\n\nMessage: ' + event.message,
                    Charset: 'UTF-8'
                }
            },
            Subject: {
                Data: SUBJECT,
                Charset: 'UTF-8'
            }
        },
        Source: SENDER
    };

    const command = new SendEmailCommand(params);
    return ses.send(command);
}
