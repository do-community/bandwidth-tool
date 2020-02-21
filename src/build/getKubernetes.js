const fs = require('fs');
const path = require('path');
const get = require('./get');

const save = async data => {
    await fs.promises.writeFile(path.join(__dirname, 'kubernetes.json'), JSON.stringify(data));
};

const main = async () => {
    const data = await get('https://api.digitalocean.com/v2/kubernetes/options');
    await save(data.options.sizes);
};

main();
