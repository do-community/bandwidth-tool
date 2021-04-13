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
    <div class="container faqs">
        <h2>{{ i18n.templates.faqs.title }}</h2>
        <p class="has-text-muted" v-html="i18n.templates.faqs.forMoreInfo"></p>

        <template v-for="item in i18n.templates.faqs.items">
            <h4>{{ item.question }}</h4>
            <p v-html="item.answer"></p>
        </template>
    </div>
</template>

<script>
    import i18n from '../i18n';

    export default {
        name: 'FAQs',
        data() {
            return {
                i18n,
            };
        },
    };
</script>
