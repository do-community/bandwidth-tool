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
    title: 'Account Bandwidth Pool',
    allowance: 'Estimated allowance:',
    allowanceUnit: 'GiB',
    consumption: 'Estimated consumption:',
    overage: 'Estimated overage:',
    overageWarning: 'Your estimated bandwidth consumption exceeds the estimated allowance in your pool. This will result in an overage charge!',
    overageOkay: 'Your estimated bandwidth consumption is less than the estimated allowance pool on your account in a month, so you should not be charged anything extra for bandwidth usage.',
    accrued: 'Bandwidth allowance from Droplets is accrued at the account level and shared between all Droplets on your DigitalOcean account.',
};
