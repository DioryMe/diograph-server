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

@Controller('throwaway')
export class ThrowawayController {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  @Get('callback')
  @Redirect('http://localhost:5173')
  async callbackAction(
    @Query() query: Record<string, string>,
    @Session() session: Record<string, string>,
  ) {
    const date = new Date().toISOString();
    await this.redisClient.set('date', date);

    session.token = query.token;
  }

  @Get('test')
  async testAction(@Session() session: Record<string, string>) {
    const date = await this.redisClient.get('date');

    return 'This is test ' + date + '<br>' + session.token;
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
