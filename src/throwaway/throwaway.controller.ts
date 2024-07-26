import { Controller, Get, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Controller('throwaway')
export class ThrowawayController {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  @Get('callback')
  async callbackAction() {
    const date = new Date().toISOString();
    await this.redisClient.set('date', date);

    return 'This is callback ' + date;
  }

  @Get('test')
  async testAction() {
    const date = await this.redisClient.get('date');

    return 'This is test ' + date;
  }
}
