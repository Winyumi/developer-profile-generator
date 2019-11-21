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
        const { username, color } = await inquirer.prompt(questions);
        const { data } = await axios.get(`https://api.github.com/users/${username}`);
        console.log(data);
    } catch (err) {
        console.log(err);
    }
}

init();
