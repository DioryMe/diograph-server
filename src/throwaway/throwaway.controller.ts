import { Controller, Get } from '@nestjs/common';

@Controller('throwaway')
export class ThrowawayController {
  @Get('callback')
  callbackAction() {
    return 'This is callback';
  }

  @Get('test')
  testAction() {
    return 'This is test';
  }
}
