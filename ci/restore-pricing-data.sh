#!/bin/sh

# Create the build directory to hold the data
mkdir build

################
# 1. Attempt to use environment provided pricing data (via workflow POST)
################

# Check the type to ensure its a valid JSON array
TYPE=$(echo "$DATA" | jq type)
SUCCESS=$([ "$TYPE" = '"array"' ] && echo 'true' || echo 'false')

# If successful, write to build/data.json and exit
if $SUCCESS; then
  echo "Using workflow POST pricing data for build"
  echo "$DATA" > build/data.json
  exit 0
fi

################
# 2. Attempt to recover pricing data from last build
################

# TODO: Git checkout gh-pages

# TODO: Look for data.json file, set success if found
SUCCESS=$(echo 'false')

# If successful, copy to build/data.json and exit
if $SUCCESS; then
  echo "Using previous pricing data for build"
  cp gh-pages/data.json build/data.json
  exit 0
fi

################
# 3. Get the latest pricing data from the public API
################

# TODO: Run new Node.js script to get data.json
echo "Using public API pricing data for build"
echo "[]" > build/data.json
