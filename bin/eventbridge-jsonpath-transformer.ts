#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventbridgeJsonpathTransformerStack } from '../lib/eventbridge-jsonpath-transformer-stack';

const app = new cdk.App();
new EventbridgeJsonpathTransformerStack(app, 'EventbridgeJsonpathTransformerStack');
