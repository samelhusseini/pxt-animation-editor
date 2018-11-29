import * as React from 'react';

import { FrameDef } from "../App";

export interface MatrixFrameProps {
    frame: FrameDef;
    sizeX: number;
    sizeY: number;
    onPixelClick?: (index: number, value: string) => void;
}

export class MatrixFrame extends React.Component<MatrixFrameProps, {}> {

    constructor(props: MatrixFrameProps) {
        super(props);

        this.pixelClick = this.pixelClick.bind(this);
    }

    pixelClick(e: any) {
        const { frame, sizeY, onPixelClick } = this.props;
        if (!onPixelClick) return;

        const target = e.target;
        const row = parseInt(target.getAttribute("data-row"));
        const col = parseInt(target.getAttribute("data-col"));
        const index = (row * sizeY) + col;

        const off = !frame.state[index] || frame.state[index] == '0';

        onPixelClick(index, off ? '1' : '0');

        e.preventDefault();
        e.stopPropagation();
    }

    render() {
        const { sizeX, sizeY, frame } = this.props;

        const rows: JSX.Element[] = [];
        for (let i = 0; i < sizeX; i++) {
            const cols: JSX.Element[] = [];
            for (let j = 0; j < sizeY; j++) {
                cols.push(<div className={`pixel ${frame.state[(i * sizeY) + j] == '1' ? 'on' : ''}`} data-row={i} data-col={j} onClick={this.pixelClick}></div>);
            }
            rows.push(<div className="pixel-row">{cols}</div>)
        }

        return (
            <div className="matrix">
                {rows}
            </div>
        );
    }
}