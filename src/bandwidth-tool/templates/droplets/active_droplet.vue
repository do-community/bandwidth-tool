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
    <div class="panel is-droplet">
        <component :is="iconType"></component>

        <div class="info">
            <div class="primary-info">
                <p>
                    <em>
                        <sup>$</sup>{{ droplet.price_monthly }}
                        <sub> / {{ i18n.templates.droplets.droplet.month }}</sub>
                        <sub v-if="type === 'kubernetes'"> / {{ i18n.templates.droplets.activeDroplet.node }}</sub>
                    </em>
                </p>
                <p>
                    <em>
                        {{ (droplet.transfer * 1000).toLocaleString() }}
                        {{ i18n.templates.droplets.droplet.transferUnitSmall }}
                        <sub> {{ i18n.templates.droplets.droplet.transfer }}</sub>
                        <sub v-if="type === 'kubernetes'"> / {{ i18n.templates.droplets.activeDroplet.node }}</sub>
                    </em>
                </p>
            </div>
            <div class="secondary-info">
                <p>
                    {{ droplet.vcpus.toLocaleString() }}
                    {{ i18n.templates.droplets.droplet[droplet.vcpus === 1 ? 'cpuSingular' : 'cpuPlural'] }}
                </p>
                <p>{{ (droplet.memory / 1024).toLocaleString() }} {{ i18n.templates.droplets.droplet.memoryUnit }}</p>
                <p>{{ droplet.disk.toLocaleString() }} {{ i18n.templates.droplets.droplet.diskSuffix }}</p>
                <p v-if="droplet.subType">
                    {{ droplet.subType }}
                </p>
                <p><code>{{ droplet.slug }}</code></p>
            </div>
        </div>
        <div class="right">
            <div v-if="type === 'kubernetes'" class="input-container">
                <span class="label">{{ i18n.templates.droplets.activeDroplet.nodesLabel }}</span>
                <div class="control">
                    <div class="control">
                        <input v-model.lazy.number="nodes" type="number" min="1" step="1" />
                        <span class="suffix">{{ i18n.templates.droplets.activeDroplet.nodesUnit }}</span>
                    </div>
                    <i v-tippy
                       :title="i18n.templates.droplets.activeDroplet.nodesTooltip"
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">&nbsp;</span>
            </div>

            <div class="input-container">
                <span v-if="type === 'kubernetes'" class="label">
                    {{ i18n.templates.droplets.activeDroplet.poolHoursLabel }}
                </span>
                <span v-else class="label">
                    {{ i18n.templates.droplets.activeDroplet.hoursLabel }}
                </span>
                <div class="control">
                    <div class="control">
                        <input v-model.lazy.number="hours" type="number" min="0" max="744" step="1" />
                        <span class="suffix">{{ i18n.templates.droplets.activeDroplet.hoursUnit }}</span>
                    </div>
                    <i v-tippy
                       :title="i18n.templates.droplets.activeDroplet[type === 'kubernetes' ? 'poolHoursTooltip' : 'hoursTooltip']"
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">{{ i18n.templates.droplets.activeDroplet.monthly }}</span>
            </div>

            <div class="input-container">
                <span class="label">{{ i18n.templates.droplets.activeDroplet.consumptionLabel }}</span>
                <div class="control">
                    <div class="control">
                        <input v-model.lazy.number="consumption" type="number" min="0" step="100" />
                        <span class="suffix">{{ i18n.templates.droplets.activeDroplet.consumptionUnit }}</span>
                    </div>
                    <i v-tippy
                       :title="i18n.templates.droplets.activeDroplet.consumptionTooltip"
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">{{ i18n.templates.droplets.activeDroplet.monthly }}</span>
            </div>

            <div class="tertiary-info">
                <p><em><sup>$</sup>{{ dropletCost().toLocaleString() }}</em></p>
                <p>
                    <sub v-if="type === 'kubernetes'">{{ i18n.templates.droplets.activeDroplet.poolMonthlyCost }}</sub>
                    <sub v-else>{{ i18n.templates.droplets.activeDroplet.monthlyCost }}</sub>
                </p>
            </div>

            <a v-tippy
               class="button is-tiny"
               :title="i18n.templates.droplets.activeDroplet[type === 'kubernetes' ? 'poolRemove' : 'remove']"
               @click="remove"
            >
                <i class="fas fa-times"></i>
            </a>
        </div>
    </div>
</template>

<script>
    const i18n = require('../../i18n');
    const Vue = require('vue').default;
    const VueTippy = require('vue-tippy').default;
    Vue.use(VueTippy);

    const CPUDropletIcon = require('../icons/cpu_droplet_icon');
    const DropletIcon = require('../icons/droplet_icon');
    const GeneralDropletIcon = require('../icons/general_droplet_icon');
    const KubernetesIcon = require('../icons/kubernetes_icon');
    const MemoryDropletIcon = require('../icons/memory_droplet_icon');
    const StandardDropletIcon = require('../icons/standard_droplet_icon');

    module.exports = {
        name: 'ActiveDroplet',
        props: {
            droplet: Object,
            type: String,
        },
        components: {
            CPUDropletIcon,
            DropletIcon,
            GeneralDropletIcon,
            KubernetesIcon,
            MemoryDropletIcon,
            StandardDropletIcon,
        },
        data() {
            return {
                i18n,
                hours: 744,
                consumption: 0,
                nodes: 1,
            };
        },
        watch: {
            hours() {
                this.$emit('update');
            },
            consumption() {
                this.$emit('update');
            },
            nodes() {
                this.$emit('update');
            },
        },
        methods: {
            remove() {
                this.$emit('remove');
            },
            maxHours() {
                if (this.$props.type === 'kubernetes') return 744;
                return 672;
            },
            cappedHours() {
                return Math.min(this.maxHours(), Math.max(0, this.$data.hours));
            },
            nodeMultiplier() {
                if (this.$props.type === 'kubernetes') return Math.max(this.$data.nodes, 1);
                return 1;
            },
            bandwidthAllowance() {
                return this.$props.droplet.transfer * 1000 * (this.cappedHours() / 672) * this.nodeMultiplier();
            },
            dropletCost() {
                return this.$props.droplet.price_monthly * (this.cappedHours() / this.maxHours()) * this.nodeMultiplier();
            },
        },
        computed: {
            iconType() {
                if (this.$props.type === 'kubernetes') return 'KubernetesIcon';
                switch (this.$props.droplet.type) {
                case 'Standard':
                    return 'StandardDropletIcon';

                case 'General Purpose':
                    return 'GeneralDropletIcon';

                case 'CPU-Optimized':
                    return 'CPUDropletIcon';

                case 'Memory-Optimized':
                    return 'MemoryDropletIcon';

                default:
                    return 'DropletIcon';
                }
            },
        },
    };
</script>
