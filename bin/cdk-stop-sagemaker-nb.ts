#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

class CdkStopSagemakerNbStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const queue = new sqs.Queue(this, 'CdkStopSagemakerNbQueue', {
      visibilityTimeoutSec: 300
    });

    const topic = new sns.Topic(this, 'CdkStopSagemakerNbTopic');

    topic.subscribeQueue(queue);
  }
}

const app = new cdk.App();

new CdkStopSagemakerNbStack(app, 'CdkStopSagemakerNbStack');

app.run();
