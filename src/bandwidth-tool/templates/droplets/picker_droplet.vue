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
    <div class="panel selectable is-droplet">
        <p><em><sup>$</sup>{{ droplet.price_monthly }}<sub> / mo</sub></em></p>
        <p><em>{{ droplet.transfer }} TB<sub> transfer</sub></em></p>
        <hr />
        <p>{{ droplet.memory / 1024 }} GB <sub> / {{ droplet.vcpus }} CPU{{ droplet.vcpus === 1 ? '' : 's' }}</sub></p>
        <p>{{ droplet.disk }} GB <sub> SSD disk</sub></p>
        <p v-if="droplet.subType">
            <sub>{{ droplet.subType }}</sub>
        </p>
        <p><code>{{ droplet.slug }}</code></p>
    </div>
</template>

<script>
    module.exports = {
        name: 'PickerDroplet',
        props: {
            droplet: Object,
        },
    };
</script>
