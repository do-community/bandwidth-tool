# Bandwidth Calculator

A tool to help calculate and explain bandwidth allowances for Droplets on DigitalOcean.

---

## Development/Building

To setup the build/develop environment, you will need to run `npm i` with Node 12+ installed. This will install the
 dependencies to allow you to build the project.
 
To develop for this tool run `npm run dev`.
This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host this tool on a service, simply run `npm run build`. This will run all the necessary build scripts
 automatically to build the tool.\
You can then take the `dist` folder and put it on your web server/bucket.

GitHub Actions is setup to do this automatically for this repository to deploy to gh-pages.

## Source Structure

### [`src/bandwidth-tool`](./src/bandwidth-tool)

#### [`src/bandwidth-tool/scss`](./src/bandwidth-tool/scss)

The scss directory contains the main SCSS styling file for the tool, which imports our do-bulma library and then adds
 tool-specific customisations.

#### [`src/bandwidth-tool/templates`](./src/bandwidth-tool/templates)

This directory contains the Vue templates that are used to render the tool on the client-side.
`app.vue` is the main Vue file that other templates are referenced into.

#### [`src/bandwidth-tool/utils`](./src/bandwidth-tool/utils)

Utility functions that are used by the tool, such as determining the type of a Droplet from its slug, live inside this
 directory.

### [`src/build`](./src/build)

The build directory contains a special utility script that is used during the initial build of the tool both for
 deployments and in development. This script fetches all Droplet sizes, saving them to a local JSON file that the tool
 then uses.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your pull requests.

