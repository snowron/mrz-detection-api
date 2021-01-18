const path = require('path');

const { Image } = require('image-js');

const { readMrz } = require('mrz-detection')

async function exec(file) {
    return new Promise(async (resolve, reject) => {
        if (file) {
            const pathname = path.resolve(file);

            await processFile(pathname).then(res => {
                resolve(res)
            }).catch(reject);
        } else {
            reject('No file')
        }
    })
}
async function processFile(imagePath) {
    return new Promise(async (resolve, reject) => {
        try {
            const parsedPath = path.parse(imagePath);
            const result = await readMrz(await Image.load(imagePath), {
                debug: true,
            });
            resolve(result);
        } catch (e) {
            console.log(e);
            reject('read error', e.message, e.stack);
        }
    })
}
module.exports = exec
