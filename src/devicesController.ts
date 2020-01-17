import {Controller, Get} from '@nestjs/common';
import {DevicesService} from "./socket/devices.service";

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
}
