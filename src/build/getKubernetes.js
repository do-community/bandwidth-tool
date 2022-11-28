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

import { get, flatten, save } from './get.js';

const main = async () => {
    const data = await get('https://www.digitalocean.com/api/static-content/v1/products');
    const results = flatten(data.kubernetes);
    await save(results, 'kubernetes');
};

main().catch(err => {
    console.error(err);
    process.exit(1);
});
