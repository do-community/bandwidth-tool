module.exports = (array1, array2) => {
    const array1Sorted = array1.sort();
    const array2Sorted = array2.sort();
    return array1.length === array2.length &&
        array1Sorted.every((value, index) => { return value === array2Sorted[index]; });
};
