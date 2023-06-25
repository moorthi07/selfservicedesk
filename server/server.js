/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as dotenv from 'dotenv';
// import { dialogflow } from './dialogflow';
// import { speech } from './speech';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as sourceMapSupport from 'source-map-support';

import axios from 'axios';
import FormData from "form-data"

import * as ss from 'socket.io-stream';
// const ss = require('socket.io-stream');

dotenv.config();
sourceMapSupport.install();

export class App {
    PORT = parseInt(process.env.PORT) || 8080;
    app = express.application;
    server = http.Server;
    io = socketIo.Server;
    socketClient = socketIo.Server;

    constructor() {
        this.createApp();
        this.createServer();
        this.sockets();
        this.listen();
    }

    createApp() {
        app = express();
        app.use(cors);
        app.set('trust proxy', true);
        // this.app.use('/', express.static(path.join(__dirname, '../dist/public')));
        // this.app.use(function(req: any, res: any, next: any) {
        //     // res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        //     // if (req.secure) {
        //     //     // request was via https, so do no special handling
        //     //     next();
        //     // } else {
        //     //         // request was via http, so redirect to https
        //     //         res.redirect('https://' + req.headers.host + req.url);
        //     // }

        // });
        this.app.use('/', express.static(path.join(__dirname, '../dist/public')));
    }

    createServer() {
        this.server = http.createServer(this.app);
    }

    sockets() {
        this.io = socketIo(this.server);
    }

    listen() {
        let me = this;
        this.server.listen(App.PORT, () => {
            console.log('Running server on port %s', App.PORT);
        });

        this.io.on('connect', (client) => {
            var me = this;
            me.socketClient = client;
            console.log(`Client connected [id=${client.id}]`);
            client.emit('server_setup', `Server connected [id=${client.id}]`);

            // simple DF detectIntent call
            /*client.on('message', function (results: any) {
                let dataURL = results.audio.dataURL;
                dataURL = dataURL.split(',').pop();
                let fileBuffer = Buffer.from(dataURL, 'base64');
        
                dialogflow.detectIntent(fileBuffer, function(results: any){
                    me.socketClient.emit('results', results);
                });
            });*/

            // DF detect stream call
            ss(client).on('stream', async function (stream, data) {
                var filename = path.basename(data.name);
                stream.pipe(fs.createWriteStream(filename));

                // const task = req.body.task || 'transcribe';
                // const language = req.body.language || null;
                // const initial_prompt = req.body.initial_prompt || null;
                // const audio_file = req.files.audio_file;
                // const encode = req.body.encode || true;
                // const output = req.body.output || 'txt';
                // const word_timestamps = req.body.word_timestamps || false;


                // interface config{
                //     method: string;
                //     headers: object;

                // }

                // interface FormData1 {
                //     task: string;
                //     language: string | null;
                //     initial_prompt: string | null;
                //     audio_file: any;
                //     encode: boolean;
                //     output: string;
                //     word_timestamps: boolean;
                //  }

                const formData = {
                    task: 'transcribe',
                    language: null,
                    initial_prompt: null,
                    audio_file: stream,
                    encode: true,
                    output: 'txt',
                    word_timestamps: false
                };



                // const options: AxiosRequestConfig<config> = {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'multipart/form-data' },
                // };

                const task = 'transcribe';
                const language = '';
                const initial_prompt = '';
                // const audio_file = req.files.audio_file;
                const encode = true;
                const output = 'json';
                const word_timestamps = false;
                const audio = stream;
                // const result = await transcribe(audio, task, language, initial_prompt, word_timestamps, output);

                const url = `https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr`;
                const headers = {
                    'Content-Type': 'application/json',
                };

                let data1 = new FormData();
                data.append('audio_file', fs.createReadStream('/Users/sendur/Downloads/stream.wav'));

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr?method=openai-whisper&task=transcribe&encode=true&output=json',
                    headers: {
                        'accept': 'application/json',
                        ...data1.getHeaders()
                    },
                    data: data1
                };

                axios.request(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });







                // if (response.status === 200) {
                //     const data = await response.data();
                //     me.socketClient.emit('results', data);
                // } else {
                //     me.socketClient.emit('error', response.statusText);
                // }




                // dialogflow.detectIntentStream(stream, function(results: any){
                //     me.socketClient.emit('results', results);
                // });
            });

            // TTS call
            client.on('tts', function (obj) {
                console.log(obj);
                // speech.textToSpeech(obj.text).then(function(audio: AudioBuffer){
                //     me.socketClient.emit('audio', audio);
                // }).catch(function(e: any) { console.log(e); })
            });
        });
    }
}

export let app = new App();
