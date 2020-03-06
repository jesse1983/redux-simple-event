module.exports = {
    projects: [{
        displayName: "browser",
        browser: true,
        testMatch: [ "**/*.test-browser.js" ],
        preset: '@marko/jest',
        collectCoverage: true,
        transform: {
          "^.+\\.tsx?$": "ts-jest"
        },
    }, {
        displayName: "server",
        browser: false,
        testEnvironment: 'node',
        testMatch: [ "**/*.test-server.js" ],
        collectCoverage: true,
        transform: {
          "^.+\\.tsx?$": "ts-jest"
        },
    }]
}
