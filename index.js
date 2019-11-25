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
        message: "Enter a GitHub username:",
        type: "input",
        name: "username",
        validate: validateName
    },
    {
        message: "Choose a color for the PDF:",
        type: "list",
        name: "color",
        choices: ["Red", "Green", "Blue", "Pink"]
    }
];

async function init() {
    try {

        console.log("");

        // Prompt user for GitHub profile
        const { username } = await inquirer.prompt(questions[0]);

        // Get data from GitHub
        try {
            console.log("Looking up GitHub profile...");
            // Get data from GitHub API
            var profile = await axios.get(`https://api.github.com/users/${username}`);
            var starred = await axios.get(`https://api.github.com/users/${username}/starred?per_page=100`);
            var data = profile.data;
            data.starred_repos = starred.data.length > 99 ? "99+" : starred.data.length;
            console.log(`Profile "${data.login}" found.\n`);
            // console.log(data);
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
            // Create pdf directory if not exists
            let dir = './pdf';
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            // Prepare filename with username and timestamp
            let filename = `profile-${data.login.toLowerCase()}-${timestamp()}.pdf`;
            // Start puppeteer instance and page
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            // Set the page contents and wait for it to finish loading
            await page.setContent(generateHTML(data), {
                waitUntil: "networkidle0"
            });
            // Print page to PDF
            await page.pdf({
                path: `${dir}/${filename}`,
                format: 'Letter'
            });
            // End puppeteer instance
            await browser.close();
            console.log(`PDF has been created at "${dir}/${filename}".`);
        })();

    } catch (err) {

        console.log(err);

    }
}

init();
