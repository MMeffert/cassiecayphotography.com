#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StaticSiteStack } from '../lib/static-site-stack';
import { GitHubOidcStack } from '../lib/github-oidc-stack';

const app = new cdk.App();

const env = {
  account: '241654197557',
  region: 'us-east-1', // Required for CloudFront + ACM
};

// GitHub OIDC provider and deployment role
new GitHubOidcStack(app, 'CassiePhotoGitHubOidcStack', {
  env,
  description: 'GitHub OIDC provider and deployment role for Cassie Cay Photography',
  repositoryOwner: 'MMeffert',
  repositoryName: 'cassiecayphotography.com',
});

// Static site infrastructure (S3, CloudFront, Route53)
// NOTE: skipDomainSetup=true for initial deployment alongside existing infrastructure
// After migration, set to false (or remove) and redeploy to attach the domain
new StaticSiteStack(app, 'CassiePhotoStaticSiteStack', {
  env,
  description: 'Static site infrastructure for Cassie Cay Photography',
  domainName: 'cassiecayphotography.com',
  skipDomainSetup: true, // TODO: Set to false after migrating from old infrastructure
});

app.synth();
