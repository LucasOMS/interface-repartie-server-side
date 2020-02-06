import {Controller, Get} from '@nestjs/common';
import {DevicesService} from "./socket/devices.service";

@Controller('mock')
export class MockController {
    constructor(private devices: DevicesService) {
    }

    @Get('/clue_found')
    fakeClue() {
        this.devices.sendToTable('CLUE_FOUND');
    }

    @Get('/end_talk')
    fakeTalk() {
        this.devices.sendToTable('END_TALK');
    }
}
