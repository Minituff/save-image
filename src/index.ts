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
    
    console.log(`url: ${url}`);
    console.log(`imagePath: ${imagePath}`);
    console.log(`deleteOnFail: ${deleteOnFail}`);

    async function ensureDirectoryExistence(filePath: string) {
      const dirname = path.dirname(filePath);
      const exists = await fs.existsSync(dirname)
      if (exists) return true
      
      fs.mkdir(dirname, { recursive: true }, () => console.log(`${filePath} created`));
      return true
    }

    async function downloadImage(url: string, imagePath: string) {
      let response
      
      try {
        response = await fetch(url);
      } catch (error) {
        console.log(`Image failed to load.`)
        core.setOutput("imageLoaded", false);
        
        if (deleteOnFail) {
          console.log(`deleteOnFail == true. Deleting ${imagePath}`)
          await fs.unlink(imagePath, () => console.log(`${imagePath} deleted`))
          return
        } else {
          core.setFailed(error)
          return
        }

      }
      core.setOutput("imageLoaded", true);
      const buffer = await response.buffer();
      fs.writeFile(imagePath, buffer, () => console.log(`Saved ${imagePath}`));
    }

    if (url == "" || url == undefined) {
      core.setFailed("URL does not exist")
      return
    }

    if (imagePath == "" || imagePath == undefined) {
      core.setFailed("imagePath does not exist")
      return
    }

    await ensureDirectoryExistence(imagePath)
    await downloadImage(url, imagePath)

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

main();