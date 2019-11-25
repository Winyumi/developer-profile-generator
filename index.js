// Node modules
const axios = require("axios");
const inquirer = require("inquirer");
const fs = require("fs");
const puppeteer = require("puppeteer");

// Local modules
const timestamp = require("./modules/timestamp");
const generateHTML = require("./modules/generateHTML");


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
        // console.log(`You've selected ${color}.`);
        data.color = color.toLowerCase();

        // Create the PDF
        (async function createPDF() {
            console.log("Creating PDF...");
            let dir = './pdf';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            let filename = `profile-${data.login.toLowerCase()}-${timestamp()}.pdf`;
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(generateHTML(data), {
                waitUntil: "networkidle0"
            });
            await page.pdf({
                path: `${dir}/${filename}`,
                format: 'Letter'
            });
            await browser.close();
            console.log(`PDF has been created at "${dir}/${filename}".`);
        })();

    } catch (err) {

        console.log(err);

    }
}

init();
