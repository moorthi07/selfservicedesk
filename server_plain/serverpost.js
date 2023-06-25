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

let data = new FormData();
data.append('audio_file', fs.createReadStream('/Users/sendur/Downloads/stream.wav'));

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://whisper-asr-webservice-whisperasr.bunnyenv.com/asr?method=openai-whisper&task=transcribe&encode=true&output=json',
  headers: { 
    'accept': 'application/json', 
    ...data.getHeaders()
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
