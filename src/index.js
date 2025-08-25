import express from 'express';
import 'dotenv/config'
import { OpenAI } from "openai";
import { Mistral } from '@mistralai/mistralai';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 4000;


const corsOptions = {
  origin: 'http://localhost:5173', // Your React app's origin
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type'] // Allowed headers
};

app.use(cors(corsOptions));

app.use(express.json());


// MISTRAL AI
const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({apiKey: apiKey});

app.post('/api/mistral', async (req, res) => {
  const requestBody = req.body.data
  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{role: 'user', content: requestBody}],
    });

    console.log(req.body.data)

    // for await (const chunk of chatResponse) {
    //   const streamText = chunk.data.choices[0].delta.content;
    //   process.stdout.write(streamText);
    // }
    const responseBody = chatResponse.choices[0].message.content;
    console.log(responseBody)
    res.status(200).json({ content: responseBody });
    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
})


// CHATGPT
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


app.post('/api/chatgpt', async (req,res) => {
  try {
    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": req.body.data},
      ],
    });
    console.log(completion.choices[0].message);

    res.status(200).send(completion.choices[0].message)
  } catch (error) {
    res.status(404).send(error.message)
  }
})
    
  


//DEEPSEEK
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY
});

app.post('/api/deepseek', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: req.body.data }],
      model: "deepseek-chat",
    });
      
    console.log(completion.choices[0].message.content);
    res.status(200).send(completion)
  } catch (error) {
    res.status(400).send(error.message)
  }

})



// app.post('/', async (req, res) => {
//     const prompt = req.body;
//     try {
//         res.status(200).send('User has established connection');
//     } catch (error) {
//         res.status(500).send('Unable to connect with AI.');
//     }
// })

app.listen(port, () => {
    console.log(`client has connected to server on ${port}`)
});

