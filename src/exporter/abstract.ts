export abstract class AbstractEmitter implements AnimationEmitter {

    protected outputHeader(frames: FrameDef[]) {
        return `// Auto-generated. Do not edit.`;
    }

    abstract output(frames: FrameDef[], delay: number): string;
}