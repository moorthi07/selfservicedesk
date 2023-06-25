
const apiKey =  "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"; //process.env.OPENAI_API_KEY || 
// const client = axios.create({
//     headers: { 'Authorization': 'Bearer ' + apiKey }
// });

// const params = {
//   "prompt": "Once upon a time  he says come she says no - convert this into oscars standard screenplay without any addition to the story", 
//   "max_tokens": 10
// }

// client.post('https://api.openai.com/v1/chat/completions', params)
//   .then(result => {
//     console.log(params.prompt + result.data.choices[0].text);
// }).catch(err => {
//   console.log(err.message);
// });

import request  from "request";
import fs from "fs";
import FormData from "form-data"
import axios from 'axios';
import { Configuration, OpenAIApi } from "openai";
// const { Configuration, OpenAIApi } = require("openai");



const configuration = new Configuration({
  apiKey: apiKey //process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [ {role: "user", content: "He says come over she says no no I have to go and I’ll be back at 4pm she leaves to garage starts car drive through he locks the door and says honey you can come out now  - convert this to oscar standard screenplay including the correct format and importantly do not add additional story of yourself"}],
});
console.log(completion.data.choices[0].message);
