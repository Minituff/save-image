"use strict";
const github = require('@actions/github');
const core = require('@actions/core');
const fs = require('fs');
const fetch = require('node-fetch');
const main = async () => {
    try {
        // `who-to-greet` input defined in action metadata file
        const url = core.getInput('url');
        const imagePath = core.getInput('imagePath');
        const deleteOnFail = core.getInput('deleteOnFail');
        // const url = 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1936&q=80'
        // const url = 'https://minituff-github-readme-stats.vercel.app/api/wakatime?username=minituff&langs_count=18&layout=compact&custom_title=My%20Code%20Stats'
        // const imagePath = '../media/test.svg'
        console.log(`url ${url}`);
        console.log(`imagePath ${imagePath}`);
        console.log(`deleteOnFail ${deleteOnFail}`);
        // console.log(path.resolve(imagePath))
        async function downloadImage() {
            const response = await fetch(url);
            const buffer = await response.buffer();
            fs.writeFile(imagePath, buffer, () => console.log('finished downloading!'));
        }
        await downloadImage();
        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event payload: ${payload}`);
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
main();
//# sourceMappingURL=index.js.map