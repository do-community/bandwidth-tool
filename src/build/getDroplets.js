/*
Copyright 2021 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const fs = require('fs');
const path = require('path');
const get = require('./get');

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

    // Stub in the new AMD/Intel basic variants
    // TODO: Remove this for public release
    const regularBasic = results.filter(x => x.slug.startsWith('s-'));
    for (const droplet of regularBasic) {
        results.push(
            {
                ...droplet,
                slug: `${droplet.slug}-intel`,
                price_hourly: droplet.price_hourly * 1.2,
                price_monthly: Math.floor(droplet.price_monthly * 1.2),
            },
            {
                ...droplet,
                slug: `${droplet.slug}-amd`,
                price_hourly: droplet.price_hourly * 1.2,
                price_monthly: Math.floor(droplet.price_monthly * 1.2),
            },
        );
    }

    await save(results);
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});
