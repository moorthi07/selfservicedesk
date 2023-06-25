// var request = require('request');
// var fs = require('fs');

import request  from "request";
import fs from "fs";
import FormData from "form-data"
import axios from 'axios';

// var options = {
//   'method': 'POST',
//   'url': 'https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr?method=openai-whisper&task=transcribe&encode=true&output=json',
//   'headers': {
//     'accept': 'application/json'
//   },
//   formData: {
//     'audio_file': {
//       'value': fs.createReadStream('/Users/sendur/Downloads/stream.wav'),
//       'options': {
//         'filename': 'stream.wav',
//         'contentType': null
//       }
//     }
//   }
// };
// request(options, function (error, response) {
//   if (error) throw new Error(error);
//   console.log(response.body);
// });


//---------------
// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');

// let data = new FormData();
// data.append('audio_file', fs.createReadStream('/Users/sendur/Downloads/stream.wav'));

// let config = {
//   method: 'post',
//   maxBodyLength: Infinity,
//   url: 'https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr?method=openai-whisper&task=transcribe&encode=true&output=json',
//   headers: { 
//     'accept': 'application/json', 
//     ...data.getHeaders()
//   },
//   data : data
// };
// let transtext =''
// axios.request(config)
// .then((response) => {
//   // transtext = JSON.stringify(response.data)
//   transtext = response.data
//   console.log('trantext -----', transtext.text);
// })
// .catch((error) => {
//   console.log(error);
// }); 
// ------------------
const apiKey =  "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"; //process.env.OPENAI_API_KEY || 
const client = axios.create({
    headers: { 'Authorization': 'Bearer ' + apiKey }
});

const params = {
  "prompt": "Once upon a time  he says come she says no - convert this into oscars standard screenplay without any addition to the story", 
  "max_tokens": 10
}

client.post('https://api.openai.com/v1/chat/completions', params)
  .then(result => {
    console.log(params.prompt + result.data.choices[0].text);
}).catch(err => {
  console.log(err.message);
});