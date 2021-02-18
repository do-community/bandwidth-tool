#!/bin/sh

# Copyright 2021 DigitalOcean
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

echo "Getting pricing data for $TYPE..."

# Create the build directory to hold the data
mkdir -p build

################
# 1. Attempt to use environment provided pricing data (via workflow dispatch)
################

# Check the type to ensure it's a valid JSON array
JQ_TYPE=$(echo "$DATA" | jq type)
SUCCESS=$([ "$JQ_TYPE" = '"array"' ] && echo 'true' || echo 'false')

# If successful, write to build and exit
if $SUCCESS; then
  echo "Using workflow dispatch pricing data for $TYPE"
  echo "$DATA" > "build/$TYPE.json"
  exit 0
fi

################
# 2. Attempt to recover pricing data from last build
################

# TODO: Git checkout gh-pages

# TODO: Look for json file, set success if found
SUCCESS=$(echo 'false')

# If successful, copy to build/droplets.json and exit
if $SUCCESS; then
  echo "Using previous pricing data for $TYPE"
  cp "gh-pages/$TYPE.json" "build/$TYPE.json"
  exit 0
fi

################
# 3. Get the latest pricing data from the public API
################

echo "Using public API pricing data for $TYPE"
npm run "build:data:$TYPE"
