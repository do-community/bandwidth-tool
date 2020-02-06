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
            <div class="panel-list panel-list-vertical">
                <ActiveDroplet
                    v-for="(droplet, id) in activeDroplets"
                    :droplet="droplet"
                    :key="id"
                    @remove="removed(id)"
                ></ActiveDroplet>
            </div>
            <Picker :droplets="droplets" @picked="picked"></Picker>
        </div>

        <Footer text=""></Footer>
    </div>
</template>

<script>
    const { dropletType, dropletSubType } = require('../utils/dropletType');
    const dropletData = require('../../build/droplets.json');
    const droplets = {};
    for (const droplet of dropletData) {
        const type = dropletType(droplet.slug);
        if (!type) continue;
        if (!(type in droplets)) droplets[type] = [];
        droplet.type = type;
        droplet.subType = dropletSubType(droplet.slug);
        droplets[type].push(droplet);
    }

    const ActiveDroplet = require('./active_droplet.vue');
    const Picker = require('./picker.vue');

    module.exports = {
        name: 'App',
        components: {
            ActiveDroplet,
            Picker,
        },
        data() {
            return {
                droplets,
                activeDroplets: {},
            };
        },
        methods: {
            removed(id) {
                this.$delete(this.$data.activeDroplets, id);
            },
            picked(slug) {
                const droplet = dropletData.filter(d => d.slug === slug)[0];
                const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                const id = keys.length ? Math.max(...keys) + 1 : 0;
                this.$set(this.$data.activeDroplets, id, droplet);
            },
        },
    }
</script>
