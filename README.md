# Bandwidth Tool
TODO

## Developing or Building the tool
To build or develop this tool, you will need to create a DigitalOcean API key. To do this, sign into the DigitalOcean control panel, click "API" in the sidebar and click "Generate New Token" on the screen which appears. Simply create a read-only token and then follow the following commands (replacing `TOKEN_HERE` with your token):

- `DIGITALOCEAN_TOKEN=TOKEN_HERE npm run dev` - Launches a hot reload development enviroment to allow you to easily reload created changes.
- `DIGITALOCEAN_TOKEN=TOKEN_HERE npm run build` - Build the site to the `dist` folder.
