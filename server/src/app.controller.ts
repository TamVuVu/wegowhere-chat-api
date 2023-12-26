import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MessagePayload } from './type';
import { SEND_MESSAGE } from './constant';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern(SEND_MESSAGE)
  getMessages(
    @Payload() data: MessagePayload,
    @Ctx() _context: RmqContext,
  ): MessagePayload {
    return data;
  }
}
