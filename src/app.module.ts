import {Logger, Module} from '@nestjs/common';
import {DevicesController} from './devicesController';
import {ServerSocket} from './socket/server.socket';
import {DevicesService} from "./socket/devices.service";

@Module({
    imports: [],
    controllers: [DevicesController],
    providers: [ServerSocket, Logger, DevicesService],
})
export class AppModule {
}
