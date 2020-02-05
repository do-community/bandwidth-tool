<!--
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
-->

<template>
    <div class="all do-bulma">
        <Header title="Bandwidth Tool">
            <template v-slot:description>
                A small tool to help explain DigitalOcean Droplet/Account bandwidth allowances.
            </template>
            <template v-slot:header>
            </template>
            <template v-slot:buttons>
            </template>
        </Header>

        <div class="main container">
            <Picker :droplets="droplets"></Picker>
        </div>

        <Footer text=""></Footer>
    </div>
</template>

<script>
    const dropletType = require('../utils/dropletType');
    const dropletData = require('../../build/droplets.json');
    const droplets = {};
    for (const droplet of dropletData) {
        const type = dropletType(droplet.slug);
        if (!type) continue;
        if (!(type in droplets)) droplets[type] = [];
        droplet.type = type;
        droplets[type].push(droplet);
    }

    const Picker = require('./picker.vue');

    module.exports = {
        name: 'App',
        components: {
            Picker,
        },
        data() {
            return {
                droplets,
            }
        },
        methods: {
            dropletType,
        },
    }
</script>
