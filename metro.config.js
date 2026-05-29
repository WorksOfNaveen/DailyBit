const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/private/defaults/exclusionList').default;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blockList: exclusionList([
      // Entire Gradle output/cache tree inside the RN Gradle plugin (Windows watcher race)
      /node_modules[/\\]@react-native[/\\]gradle-plugin[/\\]\.gradle[/\\].*/,
      /node_modules[/\\]@react-native[/\\]gradle-plugin[/\\].*[/\\]build[/\\].*/,
      // Android native build outputs (CMake .cxx dirs are deleted mid-build → Metro ENOENT on Windows)
      /android[/\\]\.gradle[/\\].*/,
      /android[/\\]build[/\\].*/,
      /android[/\\]app[/\\]build[/\\].*/,
      /android[/\\]app[/\\]\.cxx[/\\].*/,
      /ios[/\\]build[/\\].*/,
      /ios[/\\]Pods[/\\].*/,
    ]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
