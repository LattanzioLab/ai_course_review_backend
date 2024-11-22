# ai_course_review_backend
NodeJS backend server for generating question-answer combinations using a custom OpenAI Assistant trained on course material. I customized an OpenAI Assistant to produce question-answer combinations in the form of a multiple choice question, four answer options (A,B,C, or D), and the correct answer letter, based on course materials I uploaded in the Tools (file search) section of the Assistant Dashboard. I host a frontend server that generates a web interface for the quiz. My students input their name and email address, which are then sent as a POST request to this server. The server then creates and saves the output of an Assistant thread, and pushes that information back to the frontend server. Questions are then asked of the student, one by one, until the quiz is completed. Once completed, a results page is produced with a final score and the option to download results as a PDF. I have my students email these completion certificates to me for credit each week. Because the Assistant API is called each time a student starts a quiz, the questions are randomized, which provides a fun twist on a typical review quiz. 

With that in mind, this backend server is really just a middleperson in the process, and effectively accepts and responds to POST requests from a frontend server, ultimately generating output based on system instructions the developer includes in their Assistant's dashboard system instructions prompt. In other words, this server could be easily adapted for other purposes, depending on user needs. I include setup instructions below to replicate the system instructions I provided to create my multiple choice questions and their answers. 

**Initial setup**

1. Create your OpenAI API account here - [https://openai.com/api/](https://openai.com/api/). This process should involve creation of an Organization, and potentially a project to start. Please be aware of API use charges and how they vary per model. 
2. Navigate to your Dashboard, then the Assistants section.
3. Next to your organization name at the top-left of the window, create a new Project (if you have not done so already). Then click **Create Assistant**.
4. The right-hand section provides prompts for you to give your assistant a name, set instructions, enable file search (and upload files), and several other options. 
5. In the system instructions, in my use case, I include the following guidance to ensure the thread output includes, for each question, the question, an array of answer options, and the answer itself:
```
Generate 10 multiple-choice trivia questions and their answers, from the attached files. Do not use the internet or external knowledge; only draw from the files.   Each question should include four options (A, B, C, D) and clearly indicate the correct answer. Format the output as a JSON array like this:
[
  {
    "Question": "<question>",
    "Options": ["A. <option A>", "B. <option B>", "C. <option C>", "D. <option D>"],
    "Answer": "B"
  },
  ...
]
```
5. Set other options as desired; note that different models have different costs per use! Because I used file search, I uploaded course materials (so far, the API does well with PDFs as well as other document types). Note that if you upload new files, and/or delete existing file stores, the content used by the Assistant to generate the questions and answers will also change (I take advantage of this by uploading new material each week as we progress through the course to keep questions on-topic). 
6. Get the required `.env` keys: The `ASST_ID` (Assistant ID) should be displayed above the Name prompt for your Assistant. To obtain an API use key for the `OPENAI_API_KEY` variable, select **API Keys** on the left-hand menu, and click **Create new secret key**. 
7. That's it for this page (for now; you may want to tweak settings depending on your specific use case). 
8. Install and run:
```
npm install
node index.js
```
