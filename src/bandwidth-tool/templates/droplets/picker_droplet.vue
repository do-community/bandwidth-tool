<!--
Copyright 2023 DigitalOcean

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
    <div class="panel is-selectable is-droplet">
        <p>
            <em>
                <sup>$</sup>{{ droplet.price.monthly.toLocaleString() }}
                <sub> {{ i18n.common.perMonth }}</sub>
                <sub v-if="type === 'kubernetes'" class="sub-block">
                    {{ i18n.templates.droplets.pickerDroplet.perNode }}
                </sub>
            </em>
        </p>
        <p>
            <small>
                <em>
                    {{ droplet.price.transferQuota.toLocaleString() }} {{ i18n.templates.droplets.droplet.transferUnitSmall }}
                    <sub> {{ i18n.templates.droplets.droplet.transfer }}</sub>
                    <sub v-if="type === 'kubernetes'" class="sub-block">
                        {{ i18n.templates.droplets.pickerDroplet.perNode }}
                    </sub>
                </em>
            </small>
        </p>

        <a class="button is-primary is-tiny">Add</a>

        <p>
            {{ droplet.cpus.toLocaleString() }}
            {{ i18n.templates.droplets.droplet[droplet.cpus === 1 ? 'cpuSingular' : 'cpuPlural'] }}
        </p>
        <p>{{ droplet.memory.toLocaleString() }} {{ i18n.templates.droplets.droplet.memoryUnit }}</p>
        <p>{{ droplet.ssd.size.toLocaleString() }} {{ i18n.templates.droplets.droplet.diskSuffix }}</p>
        <p v-if="droplet.variant?.length">{{ droplet.variant.join(', ') }}</p>
        <p><code>{{ droplet.slug }}</code></p>
    </div>
</template>

<script>
    import i18n from '../../i18n';

    export default {
        name: 'PickerDroplet',
        props: {
            droplet: Object,
            type: String,
        },
        data() {
            return {
                i18n,
            };
        },
    };
</script>
