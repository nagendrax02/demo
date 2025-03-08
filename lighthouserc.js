module.exports = {
  ci: {
    collect: {
      url: ['https://swlite-sandbox.marvin.crm4b2c.com'],
      isSinglePageApplication: true,
      settings: {
        chromeFlags: '--no-sandbox',
        emulatedFormFactor: 'desktop',
        preset: 'desktop'
      },
      numberOfRuns: 2
    },
    upload: {
      ignoreDuplicateBuildFailure: true,
      serverBaseUrl: 'http://13.127.59.173',
      token: '45be68b8-1efa-4e15-b9b9-3d0625779315'
    },
    assert: {
      includePassedAssertions: true,
      assertions: {
        'first-contentful-paint': ['error', { minScore: 0.8 }],
        'first-meaningful-paint': ['error', { minScore: 0.8 }],
        'speed-index': ['error', { minScore: 0.7 }],
        interactive: ['error', { minScore: 0.8 }],
        'total-blocking-time': ['error', { minScore: 0.8 }],
        'unused-css-rules': ['error', { minScore: 0.8 }],
        'render-blocking-resources': ['error', { minScore: 0.8 }]
      }
    }
  }
};
