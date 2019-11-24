const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const puppeteer = require("puppeteer");

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

async function init() {
    try {

        // Prompt user for GitHub profile
        const { username } = await inquirer.prompt(questions[0]);

        // Get data from GitHub
        try {
            var { data } = await axios.get(`https://api.github.com/users/${username}`);
        } catch (err) {
            console.log(`GitHub profile not found.`);
            return;
        }

        // Prompt user for color
        const { color } = await inquirer.prompt(questions[1]);
        console.log(`You've selected ${color}.`);

        // Create the PDF
        (async function createPDF() {
            let dir = './pdf';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            let html = `<p>${data.name} - ${data.avatar_url}</p>`;
            await page.setContent(html);
            await page.pdf({
                path: `${dir}/profile.pdf`,
                format: 'Letter'
            });
            await browser.close();
            console.log("PDF has been created.");
        })();

    } catch (err) {

        console.log(err);

    }
}

init();
