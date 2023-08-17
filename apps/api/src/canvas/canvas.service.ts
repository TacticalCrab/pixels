import { Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';

@Injectable()
export class CanvasService {
    private _canvasData = new Uint32Array(1000000).fill(0xffffffff);

    constructor(private prismaService: PrismaService) {}

    get canvasData(): Uint32Array {
        return this._canvasData;
    }

    updatePixel(x: number, y: number, color: string): void {
        this._canvasData[y * 1000 + x] = this.RGBToCanvasPixel(color);
    }

    RGBToCanvasPixel(color: string): number {
        color = color.replace('#', '');
        const formattedColor = [color.slice(0, 2), color.slice(2, 4), color.slice(4)].reverse().join('');
        return parseInt('0xff' + formattedColor);
    }

    // @Cron(CronExpression.EVERY_10_MINUTES)
    // async makeCanvasSnapshot() {
    //     await this.prismaService.canvasSnapshots.create({
    //         data: {
    //             canvasData: Buffer.from(this.canvasData.buffer)
    //         }
    //     });
    //     console.log('[!] CANVAS SNAPSHOT SAVED')
    // }
}
