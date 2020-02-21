module.exports = {
    title: 'Bandwidth FAQs',
    forMoreInfo: 'For more information, please see our [bandwidth billing docs](https://www.digitalocean.com/docs/accounts/billing/bandwidth/).',
    items: [
        {
            question: 'Does traffic between my Droplets in the same datacenter region count against my bandwidth usage?',
            answer: 'No. Only outbound traffic from your Droplets to the public internet counts against your bandwidth usage.',
        },
        {
            question: 'Does traffic between my Droplets in different datacenter regions count against my bandwidth usage?',
            answer: 'Yes. Droplets use the public internet to transfer data to Droplets in different datacenter regions. Any outbound traffic that is sent through the public internet counts against your bandwidth usage.',
        },
        {
            question: 'Does traffic using the Spaces service count against my bandwidth usage?',
            answer: 'Spaces bandwidth usage is calculated and [billed differently](https://www.digitalocean.com/docs/accounts/billing/bandwidth/#spaces) than outbound traffic from your Droplets.',
        },
        {
            question: 'Does transfer from Droplets to Spaces count against my bandwidth?',
            answer: 'Yes, outbound traffic from any Droplet to any Space does currently count against your Droplets’ outbound transfer allowance. We’re working on changing this behavior.',
        },
    ],
};
