/*
Copyright 2022 DigitalOcean

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

const fetch = import('node-fetch');

let token = process.env.DIGITALOCEAN_TOKEN;
if (fs.existsSync(path.join(__dirname, '..', '..', 'config.js'))) {
    const config = require('../../config');
    token = config.token;
}

module.exports = async url => {
    const res = await fetch.then(({ default: run }) => run(url, {
        headers: { Authorization: `Bearer ${token}` },
    }));
    return await res.json();
};
