"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendTsStack = void 0;
const core_1 = require("@aws-cdk/core");
const amplify = require("@aws-cdk/aws-amplify");
const cognito = require("@aws-cdk/aws-cognito");
const iam = require("@aws-cdk/aws-iam");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class BackendTsStack extends core_1.Stack {
    constructor(scope, id, props) {
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
                    clientId: `${core_1.SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,
                    providerName: `cognito-idp.us-east-1.amazonaws.com/${core_1.SecretValue.secretsManager("userPoolId").unsafeUnwrap()}` // userPool.userPoolProviderName
                }]
        });
        const serviceRole = iam.Role.fromRoleArn(this, 'amplify-console', `${core_1.SecretValue.secretsManager("amplifyServiceRole").unsafeUnwrap()}`, 
        // aws secretsmanager create-secret --name amplifyServiceRole  --secret-string '***'
        // {
        //   "ARN": "arn:aws:secretsmanager:us-east-1:312512371189:secret:amplifyServiceRole-LfBaw3",
        //     "Name": "amplifyServiceRole",
        //     "VersionId": "0816f534-0f32-46cd-9bff-e4eeeed5bc5a"
        // }
        { mutable: false });
        // AWS Amplify App: Frontend
        const app = new amplify.App(this, "amplify-frontend", {
            role: serviceRole,
            sourceCodeProvider: new amplify.GitHubSourceCodeProvider({
                owner: "ruralinnovation",
                repository: "cdk-amplify-frontend",
                oauthToken: core_1.SecretValue.secretsManager("gh_token")
                // $ aws secretsmanager create-secret --name gh_token --secret-string $GITHUB_PAT
                // {
                //   "ARN": "arn:aws:secretsmanager:us-east-1:312512371189:secret:gh_token-GkY8AT",
                //   "Name": "gh_token",
                //   "VersionId": "198ab2fe-4895-461c-be21-e88865ac836e"
                // }
            }),
            autoBranchCreation: {
                patterns: ['main*', 'dev*'],
            },
            environmentVariables: {
                'USER_POOL_ID': `${core_1.SecretValue.secretsManager("userPoolId").unsafeUnwrap()}`,
                'USER_POOL_CLIENT_ID': `${core_1.SecretValue.secretsManager("userPoolClientId").unsafeUnwrap()}`,
                'IDENTITY_POOL_ID': identityPool.ref,
                'REGION': this.region
            }
        });
        const frontendMainBranch = app.addBranch("main");
    }
}
exports.BackendTsStack = BackendTsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2VuZC10cy1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImJhY2tlbmQtdHMtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0Esd0NBQTBFO0FBQzFFLGdEQUFnRDtBQUNoRCxnREFBZ0Q7QUFDaEQsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUU5QyxNQUFhLGNBQWUsU0FBUSxZQUFLO0lBQ3ZDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNkNBQTZDO1FBRTdDLG1CQUFtQjtRQUNuQix3REFBd0Q7UUFDeEQsaURBQWlEO1FBQ2pELE1BQU07UUFFTixrR0FBa0c7UUFFbEcsc0VBQXNFO1FBQ3RFLHFFQUFxRTtRQUNyRSwrRkFBK0Y7UUFDL0Ysa0ZBQWtGO1FBQ2xGLE1BQU07UUFFTix3RkFBd0Y7UUFDeEYsY0FBYztRQUNkLG1GQUFtRjtRQUNuRixNQUFNO1FBRU4sMkZBQTJGO1FBRTNGLE1BQU0sWUFBWSxHQUFHLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsd0JBQXdCLEVBQUU7WUFDL0UsOEJBQThCLEVBQUUsSUFBSTtZQUNwQyx3QkFBd0IsRUFBRSxDQUFDO29CQUN6QixRQUFRLEVBQUUsR0FBRyxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO29CQUM1RSxZQUFZLEVBQUUsdUNBQXVDLGtCQUFXLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQU0sZ0NBQWdDO2lCQUNySixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQ3BDLElBQUksRUFDSixpQkFBaUIsRUFDakIsR0FBRyxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO1FBQ3BFLG9GQUFvRjtRQUNwRixJQUFJO1FBQ0osNkZBQTZGO1FBQzdGLG9DQUFvQztRQUNwQywwREFBMEQ7UUFDMUQsSUFBSTtRQUNSLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUNqQixDQUFDO1FBRUYsNEJBQTRCO1FBQzVCLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUU7WUFDcEQsSUFBSSxFQUFFLFdBQVc7WUFDakIsa0JBQWtCLEVBQUUsSUFBSSxPQUFPLENBQUMsd0JBQXdCLENBQUM7Z0JBQ3ZELEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLFVBQVUsRUFBRSxzQkFBc0I7Z0JBQ2xDLFVBQVUsRUFBRSxrQkFBVyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7Z0JBQ2xELGlGQUFpRjtnQkFDakYsSUFBSTtnQkFDSixtRkFBbUY7Z0JBQ25GLHdCQUF3QjtnQkFDeEIsd0RBQXdEO2dCQUN4RCxJQUFJO2FBQ0wsQ0FBQztZQUNGLGtCQUFrQixFQUFFO2dCQUNsQixRQUFRLEVBQUUsQ0FBRSxPQUFPLEVBQUUsTUFBTSxDQUFFO2FBQzlCO1lBQ0Qsb0JBQW9CLEVBQUU7Z0JBQ3BCLGNBQWMsRUFBRSxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUFFO2dCQUM1RSxxQkFBcUIsRUFBRSxHQUFHLGtCQUFXLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUU7Z0JBQ3pGLGtCQUFrQixFQUFFLFlBQVksQ0FBQyxHQUFHO2dCQUNwQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU07YUFDdEI7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEQsQ0FBQztDQUNGO0FBMUVELHdDQTBFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCAqIGFzIGFtcGxpZnkgZnJvbSBcIkBhd3MtY2RrL2F3cy1hbXBsaWZ5XCI7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gXCJAYXdzLWNkay9hd3MtY29nbml0b1wiO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gXCJAYXdzLWNkay9hd3MtaWFtXCI7XG4vLyBpbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5cbmV4cG9ydCBjbGFzcyBCYWNrZW5kVHNTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgY29kZSB0aGF0IGRlZmluZXMgeW91ciBzdGFjayBnb2VzIGhlcmVcblxuICAgIC8vIGV4YW1wbGUgcmVzb3VyY2VcbiAgICAvLyBjb25zdCBxdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0JhY2tlbmRUc1F1ZXVlJywge1xuICAgIC8vICAgdmlzaWJpbGl0eVRpbWVvdXQ6IGNkay5EdXJhdGlvbi5zZWNvbmRzKDMwMClcbiAgICAvLyB9KTtcblxuICAgIC8vIEFXUyBDb2duaXRvIFVzZXIgUG9vbCAoQVdTIENESyBMZXZlbCAyIGNvbnN0cnVjdCkgYW5kIElkZW50aXR5IFBvb2wgKEFXUyBDREsgTGV2ZWwgMSBjb25zdHJ1Y3QpXG5cbiAgICAvLyBjb25zdCB1c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsIFwiQW1wbGlmeUNES1VzZXJQb29sXCIsIHtcbiAgICAvLyAgIHNlbGZTaWduVXBFbmFibGVkOiBmYWxzZSwgICAgIC8vIEFsbG93L0Rpc2FsbG93IHVzZXJzIHRvIHNpZ24gdXBcbiAgICAvLyAgIGF1dG9WZXJpZnk6IHsgZW1haWw6IHRydWUgfSwgICAvLyBWZXJpZnkgZW1haWwgYWRkcmVzc2VzIGJ5IHNlbmRpbmcgdmVyaWZpY2F0aW9uIGNvZGUvbGlua1xuICAgIC8vICAgc2lnbkluQWxpYXNlczogeyBlbWFpbDogdHJ1ZSB9IC8vIFNldCBlbWFpbCBhcyBhbiBhbGlhcyBmb3Igc2lnbi1pbiB1c2VyIG5hbWVcbiAgICAvLyB9KTtcblxuICAgIC8vIGNvbnN0IHVzZXJQb29sQ2xpZW50ID0gbmV3IGNvZ25pdG8uVXNlclBvb2xDbGllbnQodGhpcywgXCJBbXBsaWZ5Q0RLVXNlclBvb2xDbGllbnRcIiwge1xuICAgIC8vICAgdXNlclBvb2wsXG4gICAgLy8gICBnZW5lcmF0ZVNlY3JldDogZmFsc2UgLy8gU2VjcmV0IGlzIG5vdCByZXF1aXJlZCBmb3IgYnJvd3Nlci1iYXNlZCBhbXBsaWZ5IGFwcHNcbiAgICAvLyB9KTtcblxuICAgIC8vIC4uLiBhYm92ZSBeIGlzIGNvbW1lbnRlZCBvdXQsIGJlY2F1c2UgSSB3aWxsIHJlLXVzZSBleGlzdGluZyB1c2VyUG9vbCBhbmQgdXNlclBvb2xDbGllbnRcblxuICAgIGNvbnN0IGlkZW50aXR5UG9vbCA9IG5ldyBjb2duaXRvLkNmbklkZW50aXR5UG9vbCh0aGlzLCBcIkFtcGxpZnlDREtJZGVudGl0eVBvb2xcIiwge1xuICAgICAgYWxsb3dVbmF1dGhlbnRpY2F0ZWRJZGVudGl0aWVzOiB0cnVlLFxuICAgICAgY29nbml0b0lkZW50aXR5UHJvdmlkZXJzOiBbe1xuICAgICAgICBjbGllbnRJZDogYCR7U2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoXCJ1c2VyUG9vbENsaWVudElkXCIpLnVuc2FmZVVud3JhcCgpfWAsICAvL3VzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXG4gICAgICAgIHByb3ZpZGVyTmFtZTogYGNvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tLyR7U2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoXCJ1c2VyUG9vbElkXCIpLnVuc2FmZVVud3JhcCgpfWAgICAgICAvLyB1c2VyUG9vbC51c2VyUG9vbFByb3ZpZGVyTmFtZVxuICAgICAgfV1cbiAgICB9KTtcblxuICAgIGNvbnN0IHNlcnZpY2VSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oXG4gICAgICAgIHRoaXMsXG4gICAgICAgICdhbXBsaWZ5LWNvbnNvbGUnLFxuICAgICAgICBgJHtTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcihcImFtcGxpZnlTZXJ2aWNlUm9sZVwiKS51bnNhZmVVbndyYXAoKX1gLFxuICAgICAgICAvLyBhd3Mgc2VjcmV0c21hbmFnZXIgY3JlYXRlLXNlY3JldCAtLW5hbWUgYW1wbGlmeVNlcnZpY2VSb2xlICAtLXNlY3JldC1zdHJpbmcgJyoqKidcbiAgICAgICAgLy8ge1xuICAgICAgICAvLyAgIFwiQVJOXCI6IFwiYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy1lYXN0LTE6MzEyNTEyMzcxMTg5OnNlY3JldDphbXBsaWZ5U2VydmljZVJvbGUtTGZCYXczXCIsXG4gICAgICAgIC8vICAgICBcIk5hbWVcIjogXCJhbXBsaWZ5U2VydmljZVJvbGVcIixcbiAgICAgICAgLy8gICAgIFwiVmVyc2lvbklkXCI6IFwiMDgxNmY1MzQtMGYzMi00NmNkLTliZmYtZTRlZWVlZDViYzVhXCJcbiAgICAgICAgLy8gfVxuICAgIHsgbXV0YWJsZTogZmFsc2UgfSxcbiAgICApO1xuXG4gICAgLy8gQVdTIEFtcGxpZnkgQXBwOiBGcm9udGVuZFxuICAgIGNvbnN0IGFwcCA9IG5ldyBhbXBsaWZ5LkFwcCh0aGlzLCBcImFtcGxpZnktZnJvbnRlbmRcIiwge1xuICAgICAgcm9sZTogc2VydmljZVJvbGUsXG4gICAgICBzb3VyY2VDb2RlUHJvdmlkZXI6IG5ldyBhbXBsaWZ5LkdpdEh1YlNvdXJjZUNvZGVQcm92aWRlcih7XG4gICAgICAgIG93bmVyOiBcInJ1cmFsaW5ub3ZhdGlvblwiLFxuICAgICAgICByZXBvc2l0b3J5OiBcImNkay1hbXBsaWZ5LWZyb250ZW5kXCIsXG4gICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwiZ2hfdG9rZW5cIilcbiAgICAgICAgLy8gJCBhd3Mgc2VjcmV0c21hbmFnZXIgY3JlYXRlLXNlY3JldCAtLW5hbWUgZ2hfdG9rZW4gLS1zZWNyZXQtc3RyaW5nICRHSVRIVUJfUEFUXG4gICAgICAgIC8vIHtcbiAgICAgICAgLy8gICBcIkFSTlwiOiBcImFybjphd3M6c2VjcmV0c21hbmFnZXI6dXMtZWFzdC0xOjMxMjUxMjM3MTE4OTpzZWNyZXQ6Z2hfdG9rZW4tR2tZOEFUXCIsXG4gICAgICAgIC8vICAgXCJOYW1lXCI6IFwiZ2hfdG9rZW5cIixcbiAgICAgICAgLy8gICBcIlZlcnNpb25JZFwiOiBcIjE5OGFiMmZlLTQ4OTUtNDYxYy1iZTIxLWU4ODg2NWFjODM2ZVwiXG4gICAgICAgIC8vIH1cbiAgICAgIH0pLFxuICAgICAgYXV0b0JyYW5jaENyZWF0aW9uOiB7IC8vIEF1dG9tYXRpY2FsbHkgY29ubmVjdCBicmFuY2hlcyB0aGF0IG1hdGNoIGEgcGF0dGVybiBzZXRcbiAgICAgICAgcGF0dGVybnM6IFsgJ21haW4qJywgJ2RldionIF0sXG4gICAgICB9LFxuICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgJ1VTRVJfUE9PTF9JRCc6IGAke1NlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwidXNlclBvb2xJZFwiKS51bnNhZmVVbndyYXAoKX1gLCAgICAgICAgICAgICAgICAvLyB1c2VyUG9vbC51c2VyUG9vbElkLFxuICAgICAgICAnVVNFUl9QT09MX0NMSUVOVF9JRCc6IGAke1NlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKFwidXNlclBvb2xDbGllbnRJZFwiKS51bnNhZmVVbndyYXAoKX1gLCAgLy8gdXNlclBvb2xDbGllbnQudXNlclBvb2xDbGllbnRJZCxcbiAgICAgICAgJ0lERU5USVRZX1BPT0xfSUQnOiBpZGVudGl0eVBvb2wucmVmLFxuICAgICAgICAnUkVHSU9OJzogdGhpcy5yZWdpb25cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGZyb250ZW5kTWFpbkJyYW5jaCA9IGFwcC5hZGRCcmFuY2goXCJtYWluXCIpXG4gIH1cbn1cbiJdfQ==