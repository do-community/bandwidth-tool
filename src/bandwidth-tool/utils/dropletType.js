module.exports = slug => {
    const type = slug.split('-')[0];
    switch (type) {
        case 's':
            return 'Standard';

        case 'g':
            return 'General Purpose (1x SSD)';
        case 'gd':
            return 'General Purpose (2x SSD)';

        case 'c':
            return 'CPU-Optimized';

        case 'm':
            return 'Memory-Optimized (1x SSD)';
        case 'm3':
            return 'Memory-Optimized (3x SSD)';
        case 'm6':
            return 'Memory-Optimized (6x SSD)';
    }
};
