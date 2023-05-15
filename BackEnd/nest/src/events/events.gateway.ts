import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Chatting, RoomName } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
// socket io를 통해 채팅 서비스를 구현
// ws://localhost:3000/chattings -> url주소
// namespace가 엔드 포인트
// socket.emit으로 원하는 값을 전단
// socket.on으로 값을 전달받음

@WebSocketGateway({ namespace: 'chattings' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('chat');
  userRepository: any;
  constructor(
    @InjectRepository(Chatting) private chatRepository: Repository<Chatting>,
    @InjectRepository(RoomName)
    private roomNameRepository: Repository<RoomName>,
  ) {}
  //클라이언트와 서버가 연결될 시에 호출되는 함수
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected : ${socket.id} ${socket.nsp.name}`);
  }
  //초기 호출되는 함수
  afterInit() {
    this.logger.log('init');
  }

  //연결이 끊어졌을 시 시행되는 함수
  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const user = await this.chatRepository.findOne({
      where: { socketId: socket.id },
    });
    if (user) {
      socket.broadcast.emit('disconnect_user', user.username);
      await this.chatRepository.delete({ socketId: socket.id });
    }
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('join')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new Error('User not found');
    }
    const roomName = `room_${socket.id}_${user.userId}`;
    await this.roomNameRepository.save({ roomName, inAndOut: true });
    socket.join(roomName);
    //socket.emit('join_success', roomName);
  }

  //특정 채팅방에 처음 들어왔을 때 로직
  @SubscribeMessage('new_user')
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() username: string,
  ) {
    const isUserExists = await this.chatRepository.findOne({
      where: { username },
    });

    if (isUserExists) {
      const roomName = `room_${isUserExists.socketId}_${isUserExists.username}`;
      socket.broadcast
        .to(roomName)
        .emit('user_connected', isUserExists.username);
    }

    return isUserExists.username;
  }

  //채팅 방에서 입력을 주고 받을 시 로직
  @SubscribeMessage('submit_user')
  async handleSubmitMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() chat: string,
  ) {
    const { username } = await this.chatRepository.findOne({
      where: { socketId: socket.id },
    });
    socket.broadcast.to(username).emit('new_chat', chat);
  }
}
