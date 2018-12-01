
import { AbstractEmitter } from "./abstract";

export class MicrobitEmitter extends AbstractEmitter {

    output(frames: FrameDef[], delay: number) {
        if (!frames.length) return ' ';

        const frameRows: string[] = [];
        const rows = frames[0].sizeX;
        const cols = frames[0].sizeY;

        for (let row = 0; row < rows; row++) {
            let frameRow = '';
            for (let f = 0; f < frames.length; f++) {
                for (let col = 0; col < cols; col++) {
                    frameRow += frames[f].state[(row * cols) + col] ? '# ' : '. ';
                }
            }
            frameRows.push(frameRow + "\n        ");
        }

        return this.outputHeader(frames) + `
namespace basic {

    /**
     * Play the animation
     */
    //% weight=100
    //% blockId="custom_animation" block="play custom animation"
    export function playCustomAnimation() {
        basic.showAnimation(` + '`' + `
        ${frameRows.map(frameRow => frameRow).join('')}
        ` + '`' + `, ${delay});
    }

}`;
    }

}