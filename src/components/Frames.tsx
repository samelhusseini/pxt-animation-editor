import * as React from 'react';

import { FrameDef } from "../App";
import { Frame } from "./Frame";

export interface FramesProps {
    frames: FrameDef[];
    selected?: number;
    running?: boolean;
    onSelected?: (frame: number) => void;
    onDeleted?: (frame: number) => void;
    onDuplicated?: (frame: number) => void;
}

export class Frames extends React.Component<FramesProps, {}> {

    constructor(props: FramesProps) {
        super(props);

        this.handleFrameClick = this.handleFrameClick.bind(this);
        this.handleFrameDeleted = this.handleFrameDeleted.bind(this);
        this.handleFrameDuplicate = this.handleFrameDuplicate.bind(this);
    }

    handleFrameClick(index: number) {
        const { onSelected } = this.props;
        if (onSelected) onSelected(index);
    }

    handleFrameDeleted(index: number) {
        const { onDeleted } = this.props;
        if (onDeleted) onDeleted(index);
    }

    handleFrameDuplicate(index: number) {
        const { onDuplicated } = this.props;
        if (onDuplicated) onDuplicated(index);
    }

    render() {
        const { frames, selected, running } = this.props;

        return (
            <div className="frames">
                {frames.map((frame, index) =>
                    <Frame key={`frame${index}`} frame={frame} selected={selected == index} running={running} index={index} onClick={this.handleFrameClick}
                        onDelete={this.handleFrameDeleted} onDuplicate={this.handleFrameDuplicate} />
                )}
            </div>
        );
    }
}