
const apiKey =   process.env.OPENAI_API_KEY  ;
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
import express from  "express";
// const { Configuration, OpenAIApi } = require("openai");
import * as path from 'path';
import { fileURLToPath } from 'url';
 

// const configuration = new Configuration({
//   apiKey: apiKey //process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// const completion = await openai.createChatCompletion({
//   model: "gpt-3.5-turbo",
//   messages: [ {role: "user", content: "He says come over she says no no I have to go and I’ll be back at 4pm she leaves to garage starts car drive through he locks the door and says honey you can come out now  - convert this to oscar standard screenplay including the correct format and importantly do not add additional story of yourself"}],
// });
// console.log(completion.data.choices[0].message);
 // Get the current file URL
const __filename = fileURLToPath(import.meta.url);

// Get the current file directory
const __dirname = path.dirname(__filename);


// ***********************************************
// Create an express app
const app = express();
console.log(path.join(__dirname, './dist/public/index.html'))
app.use('/', express.static(path.join(__dirname, './dist/public')));
// Define the API key
// const apiKey = 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

// Create a configuration object with the API key
const configuration = new Configuration({
  apiKey: apiKey //process.env.OPENAI_API_KEY,
});

// Create an OpenAI API object with the configuration
const openai = new OpenAIApi(configuration);

// Define a route for the endpoint
app.get('/gscreenplay', async (req, res) => {
  // Get the content from the query parameter
  const content = req.query.content;

  // Check if the content is valid
  if (!content) {
    // Return an error message if not
    return res.status(400).send('Please provide a valid content');
  }

  try {
    // Create a chat completion with the content as a message
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: content }],
    });

    // Get the message from the completion
    const message = completion.data.choices[0].message;

    // Return the message as a response
    return res.status(200).send(message);
  } catch (error) {
    // Return an error message if something goes wrong
    console.log(error )
    return res.status(500).send(error.message);
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
