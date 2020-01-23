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
                this.devices.broadcastFrom(DeviceType.TABLE, 'DEVICE_CONNECTED', {device_type: 'TABLE'});
                break;
            case 'VR':
                this.devices.registerNewDeviceConnection(DeviceType.VR, client);
                this.devices.broadcastFrom(DeviceType.VR, 'DEVICE_CONNECTED', {device_type: 'VR'});
                break;
            case 'TABLET':
                this.devices.registerNewDeviceConnection(DeviceType.TABLET, client);
                this.devices.broadcastFrom(DeviceType.TABLET, 'DEVICE_CONNECTED', {device_type: 'TABLET'});
                break;
            default:
                throw new Error("Unknown type of device");
        }
    }

    @SubscribeMessage('EXPLORE_PLACE')
    explorePlaceWithVr(@MessageBody() data: any) {
        this.devices.broadcastFrom(DeviceType.TABLE, 'EXPLORE_PLACE', undefined);
        this.logger.log("Start exploring place with VR and Tablet");
    }

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(`New client with id ${client.id}`);
        client.emit('REGISTRATION_ASK');
    }

    handleDisconnect(client: Socket): any {
        switch (this.devices.getDeviceType(client)) {
            case DeviceType.TABLE:
                this.devices.broadcastFrom(DeviceType.TABLE, 'DEVICE_DISCONNECTED', {device_type: 'TABLE'});
                break;
            case DeviceType.VR:
                this.devices.broadcastFrom(DeviceType.VR, 'DEVICE_DISCONNECTED', {device_type: 'VR'});
                break;
            case DeviceType.TABLET:
                this.devices.broadcastFrom(DeviceType.TABLET, 'DEVICE_DISCONNECTED', {device_type: 'TABLET'});
                break;
        }
        this.devices.removeConnection(client);
    }
}
