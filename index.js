import { Configuration, OpenAIApi } from "openai";
import { OPENAI_API_KEY, ORGANIZATION_KEY } from "./api_key.js";

const configuration = new Configuration({
  key: ORGANIZATION_KEY,
  apiKey: OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatbotConversation = document.getElementById("chatbot-conversation");

const conversationArr = [
  {
    role: "system",
    content:
      "You are a highly knowledgeable assistant that is always happy to help.",
  },
];

document.getElementById("clear-btn").addEventListener("click", () => {
  conversationArr.splice(1);
  chatbotConversation.innerHTML = `<div class="speech speech-ai">How can I help you?</div>`;
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  const userInput = document.getElementById("user-input");
  conversationArr.push({ role: "user", content: userInput.value });
  fetchReply();
  const newSpeechBubble = document.createElement("div");
  newSpeechBubble.classList.add("speech", "speech-human");
  chatbotConversation.appendChild(newSpeechBubble);
  newSpeechBubble.textContent = userInput.value;
  userInput.value = "";
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
});

async function fetchReply() {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationArr,
    presence_penalty: 0,
    frequency_penalty: 0,
  });
  console.log(response);
  conversationArr.push(response.data.choices[0].message);
  const text = JSON.stringify(response.data.choices[0].message.content);
  console.log(text);
  renderTypewriterText(text);
}

function renderTypewriterText(text) {
  const newSpeechBubble = document.createElement("div");
  newSpeechBubble.classList.add("speech", "speech-ai", "blinking-cursor");
  chatbotConversation.appendChild(newSpeechBubble);
  let i = 0;
  const interval = setInterval(() => {
    newSpeechBubble.textContent += text.slice(i - 1, i);
    if (text.length === i) {
      clearInterval(interval);
      newSpeechBubble.classList.remove("blinking-cursor");
    }
    i++;
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
  }, 50);
}
