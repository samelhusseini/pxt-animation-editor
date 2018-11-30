/// <reference path="./typings/animation-editor.d.ts" />

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Menu, Button } from 'semantic-ui-react'
import Slider from 'rc-slider';

import { pxt, PXTClient } from './lib/pxtextensions';

import { Canvas } from './components/Canvas';
import { Frames } from './components/Frames';

import { EmitterFactory } from "./exporter/factory";

export interface AppState {
    target: string;
    frames?: FrameDef[];
    running?: boolean;
    delay?: number;
    selectedFrame?: number;
}

export interface AppProps {
    client: PXTClient;
    target: string;
    layout?: LayoutTypes;
    size?: number;
    sizeX?: number;
    sizeY?: number;
    backgroundColor?: string;
}

export class App extends React.Component<AppProps, AppState> {

    private timerId: any;

    constructor(props: AppProps) {
        super(props);

        this.state = this.getInitialState(props);

        this.handleSave = this.handleSave.bind(this);
        this.handleStartOver = this.handleStartOver.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleStartStop = this.handleStartStop.bind(this);
        this.handleSelectedFrame = this.handleSelectedFrame.bind(this);
        this.handleFrameDeleted = this.handleFrameDeleted.bind(this);
        this.handleFrameDuplicated = this.handleFrameDuplicated.bind(this);
        this.handleFrameUpdated = this.handleFrameUpdated.bind(this);
        this.handleDelayChanged = this.handleDelayChanged.bind(this);

        this.handleReadResponse = this.handleReadResponse.bind(this);
        this.handleHidden = this.handleHidden.bind(this);

        props.client.on('read', this.handleReadResponse);
        props.client.on('hidden', this.handleHidden);
    }

    private handleReadResponse(resp: pxt.extensions.ReadResponse) {

    }

    private handleHidden() {
        const { frames, target } = this.state;
        if (frames && frames.length > 0) {
            const emitter = EmitterFactory.getEmitter(target);
            if (emitter) {
                const output = emitter.output(frames);
                pxt.extensions.write(output, JSON.stringify(frames));
            }
        } else {
            pxt.extensions.write(' ', ' ');
        }
    }

    private getInitialState(props: AppProps) {
        return {
            target: props.target,
            frames: [this.emptyFrame()],
            running: false,
            delay: 400,
            selectedFrame: 0
        }
    }

    private emptyFrame(): FrameDef {
        const { layout, size, sizeX, sizeY } = this.props;

        const state: { [key: number]: string; } = {};
        const len = sizeX && sizeY ? sizeX * sizeY : size;
        for (let i = 0; i < len; i++) {
            state[i] = '';
        }

        return {
            layout, size, sizeX, sizeY, state
        };
    }

    componentDidUpdate(prevProps: AppProps, prevState: AppState) {
        if (prevState.running != this.state.running) {
            if (this.state.running) {
                // Start running
                this.timerId = setInterval(() => {
                    const nextIndex = this.state.selectedFrame == this.state.frames.length - 1 ? 0 : this.state.selectedFrame + 1;
                    this.setState({ selectedFrame: nextIndex })
                }, this.state.delay);
            } else {
                // Stop running
                clearInterval(this.timerId);
                this.timerId = undefined;
            }
        } else if (prevState.delay != this.state.delay) {
            if (this.timerId) {
                // Restart
                clearInterval(this.timerId);
                this.timerId = setInterval(() => {
                    const nextIndex = this.state.selectedFrame == this.state.frames.length - 1 ? 0 : this.state.selectedFrame + 1;
                    this.setState({ selectedFrame: nextIndex })
                }, this.state.delay);
            }
        }
    }

    handleStartOver() {
        // reset everything
        let conf = window.confirm('Are you sure you want to clear this animation');
        if (conf) {
            this.setState(this.getInitialState(this.props));
        }
    }

    handleSave() {
        // TODO: save and export, ie: go back to the editor
    }

    handleAdd() {
        if (this.state.running) return;
        const frames = this.state.frames;
        const index = this.state.selectedFrame;
        const newFrame = JSON.parse(JSON.stringify(frames[index]));
        frames.splice(index + 1, 0, newFrame);
        this.setState({ frames, selectedFrame: index + 1 });

        setTimeout(() => {
            const container = ReactDom.findDOMNode(this.refs["frames"]) as HTMLDivElement;
            const newChild = container.childNodes[index + 1] as HTMLDivElement;
            container.scrollLeft = newChild.offsetLeft;
        }, 100);
    }

    handleStartStop() {
        this.setState({ running: !this.state.running });
    }

    handleSelectedFrame(index: number) {
        this.setState({ selectedFrame: index });
    }

    handleFrameDuplicated(index: number) {
        const frames = this.state.frames;
        const newFrame = JSON.parse(JSON.stringify(frames[index]));
        frames.splice(index, 0, newFrame);
        this.setState({ frames, selectedFrame: index + 1 });
    }

    handleFrameDeleted(index: number) {
        const frames = this.state.frames;
        frames.splice(index, 1);
        if (frames.length == 0) {
            const newFrame = this.emptyFrame();
            frames.push(newFrame);
        }
        this.setState({ frames, selectedFrame: this.state.selectedFrame ? this.state.selectedFrame - 1 : 0 });
    }

    handleFrameUpdated(state: { [key: number]: string; }) {
        const frames = this.state.frames;
        frames[this.state.selectedFrame].state = state;
        this.setState({ frames });
    }

    handleDelayChanged(value: number) {
        this.setState({ delay: value });
    }

    render() {
        const { backgroundColor } = this.props;
        const { running, delay, frames, selectedFrame } = this.state;

        const frame = frames[selectedFrame];

        return (
            <div className="App" style={{ backgroundColor: backgroundColor }}>
                <Menu fixed="top" borderless>
                    <Menu.Menu position='left'>
                        <Menu.Item>
                            <Button primary onClick={this.handleStartOver}>Start Over</Button>
                        </Menu.Item>
                    </Menu.Menu>


                    <Menu.Item>
                        {`Delay (${delay}ms)`}
                    </Menu.Item>

                    <Menu.Item style={{ width: '200px' }}>
                        <Slider value={delay} onChange={this.handleDelayChanged} min={10} max={1000} step={10} />
                    </Menu.Item>

                    <Menu.Menu position='right'>
                        <Menu.Item name='save' onClick={this.handleSave}>
                            Save
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>

                <Canvas frame={frame} onUpdated={this.handleFrameUpdated} />

                <div className="footer">
                    <div className="play-pause">
                        <Button primary icon={running ? 'stop' : 'play'} size='massive' onClick={this.handleStartStop} />
                    </div>
                    <Frames ref="frames" frames={frames} selected={selectedFrame} running={running} onDuplicated={this.handleFrameDuplicated}
                        onSelected={this.handleSelectedFrame} onDeleted={this.handleFrameDeleted} />
                    <div className="add-frame">
                        <Button secondary icon='add' size='massive' onClick={this.handleAdd} />
                    </div>
                </div>
            </div>
        );
    }
}