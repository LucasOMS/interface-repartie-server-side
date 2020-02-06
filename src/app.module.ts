import {Logger, Module} from '@nestjs/common';
import {DevicesController} from './devicesController';
import {ServerSocket} from './socket/server.socket';
import {DevicesService} from "./socket/devices.service";
import {MockController} from "./mock-controller";

@Module({
    imports: [],
    controllers: [DevicesController, MockController],
    providers: [ServerSocket, Logger, DevicesService],
})
export class AppModule {
}
