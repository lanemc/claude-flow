module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: false
  },
  globals: {
    document: 'readonly',
    window: 'readonly',
    HTMLElement: 'readonly',
    Element: 'readonly',
    Event: 'readonly',
    CustomEvent: 'readonly',
    console: 'readonly'
  }
};