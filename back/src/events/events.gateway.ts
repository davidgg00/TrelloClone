import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { Task } from 'src/tasks/entities/task.entity';
import { List } from 'src/list/entities/list.entity';
import { ListService } from 'src/list/list.service';

@WebSocketGateway({ namespace: 'board', transports: ['websocket'] })
@Injectable()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly tasksService: TasksService,
    private readonly listsService: ListService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket Server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('moveTask')
  async handleMoveTask(
    @MessageBody()
    data: {
      clientId: any;
      task: Task;
      targetList: List;
      sourceList: List;
    },
    @ConnectedSocket() client: Socket,
  ) {
    await this.tasksService.update(data.task.id, {
      listId: data.targetList.id,
    });

    this.server.emit('taskMoved', {
      task: data.task,
      targetList: data.targetList,
      clientId: data.clientId,
      sourceList: data.sourceList,
    });
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(
    @MessageBody() data: { listId: string; title: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('task created');

    this.server.emit('taskCreated', {});
  }

  @SubscribeMessage('moveList')
  async handleMoveList(
    @MessageBody()
    data: { clientId: any; movedList: List; targetList: List },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('list moved');
    console.log(data);
    await this.listsService.updateListPositions(
      data.movedList.boardId,
      data.movedList.id,
      data.targetList.id,
    );

    this.server.emit('listMoved', {
      movedList: data.movedList,
      targetList: data.targetList,
      clientId: data.clientId,
    });
  }
}