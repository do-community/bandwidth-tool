<!--
Copyright 2021 DigitalOcean

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
    <div class="costs">
        <p class="collapse" @click="toggle">
            {{ i18n.templates.costs.summary }}
            <i v-if="summaryVisible" class="fas fa-caret-down"></i>
            <i v-else class="fas fa-caret-right"></i>
        </p>

        <table v-if="summaryVisible" class="table">
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
                        {{ i18n.templates.costs.estimatedDroplet }}
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

        <p v-if="generating">{{ i18n.templates.costs.generatingExport }}</p>
        <p v-else>
            {{ i18n.templates.costs.exportAs }}
            <a @click="() => xlsx(false)">XLSX</a> / <a @click="() => xlsx(true)">CSV</a>
        </p>
    </div>
</template>

<script>
    import i18n from '../i18n';

    export default {
        name: 'Costs',
        props: {
            bandwidthConsumption: Number,
            dropletCost: Number,
            bandwidthOverage: Number,
            activeDroplets: Array,
        },
        data() {
            return {
                i18n,
                additionalBandwidthConsumption: 0,
                summaryVisible: false,
                generating: false,
                exceljs: null,
            };
        },
        methods: {
            toggle() {
                this.$data.summaryVisible = !this.$data.summaryVisible;
            },
            async xlsx (asCsv) {
                // Don't process if already running
                if (this.generating) return

                // Set ourselves as running
                this.generating = true;

                // Load the exceljs library async
                if (!this.exceljs) this.exceljs = await import('exceljs');

                // Create the basic sheet
                const workbook = new this.exceljs.Workbook();
                workbook.creator = i18n.templates.costs.digitalOcean;
                workbook.created = new Date();
                workbook.modified = new Date();
                const sheet = workbook.addWorksheet(i18n.templates.app.title);

                // Generic styles to be reused
                const headerFont = {
                    color: { argb: 'FFFFFFFF' },
                    size: 12,
                    bold: true,
                };
                const headerFill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF4285F4' },
                };
                const inputFill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFCFE2F3' },
                };
                const moneyFormat = '"$"#,##0.00';
                const detailedMoneyFormat = '"$"#,##0.000';

                // Add the header
                const headers = sheet.addRow([
                    i18n.templates.costs.dropletSlug,
                    i18n.templates.droplets.droplet.cpuPlural,
                    `${i18n.templates.costs.memory} (${i18n.templates.droplets.droplet.memoryUnit})`,
                    `${i18n.templates.costs.disk} (${i18n.templates.droplets.droplet.memoryUnit})`,
                    `${i18n.templates.costs.transfer} (${i18n.common.consumptionUnit})`,
                    i18n.templates.costs.monthlyCost,
                    i18n.templates.costs.hourlyCost,
                    i18n.templates.costs.quantity,
                    i18n.templates.costs.lifetimeHours,
                    `${i18n.templates.costs.lifetimeTransfer} (${i18n.common.consumptionUnit})`,
                    `${i18n.templates.costs.consumption} (${i18n.common.consumptionUnit})`,
                    i18n.templates.costs.estimatedDroplet,
                ]);
                headers.font = headerFont;
                headers.alignment = {
                    vertical: 'bottom',
                    horizontal: 'center',
                };
                headers.fill = headerFill;

                // Add our Droplets
                this.$props.activeDroplets.forEach(ref => {
                    const row = sheet.addRow([
                        ref.$props.droplet.slug,
                        ref.$props.droplet.vcpus,
                        ref.$props.droplet.memory / 1024,
                        ref.$props.droplet.disk,
                        ref.$props.droplet.transfer * 1000,
                        ref.$props.droplet.price_monthly,
                        ref.$props.droplet.price_hourly,
                        ref.$data.nodes,
                        ref.$data.hours,
                        ref.bandwidthAllowance(),
                        ref.$data.consumption,
                        ref.dropletCost(),
                    ]);

                    // Monthly price is a price
                    row.getCell(6).numFmt = moneyFormat;
                    row.getCell(7).numFmt = detailedMoneyFormat;

                    // Quantity & lifetime can be changed
                    row.getCell(8).fill = inputFill;
                    row.getCell(9).fill = inputFill;

                    // Bandwidth allowance is based on lifetime
                    // this.$props.droplet.transfer * 1000 * (this.cappedHours() / 672) * this.nodeMultiplier()
                    row.getCell(10).value = {
                        formula: `E${row.number} * (MIN(${ref.maxHours()}, MAX(0, I${row.number})) / 672) * MAX(H${row.number}, 1)`,
                        result: ref.bandwidthAllowance(),
                    };

                    // Bandwidth consumption can be changed
                    row.getCell(11).fill = inputFill;

                    // Droplet cost is a price based on lifetime
                    // if (this.$data.hours > this.maxHours())
                    //   return this.$props.droplet.price_monthly * this.nodeMultiplier();
                    // return this.$props.droplet.price_hourly * this.cappedHours() * this.nodeMultiplier();
                    row.getCell(12).numFmt = detailedMoneyFormat;
                    row.getCell(12).value = {
                        formula: `IF(I${row.number} >= ${ref.maxHours()}, F${row.number}, G${row.number} * MIN(${ref.maxHours()}, MAX(0, I${row.number}))) * MAX(H${row.number}, 1)`,
                        result: ref.dropletCost(),
                    };
                });

                // Add a spacer row
                const spacer = sheet.addRow();

                // Add the assorted totals
                const padding = new Array(headers.cellCount - 2).fill('');
                [
                    [
                        `${i18n.templates.costs.dropletBandwidthConsumption} (${i18n.common.consumptionUnit})`,
                        this.$props.bandwidthConsumption - this.$data.additionalBandwidthConsumption,
                        `SUM(K2:K${spacer.number - 1})`,
                    ],
                    [
                        `${i18n.templates.costs.additionalBandwidthConsumption} (${i18n.common.consumptionUnit})`,
                        this.$data.additionalBandwidthConsumption,
                        '',
                        '',
                        inputFill,
                    ],
                    [
                        i18n.templates.costs.estimatedDroplet,
                        this.$props.dropletCost,
                        `SUM(L2:L${spacer.number - 1})`,
                        moneyFormat,
                    ],
                    [
                        i18n.templates.costs.estimatedOverage,
                        this.$props.bandwidthOverage * 0.01,
                        `MAX(SUM(K2:K${spacer.number - 1}) + L${spacer.number + 2} - SUM(J2:J${spacer.number - 1}), 0) * 0.01`,
                        moneyFormat,
                    ],
                    [
                        i18n.templates.costs.estimatedTotal,
                        this.$props.dropletCost + this.$props.bandwidthOverage * 0.01,
                        `L${spacer.number + 3} + L${spacer.number + 4}`,
                        moneyFormat,
                    ],
                ].forEach((rowData, i, arr) => {
                    const row = sheet.addRow([
                        ...padding,
                        rowData[0],
                        rowData[1],
                    ]);

                    // Use two cells for the name (only xlsx)
                    if (!asCsv) {
                        sheet.mergeCells(row.number, row.cellCount - 2, row.number, row.cellCount - 1);
                        row.getCell(row.cellCount - 1).value = rowData[0];
                    }

                    // Style the name
                    row.getCell(row.cellCount - 1).alignment = { horizontal: 'right' };
                    row.getCell(row.cellCount - 1).font = headerFont;
                    row.getCell(row.cellCount - 1).fill = headerFill;

                    // Formula for some values
                    if (rowData[2]) {
                        row.getCell(row.cellCount).value = {
                            formula: rowData[2],
                            result: rowData[1],
                        };
                    }

                    // Format for money values
                    if (rowData[3]) row.getCell(row.cellCount).numFmt = rowData[3];

                    // Fill for input values
                    if (rowData[4]) row.getCell(row.cellCount).fill = rowData[4];

                    // Last cell is bigger
                    if (i === arr.length - 1) row.getCell(row.cellCount).font = {
                        size: 12,
                        bold: true,
                    };
                });

                // Resize columns
                sheet.columns.forEach(column => {
                    column.width = 22;
                });

                // Add some borders
                sheet.eachRow(row => {
                    row.eachCell(cell => {
                        if (!['', null, undefined].includes(cell.value)) cell.border = {
                            top: { style:'thin', color: { argb:'FF0069FF' } },
                            left: { style:'thin', color: { argb:'FF0069FF' } },
                            bottom: { style:'thin', color: { argb:'FF0069FF' } },
                            right: { style:'thin', color: { argb:'FF0069FF' } },
                        };
                    });
                });

                // Download it
                const type = asCsv ? 'csv' : 'xlsx';
                const buffer = await workbook[type].writeBuffer();
                const blob = new Blob([ buffer ], { type: asCsv ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `bandwidth-calculator.${type}`;
                link.click();

                // Done
                this.generating = false;
            },
        },
    };
</script>
