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
    <div>
        <div class="tabs">
            <ul>
                <li v-for="key in keys" :class="type === key ? 'is-active' : ''">
                    <a @click="type = key">{{ key }}</a>
                </li>
            </ul>
        </div>
        <div class="panel-list">
            <Droplet v-for="droplet in droplets[type].sort((a, b) => a.price - b.price)" :droplet="droplet"></Droplet>
        </div>
    </div>
</template>

<script>
    const Droplet = require('./droplet.vue');

    module.exports = {
        name: 'Picker',
        components: {
            Droplet,
        },
        props: {
            droplets: Object,
        },
        data() {
            return {
                type: 'Standard' in this.$props.droplets ? 'Standard' : Object.keys(this.$props.droplets)[0],
                keys: Object.keys(this.$props.droplets).sort(), // TODO: custom sort (Standard, gen, cpu, mem)
            };
        },
    }
</script>
