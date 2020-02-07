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
    <div class="panel is-droplet">
        <div class="info">
            <div class="primary-info">
                <span v-for="_ in 2" class="data-skeleton"
                      :style="{ ...getSkeletonStyle(50, 100), margin: '0 .2rem .1rem 0' }"
                >
                </span>
            </div>
            <div class="secondary-info">
                <span v-for="_ in 3" class="data-skeleton"
                      :style="{ ...getSkeletonStyle(50, 150), margin: '.1rem .2rem 0 0' }"
                >
                </span>
            </div>
        </div>
        <div class="right">
            <span v-for="_ in 2" class="data-skeleton"
                  :style="{ ...getSkeletonStyle(100, 150), height: '1.75em', borderRadius: '.875em', margin: '0 .5rem' }"
            >
            </span>
            <span class="data-skeleton"
                  :style="{ ...getSkeletonStyle(100, 150), height: '1.75em', borderRadius: '.875em', margin: '0 3rem' }"
            >
            </span>
            <span class="data-skeleton"
                  :style="{ ...getSkeletonStyle(30, 30), height: '1.25em', borderRadius: '.625em', margin: '0 .25rem' }"
            >
            </span>
        </div>
    </div>
</template>

<script>
    const { getSkeletonStyle } = require('do-bulma/src/utils/skeletonStyle');

    module.exports = {
        name: 'SkeletonDroplet',
        methods: {
            getSkeletonStyle,
        },
    };
</script>
