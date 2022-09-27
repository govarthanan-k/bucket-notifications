#!/usr/bin / env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { S3EventNotificationsLambdaStack } from '../lib/stacks/S3EventNotificationsLambdaStack';

const app = new App();
const env = { account: "886413358586", region: "ap-south-1" };

new S3EventNotificationsLambdaStack(app, "S3EventNotificationsLambdaStackV2", { env });