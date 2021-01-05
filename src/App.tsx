import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import AgoraRTC, { IAgoraRTCClient, ILocalAudioTrack, ILocalVideoTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { downsampleBuffer, isEmptyBuffer } from './helpers';
import { socket } from './services/socket.service';


class App extends Component {
    client: IAgoraRTCClient = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });;
    audioTrack: any;
    bufferSize: number = 1024 * 2 ;

    state = {
        transcript: '',
        started: false
    }

    componentDidMount() {
        socket.on('connect', () => {
            console.info('Connected established!');
            
        })
    }
    

    startCall = async () => {

        this.audioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        this.audioTrack.setAudioFrameCallback(this.generateBufferForGoogleSpeechToText, this.bufferSize)
        this.listenToTheResult();
        this.setState({ started: true })
    }


    /**
     * Generate Audio Buffer for Google Speech To Text
     * @param e Audio Buffer
     */
    generateBufferForGoogleSpeechToText = (e: AudioBuffer) => {
        const left = e.getChannelData(0);

        const gSTTBuffer = downsampleBuffer(left, e.sampleRate, 16000)
        if (!isEmptyBuffer(gSTTBuffer.buffer)) this.sendBufferForGoogleSpeechToText(gSTTBuffer.buffer)

    }

    private sendBufferForGoogleSpeechToText = (gSTTBuffer: Buffer): void => {
        // console.log('Data', gSTTBuffer);
        
        socket.emit('audio_data', gSTTBuffer)
    }

    listenToTheResult = (): void => {
        socket.on('transcript', (data: string) => {
            this.setState((prev: any) => ({
                transcript: (data.trim()) === '[Background]' ? '' : `${prev.transcript} ${data}`
            }))
        })
    }

    render() {
        const { transcript, started } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <img src="https://renesistech.com/images/logo.svg" className="App-logo" alt="logo" />
                    <p>
                       Let's start the mic to test the speech to text modal. 
                    </p>
                    <button className="btn btn-default" onClick={started ? window.location.reload : this.startCall}>
                        { started ? 'Stop' : 'Start'}
                    </button>

                    <p>
                        Transcript: { transcript }
                    </p>
                </header>
            </div>
        );
    }
}

export default App;
