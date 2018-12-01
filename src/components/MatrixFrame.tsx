import * as React from 'react';
import * as ReactDom from 'react-dom';

import { pxt } from "../lib/pxtextensions";

export interface MatrixFrameProps {
    frame: FrameDef;
    sizeX: number;
    sizeY: number;
    onPixelChange?: (index: number, value: string) => void;
}

export class MatrixFrame extends React.Component<MatrixFrameProps, {}> {

    private currentDragState_: string;

    constructor(props: MatrixFrameProps) {
        super(props);

        this.pixelMouseDown = this.pixelMouseDown.bind(this);
    }

    isEditable() {
        const { onPixelChange } = this.props;
        if (!onPixelChange) return false;
        return true;
    }

    getPixelFromTarget(target: any) {
        if (!target) return {};
        const { sizeY, frame } = this.props;
        const row = parseInt(target.getAttribute("data-row"));
        const col = parseInt(target.getAttribute("data-col"));
        if (isNaN(row) || isNaN(col)) return {};
        const index = (row * sizeY + col);
        return {
            x: row,
            y: col,
            index,
            state: frame.state[index]
        }
    }

    getOppositeState(state: string) {
        return !state || state == '0' ? '1' : '0';
    }

    setPixelState(x: number, y: number, value: string) {
        const { sizeY, onPixelChange } = this.props;
        const index = (x * sizeY + y);
        onPixelChange(index, value);
    }

    togglePixelState(x: number, y: number) {
        const { frame, sizeY } = this.props;
        const index = (x * sizeY + y);
        this.setPixelState(x, y, this.getOppositeState(frame.state[index]));
    }

    pixelMouseDown(ev: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
        if (!this.isEditable()) return;

        const { x, y, state } = this.getPixelFromTarget(ev.target);
        this.currentDragState_ = this.getOppositeState(state);

        this.togglePixelState(x, y);

        document.addEventListener(pxt.extensions.ui.pointerEvents.up, this.clearRootMoveListener);
        document.addEventListener(pxt.extensions.ui.pointerEvents.leave, this.clearRootMoveListener);

        const matrixDom = ReactDom.findDOMNode(this.refs["matrix"]);
        matrixDom.addEventListener(pxt.extensions.ui.pointerEvents.move, this.handleRootMoveListener);

        ev.stopPropagation();
        ev.preventDefault();
    }

    private handleRootMoveListener = (ev: MouseEvent | PointerEvent | TouchEvent) => {
        const { clientX, clientY } = pxt.extensions.ui.getClientXYFromEvent(ev);
        const target = document.elementFromPoint(clientX, clientY);
        if (!target) return;
        const { x, y } = this.getPixelFromTarget(target);
        if (x != undefined && y != undefined) {
            this.setPixelState(x, y, this.currentDragState_);
        }
    }

    private clearRootMoveListener = (ev: MouseEvent | PointerEvent | TouchEvent) => {
        const matrixDom = ReactDom.findDOMNode(this.refs["matrix"]);
        if (matrixDom) {
            matrixDom.removeEventListener(pxt.extensions.ui.pointerEvents.move, this.handleRootMoveListener);
        }

        ev.stopPropagation();
        ev.preventDefault();
    }

    render() {
        const { sizeX, sizeY, frame } = this.props;

        const rows: JSX.Element[] = [];
        for (let i = 0; i < sizeX; i++) {
            const cols: JSX.Element[] = [];
            for (let j = 0; j < sizeY; j++) {
                cols.push(<div key={`pixel${i}${j}`} role="button"
                    className={`pixel ${frame.state[(i * sizeY) + j] == '1' ? 'on' : ''}`}
                    data-row={i} data-col={j}
                    onPointerDown={pxt.extensions.ui.usePointerEvents() ? this.pixelMouseDown : undefined}
                    onTouchStart={pxt.extensions.ui.useTouchEvents() ? this.pixelMouseDown : undefined}
                    onMouseDown={pxt.extensions.ui.useMouseEvents() ? this.pixelMouseDown : undefined}></div>);
            }
            rows.push(<div key={`pixel_row${i}`} className="pixel-row">{cols}</div>)
        }

        return (
            <div className="matrix" ref="matrix">
                {rows}
            </div>
        );
    }
}