import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface GitHubOidcStackProps extends cdk.StackProps {
  repositoryOwner: string;
  repositoryName: string;
}

export class GitHubOidcStack extends cdk.Stack {
  public readonly deploymentRole: iam.Role;

  constructor(scope: Construct, id: string, props: GitHubOidcStackProps) {
    super(scope, id, props);

    // Apply standard tags
    cdk.Tags.of(this).add('Application', 'cassiecayphotography');
    cdk.Tags.of(this).add('Environment', 'production');
    cdk.Tags.of(this).add('ManagedBy', 'cdk');
    cdk.Tags.of(this).add('Repository', `${props.repositoryOwner}/${props.repositoryName}`);

    // Create or reference GitHub OIDC provider
    // Using fromOpenIdConnectProviderArn to avoid duplicate provider errors
    // If the provider doesn't exist, use the creation block below instead
    const githubOidcProvider = new iam.OpenIdConnectProvider(this, 'GitHubOidcProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: [
        '6938fd4d98bab03faadb97b34396831e3780aea1',
        '1c58a3a8518e8759bf075b76b750d4f2df264fcd',
      ],
    });

    // Create IAM role for GitHub Actions
    this.deploymentRole = new iam.Role(this, 'GitHubActionsDeploymentRole', {
      roleName: 'CassiePhotoGitHubActionsDeploymentRole',
      assumedBy: new iam.FederatedPrincipal(
        githubOidcProvider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${props.repositoryOwner}/${props.repositoryName}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
      description: 'Role for GitHub Actions to deploy Cassie Cay Photography static site',
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // S3 permissions for deployment
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'S3DeploymentPermissions',
        effect: iam.Effect.ALLOW,
        actions: [
          's3:PutObject',
          's3:GetObject',
          's3:DeleteObject',
          's3:ListBucket',
          's3:GetBucketLocation',
        ],
        resources: [
          `arn:aws:s3:::cassiecayphotography.com-site-content`,
          `arn:aws:s3:::cassiecayphotography.com-site-content/*`,
        ],
      })
    );

    // CloudFront permissions for cache invalidation
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        sid: 'CloudFrontInvalidation',
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudfront:CreateInvalidation',
          'cloudfront:GetInvalidation',
          'cloudfront:ListInvalidations',
        ],
        resources: ['*'], // CloudFront doesn't support resource-level permissions for invalidations
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'DeploymentRoleArn', {
      value: this.deploymentRole.roleArn,
      description: 'ARN of the GitHub Actions deployment role',
      exportName: 'CassiePhotoGitHubActionsRoleArn',
    });

    new cdk.CfnOutput(this, 'OidcProviderArn', {
      value: githubOidcProvider.openIdConnectProviderArn,
      description: 'ARN of the GitHub OIDC provider',
    });
  }
}
