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
        <div class="icon">
            <svg v-if="type === 'kubernetes'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" aria-hidden="true">
                <path fill="none" stroke="#0069FF" stroke-width="2"
                      d="M36.779 23.119c0 7.962-6.454 14.416-14.416 14.416-7.962 0-14.416-6.454-14.416-14.416 0-7.962 6.454-14.417 14.416-14.417 7.962 0 14.416 6.455 14.416 14.417zm-9.212.031c0 2.844-2.306 5.151-5.151 5.151-2.845 0-5.151-2.307-5.151-5.151 0-2.845 2.306-5.151 5.151-5.151 2.845 0 5.151 2.306 5.151 5.151zm-5.153-5.291V3.435v14.424zM6.999 10.598l11.22 9.136-11.22-9.136zm30.833 0l-11.219 9.136 11.219-9.136zm4.001 16.795l-14.11-3.095 14.11 3.095zM3 27.393l14.11-3.095L3 27.393zM31.2 41l-6.405-13.343L31.2 41zm-17.558 0l6.304-13.343L13.642 41z"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 45" aria-hidden="true">
                <g stroke="#0069FF" stroke-width="2" fill="none" fill-rule="evenodd">
                    <path
                        d="M22.6 41.2C14.2 41.2 7 34.3 7 25.8 7 12.9 22.6 4.2 22.6 4.2s15.6 9 15.6 21.7c0 8.4-7.1 15.3-15.6 15.3z"></path>
                    <path
                        d="M22.6 30.8c-2.9 0-5.2-2.3-5.2-5.2 0-4 5.2-7.8 5.2-7.8s5.2 3.7 5.2 7.8c0 2.9-2.3 5.2-5.2 5.2z"></path>
                </g>
            </svg>
        </div>
        <div class="info">
            <div class="primary-info">
                <p>
                    <em>
                        <sup>$</sup>
                        {{ droplet.price_monthly }}
                        <sub> / {{ i18n.templates.droplets.droplet.month }}</sub>
                        <sub v-if="type === 'kubernetes'"> / {{ i18n.templates.droplets.droplet.node }}</sub>
                    </em>
                </p>
                <p>
                    <em>
                        {{ (droplet.transfer * 1024).toLocaleString() }}
                        {{ i18n.templates.droplets.droplet.transferUnitSmall }}
                        <sub> {{ i18n.templates.droplets.droplet.transfer }}</sub>
                        <sub v-if="type === 'kubernetes'"> / {{ i18n.templates.droplets.droplet.node }}</sub>
                    </em>
                </p>
            </div>
            <div class="secondary-info">
                <p>{{ droplet.memory / 1024 }} {{ i18n.templates.droplets.droplet.memoryUnit }}</p>
                <p>
                    {{ droplet.vcpus }}
                    {{ i18n.templates.droplets.droplet[droplet.vcpus === 1 ? 'cpuSingular' : 'cpuPlural'] }}
                </p>
                <p>{{ droplet.disk }} {{ i18n.templates.droplets.droplet.diskSuffix }}</p>
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
                        <input ref="nodes" type="number" min="1" step="1" :value="nodes" @input="update" />
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
                        <input ref="hours" type="number" min="0" max="744" step="1" :value="hours" @input="update" />
                        <span class="suffix">{{ i18n.templates.droplets.activeDroplet.hoursUnit }}</span>
                    </div>
                    <i v-tippy
                       :title="i18n.templates.droplets.activeDroplet.hoursTooltip"
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">{{ i18n.templates.droplets.activeDroplet.monthly }}</span>
            </div>

            <div class="input-container">
                <span class="label">{{ i18n.templates.droplets.activeDroplet.consumptionLabel }}</span>
                <div class="control">
                    <div class="control">
                        <input ref="consumption" type="number" min="0" step="64" :value="consumption" @input="update" />
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
            <a v-tippy class="button is-tiny" :title="i18n.templates.droplets.activeDroplet.remove" @click="remove">
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
            type: String,
        },
        data() {
            return {
                i18n,
                hours: 744,
                consumption: 0,
                nodes: 1,
            };
        },
        methods: {
            remove() {
                this.$emit('remove');
            },
            update() {
                this.$data.hours = Number(this.$refs.hours.value);
                this.$data.consumption = Number(this.$refs.consumption.value);
                this.$data.nodes = Number(this.$refs.nodes.value);
                this.$emit('update');
            },
            cappedHours() {
                return Math.min(672, Math.max(0, this.$data.hours));
            },
            nodeMultiplier() {
                if (this.$props.type === 'kubernetes') return Math.max(this.$data.nodes, 1);
                return 1;
            },
            bandwidthAllowance() {
                return this.$props.droplet.transfer * 1024 * (this.cappedHours() / 672) * this.nodeMultiplier();
            },
            dropletCost() {
                if (this.cappedHours() >= 672) return this.$props.droplet.price_monthly * this.nodeMultiplier();
                return this.$props.droplet.price_hourly * this.cappedHours() * this.nodeMultiplier();
            },
        },
    };
</script>
