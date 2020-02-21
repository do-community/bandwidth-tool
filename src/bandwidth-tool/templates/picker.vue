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

        <div class="switch">
            <span>{{ i18n.templates.picker.droplets }}</span>
            <PrettyCheck class="p-switch p-fill" :checked="false" @change="toggleType"></PrettyCheck>
            <span>{{ i18n.templates.picker.kubernetes }}</span>
        </div>

        <div v-if="subCategories.length" class="radio">
            <PrettyRadio
                v-for="subCat in subCategories"
                :checked="subCat === subCategory"
                class="p-default p-round"
                name="subCategory"
                @change="setSubCategory(subCat)"
            >
                {{ subCat }}
            </PrettyRadio>
        </div>

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
    const PrettyRadio = require('pretty-checkbox-vue/radio');
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
            PrettyRadio,
        },
        props: {
            droplets: Object,
        },
        data() {
            return {
                i18n,
                category: 'Standard',
                subCategory: undefined,
                subCategories: [],
                type: 'droplet',
                keys: dropletTypes,
                display: getDroplets(this.$props.droplets, 'Standard'),
            };
        },
        methods: {
            setCategory(key) {
                this.$data.category = key;

                // Get droplets and all the subcats
                const droplets = getDroplets(this.$props.droplets, key);
                const subCats = [...new Set(droplets.map(d => d.subType))].filter(d => !!d).sort();

                // Set the default subcat
                this.$data.subCategory = subCats.length ? subCats[0] : undefined;

                // Set the subcats for picking (note: in k8s world, variants are't available and 1x is always used)
                this.$data.subCategories = this.$data.type === 'kubernetes' ? [] : subCats;

                // Set the droplets to show, filtered by subcat
                this.$data.display = droplets.filter(d => d.subType === this.$data.subCategory);
            },
            setSubCategory(key) {
                this.$data.subCategory = key;
                this.$data.display = getDroplets(this.$props.droplets, this.$data.category)
                    .filter(d => d.subType === this.$data.subCategory);
            },
            toggleType() {
                if (this.$data.type === 'droplet') this.$data.type = 'kubernetes';
                else this.$data.type = 'droplet';

                // Re-run category setting to deal with kubernetes not using subcats
                this.setCategory(this.$data.category);
            },
            picked(slug) {
                this.$emit('picked', slug, this.$data.type);
            },
        },
    };
</script>
