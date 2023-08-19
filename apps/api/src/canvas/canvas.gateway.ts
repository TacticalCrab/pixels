import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway
} from '@nestjs/websockets';
import {CanvasService} from './canvas.service';
import {UpdatePixelRequest, UpdatePixelResponse,} from 'shared/lib/model/sockets/updatePixel.dto';
import {SyncCanvasResponse} from 'shared/lib/model/sockets/syncCanvas.dto';
import {CanvasSocket} from './types/canvasSocket';
import {ErrorResponse, ErrorTypes} from 'shared/lib/model/sockets/error.dto';
import UpdateTimeoutResponse from 'shared/lib/model/sockets/updateTimeout.dto';

@WebSocketGateway({ namespace: 'canvas', cors: true })
export class CanvasGateway implements OnGatewayConnection {
    currentTimeout = 1;

    constructor(private canvasService: CanvasService) {}
    handleConnection(@ConnectedSocket() socket: CanvasSocket): void {
        const canvasSyncResponse: SyncCanvasResponse = this.canvasService.canvasData;

        socket.emit('syncCanvas',
            canvasSyncResponse, {buffer: true});

        const updateTimeoutResponse: UpdateTimeoutResponse = {
            timeout: this.currentTimeout + 1
        }

        socket.emit('updateTimeout', updateTimeoutResponse);
    }
    
    @SubscribeMessage('updatePixel')
    handlePlacePixel(@ConnectedSocket() socket: CanvasSocket, @MessageBody() requestBody: UpdatePixelRequest): void {
        this.canvasService.updatePixel(requestBody.x, requestBody.y, requestBody.color);

        const responseBody: UpdatePixelResponse = {
            x: requestBody.x,
            y: requestBody.y,
            color: requestBody.color
        }

        socket.broadcast.emit('updatePixel',
            responseBody
        );
    }
}
