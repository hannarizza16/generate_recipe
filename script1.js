
fetch('config.json')
    .then(response => response.json())
    .then(config => {
        console.log(config.API_KEY)
    })

// 🔹 Load API Key from config.json
async function getAPIKey() {
    const response = await fetch("config.json");  // Fetch config file
    const config = await response.json();        // Convert response to JSON
    return config.API_KEY;                        // Return API key
}

// 🔹 Select elements
const inputDish = document.querySelector("#ingredient-input-box");
const generateBtn = document.querySelector("#generate-recipe");
const recipeContent = document.querySelector(".recipe-content");
const chatBotCircle = document.querySelector('.chatBotCircle');
const chatBotBox = document.querySelector(".chatBotBox");



inputDish.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        generateRecipe();
    }
});

// 🔹 Function to generate AI-powered recipe
async function generateRecipe() {
    let inputValue = inputDish.value.trim();

    if (inputValue === "") {
        alert("⚠️ Please enter a dish before generating a recipe.");
        return;
    }

    // Display loading text while fetching data
    recipeContent.innerHTML = "Please wait...";

    try {
        const API_KEY = await getAPIKey();  // Get API Key

        // 🔹 Define the API URL
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        // 🔹 Define request body
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: `Give me a simple step-by-step recipe for ${inputValue}. Include ingredients and instructions.` }
                    ]
                }
            ]
        };

        // 🔹 Send request to Gemini API using fetch()
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        // 🔹 Parse response
        const data = await response.json();
        
        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;  // Extract AI-generated text

            recipeContent.innerHTML = `<strong>${inputValue} Recipe:</strong><br><br>` + aiResponse.replace(/\n/g, "<br>");

        } else {
            recipeContent.innerHTML = "❌ No recipe found. Try another dish.";
        }

    } catch (error) {
        console.error("Error generating recipe:", error);
        recipeContent.innerHTML = "❌ Error generating recipe. Please try again.";
    }

    console.log(inputValue);
    // Clear input field
    // inputDish.value = "";
}


chatBotCircle.addEventListener("click", () => {
    chatBotBox.classList.toggle("active");
})
