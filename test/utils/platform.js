const os = require('os');

function isWindows() {
  return os.platform() === 'win32';
}

function isMacOS() {
  return os.platform() === 'darwin';
}

function isLinux() {
  return os.platform() === 'linux';
}

function skipOnWindows(reason = 'Test skipped on Windows') {
  if (isWindows()) {
    test.skip(reason, () => {});
    return true;
  }
  return false;
}

function skipOnMacOS(reason = 'Test skipped on macOS') {
  if (isMacOS()) {
    test.skip(reason, () => {});
    return true;
  }
  return false;
}

function runOnPlatform(platform, testFn) {
  const currentPlatform = os.platform();
  if (currentPlatform === platform) {
    testFn();
  } else {
    test.skip(`Test only runs on ${platform}`, () => {});
  }
}

module.exports = {
  isWindows,
  isMacOS,
  isLinux,
  skipOnWindows,
  skipOnMacOS,
  runOnPlatform
};