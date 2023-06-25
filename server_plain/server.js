import * as dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import socketio from "socket.io";
import fs from "fs";
import path from 'path';
import ss from "socket.io-stream";
import * as sourceMapSupport from 'source-map-support';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
// const ss = require('socket.io-stream');

import axios from 'axios';
import FormData from "form-data"

dotenv.config();
sourceMapSupport.install();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT) || 8080;
const app = express();

app.use(cors());
app.use('/', express.static(path.join(__dirname, '../dist/public')));

app.post("/transcribe", async (req, res) => {
  const response = await fetch("https://example.com/api/users", {
    method: "POST",
    body: JSON.stringify(req.body),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (response.status === 200) {
    const data = await response.json();

    res.json(data);
  } else {
    console.log(response.status);
    res.status(response.status).json({ error: response.statusText });
  }
});

const server = app.listen(PORT, () => {
  console.log('Running server on port %s', PORT);
});
const io = socketio(server);

io.on("connect", (client) => {
  var me = this;
  console.log(`Client connected [id=${client.id}]`);
  client.emit('server_setup', `Server connected [id=${client.id}]`);




  //   socket.on("message", async (data) => {}
  ss(client).on('stream', async function (stream, datablob) {
    var filename = path.basename(datablob.name);
    stream.pipe(fs.createWriteStream(filename));

    const task = 'transcribe';
    const language = '';
    const initial_prompt = '';
    // const audio_file = req.files.audio_file;
    const encode = true;
    const output = 'json';
    const word_timestamps = false;
    const audio = stream;
    // const result = await transcribe(audio, task, language, initial_prompt, word_timestamps, output);

    const body = {
      task,
      language,
      initial_prompt,
      encode,
      output,
      word_timestamps,
      audio
    };

    const url = `https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr`;
    const headers = {
      'Content-Type': 'application/json',
    };

    // const response = await fetch(url, {
    // method: "POST",
    // body: body,
    // //   body: JSON.stringify(data),
    // headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    // },
    // });

test
    let data1 = new FormData();
    data1.append('audio_file', fs.createReadStream('/Users/sendur/Downloads/stream.wav'));

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

    await axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            client.emit('results', response);
        })
        .catch((error) => {
            console.log(error);
            client.emit('error', error);
        });


    // if (response.status === 200) {
    //   const resdata = await response.json();
    //   //   const data1 =   response.data ;
    //   client.emit('results', resdata);

    //   //   socket.emit("data", data);
    // } else {
    //   console.log("EERRR......" + response.status);
    //   client.emit('error', response.statusText);

    //   //   socket.emit("error", response.statusText);
    // }

  });

});
