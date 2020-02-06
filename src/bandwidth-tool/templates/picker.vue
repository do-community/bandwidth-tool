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
        <div class="tabs picker">
            <ul>
                <li v-for="key in keys" :class="type === key ? 'is-active' : ''">
                    <a @click="setType(key)">{{ key }}</a>
                </li>
            </ul>
        </div>
        <div class="panel-list">
            <Droplet v-for="droplet in display" :droplet="droplet" @click.native="picked(droplet.slug)"></Droplet>
        </div>
    </div>
</template>

<script>
    const Droplet = require('./droplet.vue');
    const { dropletTypes } = require('../utils/dropletType');

    const getDroplets = (droplets, type) => {
        return droplets[type].sort((a, b) => a.price - b.price);
    };

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
                type: 'Standard',
                keys: dropletTypes,
                display: getDroplets(this.$props.droplets, 'Standard')
            };
        },
        methods: {
            setType(key) {
                this.$data.type = key;
                this.$data.display = getDroplets(this.$props.droplets, key);
            },
            picked(slug) {
                this.$emit('picked', slug);
            },
        }
    }
</script>
