module.exports = {
    presets: {
        web_db: {
            name: 'Web + Database',
            packages: ['web', '@repo/db'],
        },
        full_stack: {
            name: 'Full Stack (Web, API, DB)',
            packages: ['web', 'api', '@repo/db', '@repo/config'],
        },
    },
    runAll: true,
};
