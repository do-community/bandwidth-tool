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
        <div class="info">
            <div class="primary-info">
                <p><em><sup>$</sup>{{ droplet.price_monthly }}<sub> / {{ templateI18n.month }}</sub></em></p>
                <p>
                    <em>
                        {{ droplet.transfer }} {{ templateI18n.transferUnit }}<sub> {{ templateI18n.transfer }}</sub>
                    </em>
                </p>
            </div>
            <div class="secondary-info">
                <p>{{ droplet.memory / 1024 }} {{ templateI18n.memoryUnit }}</p>
                <p>{{ droplet.vcpus }} {{ templateI18n[droplet.vcpus === 1 ? 'cpuSingular' : 'cpuPlural'] }}</p>
                <p>{{ droplet.disk }} {{ templateI18n.diskSuffix }}</p>
                <p v-if="droplet.subType">
                    {{ droplet.subType }}
                </p>
                <p><code>{{ droplet.slug }}</code></p>
            </div>
        </div>
        <div class="right">
            <div class="input-container">
                <span class="label">{{ templateI18n.hoursLabel }}</span>
                <div class="control">
                    <div class="control">
                        <input ref="hours" type="number" min="0" max="744" step="1" :value="hours" @input="update" />
                        <span class="suffix">{{ templateI18n.hoursUnit }}</span>
                    </div>
                    <i v-tippy :title="templateI18n.hoursTooltip" class="far fa-question-circle help"></i>
                </div>
                <span class="label">{{ templateI18n.monthly }}</span>
            </div>
            <div class="input-container">
                <span class="label">{{ templateI18n.consumptionLabel }}</span>
                <div class="control">
                    <div class="control">
                        <input ref="consumption" type="number" min="0" step="0.5" :value="consumption" @input="update" />
                        <span class="suffix">{{ templateI18n.consumptionUnit }}</span>
                    </div>
                    <i v-tippy :title="templateI18n.consumptionTooltip" class="far fa-question-circle help"></i>
                </div>
                <span class="label">{{ templateI18n.monthly }}</span>
            </div>
            <div class="tertiary-info">
                <p><em><sup>$</sup>{{ dropletCost().toLocaleString() }}</em></p>
                <p><sub>{{ templateI18n.monthlyCost }}</sub></p>
            </div>
            <a v-tippy class="button is-tiny" :title="templateI18n.remove" @click="remove">
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

    module.exports = {
        name: 'ActiveDroplet',
        props: {
            droplet: Object,
        },
        data() {
            return {
                i18n,
                templateI18n: i18n.templates.droplets.activeDroplet,
                hours: 744,
                consumption: 0,
            };
        },
        methods: {
            remove() {
                this.$emit('remove');
            },
            update() {
                this.$data.hours = Number(this.$refs.hours.value);
                this.$data.consumption = Number(this.$refs.consumption.value);
                this.$emit('update');
            },
            cappedHours() {
                return Math.min(672, Math.max(0, this.$data.hours));
            },
            bandwidthAllowance() {
                return this.$props.droplet.transfer * (this.cappedHours() / 672);
            },
            dropletCost() {
                if (this.cappedHours() >= 672) return this.$props.droplet.price_monthly;
                return this.$props.droplet.price_hourly * this.cappedHours();
            },
        },
    };
</script>
