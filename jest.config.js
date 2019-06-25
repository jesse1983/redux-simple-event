module.exports = {   
    projects: [{
        displayName: "browser",
        displayName: "browser",
        browser: true,
        testMatch: [ "**/*.test-browser.js" ]
    }, {
        displayName: "server",
        browser: false,
        testEnvironment: 'node',
        testMatch: [ "**/*.test-server.js" ]
    }]
}