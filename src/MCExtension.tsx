
import * as React from 'react';
import { App, LayoutTypes } from './App';

export interface AppState {
    target?: string;
    isSupported?: boolean;
}

declare let window: any;

export class MCExtension extends React.Component<{}, AppState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            target: this.getDefaultTarget(),
            isSupported: this.isSupported()
        }
    }

    private isSupported() {
        // Check for whether or not the extension is supported on this browser, return true if always supported
        return window.File && window.FileReader && window.FileList && window.Blob
    }

    private getDefaultTarget() {
        if (!this.isIFrame()) {
            const url = new URL(window.location.href);
            let chosen = url.searchParams.get("target");
            if (chosen) return chosen.toLowerCase();
            return "microbit"
        }
        return undefined;
    }

    private isIFrame() {
        try {
            return window && window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    componentDidMount() {
        window.addEventListener("message", (ev: any) => {
            var resp = ev.data;
            if (!resp) return;

            if (resp.type === "pxtpkgext")
                this.handleMakeCodeResponse(resp);
        }, false);
    }

    handleMakeCodeResponse = (resp: any) => {
        console.log(resp);
        const target = resp.target;
        switch (resp.event) {
            case "extloaded":
                // Loaded, set the target
                this.setState({ target })
                break;
        }
    }

    render() {
        const { target, isSupported } = this.state;

        let layout: LayoutTypes = 'matrix';
        let size: number;
        let sizeX: number;
        let sizeY: number;
        switch (target) {
            case 'microbit':
                layout = 'matrix';
                sizeX = 5;
                sizeY = 5;
                break;
            case 'adafruit':
                layout = 'ring';
                size = 10;
                break;
        }

        return (
            <div className={`MCExtension ${!target ? 'dimmable dimmed' : ''}`}>
                {!isSupported ? <div>
                    This extension is not supported on your browser
                </div> : <App layout={layout} size={size} sizeX={sizeX} sizeY={sizeY}/>}
            </div>
        );
    }
}