import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { SOCKET_EVENT } from 'src/constant';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private appService: AppService) {}
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage(SOCKET_EVENT.PUBLISH)
  async handleSendMessage(socket: Socket, message: string): Promise<string> {
    this.logger.log(`Message received from client id: ${socket.id}`);
    const messagePayload = {
      id: socket.id,
      message: message,
    };
    const messageToSend = await this.appService.sendMessage(messagePayload);

    this.io.emit(SOCKET_EVENT.SUBSCRIBE, messageToSend);
    return messageToSend;
  }
}
