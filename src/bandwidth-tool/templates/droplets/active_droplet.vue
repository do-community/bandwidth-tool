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
                <p><em><sup>$</sup>{{ droplet.price_monthly }}<sub> / mo</sub></em></p>
                <p><em>{{ droplet.transfer }} TB<sub> transfer</sub></em></p>
            </div>
            <div class="secondary-info">
                <p>{{ droplet.memory / 1024 }} GB</p>
                <p>{{ droplet.vcpus }} CPU{{ droplet.vcpus === 1 ? '' : 's' }}</p>
                <p>{{ droplet.disk }} GB SSD disk</p>
                <p v-if="droplet.subType">
                    {{ droplet.subType }}
                </p>
                <p><code>{{ droplet.slug }}</code></p>
            </div>
        </div>
        <div class="right">
            <div class="input-container">
                <span class="label">Droplet will exist for</span>
                <div class="control">
                    <div class="control">
                        <input ref="hours" type="number" min="0" max="744" step="1" :value="hours" @input="update" />
                        <span class="suffix">hours</span>
                    </div>
                    <i v-tippy
                       title="Droplet pricing and billing is capped at 672 hours a month, or 28 days."
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">(monthly)</span>
            </div>
            <div class="input-container">
                <span class="label">Outbound data consumption</span>
                <div class="control">
                    <div class="control">
                        <input ref="consumption" type="number" min="0" step="0.5" :value="consumption" @input="update" />
                        <span class="suffix">TB</span>
                    </div>
                    <i v-tippy
                       title="Use this to visualize the consumption of your account bandwidth pool by each Droplet."
                       class="far fa-question-circle help"
                    ></i>
                </div>
                <span class="label">(monthly)</span>
            </div>
            <div class="tertiary-info">
                <p><em><sup>$</sup>{{ dropletCost().toLocaleString() }}</em></p>
                <p><sub>Monthly Droplet Cost</sub></p>
            </div>
            <a v-tippy class="button is-tiny" title="Remove this Droplet" @click="remove">
                <i class="fas fa-times"></i>
            </a>
        </div>
    </div>
</template>

<script>
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
