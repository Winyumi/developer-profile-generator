const axios = require("axios");
const inquirer = require("inquirer");
// const puppeteer = require("puppeteer");

function validateName(name) {
    return name !== '';
}

const questions = [
    {
        message: "GitHub Username?",
        type: "input",
        name: "username",
        validate: validateName
    },
    {
        message: "Color?",
        type: "list",
        name: "color",
        choices: ["Red", "Green", "Blue", "Pink"]
    }
];

/*
function writeToFile(fileName, data) {

}
*/

async function init() {
    try {

        // Ask user for GitHub profile
        const { username } = await inquirer.prompt(questions[0]);

        // Get data from GitHub
        try {
            const { data } = await axios.get(`https://api.github.com/users/${username}`);
            console.log(data);
        } catch (err) {
            console.log(`GitHub profile not found.`);
            return;
        }

        // Ask user for color
        const { color } = await inquirer.prompt(questions[1]);
        console.log(`You've selected ${color}.`);

    } catch (err) {

        console.log(err);

    }
}

init();
