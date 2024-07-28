import {
  Controller,
  Get,
  Inject,
  Query,
  Redirect,
  Req,
  Session,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from '@aws-sdk/client-cognito-identity';

const getCredentials = async (identityToken) => {
  const cognitoIdentityClient = new CognitoIdentityClient({
    region: 'eu-north-1',
  });

  // Get the identity ID
  const getIdCommand = new GetIdCommand({
    IdentityPoolId: 'eu-north-1:163257d1-b8f4-4fbd-88e1-7edf6d07d7d7',
    Logins: {
      'cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Vvg0QXGcW':
        identityToken,
    },
  });

  const identityResponse = await cognitoIdentityClient.send(getIdCommand);
  const identityId = identityResponse.IdentityId;

  // Get the credentials for the identity
  const getCredentialsCommand = new GetCredentialsForIdentityCommand({
    IdentityId: identityId,
    Logins: {
      'cognito-idp.eu-north-1.amazonaws.com/eu-north-1_Vvg0QXGcW':
        identityToken,
    },
  });

  const credentialsResponse = await cognitoIdentityClient.send(
    getCredentialsCommand,
  );
  const credentials = credentialsResponse.Credentials;

  return credentials;
};

@Controller('throwaway')
export class ThrowawayController {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  @Get('callback')
  @Redirect('http://localhost:5173')
  async callbackAction(
    @Query() query: Record<string, string>,
    @Session() session: Record<string, any>,
  ) {
    const date = new Date().toISOString();
    await this.redisClient.set('date', date);

    const credentials = await getCredentials(query.token);

    session.awsCredentials = {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretKey,
      sessionToken: credentials.SessionToken,
    };
  }

  @Get('test')
  async testAction(@Session() session: Record<string, string>) {
    // const date = await this.redisClient.get('date');

    const options = {
      region: 'eu-west-1',
      credentials: JSON.parse(
        JSON.stringify(session.awsCredentials).replace(/\\/g, ''),
      ),
    };

    const s3Client = new S3Client(options);

    const listCommand = new ListObjectsV2Command({
      Bucket: 'jvalanen-diory-test3',
      Prefix: 'room/',
    });

    const list = await s3Client.send(listCommand);

    return JSON.stringify(list);
  }

  // TODO: Convert to POST
  @Get('logout')
  async logoutAction(@Req() req: any) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject('Logout failed');
        } else {
          resolve('Logged out successfully');
        }
      });
    });
  }
}
