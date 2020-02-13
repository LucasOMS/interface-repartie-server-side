import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Logger} from '@nestjs/common';
import {DevicesService, DeviceType} from "./devices.service";
import {PLACES_ID} from "../constants";

@WebSocketGateway(10000)
export class ServerSocket implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

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
    explorePlace(@MessageBody() data: { id: number }) {
        const devices = this.devices.getAllDevicesConnected();
        if (data.id == PLACES_ID.STADIUM) {
            this.logger.log(`Start exploring stadium with ${devices.vr ? 'VR' : 'table'}`);
            if (devices.vr)
                this.devices.sendToVr('EXPLORE_PLACE', {id: data.id});
            else
                this.devices.sendToTable('EXPLORE_PLACE', {id: data.id});
        } else if (data.id == PLACES_ID.LOCKER_ROOM) {
            this.logger.log(`Start exploring Locker-room with ${devices.tablet ? 'tablet' : 'table'}`);
            this.devices.sendToTablet('EXPLORE_PLACE', {id: data.id});
            // if (devices.tablet)
            //     this.devices.sendToTablet('EXPLORE_PLACE', {id: data.id});
            // else
            //     this.devices.sendToTable('EXPLORE_PLACE', {id: data.id});
        } else if (data.id == PLACES_ID.LOCKER_ROOM_LOCKERS) {
            this.logger.log(`Start exploring Locker-room (lockers) with ${devices.tablet ? 'tablet' : 'table'}`);
            if (devices.tablet)
                this.devices.sendToTablet('EXPLORE_PLACE', {id: data.id});
            else
                this.devices.sendToTable('EXPLORE_PLACE', {id: data.id});
        } else {
            throw new Error(`Unknown place to explore (id: ${data.id})`);
        }
    }

    @SubscribeMessage('CLUE_FOUND')
    clueFound(@MessageBody() data: { clue_id: number }) {
        this.devices.sendToTable('CLUE_FOUND', data);
        this.logger.log(`Clue found : ${data.clue_id}`)
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
