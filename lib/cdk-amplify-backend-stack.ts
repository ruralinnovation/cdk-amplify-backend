import * as cdk from "@aws-cdk/core";
import * as amplify from "@aws-cdk/aws-amplify";
import * as cognito from "@aws-cdk/aws-cognito";
import * as iam from "@aws-cdk/aws-iam";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkAmplifyBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your cdk.Stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAmplifyBackendQueue', {
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

    // const identityPool = new cognito.CfnIdentityPool(this, "AmplifyCDKIdentityPool", {
    //   allowUnauthenticatedIdentities: true,
    //   cognitoIdentityProviders: [{
    //     clientId: `${cdk.SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,  //userPoolClient.userPoolClientId,
    //     providerName: `cognito-idp.us-east-1.amazonaws.com/${cdk.SecretValue.secretsManager("userPoolId").unsafeUnwrap()}`      // userPool.userPoolProviderName
    //   }]
    // });

    // const serviceRole = iam.Role.fromRoleArn(
    //     this,
    //     'amplify-console',
    //     `${cdk.SecretValue.secretsManager("amplifyServiceRole").unsafeUnwrap()}`,
    //     // aws secretsmanager create-secret --name amplifyServiceRole  --secret-string '***'
    //     { mutable: false },
    // );

    // AWS Amplify App: Frontend
    const amplifyApp = new amplify.App((<cdk.Construct>(this)), "amplify-frontend", {
      // role: serviceRole,
      sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
        owner: "Real-Currents",
        repository: "cdk-amplify-frontend",
        oauthToken: cdk.SecretValue.secretsManager("gh_token")
        // $ aws secretsmanager create-secret --name gh_token --secret-string $GITHUB_PAT
      }),
      autoBranchCreation: { // Automatically connect branches that match a pattern set
        patterns: [ 'main*', 'dev*' ],
      },
      environmentVariables: {
        'APP_VERSION': "1",
        'API_BACKEND': "https://frontend.ruralopportunitymap.us",
        'VERSION_AMPLIFY': "10.5.2",
        // 'USER_POOL_ID': `${cdk.SecretValue.secretsManager("userPoolId").unsafeUnwrap()}`,                // userPool.userPoolId,
        // 'USER_POOL_CLIENT_ID': `${cdk.SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,  // userPoolClient.userPoolClientId,
        // 'IDENTITY_POOL_ID': identityPool.ref,
        // 'REGION': this.region
      }
    });

    amplifyApp.addBranch("main")
  }
}
