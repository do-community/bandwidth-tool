const dropletType = slug => {
    const type = slug.split('-')[0];
    switch (type) {
        case 's':
            return 'Standard';

        case 'g':
        case 'gd':
            return 'General Purpose';

        case 'c':
            return 'CPU-Optimized';

        case 'm':
        case 'm3':
        case 'm6':
            return 'Memory-Optimized';

        default:
            return undefined; // Should be 'Legacy'
    }
};

const dropletTypes = ['Standard', 'General Purpose', 'CPU-Optimized', 'Memory-Optimized']; // Missing 'Legacy'

const dropletSubType = slug => {
    const type = slug.split('-')[0];
    switch (type) {
        case 'g':
            return '1x SSD';
        case 'gd':
            return '2x SSD';

        case 'm':
            return '1x SSD';
        case 'm3':
            return '3x SSD';
        case 'm6':
            return '6x SSD';

        default:
            return undefined;
    }
};

module.exports = { dropletType, dropletTypes, dropletSubType };
