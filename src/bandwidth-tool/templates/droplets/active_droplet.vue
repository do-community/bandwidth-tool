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
                <p v-if="droplet.subType">{{ droplet.subType }}</p>
                <p><code>{{ droplet.slug }}</code></p>
            </div>
        </div>
        <div class="right">
            <div class="input-container">
                <div class="control">
                    <input type="number" min="0" max="672" step="1" ref="hours" :value="hours" @input="update" />
                    <span class="suffix">hours</span>
                </div>
                <span class="label">Hours the Droplet has been on your account</span>
            </div>
            <div class="input-container">
                <div class="control">
                    <input type="number" min="0" step="0.5" ref="consumption" :value="consumption" @input="update" />
                    <span class="suffix">TB</span>
                </div>
                <span class="label">Estimated bandwidth consumption in TB</span>
            </div>
            <a class="button is-danger is-small" @click="remove">Remove</a>
        </div>
    </div>
</template>

<script>
    module.exports = {
        name: 'ActiveDroplet',
        props: {
            droplet: Object,
        },
        data() {
            return {
                hours: 672,
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
            bandwidthAllowance() {
                return this.$props.droplet.transfer * (this.$data.hours / 672)
            }
        },
    }
</script>
