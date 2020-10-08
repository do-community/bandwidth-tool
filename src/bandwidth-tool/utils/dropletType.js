/*
Copyright 2020 DigitalOcean

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

const dropletType = slug => {
    const type = slug.split('-')[0];
    switch (type) {
        case 's':
            return 'Basic';

        case 'g':
        case 'gd':
            return 'General Purpose';

        case 'c':
            return 'CPU-Optimized';

        case 'm':
        case 'm3':
        case 'm6':
            return 'Memory-Optimized';

        default:
            return 'Legacy';
    }
};

const dropletTypes = ['Basic', 'General Purpose', 'CPU-Optimized', 'Memory-Optimized', 'Legacy'];

const dropletSubType = slug => {
    const type = slug.split('-')[0];
    switch (type) {
        case 'g':
            return '1x SSD';
        case 'gd':
            return '2x SSD';

        case 'm':
            return '1x SSD';
        case 'm3':
            return '3x SSD';
        case 'm6':
            return '6x SSD';

        default:
            return undefined;
    }
};

module.exports = { dropletType, dropletTypes, dropletSubType };
