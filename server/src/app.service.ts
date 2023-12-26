import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MessagePayload } from './type';
import { SEND_MESSAGE } from './constant';

@Injectable()
export class AppService {
  constructor(
    @Inject('CHAT_SERVICE') private readonly clientProxy: ClientProxy,
  ) {
    this.clientProxy
      .connect()
      .then(() => console.log('Connected Successfully'))
      .catch((err) => console.log('err', err));
  }

  async sendMessage(data: MessagePayload): Promise<string> {
    try {
      const createMessageResponse = await firstValueFrom(
        this.clientProxy.send(SEND_MESSAGE, JSON.stringify(data)),
      );

      return createMessageResponse;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
