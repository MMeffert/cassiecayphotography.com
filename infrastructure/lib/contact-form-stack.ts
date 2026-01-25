import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface ContactFormStackProps extends cdk.StackProps {
  domainName: string;
}

export class ContactFormStack extends cdk.Stack {
  public readonly functionUrl: lambda.FunctionUrl;

  constructor(scope: Construct, id: string, props: ContactFormStackProps) {
    super(scope, id, props);

    // Apply standard tags
    cdk.Tags.of(this).add('Application', 'cassiecayphotography');
    cdk.Tags.of(this).add('Environment', 'production');
    cdk.Tags.of(this).add('ManagedBy', 'cdk');
    cdk.Tags.of(this).add('Repository', 'Meffert-House/cassiecayphotography.com');

    // Import existing Secrets Manager secret for the reCAPTCHA API key
    // The secret was created manually and its value is managed outside of CDK
    const recaptchaSecretName = 'cassiecayphotography-website/recaptcha-api-key';
    const recaptchaApiKeySecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      'RecaptchaApiKey',
      recaptchaSecretName,
    );

    // Create Lambda function for contact form
    const contactFormFunction = new lambda.Function(this, 'ContactFormFunction', {
      functionName: 'cassiecayphotography-website-contact-form',
      runtime: lambda.Runtime.NODEJS_24_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/contact-form'),
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      // Rate limiting: limit concurrent executions to prevent cost abuse
      // 5 concurrent = ~5 requests/second max, sufficient for legitimate contact form usage
      reservedConcurrentExecutions: 5,
      environment: {
        SENDER_EMAIL: 'no-reply@cassiecayphotography.com',
        RECEIVER_EMAIL: 'cassiecayphoto@gmail.com',
        EMAIL_SUBJECT: 'Contact Form Submission',
        RECAPTCHA_API_KEY_SECRET_NAME: recaptchaSecretName,
        RECAPTCHA_PROJECT_ID: 'cassiecayphotographycom',
        RECAPTCHA_SITE_KEY: '6LchXjYsAAAAANiJ_B8AKMUp7vwsJx_8HnKLBzr2',
        RECAPTCHA_SCORE_THRESHOLD: '0.5',
      },
      description: 'Contact form handler for cassiecayphotography.com',
    });

    // Grant Lambda permission to read the secret
    recaptchaApiKeySecret.grantRead(contactFormFunction);

    // Grant Lambda permission to send emails via SES
    contactFormFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'],
      conditions: {
        StringEquals: {
          'ses:FromAddress': 'no-reply@cassiecayphotography.com',
        },
      },
    }));

    // Create Function URL (replaces API Gateway for simpler setup)
    // Note: OPTIONS is handled automatically by Lambda Function URLs for CORS preflight
    this.functionUrl = contactFormFunction.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: [
          'https://cassiecayphotography.com',
          'https://www.cassiecayphotography.com',
        ],
        allowedMethods: [lambda.HttpMethod.POST],
        allowedHeaders: ['Content-Type'],
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'FunctionUrl', {
      value: this.functionUrl.url,
      description: 'Contact form Lambda Function URL',
      exportName: 'CassiePhotoContactFormUrl',
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: recaptchaApiKeySecret.secretArn,
      description: 'ARN of the Secrets Manager secret for reCAPTCHA API key',
    });
  }
}
