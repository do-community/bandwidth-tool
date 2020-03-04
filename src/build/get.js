const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

let token = process.env.DIGITALOCEAN_TOKEN;
if (fs.existsSync(path.join(__dirname, '..', '..', 'config.js'))) {
    const config = require('../../config');
    token = config.token;
}

module.exports = async url => {
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
};
