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
        <Header title="Droplet Planner">
            <template v-slot:description>
                Estimate your monthly costs and gain an understanding of how bandwidth usage and pooling will impact your bill.
            </template>
            <template v-slot:header>
                <div class="estimate">
                    <div class="droplet">
                        <h2>Droplets</h2>
                        <div v-if="hasActiveDroplets" class="panel-list panel-list-vertical">
                            <ActiveDroplet
                                v-for="(droplet, id) in activeDroplets"
                                :key="id"
                                ref="activeDroplets"
                                :droplet="droplet"
                                @remove="removed(id)"
                                @update="update"
                            ></ActiveDroplet>

                            <div class="total-right">
                                <h3>Droplet Subtotal</h3>
                                <div class="line-item">
                                    <strong>$123</strong>
                                    <span class="label">monthly</span>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <p class="has-text-muted">
                                Select a Droplet below to get started estimating the bandwidth allowance on your account!
                            </p>
                            <div class="panel-list panel-list-vertical">
                                <SkeletonDroplet></SkeletonDroplet>
                            </div>
                        </div>
                    </div>
                    <div class="bandwidth">
                        <h2>Bandwidth</h2>

                        <div class="bars">
                            <div class="bar is-primary" :style="{ width: bandwidthAllowanceWidth }"></div>
                            <div class="bar is-dark" :style="{ width: bandwidthConsumptionWidth }"></div>
                        </div>

                        <div class="stats">
                            <div class="data">
                                <p class="allowance">
                                    <span>Estimated allowance:</span>
                                    <b>{{ bandwidthAllowance.toLocaleString() }} TB</b>
                                </p>
                                <p class="consumption">
                                    <span>Estimated consumption:</span>
                                    <b>{{ bandwidthConsumption.toLocaleString() }} TB</b>
                                </p>
                                <div v-if="bandwidthOverage">
                                    <hr />
                                    <p>
                                        Your estimated bandwidth consumption exceeds the allowance on your account.
                                        This will result in an overage charge!
                                    </p>
                                    <p>
                                        <span>Estimated overage:</span>
                                        <b>
                                            ${{ (bandwidthOverage * 0.01).toLocaleString() }}
                                        </b>
                                        <small class="has-text-muted">
                                            ({{ bandwidthOverage.toLocaleString() }} GB
                                            @ $0.01 / GB)
                                        </small>
                                    </p>
                                </div>
                            </div>
                            <div class="info">
                                <p>
                                    Bandwidth allowance from Droplets is accrued at the account level and shared between
                                    all Droplets on your DigitalOcean account.
                                </p>
                                <p>
                                    Find out more about how accounts are charged for bandwidth usage in our
                                    <a href="https://www.digitalocean.com/docs/accounts/billing/bandwidth/">bandwidth
                                        billing docs</a>.
                                </p>
                            </div>
                        </div>
                        <div class="total-right line-item">
                            <h3>Bandwidth Subtotal</h3>
                            <div class="line-item">
                                <strong>$0</strong>
                                <span class="label">monthly</span>
                            </div>
                        </div>
                    </div>
                    <div class="total-right line-item">
                        <h3>Total</h3>
                        <div class="line-item">
                            <strong>$123</strong>
                            <span class="label">monthly</span>
                        </div>
                    </div>
                </div>
            </template>
            <template v-slot:buttons>
            </template>
        </Header>

        <div class="main container">
            <h3>Droplet Picker</h3>
            <Picker :droplets="droplets" @picked="picked"></Picker>
        </div>

        <Footer text=""></Footer>
    </div>
</template>

<script>
    const queryString = require('query-string');

    const { dropletType, dropletSubType } = require('../utils/dropletType');
    const dropletData = require('../../build/droplets');
    const droplets = {};
    for (const droplet of dropletData) {
        const type = dropletType(droplet.slug);
        if (!type) continue;
        if (!(type in droplets)) droplets[type] = [];
        droplet.type = type;
        droplet.subType = dropletSubType(droplet.slug);
        droplets[type].push(droplet);
    }

    const Header = require('do-vue/src/templates/header').default;
    const Footer = require('do-vue/src/templates/footer').default;
    const ActiveDroplet = require('./droplets/active_droplet');
    const SkeletonDroplet = require('./droplets/skeleton_droplet');
    const Picker = require('./picker');

    const compareArrays = require('../utils/compareArrays');

    module.exports = {
        name: 'App',
        components: {
            Header,
            Footer,
            ActiveDroplet,
            SkeletonDroplet,
            Picker,
        },
        data() {
            return {
                droplets,
                activeDroplets: {},
                hasActiveDroplets: false,
                bandwidthConsumption: 0,
                bandwidthConsumptionWidth: '0',
                bandwidthAllowance: 0,
                bandwidthAllowanceWidth: '0',
                bandwidthOverage: 0,
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
                for (const item of data) {
                    // Insert as a new active droplet
                    const droplet = dropletData.filter(d => d.slug === item.slug);
                    if (!droplet) continue;
                    const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                    const id = keys.length ? Math.max(...keys) + 1 : 0;
                    this.$set(this.$data.activeDroplets, id, droplet[0]);
                    this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;

                    // Once rendered, set the data in the ref
                    this.$nextTick(() => {
                        const ref = this.$refs.activeDroplets.filter(d => d.$vnode.key === id.toString());
                        if (!ref) return;
                        ref[0].$data.hours = item.hours;
                        ref[0].$data.consumption = item.consumption;
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
                const data = this.$refs.activeDroplets.map(ref => { return {
                    slug: ref.$props.droplet.slug,
                    hours: ref.$data.hours,
                    consumption: ref.$data.consumption,
                }; });

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
                this.$data.bandwidthAllowance = this.getBandwidthAllowance();
                this.$data.bandwidthConsumption = this.getBandwidthConsumption();
                this.$data.bandwidthOverage = Math.max(
                    (this.$data.bandwidthConsumption - this.$data.bandwidthAllowance) * 1000,
                    0,
                );
                const barMaxWidth = Math.max(this.$data.bandwidthConsumption, this.$data.bandwidthAllowance);
                this.$data.bandwidthAllowanceWidth = this.$data.bandwidthAllowance === 0 ? '5px' : `${this.$data.bandwidthAllowance / barMaxWidth * 100}%`;
                this.$data.bandwidthConsumptionWidth = this.$data.bandwidthConsumption === 0 ? '5px' : `${this.$data.bandwidthConsumption / barMaxWidth * 100}%`;
                this.save();
            },
            removed(id) {
                this.$delete(this.$data.activeDroplets, id);
                this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;
                this.$nextTick(this.update);
            },
            picked(slug) {
                const droplet = dropletData.filter(d => d.slug === slug)[0];
                const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                const id = keys.length ? Math.max(...keys) + 1 : 0;
                this.$set(this.$data.activeDroplets, id, droplet);
                this.$data.hasActiveDroplets = !!Object.keys(this.$data.activeDroplets).length;
                this.$nextTick(this.update);
            },
            getBandwidthAllowance() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => { return total + val.bandwidthAllowance(); }, 0);
            },
            getBandwidthConsumption() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => { return total + val.$data.consumption; }, 0);
            },
        },
        mounted() {
            this.load();
        },
    };
</script>
