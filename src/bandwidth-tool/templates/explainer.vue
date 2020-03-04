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
    <div class="container explainer">
        <h2>{{ i18n.templates.explainer.simpleApproach }}</h2>
        <div class="columns">
            <div class="column">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" aria-hidden="true">
                    <g fill="none" fill-rule="evenodd">
                        <rect fill="#F2F7FF" width="40" height="40" rx="4"></rect>
                        <path d="M17 16.25h8.25m-3-3l3 3-3 3m.75 4.5h-8.25m3 3l-3-3 3-3" stroke="#0069FF"
                              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        ></path>
                        <path
                            d="M28.25 8.75h-16.5a3 3 0 0 0-3 3v16.5a3 3 0 0 0 3 3h16.5a3 3 0 0 0 3-3v-16.5a3 3 0 0 0-3-3z"
                            stroke="#0069FF" stroke-width="1.5" stroke-linecap="round"
                            stroke-linejoin="round"
                        ></path>
                    </g>
                </svg>
                <h3>{{ i18n.templates.explainer.poolTitle }}</h3>
                <p>{{ i18n.templates.explainer.poolDesc }}</p>
            </div>
            <div class="column">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" aria-hidden="true">
                    <g fill="none" fill-rule="evenodd">
                        <rect width="40" height="40" fill="#F2F7FF" fill-rule="nonzero" rx="4"></rect>
                        <g stroke="#0069FF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                            <path
                                d="M16.25 31.25v-10.5M27.569 23.6a4.875 4.875 0 1 0-3.958-8.738 7.5 7.5 0 1 0-12.6 6.749"
                            ></path>
                            <path d="M19.25 23.75l-3-3-3 3M23.75 20.75v10.5M20.75 28.25l3 3 3-3"></path>
                        </g>
                    </g>
                </svg>
                <h3>{{ i18n.templates.explainer.overageTitle }}</h3>
                <p>{{ i18n.templates.explainer.overageDesc }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    const i18n = require('../i18n');

    module.exports = {
        name: 'Explainer',
        data() {
            return {
                i18n,
            };
        },
    };
</script>
