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
        <Header title="Bandwidth Tool">
            <template v-slot:description>
                A small tool to help explain DigitalOcean Droplet/Account bandwidth allowances.
            </template>
            <template v-slot:header>
            </template>
            <template v-slot:buttons>
            </template>
        </Header>

        <div class="main container">
            <div class="bandwidth">
                <h2>Account Bandwidth Pool</h2>

                <div class="bars">
                    <div class="allowance" :style="{ width: bandwidthAllowanceWidth }"></div>
                    <div class="consumption" :style="{ width: bandwidthConsumptionWidth }"></div>
                </div>

                <div class="stats">
                    <p class="allowance">
                        <span>Estimated Allowance:</span>
                        <b>{{ bandwidthAllowance.toLocaleString() }} TB</b>
                    </p>
                    <p class="consumption">
                        <span>Estimated Consumption:</span>
                        <b>{{ bandwidthConsumption.toLocaleString() }} TB</b>
                    </p>
                </div>
            </div>

            <h3>Active Droplets</h3>
            <div class="panel-list panel-list-vertical">
                <ActiveDroplet
                    v-for="(droplet, id) in activeDroplets"
                    :droplet="droplet"
                    :key="id"
                    ref="activeDroplets"
                    @remove="removed(id)"
                    @update="update"
                ></ActiveDroplet>
            </div>

            <h3>Droplet Picker</h3>
            <Picker :droplets="droplets" @picked="picked"></Picker>
        </div>

        <Footer text=""></Footer>
    </div>
</template>

<script>
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
    const ActiveDroplet = require('./active_droplet');
    const Picker = require('./picker');

    module.exports = {
        name: 'App',
        components: {
            Header,
            Footer,
            ActiveDroplet,
            Picker,
        },
        data() {
            return {
                droplets,
                activeDroplets: {},
                bandwidthConsumption: 0,
                bandwidthConsumptionWidth: '0',
                bandwidthAllowance: 0,
                bandwidthAllowanceWidth: '0',
            };
        },
        methods: {
            update() {
                this.$data.bandwidthAllowance = this.getBandwidthAllowance();
                this.$data.bandwidthConsumption = this.getBandwidthConsumption();
                const barMaxWidth = Math.max(this.$data.bandwidthConsumption, this.$data.bandwidthAllowance);
                this.$data.bandwidthAllowanceWidth = this.$data.bandwidthAllowance === 0 ? '5px' : `${this.$data.bandwidthAllowance / barMaxWidth * 100}%`;
                this.$data.bandwidthConsumptionWidth = this.$data.bandwidthConsumption === 0 ? '5px' : `${this.$data.bandwidthConsumption / barMaxWidth * 100}%`;
            },
            removed(id) {
                this.$delete(this.$data.activeDroplets, id);
                this.$nextTick(this.update);
            },
            picked(slug) {
                const droplet = dropletData.filter(d => d.slug === slug)[0];
                const keys = Object.keys(this.$data.activeDroplets).map(x => parseInt(x));
                const id = keys.length ? Math.max(...keys) + 1 : 0;
                this.$set(this.$data.activeDroplets, id, droplet);
                this.$nextTick(this.update);
            },
            getBandwidthAllowance() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => { return total + val.bandwidthAllowance() }, 0);
            },
            getBandwidthConsumption() {
                if (!this.$refs.activeDroplets) return 0;
                return this.$refs.activeDroplets.reduce((total, val) => { return total + val.$data.consumption }, 0);
            },
        },
        mounted() {
            this.update();
        },
    }
</script>
