/// <reference path="./typings/animation-editor.d.ts" />

import * as React from 'react';
import { App } from './App';

import { pxt, PXTClient } from "./lib/pxtextensions";

export interface AppState {
    target?: string;
    isSupported?: boolean;
}

declare let window: any;

export class PXTExtension extends React.Component<{}, AppState> {

    private client: PXTClient;

    constructor(props: {}) {
        super(props);

        this.state = {
            target: this.getDefaultTarget(),
            isSupported: this.isSupported()
        }

        this.client = new PXTClient();
        pxt.extensions.setup(this.client);
        pxt.extensions.init();
    }

    private isSupported() {
        // Check for whether or not the extension is supported on this browser, return true if always supported
        return window.File && window.FileReader && window.FileList && window.Blob
    }

    private getDefaultTarget() {
        if (!pxt.extensions.inIframe()) {
            const url = new URL(window.location.href);
            let chosen = url.searchParams.get("target");
            if (chosen) return chosen.toLowerCase();
            return "microbit"
        }
        return undefined;
    }

    componentDidMount() {
        this.client.on('loaded', (target: string) => {
            this.setState({ target });
            pxt.extensions.read(this.client);
        })

        this.client.on('shown', (target: string) => {
            this.setState({ target });
            pxt.extensions.read(this.client);
        })

        if (!pxt.extensions.inIframe()) {
            this.client.emit('loaded', this.getDefaultTarget());
        }
    }

    render() {
        const { target, isSupported } = this.state;

        let layout: LayoutTypes = 'matrix';
        let size: number;
        let sizeX: number;
        let sizeY: number;
        let backgroundColor = "#F2F2F2";
        switch (target) {
            case 'microbit':
                layout = 'matrix';
                sizeX = 5;
                sizeY = 5;
                break;
            case 'adafruit':
                layout = 'ring';
                size = 10;
                backgroundColor = "#0183B7";
                break;
            default:
                layout = 'matrix';
                sizeX = 5;
                sizeY = 5;
        }

        return (
            <div className={`MCExtension ${!target ? 'dimmable dimmed' : ''}`}>
                {!isSupported ? <div>
                    This extension is not supported on your browser
                </div> : <App client={this.client} target={target} layout={layout} size={size} sizeX={sizeX} sizeY={sizeY} backgroundColor={backgroundColor} />}
            </div>
        );
    }
}