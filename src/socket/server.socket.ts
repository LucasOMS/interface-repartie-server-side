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
import {DevicesService, DeviceType} from "./devices.service";

@WebSocketGateway(10000)
export class ServerSocket implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(public logger: Logger, public devices: DevicesService) {
    }

    @SubscribeMessage('REGISTER_DEVICE')
    registerDevice(@MessageBody() data: any,
                   @ConnectedSocket() client: Socket) {
        this.logger.log('Client ' + client.id + ' is a ' + data.device_type);
        switch (data.device_type) {
            case 'TABLE':
                this.devices.registerNewDeviceConnection(DeviceType.TABLE, client);
                break;
            case 'VR':
                this.devices.registerNewDeviceConnection(DeviceType.VR, client);
                break;
            case 'TABLET':
                this.devices.registerNewDeviceConnection(DeviceType.TABLET, client);
                break;
            default:
                throw new Error("Unknown type of device");
        }
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(`New client with id ${client.id}`);
        client.emit('REGISTRATION_ASK');
    }

    handleDisconnect(client: Socket): any {
        this.devices.removeConnection(client);
    }
}
