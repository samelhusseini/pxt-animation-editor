import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Button } from 'semantic-ui-react'

import { FrameDef } from "../App";

import { MatrixFrame } from "./MatrixFrame";

export interface FrameProps {
    frame: FrameDef;
    selected?: boolean;
    running?: boolean;
    index?: number;
    onClick?: (index: number) => void;
    onDuplicate?: (index: number) => void;
    onDelete?: (index: number) => void;
    onPixelChange?: (index: number, value: string) => void;
}

export interface FrameState {
    width?: string;
    height?: string;
}

export class Frame extends React.Component<FrameProps, FrameState> {

    constructor(props: FrameProps) {
        super(props);

        this.state = {
            width: '200px',
            height: '200px'
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteFrame = this.handleDeleteFrame.bind(this);
        this.handleDuplicateFrame = this.handleDuplicateFrame.bind(this);
        this.handlePixelClick = this.handlePixelClick.bind(this);
    }

    componentDidMount() {
        // We only want to do this for the main frame
        const { onPixelChange } = this.props;
        if (!onPixelChange) return;

        window.onresize = () => {
            this.resize();
        }
        this.resize();
    }

    resize() {
        const frame = ReactDom.findDOMNode(this.refs["frame"]);
        const canvas = frame.parentNode as HTMLDivElement;
        const padding = 20;
        const height = Math.min(500, Math.max(100, Math.min(canvas.offsetHeight, canvas.offsetWidth) - (padding * 2)));
        // Match height
        const width = height;
        this.setState({ width: `${width}px`, height: `${height}px` })
    }

    handleClick() {
        const { index, running, onClick } = this.props;
        if (!running && onClick) onClick(index);
    }

    handlePixelClick(index: number, value: string) {
        const { onPixelChange } = this.props;
        onPixelChange(index, value);
    }

    handleDeleteFrame(e: any) {
        const { index, onDelete } = this.props;
        if (onDelete) onDelete(index);

        e.preventDefault();
        e.stopPropagation();
    }

    handleDuplicateFrame(e: any) {
        const { index, onDuplicate } = this.props;
        if (onDuplicate) onDuplicate(index);

        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const { frame, selected, running, onPixelChange } = this.props;
        const { height, width } = this.state;
        if (!frame) return;

        const layout = frame.layout;

        return (
            <div ref="frame" className={`frame ${selected ? 'selected' : ''}`} style={{ width, height }} onClick={this.handleClick}>
                {layout == 'matrix' ?
                    <MatrixFrame frame={frame} onPixelChange={onPixelChange ? this.handlePixelClick : undefined} sizeX={frame.sizeX} sizeY={frame.sizeY} />
                    : undefined}
                {selected && !running ?
                    <div className='overlay'>
                        <div className='duplicate'>
                            <Button icon='clone' circular={true} size='small' onClick={this.handleDuplicateFrame} />
                        </div>
                        <div className='delete'>
                            <Button icon='close' circular={true} size='small' onClick={this.handleDeleteFrame} />
                        </div>
                    </div>
                    : undefined}
                {selected && running ? <div className='overlay' /> : undefined}
            </div>
        );
    }
}