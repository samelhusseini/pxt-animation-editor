import * as React from 'react';
import { Frame } from "./Frame";

export interface CanvasProps {
    frame: FrameDef;
    onUpdated?: (state: { [key: number]: string; }) => void;
}

export class Canvas extends React.Component<CanvasProps, {}> {

    constructor(props: CanvasProps) {
        super(props);

        this.handlePixelChange = this.handlePixelChange.bind(this);
    }

    handlePixelChange(index: number, value: string) {
        const { frame, onUpdated } = this.props;
        frame.state[index] = value;
        if (onUpdated) onUpdated(frame.state);
    }

    render() {
        const { frame } = this.props;

        return (
            <div className="canvas">
                <Frame frame={frame} onPixelChange={this.handlePixelChange} />
            </div>
        );
    }
}