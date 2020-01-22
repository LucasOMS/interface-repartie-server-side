import {Controller, Get} from '@nestjs/common';
import {DevicesService, DeviceType} from "./socket/devices.service";

@Controller('devices')
export class DevicesController {
    constructor(private devices: DevicesService) {
    }

    @Get()
    getDevicesConnected(): { table: boolean, tablet: boolean, vr: boolean } {
        return this.devices.getAllDevicesConnected();
    }

    @Get('/table/ping')
    pingTable() {
        this.devices.sendToTable('PING');
    }

    @Get('/registerMock/vr')
    fakeRegisterVR() {
        this.devices.broadcastFrom(DeviceType.VR, 'DEVICE_CONNECTED', {device_type: 'VR'});
    }

    @Get('/registerMock/tablet')
    fakeRegisterTablet() {
        this.devices.broadcastFrom(DeviceType.TABLET, 'DEVICE_CONNECTED', {device_type: 'TABLET'});
    }

    @Get('/unregisterMock/vr')
    fakeUnregisterVR() {
        this.devices.broadcastFrom(DeviceType.VR, 'DEVICE_DISCONNECTED', {device_type: 'VR'});
    }

    @Get('/unregisterMock/tablet')
    fakeUnregisterTablet() {
        this.devices.broadcastFrom(DeviceType.TABLET, 'DEVICE_DISCONNECTED', {device_type: 'TABLET'});
    }
}
