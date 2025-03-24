// fetch api key from config.json

const fetchAPIKey = async () => {
    try {
        // fetch api
        const response = await fetch("config.json");
        // error handling if fetching api fails
        if (!response.ok) {

            throw new Error(`HTTPS ERROR! Status: ${response.status}`);
        }
        //converts fetching data to json
        const config = await response.json();
        return config.API_KEY;



    } catch (error) {
        console.error("Error fetching API Key:", error);
        alert("Failed to fetch API Key")
        return null;
    }
};

// generate recipe part
const inputDish = document.querySelector('#ingredient-input-box');
const generatebtn = document.querySelector('#generate-recipe');
const recipeContent = document.querySelector('.recipe-content');
// ChatBot AI Outer
const chatBotCircle = document.querySelector('.chatBotCircle');
const chatBotBox = document.querySelector(".chatBotBox");
// ChatBot AI Inner
const chatUserTxtInput = document.querySelector(".user-text-input"); // chat input box
const userMsgContainer = document.querySelector(".user-msg-container");
const chatBotMsgContainer = document.querySelector(".chat-bot-container");
const allChatContainer = document.querySelector('.all-chat-container');
const sendButton = document.querySelector('.chatWithAI');


const generateRecipe = async () => {
    let inputValue = inputDish.value.trim();
    console.log(inputValue);

    if (inputValue === "") {
        alert("Please enter a dish before generating a recipe");
        return;
    }
    recipeContent.innerHTML = "Please wait...";
    inputDish.value = "";



    try {
        const API_KEY = await fetchAPIKey();
        if (!API_KEY) return; // this checks the API if api key fails


        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const isDishValid = await validateRecipe(url, inputValue);
        if (!isDishValid) {
            return recipeContent.innerHTML = `${inputValue} is not a dish, please enter another.`
        }

        const recipeText = await recipeAigenerated(url, inputValue);
        recipeContent.innerHTML = `<strong>${inputValue} Recipe:</strong><br><br>` + recipeText.replace(/\n/g, "<br>");



    } catch (error) {
        console.error("Error generating recipe: ", error);
        recipeContent.innerHTML = "Error generating recipe, please try again later"

    }
};


const validateRecipe = async (url, inputValue) => {

    try {
        const validateDishRequestBody = { contents: [{ parts: [{ text: `Is "${inputValue}" a food or dish? Reply with just "yes" or "no".` }] }] };
        const validateDishResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validateDishRequestBody)
        });

        //parse data
        const data = await validateDishResponse.json();

        const aiResponse = data.candidates[0].content.parts[0].text.toLowerCase().trim();

        return aiResponse === "yes";

    } catch (error) {
        console.error("Error Validating dish", error)
        return false;
    }

};

const recipeAigenerated = async (url, inputValue) => {
    try {
        //request body 
        const recipeAiGeneratedBody = { contents: [{ parts: [{ text: `Give me a simple step-by-step recipe for ${inputValue}. Include ingredients, instructions, and servings.` }] }] };
        const recipeAiGeneratedResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipeAiGeneratedBody)
        })

        //parse data 
        const data = await recipeAiGeneratedResponse.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("Unexpected API response structure");
        }

    } catch (error) {
        console.error("Error generating recipe", error)
        recipeContent.innerHTML = "Cannot generate a recipe";
    }
}


// AI Chatbot Response Function
chatBotCircle.addEventListener("click", () => {
    chatBotBox.classList.toggle("active");

    const aiGreetings = "Ma, Anong Ulam?"

    if (!document.querySelector(".chat-bot-msg-content")){
        const aiNameDiv = document.createElement('div');
        const aiMessageDiv = document.createElement('div');
        aiMessageDiv.classList.add('chat-bot-msg-content', 'chat-bot-container',);
        aiNameDiv.classList.add('chat-bot-container','name-content');

        aiNameDiv.textContent = "ChatBot AI"
        aiMessageDiv.textContent = aiGreetings;
        allChatContainer.appendChild(aiNameDiv);
        allChatContainer.appendChild(aiMessageDiv);

    }
});


const chatWithAI = async() => {
    let userInput = chatUserTxtInput.value.trim();

    console.log(userInput)
    if (userInput !== "") {
        const userNameDiv = document.createElement('div');
        const userInputDiv = document.createElement('div');
        userNameDiv.textContent = "You";
        userInputDiv.textContent = userInput;

        //
        allChatContainer.appendChild(userNameDiv);
        allChatContainer.appendChild(userInputDiv);
        // allChatContainer.appendChild(userMsgContainer);
        userInputDiv.classList.add('user-msg-content', 'user-msg-container');
        userNameDiv.classList.add('user-msg-container', 'name-content');


        chatUserTxtInput.value = "";
    }

    if (userInput) {

        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = "Typing...";
        loadingMsg.classList.add("typing");
        allChatContainer.appendChild(loadingMsg);

        try {
            const API_KEY = await fetchAPIKey();
            if (!API_KEY) return;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
            const aiResponse = await chatBotAssist(url, userInput);

            allChatContainer.removeChild(loadingMsg);

            const aiNameDiv = document.createElement('div');
            const aiResponseMsg = document.createElement('div');
            
            aiNameDiv.textContent = "ChatBot AI"
            aiResponseMsg.textContent = aiResponse;
            allChatContainer.appendChild(aiNameDiv);
            allChatContainer.appendChild(aiResponseMsg);

            aiResponseMsg.classList.add('chat-bot-msg-content', 'chat-bot-container' );
            aiNameDiv.classList.add('chat-bot-container', 'name-content');



            console.log(aiResponseMsg);

        } catch (error) {
            console.error("Error in chatbot response:", error);
            const errorMsgDiv = document.createElement('div');
            errorMsgDiv.textContent = "Sorry, I couldn't process your request. Please try again later.";
            errorMsgDiv.classList.add('chat-bot-msg-content');
            chatBotMsgContainer.appendChild(errorMsgDiv);
        }
    }
} 


const chatBotAssist = async (url, inputValue) => {
    try {
        //request body 
        const aiAssistantBody = { contents: [{ parts: [{ text: `${inputValue}` }] }] };
        const aiAssistantResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(aiAssistantBody)
        })

        //parse data 
        const data = await aiAssistantResponse.json();

        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            return data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error("Unexpected API response structure");
        }

    } catch (error) {
        console.error("Error generating recipe", error)
        recipeContent.innerHTML = "Cannot generate a recipe";
    }
}

const handleUserInput = (event) => {

    if(event.type === "keydown" && event.key === "Enter"){
        if(event.target === inputDish){
            generateRecipe();
        }else if(event.target === chatUserTxtInput){
            chatWithAI();
        }
        return;
    }

    if(event.type === "click"){
        generateRecipe();
    }

};



chatUserTxtInput.addEventListener("keydown", handleUserInput);
sendButton.addEventListener("click", handleUserInput);
inputDish.addEventListener("keydown", handleUserInput);

