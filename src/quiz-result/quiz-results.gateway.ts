import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class QuizResultsGateway {
  @WebSocketServer()
  server: Server;

  handleQuizResultCreated(quizResult: any) {
    if (this.server) {
      this.server.emit('quizResultCreated', quizResult);
    } else {
      console.warn('WebSocket server is not initialized');
    }
  }
}
