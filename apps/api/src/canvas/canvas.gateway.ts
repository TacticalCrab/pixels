import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import {CanvasService} from './canvas.service';
import {UpdatePixelRequest, UpdatePixelResponse} from './model/updatePixel.dto';
import {SyncCanvasResponse} from './model/syncCanvas.dto';

@WebSocketGateway(3002, {namespace: 'canvas', cors: true})
export class CanvasGateway implements OnGatewayConnection {

    constructor(private canvasService: CanvasService) {}
    handleConnection(@ConnectedSocket() socket: Socket): void {
        const canvasSyncResponse: SyncCanvasResponse = this.canvasService.canvasData;

        socket.emit('syncCanvas',
            canvasSyncResponse, {buffer: true});
    }
    
    @SubscribeMessage('updatePixel')
    handlePlacePixel(@ConnectedSocket() socket: Socket, @MessageBody() requestBody: UpdatePixelRequest): void {
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
