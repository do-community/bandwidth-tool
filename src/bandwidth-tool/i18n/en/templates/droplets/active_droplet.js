/*
Copyright 2022 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export default {
    node: 'node',

    nodesLabel: 'Quantity',
    nodesPoolLabel: 'Pool will have',
    nodesUnit: 'nodes',
    nodesTooltip: 'By default, a Kubernetes cluster pool on DigitalOcean will consist of 3 nodes.',

    hoursLabel: 'Droplet will exist for',
    poolHoursLabel: 'Pool will exist for',
    hoursUnit: 'hours',
    hoursTooltip: 'Droplet pricing and billing is capped at 672 hours a month, or 28 days.',
    poolHoursTooltip: 'Kubernetes pool nodes can generate additional bandwidth allowance compared to Droplets, as they are billed up to 744 hours a month, or 31 days, instead of the normal 672 hours (28 days).',

    monthly: '(monthly)',

    consumptionLabel: 'Outbound data consumption',
    consumptionTooltip: 'Use this to visualize the consumption of your account bandwidth pool by each Droplet.',

    monthlyCost: 'Monthly Droplet Cost',
    poolMonthlyCost: 'Monthly Pool Cost',

    overageTooltip: 'The monthly Droplet cost shown here does not include the estimated bandwidth pool overage cost, shown above.',

    remove: 'Remove this Droplet',
    poolRemove: 'Remove this Kubernetes Pool',
};
