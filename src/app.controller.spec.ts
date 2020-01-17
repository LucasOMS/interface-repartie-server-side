import {Test, TestingModule} from '@nestjs/testing';
import {DevicesController} from './devicesController';
import {AppService} from './app.service';

describe('AppController', () => {
    let appController: DevicesController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [DevicesController],
            providers: [AppService],
        }).compile();

        appController = app.get<DevicesController>(DevicesController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(appController.getHello()).toBe('Hello World!');
        });
    });
});
