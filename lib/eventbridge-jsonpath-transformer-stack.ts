import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

export class EventbridgeJsonpathTransformerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const project = new codebuild.Project(this, `TestProject`, {
      environment: {
        buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('debian:buster'),
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          build: {
            commands: [
              "set -ex",
              "export CERT_NAME='ABC'",
              "export CERT_ID='slskd'",
            ]
          }
        },
        env: {
          variables: {
          },
          'exported-variables': [
            'CERT_NAME',
            'CERT_ID',
          ]
        }
      })
    });
    
    const topic = new sns.Topic(this, 'Topic');

    project.onBuildSucceeded(`ProjectSuccess`, {
      target: new targets.SnsTopic(topic, {
        message: events.RuleTargetInput.fromObject({
          // iamCertId: events.EventField.fromPath('$.detail.additional-information.exported-environment-variables[0].value'),
          iamCertId: events.EventField.fromPath('$.detail.additional-information.exported-environment-variables[?(@.name=="CERT_ID")].value'),
          iamCertName: events.EventField.fromPath('$.detail.additional-information.exported-environment-variables[1].value'),
          certificateProjectName: events.EventField.fromPath('$.detail.project-name'),
          certificateBuildStatus: events.EventField.fromPath('$.detail.build-status'),
          certificateBuildId: events.EventField.fromPath('$.detail.build-id'),
          account: events.EventField.account,
        }),
      })
    });

  }
}
