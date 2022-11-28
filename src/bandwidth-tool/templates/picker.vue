<!--
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
-->

<template>
    <div class="picker">
        <div class="tabs">
            <ul>
                <li v-for="(typeVal, typeKey) in dropletTypes" :class="typeKey === dropletType ? 'is-active' : ''">
                    <a @click="setDropletType(typeKey)">{{ typeVal }}</a>
                </li>
            </ul>
        </div>

        <!--<div class="switch">
            <span>{{ i18n.templates.picker.droplets }}</span>
            <PrettyCheck class="p-switch p-fill" :checked="false" @change="toggleType"></PrettyCheck>
            <span>{{ i18n.templates.picker.kubernetes }}</span>
        </div>-->

        <div v-if="dropletVariants.length" class="radio">
            <PrettyRadio
                v-for="variant in dropletVariants"
                :key="variant"
                :checked="variant === dropletVariant"
                class="p-default p-round"
                name="variant"
                @change="setDropletVariant(variant)"
            >
                {{ variant }}
            </PrettyRadio>
        </div>

        <div class="panel-list">
            <PickerDroplet
                v-for="droplet in display"
                :key="droplet.slug"
                :droplet="droplet"
                :type="type"
                @click.native="picked(droplet.slug)"
            ></PickerDroplet>
        </div>
    </div>
</template>

<script>
    import i18n from '../i18n';
    import dropletTypes from '../utils/dropletTypes';
    import kubernetesData from '../../build/kubernetes';

    // import PrettyCheck from 'do-vue/src/templates/pretty-checkbox-vue/pretty_check';
    import PrettyRadio from 'do-vue/src/templates/pretty-checkbox-vue/pretty_radio';
    import PickerDroplet from './droplets/picker_droplet';

    const kubernetes = kubernetesData.map(x => x.slug);

    export default {
        name: 'Picker',
        components: {
            PickerDroplet,
            // PrettyCheck,
            PrettyRadio,
        },
        props: {
            droplets: Object,
        },
        data() {
            return {
                i18n,
                dropletType: null,
                dropletTypes,
                dropletVariant: null,
                dropletVariants: [],
                type: 'droplet',
                display: [],
            };
        },
        created() {
            this.setDropletType(Object.keys(dropletTypes)[0]);
        },
        methods: {
            getDroplets() {
                const droplets = [ ...this.$props.droplets[this.$data.dropletType] ]
                    .sort((a, b) => a.price.monthly - b.price.monthly);
                return this.$data.type === 'kubernetes'
                    ? droplets.filter(d => kubernetes.includes(d.slug))
                    : droplets;
            },
            setDropletType(type) {
                this.$data.dropletType = type;

                // Get droplets (kubernetes uses a limited subset)
                const droplets = this.getDroplets();

                // Get the variants
                const variants = [ ...new Set(droplets.map(d => d.variant)) ].filter(d => !!d);
                variants.sort((a, b) => {
                    const aMatch = a.match(/^(\d+(?:\.\d+)?)x SSD$/);
                    const bMatch = b.match(/^(\d+(?:\.\d+)?)x SSD$/);

                    if (aMatch && bMatch) return parseFloat(aMatch[1]) - parseFloat(bMatch[1]);
                    if (aMatch) return -1;
                    if (bMatch) return 1;

                    return variants.indexOf(a) - variants.indexOf(b);
                });

                // Set the default variant
                this.$data.dropletVariant = variants.length ? variants[0] : null;

                // Set the variants for picking (note: in k8s world, variants aren't available and 1x is always used)
                this.$data.dropletVariants = this.$data.type === 'kubernetes' ? [] : variants;;

                // Set the droplets to show, filtered by variant
                this.$data.display = droplets.filter(d => d.variant === this.$data.dropletVariant);
            },
            setDropletVariant(variant) {
                this.$data.dropletVariant = variant;
                this.$data.display = this.getDroplets().filter(d => d.variant === this.$data.dropletVariant);
            },
            toggleType() {
                this.$data.type = this.$data.type === 'droplet' ? 'kubernetes' : 'droplet';

                // Re-run category setting to deal with kubernetes not using all droplets
                this.setDropletType(this.$data.dropletType);
            },
            picked(slug) {
                this.$emit('picked', slug, this.$data.type);
            },
        },
    };
</script>
