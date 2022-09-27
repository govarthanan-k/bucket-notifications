import { App, Stack, StackProps } from "aws-cdk-lib";
import S3EventNotificationsLambdaConstruct from "../constructs/S3EventNotificationsLambdaConstruct";

export class S3EventNotificationsLambdaStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    new S3EventNotificationsLambdaConstruct(this, "S3EventNotificationsLambdaConstruct");
  }
}