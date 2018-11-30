
import { MicrobitEmitter } from "./microbit";

export class EmitterFactory {

    static getEmitter(target: string) {
        switch (target) {
            case 'microbit':
                return new MicrobitEmitter();
            default:
                return undefined;
        }
    }
}