"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const fs = require("fs");
const node_fetch_1 = require("node-fetch");
const path = require("path");
const main = async () => {
    try {
        const url = core.getInput('url');
        const imagePath = core.getInput('imagePath');
        const deleteOnFail = core.getInput('deleteOnFail');
        const requiredContentType = core.getInput('requiredContentType');
        console.log(`url: ${url}`);
        console.log(`imagePath: ${imagePath}`);
        console.log(`deleteOnFail: ${deleteOnFail}`);
        console.log(`requiredContentType: ${requiredContentType}`);
        async function ensureDirectoryExistence(filePath) {
            const dirname = path.dirname(filePath);
            const exists = fs.existsSync(dirname);
            if (exists)
                return true;
            fs.mkdir(dirname, { recursive: true }, () => console.log(`${filePath} created`));
            return true;
        }
        async function downloadImage(url, imagePath) {
            let res;
            try {
                console.log("Fetching image...");
                res = await node_fetch_1.default(url);
            }
            catch (error) {
                console.log(`Image failed to load.`);
                core.setOutput("imageLoaded", false);
                if (deleteOnFail) {
                    console.log(`deleteOnFail == true. Deleting ${imagePath}`);
                    fs.unlink(imagePath, () => console.log(`${imagePath} deleted`));
                    return;
                }
                else {
                    core.setFailed(error.message);
                    return;
                }
            }
            core.setOutput("imageLoaded", true);
            console.log(`Image loaded`);
            const contentType = res.headers.get('content-type');
            if (requiredContentType != "" && contentType != requiredContentType) {
                console.log(`Image contentType '${contentType}' does not match the requiredContent type of '${requiredContentType}'`);
                return;
            }
            const buffer = await res.buffer();
            fs.writeFile(imagePath, buffer, () => console.log(`Saved ${imagePath}`));
        }
        if (url == "" || url == undefined) {
            core.setFailed("URL does not exist");
            return;
        }
        if (imagePath == "" || imagePath == undefined) {
            core.setFailed("imagePath does not exist");
            return;
        }
        await ensureDirectoryExistence(imagePath);
        await downloadImage(url, imagePath);
    }
    catch (error) {
        core.setFailed(error.message);
    }
};
main();
//# sourceMappingURL=index.js.map