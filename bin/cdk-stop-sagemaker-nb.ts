#!/usr/bin/env node
import cdk = require('@aws-cdk/cdk');
import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import iam = require('@aws-cdk/aws-iam');

class CdkStopSagemakerNbStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    /** Create the IAM role with permissions to list and stop notebook instances */
    const role = new iam.Role(this, 'LambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicyArns: ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]
    });    
    role.addToPolicy(new iam.PolicyStatement()
        .addAllResources()
        .addAction('sagemaker:ListNotebookInstances')
        .addAction('sagemaker:StopNotebookInstance'));

    /** Create the Lambda function */
    const stopFunction  = new lambda.Function(this, 'StopNbFunction', {
      runtime: lambda.Runtime.Python36,
      handler: 'stopnb.lambda_handler',
      code: lambda.Code.asset('lambda'),
      role: role
    });    

    /** Create the CW Event to run every minute */
    const rule = new events.EventRule(this, 'EveryEveningEvent', {
      description: "RunEveryEvening",
      scheduleExpression: "rate(1 minute)",
      enabled: true
    });
    rule.addTarget(stopFunction);
  }
}

const app = new cdk.App();
new CdkStopSagemakerNbStack(app, 'CdkStopSagemakerNbStack');
app.run();
