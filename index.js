const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, //Your OpenAI API Key (see Readme.md)
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  // The origin of an extension iframe will be null so the Access-Control-Allow-Origin has to be wildcard.
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Start quiz endpoint
app.post('/', async (req, res) => {
  let isDone = false;
  try {
    // Step 1: Create and run a thread
    //Update the content to your needs as appropriate.
    const run = await openai.beta.threads.createAndRun({
      assistant_id: process.env.ASST_ID, //OpenAI's unique ID for your assistant (see Readme.md)
      thread: {
        messages: [
          {
            role: "user",
            content: "Generate 10 multiple-choice trivia questions and their answers.", 
          },
        ],
      },
    });

    // Step 2: Get the thread ID from the run response
    const thread_id = run.thread_id; // Ensure thread_id is correctly initialized
    const run_id = run.id;
    while (!isDone) {
      const run2 = await openai.beta.threads.runs.retrieve(
          thread_id,
          run_id
        );
        if(run2.status === 'completed') {
          isDone=true;
          break;
        }
    }
    // Step 3: Fetch messages using the thread ID
    const threadMessages = await openai.beta.threads.messages.list(
      `${thread_id}`, // Use the initialized thread_id
    );

    // Step 4: Interpret the results
    const content = threadMessages.data[0].content[0].text.value;
    // Extract JSON array from response
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]") + 1;
    const jsonArrayString = content.substring(jsonStart, jsonEnd);

    // Parse JSON string into an array of objects and return it in the body of the POST response
    const questionsArray = JSON.parse(jsonArrayString);
    //console.log(questionsArray); //uncomment this console log to see the questions and answers created by the Assistant. 
    res.json({questionsArray});

  } catch (error) {
    console.error("An error occurred:", error);
  }
});

//Start server
const PORT = process.env.PORT || 3000; //needed for deployment (server domains like Render or Heroku often use a random port; I used 3000 for testing purposes at home)
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.setTimeout(120000);