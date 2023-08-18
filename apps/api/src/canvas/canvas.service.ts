import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import {Cron, CronExpression} from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CanvasService implements OnModuleInit{
    private canvasDataFolderPath = path.join(__dirname, '../../data');
    private canvasDataPath = path.join(__dirname, '../../data/canvasData');
    private _canvasData = new Uint32Array();

    constructor(private prismaService: PrismaService) {}

    onModuleInit(): void {
        if (!fs.existsSync(this.canvasDataFolderPath)) {
            fs.mkdirSync(this.canvasDataFolderPath);
        }

        if (fs.existsSync(this.canvasDataPath)) {
            const fileData = fs.readFileSync(this.canvasDataPath);
            this._canvasData =  new Uint32Array(fileData.buffer, fileData.byteOffset, 1000000);
        } else {
            this._canvasData = new Uint32Array(1000000).fill(0xffffffff)
        }
    }

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

    @Cron(CronExpression.EVERY_5_MINUTES)
    async makeCanvasSnapshot() {
        fs.writeFileSync(this.canvasDataPath, Buffer.from(this._canvasData.buffer));
        console.log('[!] CANVAS SNAPSHOT SAVED')
    }
}
