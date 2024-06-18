const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/analyze', async (req, res) => {
    const { testFailure } = req.body;

    if (!testFailure) {
        return res.status(400).send('Test failure details are required.');
    }

    try {
        console.log('Sending request to OpenAI with test failure:', testFailure);

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4', // Adjust the model based on your requirements
            messages: [
                { role: 'system', content: `Analyze the following test failure:\n\n${testFailure}` }
            ],
            max_tokens: 150,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const analysis = response.data.choices[0].message.content.trim();
        console.log('Received analysis from OpenAI:', analysis);
        res.send({ analysis });
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response from OpenAI API:', error.response.data);
            res.status(500).send('Error response from OpenAI API');
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from OpenAI API:', error.request);
            res.status(500).send('No response received from OpenAI API');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error in setting up the request to OpenAI API:', error.message);
            res.status(500).send('Error in setting up the request to OpenAI API');
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
