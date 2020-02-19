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
    <div class="container faqs">
        <h2>Bandwidth FAQs</h2>
        <p class="has-text-muted">
            For more information, please see our
            <a href="https://www.digitalocean.com/docs/accounts/billing/bandwidth/">
                bandwidth billing docs</a>.
        </p>

        <h4>A question</h4>
        <p>An answer, stolen from another part of the site probably because I don't want to write new things.</p>

        <h4>Another question</h4>
        <p>Really, this is just another answer to fill some space. Maybe we'll put useful content here later.</p>
    </div>
</template>

<script>
    const i18n = require('../i18n');

    module.exports = {
        name: 'FAQs',
        data() {
            return {
                i18n,
            };
        },
    };
</script>
