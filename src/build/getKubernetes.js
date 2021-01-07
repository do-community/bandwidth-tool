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
    await fs.promises.writeFile(path.join(__dirname, 'kubernetes.json'), JSON.stringify(data));
};

const main = async () => {
    const data = await get('https://api.digitalocean.com/v2/kubernetes/options');
    await save(data.options.sizes);
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});
