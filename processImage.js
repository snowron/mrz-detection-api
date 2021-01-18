
const fs = require('fs-extra');
const { Image } = require('image-js');
const path = require('path');
const { getMrz } = require('mrz-detection')

async function exec(file) {
    if (file) {
        const pathname = path.resolve(file);
        const result = {};
        try {
            await getMrz(await Image.load(pathname), {
                debug: true,
                out: result
            });
        } catch (e) {
            console.error(e);
        }
        await saveImages(
            pathname,
            result,
            path.join(path.dirname('./'), 'out')
        );
    }
}

async function saveImages(imagePath, images, out) {
    const filename = path.basename(imagePath);
    console.log('filename', filename)
    const ext = path.extname(filename);
    console.log('ext', ext)
    for (const prefix in images) {
        const kind = path.join(out, prefix);
        await fs.ensureDir(kind);
        await images[prefix].save(path.join(kind, filename));
    }
}

module.exports = exec