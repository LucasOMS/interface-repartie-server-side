import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway
} from '@nestjs/websockets';
import {Socket} from 'socket.io';
import {Logger} from '@nestjs/common';

@WebSocketGateway(10000)
export class ServerSocket implements OnGatewayConnection, OnGatewayDisconnect {
    private connections: Socket[] = [];

    constructor(public logger: Logger) {
    }

    @SubscribeMessage('PONG')
    handlePong(@MessageBody() data: string,
               @ConnectedSocket() client: Socket) {
        this.logger.log('TRIGGER ON PONG');
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(`New client with id ${client.id}`);
        this.connections.push(client);
        this.broadcast(client, 'PING', {id: client.id});
    }

    handleDisconnect(client: Socket): any {
        this.connections.splice(this.connections.indexOf(client), 1);
    }

    private broadcast(emitter: Socket, eventName: string, data: any) {
        this.connections.filter(con => con.id !== emitter.id).forEach(cli => {
            this.logger.log('Emmit message to ' + cli.id + ' from ' + emitter.id);
            cli.emit(eventName, data);
        });
    }
}
