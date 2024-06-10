import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class QuizResultsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('QuizResultsGateway');

  afterInit(server: Server) {
    this.logger.log('WebSocket server initialized');
    console.log(server);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(args);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleQuizResultCreated(quizResult: any) {
    if (this.server) {
      this.server.emit('quizResultCreated', quizResult);
    } else {
      this.logger.warn('WebSocket server is not initialized');
    }
  }
}
