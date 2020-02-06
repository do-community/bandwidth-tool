const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');

const get = async url => {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.DIGITALOCEAN_TOKEN}` }
    });
    return await res.json();
};

const save = async data => {
    await fs.writeFile(path.join(__dirname, 'droplets.json'), JSON.stringify(data));
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
