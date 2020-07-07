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
    <div class="all do-bulma">
        <div class="container inset">
            <div class="container">
                <div class="panel bandwidth">
                    <h1>{{ i18n.templates.app.title }}</h1>
                    <h3><small>{{ i18n.templates.app.description }}</small></h3>

                    <Pool
                        :bandwidth-allowance="bandwidthAllowance"
                        :bandwidth-allowance-data="bandwidthAllowanceData"
                        :bandwidth-consumption="bandwidthConsumption"
                        :bandwidth-consumption-data="bandwidthConsumptionData"
                        :bandwidth-overage="bandwidthOverage"
                        :focused-droplet-class="focusedDropletClass"
                        :focused-droplet-enter="focusedDropletEnter"
                        :focused-droplet-leave="focusedDropletLeave"
                    ></Pool>

                    <div class="droplets">
                        <h2>{{ i18n.templates.app.droplets }}</h2>
                        <div v-if="hasActiveDroplets">
                            <div class="panel-list panel-list-vertical">
                                <ActiveDroplet
                                    v-for="(droplet, id) in activeDroplets"
                                    :key="id"
                                    ref="activeDroplets"
                                    :droplet="droplet[0]"
                                    :type="droplet[1]"
                                    :class="focusedDropletClass(id)"
                                    @mouseenter.native="focusedDropletEnter(id)"
                                    @mouseleave.native="focusedDropletLeave(id)"
                                    @remove="removed(id)"
                                    @update="update"
                                ></ActiveDroplet>
                            </div>

                            <table class="table costs">
                                <tbody>
                                    <tr>
                                        <td>
                                            {{ i18n.templates.app.dropletBandWidthConsumption }}
                                        </td>
                                        <td>
                                            <b>{{ (bandwidthConsumption - additionalBandwidthConsumption).toLocaleString() }} {{ i18n.common.consumptionUnit }}</b>
                                            <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ i18n.templates.app.additionalBandWidthConsumption }}
                                        </td>
                                        <td>
                                            <div class="input-container">
                                                <div class="control">
                                                    <div class="control">
                                                        <input v-model.lazy.number="additionalBandwidthConsumption"
                                                               type="number"
                                                               min="0"
                                                               step="100"
                                                               @change="update"
                                                        />
                                                        <span class="suffix">
                                                            {{ i18n.common.consumptionUnit }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span class="label">{{ i18n.common.perMonth }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="hr">
                                        <td>
                                            {{ i18n.templates.app.estimatedDroplets }}
                                        </td>
                                        <td>
                                            <b>${{ dropletCost.toLocaleString() }}</b>
                                            <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {{ i18n.templates.app.estimatedOverage }}
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
                                            {{ i18n.templates.app.estimatedTotal }}
                                        </td>
                                        <td>
                                            <b>${{ (dropletCost + bandwidthOverage * 0.01).toLocaleString() }}</b>
                                            <small class="has-text-muted">{{ i18n.common.perMonth }}</small>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else>
                            <p class="has-text-muted">
                                {{ i18n.templates.app.selectToStart }}
                            </p>
                            <div class="panel-list panel-list-vertical">
                                <SkeletonDroplet></SkeletonDroplet>
                            </div>
                        </div>
                    </div>

                    <Picker :droplets="droplets" @picked="picked"></Picker>
                </div>
            </div>
        </div>

        <FAQs></FAQs>

        <Footer :text="i18n.templates.app.oss"></Footer>
    </div>
</template>

<script>
    const queryString = require('query-string');

    const i18n = require('../i18n');
    const compareArrays = require('../utils/compareArrays');
    const { dropletType, dropletSubType } = require('../utils/dropletType');
    const dropletData = require('../../build/droplets');

    const Footer = require('do-vue/src/templates/footer').default;
    const Pool = require('./pool');
    const ActiveDroplet = require('./droplets/active_droplet');
    const SkeletonDroplet = require('./droplets/skeleton_droplet');
    const Picker = require('./picker');
    const FAQs = require('./faqs');

    // Build the Droplet data
    const droplets = {};
    for (const droplet of dropletData) {
        if (!droplet.available || !droplet.regions.length) continue;
        const type = dropletType(droplet.slug);
        if (!type) continue;
        if (!(type in droplets)) droplets[type] = [];
        droplet.type = type;
        droplet.subType = dropletSubType(droplet.slug);
        droplets[type].push(droplet);
    }

    module.exports = {
        name: 'App',
        components: {
            Footer,
            Pool,
            ActiveDroplet,
            SkeletonDroplet,
            Picker,
            FAQs,
        },
        data() {
            return {
                i18n,
                droplets,
                activeDroplets: {},
                hasActiveDroplets: false,
                bandwidthAllowance: 0,
                bandwidthAllowanceData: [],
                bandwidthConsumption: 0,
                additionalBandwidthConsumption: 0,
                bandwidthConsumptionData: [],
                bandwidthOverage: 0,
                dropletCost: 0,
                focusedDroplet: null,
            };
        },
        methods: {
            get() {
                const parsed = queryString.parse(window.location.search);
                try {
                    if (!parsed.active) return [];
                    if (!parsed.active.length) return [];
                    const data = JSON.parse(parsed.active);
                    if (!data) return [];
                    if (!Array.isArray(data)) return [];
                    return data;
                } catch (_) {
                    return [];
                }
            },
            load() {
                // Get the old data
                const data = this.get();

                // If no data, add a default demo Droplet
                if (!data.length) data.push({
                    slug: 's-1vcpu-2gb',
                    type: 'droplet',
                    hours: 722,
                    consumption: 1500,
                    nodes: 1,
                });

                // Work through the initial droplets and load them in the tool
                for (const item of data) {
                    // Insert as a new active droplet
                    const droplet = dropletData.filter(d => d.slug === item.slug);
                    if (!droplet) continue;
                    const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                    const id = keys.length ? Math.max(...keys) + 1 : 0;
                    this.$set(this.$data.activeDroplets, id, [droplet[0], item.type]);
                    this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;

                    // Once rendered, set the data in the ref
                    this.$nextTick(() => {
                        const ref = this.$refs.activeDroplets.filter(d => d.$vnode.key === id.toString());
                        if (!ref) return;
                        ref[0].$data.hours = item.hours;
                        ref[0].$data.consumption = item.consumption;
                        ref[0].$data.nodes = item.nodes;
                    });
                }

                // Update a tick after the initial data is set in the refs
                this.$nextTick(() => {
                    this.$nextTick(this.update);
                });
            },
            save() {
                // Get the new data to save
                if (!this.$refs.activeDroplets) return;
                const data = this.$refs.activeDroplets.map(ref => {
                    return {
                        slug: ref.$props.droplet.slug,
                        type: ref.$props.type,
                        hours: ref.$data.hours,
                        consumption: ref.$data.consumption,
                        nodes: ref.$data.nodes,
                    };
                });

                // Get the old data, check if changed droplets
                const last = this.get();
                const sameDroplets = compareArrays(data.map(x => x.slug), last.map(x => x.slug));

                // Create new query param
                const parsed = queryString.parse(window.location.search);
                parsed.active = JSON.stringify(data);

                // Save
                if (sameDroplets) {
                    // Changed hours/consumption - don't spam new history entries
                    window.history.replaceState({}, '', `?${queryString.stringify(parsed)}`);
                } else {
                    // Changed droplets - store a new history point
                    window.history.pushState({}, '', `?${queryString.stringify(parsed)}`);
                }
            },
            update() {
                // Calculate the totals
                this.$data.dropletCost = this.getDropletCost();
                this.$data.bandwidthAllowance = this.getBandwidthAllowance();
                this.$data.bandwidthConsumption = this.getBandwidthConsumption();
                this.$data.bandwidthOverage = Math.max(
                    (this.$data.bandwidthConsumption - this.$data.bandwidthAllowance),
                    0,
                );

                // Calculate the per Droplet stacks
                const barMaxWidth = Math.max(this.$data.bandwidthConsumption, this.$data.bandwidthAllowance);
                const newBandwidthAllowanceData = [];
                const newBandwidthConsumptionData = [];
                for (const droplet of (this.$refs.activeDroplets || [])) {
                    newBandwidthAllowanceData.push([
                        droplet.$vnode.key,
                        `${droplet.bandwidthAllowance() / barMaxWidth * 100}%`,
                    ]);
                    newBandwidthConsumptionData.push([
                        droplet.$vnode.key,
                        `${droplet.$data.consumption / barMaxWidth * 100}%`,
                    ]);
                }
                newBandwidthConsumptionData.push([
                    'additional',
                    `${this.$data.additionalBandwidthConsumption / barMaxWidth * 100}%`,
                ]);

                // Filler bars
                if (!newBandwidthAllowanceData.length || this.$data.bandwidthAllowance === 0)
                    newBandwidthAllowanceData.push(['', '5px']);
                if (!newBandwidthConsumptionData.length || this.$data.bandwidthConsumption === 0)
                    newBandwidthConsumptionData.push(['', '5px']);

                // Save it all
                this.$data.bandwidthAllowanceData = newBandwidthAllowanceData;
                this.$data.bandwidthConsumptionData = newBandwidthConsumptionData;
                this.save();
            },
            removed(id) {
                this.$delete(this.$data.activeDroplets, id);
                this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;
                if (this.$data.focusedDroplet === id) this.$data.focusedDroplet = null;
                this.$nextTick(this.update);
            },
            picked(slug, type) {
                const droplet = dropletData.filter(d => d.slug === slug)[0];
                const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                const id = keys.length ? Math.max(...keys) + 1 : 0;
                this.$set(this.$data.activeDroplets, id, [droplet, type]);
                this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;
                this.$nextTick(this.update);
            },
            getBandwidthAllowance() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => {
                    return total + val.bandwidthAllowance();
                }, 0);
            },
            getDropletBandwidthConsumption() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => {
                    return total + val.$data.consumption;
                }, 0);
            },
            getBandwidthConsumption() {
                return this.getDropletBandwidthConsumption() + this.$data.additionalBandwidthConsumption;
            },
            getDropletCost() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => {
                    return total + val.dropletCost();
                }, 0);
            },
            focusedDropletLeave(id) {
                if (id === '') return;
                if (this.$data.focusedDroplet === id) this.$data.focusedDroplet = null;
            },
            focusedDropletEnter(id) {
                if (id === '') return;
                this.$data.focusedDroplet = id;
            },
            focusedDropletClass(id) {
                if (this.$data.focusedDroplet === null) return '';
                if (id === this.$data.focusedDroplet) return 'is-focused';
                return 'is-unfocused';
            },
        },
        mounted() {
            this.load();
        },
    };
</script>
