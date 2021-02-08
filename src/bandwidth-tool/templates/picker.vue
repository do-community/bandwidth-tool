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
                <li v-for="cat in categories" :class="cat === category ? 'is-active' : ''">
                    <a @click="setCategory(cat)">{{ cat }}</a>
                </li>
            </ul>
        </div>

        <!--<div class="switch">
            <span>{{ i18n.templates.picker.droplets }}</span>
            <PrettyCheck class="p-switch p-fill" :checked="false" @change="toggleType"></PrettyCheck>
            <span>{{ i18n.templates.picker.kubernetes }}</span>
        </div>-->

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
    import PickerDroplet from './droplets/picker_droplet';
    //import PrettyCheck from 'pretty-checkbox-vue/check';
    import PrettyRadio from 'pretty-checkbox-vue/radio';
    import i18n from '../i18n';
    import { dropletTypes } from '../utils/dropletType';
    import kubernetesData from '../../build/kubernetes';
    const kubernetes = kubernetesData.map(x => x.slug);

    const getDroplets = (droplets, category) => {
        return droplets[category].sort((a, b) => a.price - b.price);
    };

    export default {
        name: 'Picker',
        components: {
            PickerDroplet,
            //PrettyCheck,
            PrettyRadio,
        },
        props: {
            droplets: Object,
        },
        data() {
            return {
                i18n,
                category: 'Basic',
                categories: dropletTypes.filter(c => Object.keys(this.$props.droplets).includes(c)),
                subCategory: undefined,
                subCategories: [],
                type: 'droplet',
                display: getDroplets(this.$props.droplets, 'Basic'),
            };
        },
        methods: {
            getDroplets() {
                let droplets = getDroplets(this.$props.droplets, this.$data.category);
                if (this.$data.type === 'kubernetes') droplets = droplets.filter(d => kubernetes.includes(d.slug));
                return droplets;
            },
            setCategory(cat) {
                this.$data.category = cat;

                // Get droplets (kubernetes uses a limited subset)
                const droplets = this.getDroplets();

                // Get the subcats
                const subCats = [...new Set(droplets.map(d => d.subType))].filter(d => !!d)
                    .sort((a, b) => parseFloat(a.slice(0, a.indexOf('x'))) - parseFloat(b.slice(0, b.indexOf('x'))));

                // Set the default subcat
                this.$data.subCategory = subCats.length ? subCats[0] : undefined;

                // Set the subcats for picking (note: in k8s world, variants are't available and 1x is always used)
                this.$data.subCategories = this.$data.type === 'kubernetes' ? [] : subCats;

                // Set the droplets to show, filtered by subcat
                this.$data.display = droplets.filter(d => d.subType === this.$data.subCategory);
            },
            setSubCategory(subcat) {
                this.$data.subCategory = subcat;
                this.$data.display = this.getDroplets().filter(d => d.subType === this.$data.subCategory);
            },
            toggleType() {
                if (this.$data.type === 'droplet') this.$data.type = 'kubernetes';
                else this.$data.type = 'droplet';

                // Set the cats (use dropletTypes to preserve custom order)
                let droplets = Object.values(this.$props.droplets).flat();
                if (this.$data.type === 'kubernetes') droplets = droplets.filter(d => kubernetes.includes(d.slug));
                const dropletCats = [...new Set(droplets.map(d => d.type))].filter(d => !!d);
                const cats = dropletTypes.filter(c => dropletCats.includes(c));
                this.$data.categories = cats;
                this.$data.category = cats.includes(this.$data.category) ? this.$data.category : cats[0];

                // Re-run category setting to deal with kubernetes not using all droplets
                this.setCategory(this.$data.category);
            },
            picked(slug) {
                this.$emit('picked', slug, this.$data.type);
            },
        },
    };
</script>
