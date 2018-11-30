export abstract class AbstractEmitter implements AnimationEmitter {

    abstract output(frames: FrameDef[]): string;
}