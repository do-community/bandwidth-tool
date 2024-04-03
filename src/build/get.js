/*
Copyright 2024 DigitalOcean

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

import fs from 'node:fs/promises';

export const get = async url => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
    return await res.json();
};

export const flatten = (data, type = null, variant = []) => {
    if (Array.isArray(data)) return data.map(item => ({ ...item, type, variant }));

    return Object.keys(data).reduce((acc, key) => {
        return acc.concat(type
            ? flatten(data[key], type, [ ...variant, key ])
            : flatten(data[key], key),
        );
    }, []);
};

export const save = async (data, name) => {
    await fs.writeFile(new URL(`${name}.json`, import.meta.url), JSON.stringify(data, null, 2));
};
