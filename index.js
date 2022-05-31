
const getFeatureFlagsManager = require('./getFeatureFlagManager');
const emptyLogger = require('./emptyLogger');

/**
 *
 * @param {Object} defaultFlags Object with default flags where the keys are the feature names (without prefix) and the values are the default boolean values
 * @param {Object} config Configuration object with the following keys:
 * - environmentKey: String with the key of the environment
 * - userProperties: Array of strings with the user properties to be used send to the provider.
 * - prefix: String with the prefix of the feature names, defaults to empty string.
 * - updateInterval: Number with the update interval in milliseconds, defaults to five minutes.
 * @param {Object} logger rever logger instance, if not provided the module won't log anything
 * @param {String} [provider] feature flags provider, defaults to optimizely
*/
module.exports = (defaultFlags, config, logger = emptyLogger, provider = 'optimizely') => {
  const featureFlags = getFeatureFlagsManager(provider, config, defaultFlags, logger);
  return {
    hasFeature: featureFlags.hasFeature,
    getFeatureVariable: featureFlags.getFeatureVariable,
    defaultFlags,
  }
}
