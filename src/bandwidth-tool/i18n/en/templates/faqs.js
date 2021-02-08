export default {
    title: 'Bandwidth FAQs',
    forMoreInfo: 'For more information, please see our [bandwidth billing docs](https://www.digitalocean.com/docs/accounts/billing/bandwidth/).',
    items: [
        {
            question: 'Do data transfers between my Droplets in the same datacenter count against my bandwidth usage?',
            answer: 'If your Droplets transfer data via a DigitalOcean Private Network interface, transfers between your Droplets do not count against your bandwidth. Otherwise, all other outbound transfers using a public interface count against your bandwidth usage. Any inbound transfers don\'t count against your bandwidth usage.',
        },
        {
            question: 'Do data transfers between my Droplets in different datacenter regions count against my bandwidth usage?',
            answer: 'Yes. Droplets use the public internet to transfer data to Droplets in different datacenter regions. Any outbound transfers that are sent through the public internet count against your bandwidth usage.',
        },
        {
            question: 'Do data transfers using the Spaces service count against my bandwidth usage?',
            answer: 'Spaces bandwidth usage is calculated and [billed differently](https://www.digitalocean.com/docs/accounts/billing/bandwidth/#spaces) than outbound transfers from your Droplets.',
        },
        {
            question: 'Do data transfers from Droplets to Spaces count against my bandwidth?',
            answer: 'Yes. Outbound traffic from any Droplet to any Space does currently count against your Droplets\' outbound transfer allowance. We\'re working to change this behavior.',
        },
        {
            question: 'Will I receive a billing alert if I reach my bandwidth limit before the month is over?',
            answer: 'No. We cannot calculate the full bandwidth pool before the month is over.',
        },
        {
            question: 'Can I use this tool to calculate the bandwidth for Kubernetes clusters?',
            answer: 'Yes. Each node in a Kubernetes cluster is treated as a Droplet and uses the same bandwidth billing system.',
        },
    ],
};
