

    async function getAPIKey(){
        const response = await fetch('config.json'); // fetch API from config.json
        const config = await response.json(); // converts to .json
        return config.API_KEY;
    }




const inputDish = document.querySelector('#ingredient-input-box');
const generatebtn = document.querySelector('#generate-recipe');
const recipeContent = document.querySelector('.recipe-content');

inputDish.addEventListener("keydown", function(event){
// // .key - return the exact key that was pressed
    if (event.key === "Enter"){
        let inputValue = this.value; // gets the user input
        //check if it appears in console 
        // console.log(`Enter Dish : ${inputValue}`);
        generateRecipe();

        //empty the input box after entering
        this.value = ''; 
    
    }
})

const generateRecipe = () => {
    let inputValue = inputDish.value.trim();

        if (inputValue === "") {
        alert("⚠️ Please enter a dish before generating a recipe.");
        return; // Stop function execution if input is empty
    }

    recipeContent.innerHTML = inputValue;
    // console.log(`clicked value : ${inputValue}`);

    inputDish.value = "";
}


