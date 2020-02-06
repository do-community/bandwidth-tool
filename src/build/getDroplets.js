const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

let token = process.env.DIGITALOCEAN_TOKEN;
if (fs.existsSync(path.join(__dirname, '..', '..', 'config.js'))) {
    const config = require('../../config');
    token = config.token;
}

const get = async url => {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
};

const save = async data => {
    await fs.promises.writeFile(path.join(__dirname, 'droplets.json'), JSON.stringify(data));
};

const main = async () => {
    const results = [];
    let nextPage = 'https://api.digitalocean.com/v2/sizes?page=1';
    while (nextPage) {
        const data = await get(nextPage);
        results.push(...data.sizes);
        nextPage = data.links.pages.next;
    }
    await save(results);
};

main();
