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
    <div class="pool">
        <h2>
            {{ i18n.templates.pool.title }}
            <small>
                <i v-tippy
                   :title="i18n.templates.pool.accrued"
                   class="far fa-question-circle help"
                ></i>
            </small>
        </h2>

        <div class="bars">
            <div class="bar-stack">
                <div v-for="(data, index) in bandwidthAllowanceData"
                     :key="index"
                     :class="`bar is-primary ${focusedDropletClass(data[0])}`"
                     :style="{ width: data[1] }"
                     @mouseenter="focusedDropletEnter(data[0])"
                     @mouseleave="focusedDropletLeave(data[0])"
                ></div>
            </div>
            <div class="bar-stack">
                <div v-for="(data, index) in bandwidthConsumptionData"
                     :key="index"
                     :class="`bar is-dark ${focusedDropletClass(data[0])}`"
                     :style="{ width: data[1] }"
                     @mouseenter="focusedDropletEnter(data[0])"
                     @mouseleave="focusedDropletLeave(data[0])"
                ></div>
            </div>
        </div>

        <div class="stats columns">
            <div class="data column">
                <p class="allowance">
                    <span>{{ i18n.templates.pool.allowance }}</span>
                    <b>{{ bandwidthAllowance.toLocaleString() }} {{ i18n.templates.pool.allowanceUnit }}</b>
                </p>
                <p class="consumption">
                    <span>{{ i18n.templates.pool.consumption }}</span>
                    <b>{{ bandwidthConsumption.toLocaleString() }} {{ i18n.common.consumptionUnit }}</b>
                </p>
                <p>
                    <span>{{ i18n.templates.pool.overage }}</span>
                    <b>
                        ${{ (bandwidthOverage * 0.01).toLocaleString() }}
                    </b>
                    <small class="has-text-muted">
                        ({{ bandwidthOverage.toLocaleString() }} {{ i18n.common.consumptionUnit }}
                        @ $0.01 / {{ i18n.common.consumptionUnit }})
                    </small>
                </p>
            </div>
            <div class="info column">
                <p v-if="bandwidthOverage">
                    {{ i18n.templates.pool.overageWarning }}
                </p>
                <p v-else class="has-text-muted">
                    {{ i18n.templates.pool.overageOkay }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    const i18n = require('../i18n');

    module.exports = {
        name: 'Pool',
        props: {
            bandwidthAllowance: Number,
            bandwidthAllowanceData: Array,
            bandwidthConsumption: Number,
            bandwidthConsumptionData: Array,
            bandwidthOverage: Number,
            focusedDropletClass: Function,
            focusedDropletEnter: Function,
            focusedDropletLeave: Function,
        },
        data() {
            return {
                i18n,
            };
        },
    };
</script>
