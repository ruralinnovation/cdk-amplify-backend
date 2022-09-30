import * as cdk from '@aws-cdk/core';
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendTsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'BackendTsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // AWS Cognito User Pool (AWS CDK Level 2 construct) and Identity Pool (AWS CDK Level 1 construct)

    // const userPool = new cognito.UserPool(this, "AmplifyCDKUserPool", {
    //   selfSignUpEnabled: false,     // Allow/Disallow users to sign up
    //   autoVerify: { email: true },   // Verify email addresses by sending verification code/link
    //   signInAliases: { email: true } // Set email as an alias for sign-in user name
    // });

    // const userPoolClient = new cognito.UserPoolClient(this, "AmplifyCDKUserPoolClient", {
    //   userPool,
    //   generateSecret: false // Secret is not required for browser-based amplify apps
    // });

    // ... above ^ is commented out, because I will re-use existing userPool and userPoolClient

    const identityPool = new cognito.CfnIdentityPool(this, "AmplifyCDKIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: `${SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,  //userPoolClient.userPoolClientId,
        providerName: `cognito-idp.us-east-1.amazonaws.com/${SecretValue.secretsManager("userPoolId").unsafeUnwrap()}`      // userPool.userPoolProviderName
      }]
    });

    const serviceRole = iam.Role.fromRoleArn(
        this,
        'amplify-console',
        `${SecretValue.secretsManager("amplifyServiceRole").unsafeUnwrap()}`,
        // aws secretsmanager create-secret --name amplifyServiceRole  --secret-string '***'
        // {
        //   "ARN": "arn:aws:secretsmanager:us-east-1:312512371189:secret:amplifyServiceRole-LfBaw3",
        //     "Name": "amplifyServiceRole",
        //     "VersionId": "0816f534-0f32-46cd-9bff-e4eeeed5bc5a"
        // }
    { mutable: false },
    );

    // AWS Amplify App: Frontend
    const app = new amplify.App(this, "amplify-frontend", {
      role: serviceRole,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "ruralinnovation",
        repository: "cdk-amplify-frontend",
        oauthToken: SecretValue.secretsManager("gh_token")
        // $ aws secretsmanager create-secret --name gh_token --secret-string $GITHUB_PAT
        // {
        //   "ARN": "arn:aws:secretsmanager:us-east-1:312512371189:secret:gh_token-GkY8AT",
        //   "Name": "gh_token",
        //   "VersionId": "198ab2fe-4895-461c-be21-e88865ac836e"
        // }
      }),
      autoBranchCreation: { // Automatically connect branches that match a pattern set
        patterns: [ 'main*', 'dev*' ],
      },
      environmentVariables: {
        'USER_POOL_ID': `${SecretValue.secretsManager("userPoolId").unsafeUnwrap()}`,                // userPool.userPoolId,
        'USER_POOL_CLIENT_ID': `${SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,  // userPoolClient.userPoolClientId,
        'IDENTITY_POOL_ID': identityPool.ref,
        'REGION': this.region
      }
    });

    const frontendMainBranch = app.addBranch("main")
  }
}
