import * as React from 'react';
import * as ReactDom from 'react-dom';

import { Button } from 'semantic-ui-react'

import { FrameDef } from "../App";

import { MatrixFrame } from "./MatrixFrame";
import { RingFrame } from "./RingFrame";

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
    width?: number;
    height?: number;
}

export class Frame extends React.Component<FrameProps, FrameState> {

    constructor(props: FrameProps) {
        super(props);

        this.state = {
            width: 200,
            height: 200
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleDeleteFrame = this.handleDeleteFrame.bind(this);
        this.handleDuplicateFrame = this.handleDuplicateFrame.bind(this);
        this.handlePixelClick = this.handlePixelClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        // We only want to do this for the main frame
        const { onPixelChange } = this.props;
        if (!onPixelChange) return;

        window.onresize = () => {
            this.resize();
        }
        this.resize();

        // Handle window keys
    }

    handleKeyDown(e: React.KeyboardEvent<any>) {
        const charCode = (typeof e.which == "number") ? e.which : e.keyCode;
        const { onPixelChange, selected } = this.props;
        if (!onPixelChange || !selected) return;

        if (charCode === 8 /* Back space */) {
            console.log('backspace... ');
            const { index, onDelete } = this.props;
            if (onDelete) onDelete(index);

            e.preventDefault();
            e.stopPropagation();
        }
    }

    resize() {
        const frame = ReactDom.findDOMNode(this.refs["frame"]);
        const canvas = frame.parentNode as HTMLDivElement;
        const padding = 20;
        const height = Math.min(500, Math.max(100, Math.min(canvas.offsetHeight, canvas.offsetWidth) - (padding * 2)));
        // Match height
        const width = height;
        this.setState({ width, height })
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
        console.log('handleDeleteFrame');
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
        if (!frame) return <div />;

        const layout = frame.layout;

        return (
            <div ref="frame" role="button" tabIndex={0} className={`frame ${selected ? 'selected' : ''}`} style={{ width: `${width}px`, height: `${height}px` }}
                onClick={this.handleClick} onKeyDown={this.handleKeyDown}>
                {layout == 'matrix' ?
                    <MatrixFrame frame={frame} onPixelChange={onPixelChange ? this.handlePixelClick : undefined} sizeX={frame.sizeX} sizeY={frame.sizeY} />
                    : undefined}
                {layout == 'ring' ?
                    <RingFrame frame={frame} onPixelChange={onPixelChange ? this.handlePixelClick : undefined} size={frame.size} radius={height / 2} />
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