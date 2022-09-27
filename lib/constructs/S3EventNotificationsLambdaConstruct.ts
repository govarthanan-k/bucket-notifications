

import { Duration, RemovalPolicy } from "aws-cdk-lib"
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { resolve } from "path";
import { Bucket, EventType } from 'aws-cdk-lib/aws-s3';
import { LambdaDestination, SqsDestination } from "aws-cdk-lib/aws-s3-notifications";

import { Construct } from 'constructs'
import { S3EventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Queue } from "aws-cdk-lib/aws-sqs";

export interface S3EventNotificationsLambdaProps { }
export default class S3EventNotificationsLambdaConstruct extends Construct {
  sourceBucket: Bucket;
  notificationsProcessorLambda: Function;
  s3CreateObjectNotificationQueue: Queue;

  constructor(scope: Construct, id: string, props?: S3EventNotificationsLambdaProps) {
    super(scope, id);
    this.sourceBucket = this.createBucket('gova-gova-cdk-first-bucket')
    this.notificationsProcessorLambda = this.createNotificationsProcessorLambda()
    this.s3CreateObjectNotificationQueue = this.createS3CreateObjectNotificationQueue()
    // this.addS3SourceToLambda(this.sourceBucket, this.notificationsProcessorLambda)
    this.addSQSTriggerToBucket(this.sourceBucket, this.s3CreateObjectNotificationQueue)
    this.sourceBucket.grantRead(this.notificationsProcessorLambda)
  }

  private createBucket(bucketName: string): Bucket {
    return new Bucket(this, 'S3 Bucket', {
      bucketName,
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }

  private createNotificationsProcessorLambda(): Function {
    const code = Code.fromAsset(resolve(process.cwd(), "./lambdas/s3-notification-processor"));
    return new Function(this, "S3NotificationProcessor", {
      functionName: 'S3NotificationProcessor',
      code,
      handler: "index.handler",
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.seconds(30),
    });
  }

  private addEventListenerLambdaToBucket(bucket: Bucket, handler: Function): void {
    // const handler = Function.fromFunctionArn(this, 'S3NotificationProcessorHandler', 'arn:aws:lambda:ap-south-1:886413358586:function:S3NotificationProcessor')
    bucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(handler))
  }

  private addS3SourceToLambda(bucket: Bucket, handler: Function): void {
    handler.addEventSource(new S3EventSource(bucket, { events: [EventType.OBJECT_CREATED] },))
  }

  private createS3CreateObjectNotificationQueue() {
    return new Queue(this, 'S3CreateObjectNotificationQueue', { queueName: 'S3CreateObjectNotificationQueue' });
  }
  private addSQSTriggerToBucket(bucket: Bucket, queue: Queue): void {
    bucket.addEventNotification(EventType.OBJECT_CREATED, new SqsDestination(queue))
    // bucket.addObjectCreatedNotification()
  }
}