<!--
Copyright 2024 DigitalOcean

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
                <li v-for="(typeVal, typeKey) in availableTypes" :class="typeKey === selectedType ? 'is-active' : ''">
                    <a @click="setDropletType(typeKey)">{{ typeVal }}</a>
                </li>
            </ul>
        </div>

        <div v-if="kubernetes" class="variants">
            <div class="switch">
                <span>{{ i18n.templates.picker.droplets }}</span>
                <PrettyCheck class="p-switch p-fill" :checked="type === 'kubernetes'" @change="toggleType"></PrettyCheck>
                <span>{{ i18n.templates.picker.kubernetes }}</span>
            </div>
        </div>

        <div class="variants">
            <div v-for="(selectedVariant, idx) in selectedVariants" class="radio">
                <PrettyRadio
                    v-for="availableVariant in getAvailableVariants(availableVariants, selectedVariants.slice(0, idx))"
                    :key="selectedVariants.slice(0, idx).concat(availableVariant).join('-')"
                    :checked="availableVariant === selectedVariant"
                    class="p-default p-round"
                    :name="`variant-${selectedVariants.slice(0, idx).join('-')}`"
                    @change="setDropletVariant(availableVariant, idx)"
                >
                    {{ availableVariant }}
                </PrettyRadio>
            </div>
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
    import compareArrays from '../utils/compareArrays.js';
    import dropletTypes from '../utils/dropletTypes';
    import kubernetesData from '../../build/kubernetes';

    import PrettyCheck from 'do-vue/src/templates/pretty-checkbox-vue/pretty_check';
    import PrettyRadio from 'do-vue/src/templates/pretty-checkbox-vue/pretty_radio';
    import { camelToTitleCase } from '../utils/titleCase.js';
    import PickerDroplet from './droplets/picker_droplet';

    const kubernetes = kubernetesData.map(x => x.slug);

    /**
     * Convert a Droplet variant array into a nested object
     *
     * @param {{ variant: string[] | undefined }} droplet Droplet object
     * @param {{ [key: string]: any }} [existing={}] Existing variants object
     * @returns {{ [key: string]: any }} Variants object
      */
    const getVariants = (droplet, existing = {}) => {
        if (!droplet.variant) return existing;
        const variants = { ...existing };
        droplet.variant.reduce((parent, variant) => {
            parent[variant] = { ...(parent[variant] || {}) };
            return parent[variant];
        }, variants);
        return variants;
    };

    /**
     * Get the available variants for a given variant array
     * @param {{ [key: string]: any }} all All variants
     * @param {string[]} selected Selected variants
     * @returns {string[]} Available variants
      */
    const getAvailableVariants = (all, selected) => {
        if (!selected.length) return Object.keys(all);
        return Object.keys(selected.reduce((acc, variant) => {
            if (!acc[variant]) throw new Error(`Invalid variant: ${variant}`);
            return acc[variant];
        }, all));
    };

    /**
     * Sort an array of variant names
     *
     * @param {string[]} variants Variants
     * @returns {string[]} Sorted variants
      */
    const sortVariants = variants => [ ...variants ].sort((a, b) => {
        const aMatch = a.match(/^(\d+(?:\.\d+)?)x SSD$/);
        const bMatch = b.match(/^(\d+(?:\.\d+)?)x SSD$/);

        if (aMatch && bMatch) return parseFloat(aMatch[1]) - parseFloat(bMatch[1]);
        if (aMatch) return -1;
        if (bMatch) return 1;

        return variants.indexOf(a) - variants.indexOf(b);
    });

    /**
     * Get a valid variant chain for a given selected chain
     *
     * @param {{ [key: string]: any }} all All variants
     * @param {string[]} selected Selected variant chain
     * @returns {string[]} Valid variant chain
      */
    const getValidVariant = (all, selected) => {
        const result = [];
        const prev = [ ...selected ];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const available = sortVariants(getAvailableVariants(all, result));
            if (!available.length) return result;

            // If there is a previous variant, and it is available, use it
            if (prev.length) {
                const next = prev.shift();
                if (available.includes(next)) {
                    result.push(next);
                    continue;
                }
            }

            // Otherwise, use the first available variant
            result.push(available[0]);
        }
    };

    export default {
        name: 'Picker',
        components: {
            PickerDroplet,
            PrettyCheck,
            PrettyRadio,
        },
        props: {
            droplets: Object,
            kubernetes: {
                type: Boolean,
                default: false,
            },
        },
        data() {
            return {
                i18n,
                selectedType: null,
                availableTypes: dropletTypes,
                selectedVariants: [],
                availableVariants: {},
                getAvailableVariants,
                type: 'droplet',
                display: [],
            };
        },
        created() {
            this.setDropletType(Object.keys(dropletTypes)[0]);
        },
        methods: {
            getDroplets() {
                const isK8s = this.$data.type === 'kubernetes';

                // Get the Droplets for this type
                const dropletsType = [ ...this.$props.droplets[this.$data.selectedType] ]
                    .sort((a, b) => a.price.monthly - b.price.monthly);

                // Filter out Droplets if we're in kubernetes mode
                const dropletsFiltered = isK8s
                    ? dropletsType.filter(d => kubernetes.includes(d.slug))
                    : dropletsType;

                // Inject the variants for each Droplet
                return dropletsFiltered.map(droplet => ({
                    ...droplet,
                    variant: (droplet.variant || []).map(camelToTitleCase)
                        .concat(isK8s || !droplet.disk.variant ? [] : `${droplet.disk.variant}x SSD`),
                }));
            },
            updateDroplets() {
                // Get droplets (kubernetes uses a limited subset)
                const droplets = this.getDroplets();

                // Get the variants (note: in k8s world, ssd variants aren't available and 1x is always used)
                this.$data.availableVariants = droplets.reduce((acc, droplet) => getVariants(droplet, acc), {});

                // Ensure the selected variant chain is still valid
                this.$data.selectedVariants = getValidVariant(this.$data.availableVariants, this.$data.selectedVariants);

                // Set the droplets to show, filtered by variant
                this.$data.display = droplets.filter(d => compareArrays(d.variant, this.$data.selectedVariants));
            },
            setDropletType(type) {
                this.$data.selectedType = type;
                this.updateDroplets();
            },
            setDropletVariant(variant, idx) {
                this.$data.selectedVariants = [
                    ...this.$data.selectedVariants.slice(0, idx),
                    variant,
                    ...this.$data.selectedVariants.slice(idx + 1),
                ];
                this.updateDroplets();
            },
            toggleType(val) {
                if (typeof val !== 'boolean') return;
                this.$data.type = val ? 'kubernetes' : 'droplet';
                this.updateDroplets();
            },
            picked(slug) {
                this.$emit('picked', slug, this.$data.type);
            },
        },
    };
</script>
