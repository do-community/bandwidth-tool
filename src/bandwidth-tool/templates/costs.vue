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
    <table class="table costs">
        <tbody>
            <tr>
                <td>
                    {{ i18n.templates.costs.dropletBandwidthConsumption }}
                </td>
                <td>
                    <b>
                        {{ (bandwidthConsumption - additionalBandwidthConsumption).toLocaleString() }}
                        {{ i18n.common.consumptionUnit }}
                    </b>
                    <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                </td>
            </tr>

            <tr>
                <td>
                    {{ i18n.templates.costs.additionalBandwidthConsumption }}
                </td>
                <td>
                    <div class="input-container">
                        <div class="control">
                            <div class="control">
                                <input v-model.lazy.number="additionalBandwidthConsumption"
                                       type="number"
                                       min="0"
                                       step="100"
                                       @change="$emit('update')"
                                />
                                <span class="suffix">{{ i18n.common.consumptionUnit }}</span>
                            </div>
                        </div>
                        <span class="label">{{ i18n.common.perMonth }}</span>
                    </div>
                </td>
            </tr>

            <tr class="hr">
                <td>
                    {{ i18n.templates.costs.estimatedDroplets }}
                </td>
                <td>
                    <b>${{ dropletCost.toLocaleString() }}</b>
                    <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                </td>
            </tr>

            <tr>
                <td>
                    {{ i18n.templates.costs.estimatedOverage }}
                </td>
                <td>
                    <b>${{ (bandwidthOverage * 0.01).toLocaleString() }}</b>
                    <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                    <br />
                    <small class="has-text-muted">
                        ({{ bandwidthOverage.toLocaleString() }} {{ i18n.common.consumptionUnit }}
                        @ $0.01 / {{ i18n.common.consumptionUnit }})
                    </small>
                </td>
            </tr>

            <tr class="hr">
                <td>
                    {{ i18n.templates.costs.estimatedTotal }}
                </td>
                <td>
                    <b>${{ (dropletCost + bandwidthOverage * 0.01).toLocaleString() }}</b>
                    <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    const i18n = require('../i18n');

    module.exports = {
        name: 'Costs',
        props: {
            bandwidthConsumption: Number,
            dropletCost: Number,
            bandwidthOverage: Number,
        },
        data() {
            return {
                i18n,
                additionalBandwidthConsumption: 0,
            };
        },
    };
</script>
