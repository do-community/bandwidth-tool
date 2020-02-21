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
    <div class="picker">
        <div class="tabs">
            <ul>
                <li v-for="key in keys" :class="category === key ? 'is-active' : ''">
                    <a @click="setCategory(key)">{{ key }}</a>
                </li>
            </ul>
        </div>

        <PrettyCheck class="p-switch p-fill" :checked="false" @change="toggleType">
            {{ i18n.templates.picker.kubernetes }}
        </PrettyCheck>

        <div class="panel-list">
            <PickerDroplet
                v-for="droplet in display"
                :droplet="droplet"
                :type="type"
                @click.native="picked(droplet.slug)"
            ></PickerDroplet>
        </div>
    </div>
</template>

<script>
    const PickerDroplet = require('./droplets/picker_droplet');
    const PrettyCheck = require('pretty-checkbox-vue/check');
    const i18n = require('../i18n');
    const { dropletTypes } = require('../utils/dropletType');

    const getDroplets = (droplets, category) => {
        return droplets[category].sort((a, b) => a.price - b.price);
    };

    module.exports = {
        name: 'Picker',
        components: {
            PickerDroplet,
            PrettyCheck,
        },
        props: {
            droplets: Object,
        },
        data() {
            return {
                i18n,
                category: 'Standard',
                type: 'droplet',
                keys: dropletTypes,
                display: getDroplets(this.$props.droplets, 'Standard'),
            };
        },
        methods: {
            setCategory(key) {
                this.$data.category = key;
                this.$data.display = getDroplets(this.$props.droplets, key);
            },
            toggleType() {
                if (this.$data.type === 'droplet') return this.$data.type = 'kubernetes';
                this.$data.type = 'droplet';
            },
            picked(slug) {
                this.$emit('picked', slug, this.$data.type);
            },
        },
    };
</script>
