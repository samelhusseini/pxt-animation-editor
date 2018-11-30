import * as React from 'react';

import { FrameDef } from "../App";

export interface RingFrameProps {
    frame: FrameDef;
    size: number;
    radius: number;
    onPixelChange?: (index: number, value: string) => void;
}

export class RingFrame extends React.Component<RingFrameProps, {}> {

    constructor(props: RingFrameProps) {
        super(props);

        this.pixelClick = this.pixelClick.bind(this);
    }

    pixelClick(e: any) {
        // const { frame, sizeY, onPixelChange } = this.props;
        // if (!onPixelChange) return;

        // const target = e.target;
        // const row = parseInt(target.getAttribute("data-row"));
        // const col = parseInt(target.getAttribute("data-col"));
        // const index = (row * sizeY) + col;

        // const off = !frame.state[index] || frame.state[index] == '0';

        // onPixelChange(index, off ? '1' : '0');

        // e.preventDefault();
        // e.stopPropagation();
    }

    ColorLuminance = (hex: string, lum: number) => {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    }

    render() {
        const { size, radius, frame } = this.props;

        const padding = Math.max(10, radius / 15);
        const circleRadius = Math.max(7, radius / 7);
        const width = radius * 2;
        const height = width;
        let angle = 0;
        let step = (2 * Math.PI) / size;

        const outerRadius = radius;
        const innerRadius = circleRadius;

        const circles: JSX.Element[] = [];
        for (let i = 0; i < size; i++) {
            let x = Math.round((outerRadius - innerRadius - padding) * Math.cos(angle) + (width / 2));
            let y = Math.round((outerRadius - innerRadius - padding) * Math.sin(angle) + (height / 2));
            const color = '#FF0000';
            circles.push(<circle key={`circle${i}`} className="pixel" cx={x} cy={y} r={circleRadius} fill={color} strokeWidth={4} stroke={this.ColorLuminance(color, -0.2)} />)

            angle += step;
        }

        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${radius * 2} ${radius * 2}`} className="ring">
                <circle key='backing' className="backing" cx={radius} cy={radius} r={radius} />
                {circles}
            </svg>
        );
    }
}