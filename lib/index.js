"use strict";
const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const main = async () => {
    try {
        const url = core.getInput('url');
        const imagePath = core.getInput('imagePath');
        const deleteOnFail = core.getInput('deleteOnFail');
        // const url = 'https://minituff-github-readme-stats.vercel.app/api/wakatime?username=minituff&langs_count=18&layout=compact&custom_title=My%20Code%20Stats'
        // const imagePath = 'media/test.svg'
        console.log(`url ${url}`);
        console.log(`imagePath ${imagePath}`);
        console.log(`deleteOnFail ${deleteOnFail}`);
        console.log(path.resolve(imagePath));
        async function downloadImage(url, imagePath) {
            const response = await fetch(url);
            const buffer = await response.buffer();
            fs.writeFile(imagePath, buffer, () => console.log('finished downloading!'));
        }
        await downloadImage(url, imagePath);
        fs.writeFile('file.txt', `${url} - ${imagePath}`, () => console.log('Created file.txt'));
        // const time = (new Date()).toTimeString();
        // core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        // const payload = JSON.stringify(github.context.payload, undefined, 2)
        // console.log(`The event payload: ${payload}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
main();
//# sourceMappingURL=index.js.map