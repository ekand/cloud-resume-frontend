import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import { Construct } from "constructs";

export class CloudResumeFrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const assetsBucket = new s3.Bucket(this, "CloudResumeFrontendBucket", {
      websiteIndexDocument: "index.html",
      // publicReadAccess: true,
    });

    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./website-dist")],
      destinationBucket: assetsBucket,
    });

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      "Certificate",
      // found using aws acm list-certificates --region us-east-1
      "arn:aws:acm:us-east-1:212702451742:certificate/abf2dd8b-3651-4fe1-9452-56ade04917e1"
    );
    const cf = new cloudfront.Distribution(
      this,
      "CloudResumeFrontendDistribution",
      {
        defaultBehavior: { origin: new origins.S3Origin(assetsBucket) },
        domainNames: ["erikresume.com"],
        certificate,
      }
    );

    const zone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "erikresume-zone",
      {
        zoneName: "erikresume.com",
        hostedZoneId: "Z0110113OR9PYKNKIA91",
      }
    );

    new route53.ARecord(this, "CDNARecord", {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cf)),
    });

    new route53.AaaaRecord(this, "AliasRecord", {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(cf)),
    });
  }
}
