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

export default (array1, array2) => {
    if (array1.length !== array2.length) return false;

    const array1Sorted = [ ...array1 ].sort();
    const array2Sorted = [ ...array2 ].sort();
    return array1Sorted.every((value, index) => value === array2Sorted[index]);
};
