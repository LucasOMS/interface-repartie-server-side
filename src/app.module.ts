import {Logger, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {ServerSocket} from './socket/server.socket';

@Module({
    imports: [],
    controllers: [AppController],
    providers: [ServerSocket, Logger],
})
export class AppModule {
}
