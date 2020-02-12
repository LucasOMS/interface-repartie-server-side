import {Controller, Get, Logger, Param} from '@nestjs/common';
import {DevicesService} from "./socket/devices.service";
import {ServerSocket} from "./socket/server.socket";

@Controller('mock')
export class MockController {
    constructor(private socket: ServerSocket, private devices: DevicesService, private logger: Logger) {
    }

    @Get('/clue_found/:id')
    fakeClue(@Param('id') clueId: number) {
        this.devices.sendToTable('CLUE_FOUND', {clue_id: clueId});
    }

    @Get('/end_talk')
    fakeTalk() {
        this.devices.sendToTable('END_TALK');
    }

    @Get('/explore_place/:id')
    fakeExplorePlace(@Param('id') id: number) {
        this.socket.explorePlace({id});
    }
}
