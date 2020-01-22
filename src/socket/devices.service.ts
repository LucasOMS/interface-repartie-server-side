import {Injectable, Logger} from '@nestjs/common';
import {Socket} from "socket.io";

export enum DeviceType {
    TABLE,
    VR,
    TABLET
}

@Injectable()
export class DevicesService {
    private all_connections: Socket[] = [];
    private tableConnection: Socket;
    private tabletConnection: Socket;
    private vrConnection: Socket;

    constructor(public readonly logger: Logger) {
    }

    removeConnection(socket: Socket) {
        this.all_connections.splice(this.all_connections.indexOf(socket), 1);
        if (this.tableConnection && this.tableConnection.id === socket.id) {
            this.tableConnection = undefined;
        } else if (this.tabletConnection && this.tabletConnection.id === socket.id) {
            this.tabletConnection = undefined;
        } else if (this.vrConnection && this.vrConnection.id === socket.id) {
            this.vrConnection = undefined;
        }
    }

    broadcastFrom(type: DeviceType, eventName, data) {
        if (type !== DeviceType.TABLE && this.tableConnection)
            this.tableConnection.emit(eventName, data);
        if (type !== DeviceType.TABLET && this.tabletConnection)
            this.tabletConnection.emit(eventName, data);
        if (type !== DeviceType.VR && this.vrConnection)
            this.vrConnection.emit(eventName, data);
    }

    sendToTable(eventName, data = undefined) {
        if (this.tableConnection)
            this.tableConnection.emit(eventName, data);
        else
            this.logger.error("Try to send a message to an unknown Table device");
    }

    sendToTablet(eventName, data = undefined) {
        if (this.tabletConnection)
            this.tabletConnection.emit(eventName, data);
        else
            this.logger.error("Try to send a message to an unknown Tablet device");
    }

    sendToVr(eventName, data = undefined) {
        if (this.vrConnection)
            this.vrConnection.emit(eventName, data);
        else
            this.logger.error("Try to send a message to an unknown VR device");
    }

    registerNewDeviceConnection(type: DeviceType, client: Socket) {
        switch (type) {
            case DeviceType.TABLE:
                if (this.tableConnection !== undefined)
                    this.removeConnection(this.tableConnection);
                this.tableConnection = client;
                break;
            case DeviceType.TABLET:
                if (this.tabletConnection !== undefined)
                    this.removeConnection(this.tabletConnection);
                this.tabletConnection = client;
                break;
            case DeviceType.VR:
                if (this.vrConnection !== undefined)
                    this.removeConnection(this.vrConnection);
                this.vrConnection = client;
                break;
            default:
                throw new Error("Unknow type of device : " + type);
        }
        this.all_connections.push(client);
    }

    public getDeviceType(socket: Socket): DeviceType {
        if (this.tableConnection && this.tableConnection.id === socket.id) {
            return DeviceType.TABLE;
        } else if (this.tabletConnection && this.tabletConnection.id === socket.id) {
            return DeviceType.TABLET;
        } else if (this.vrConnection && this.vrConnection.id === socket.id) {
            return DeviceType.VR;
        }
        throw new Error("Unknow type of device for socket : " + socket.id);
    }

    public getAllDevicesConnected(): { table: boolean, tablet: boolean, vr: boolean } {
        return {
            table: this.tableConnection !== undefined,
            tablet: this.tabletConnection !== undefined,
            vr: this.vrConnection !== undefined
        };
    }
}
