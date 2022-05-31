const getOptimizelyProvider = require('./providers/optimizely');

const getProviders = (getCustomProvider = () => {}) => ({
  optimizely: getOptimizelyProvider,
  custom: getCustomProvider
});

const DEFAULT_PREFIX = '';

const shouldUseDefaults = (config) => {
  const { environmentKey } = config;
  return !environmentKey || environmentKey === 'none';
}

module.exports = (provider, config, defaultFlags, logger, getCustomProvider) => {
  const providers = getProviders(getCustomProvider);
  const supportedProviders = Object.keys(providers);
  if (!supportedProviders.includes(provider)) throw new Error(`Provider ${provider} is not supported`);

  const featureFlags = providers[provider](config, logger);
  /**
   *
   * @param {String} feature name of the future, if prefix is set it will be prefixed
   * @param {Object} [user] user/account object
   */
  const hasFeature = (feature, user) => {
  logger.setMethodProcess('hasFeature');

    try {
      if (shouldUseDefaults(config)) return defaultFlags[feature];
      const prefix = config.prefix || DEFAULT_PREFIX;
      return featureFlags.hasFeature(`${prefix}${feature}`, user);

    } catch (error) {
      logger.error(error);
      return defaultFlags[feature];
    }
  }

  /**
   *
   * @param {String} feature name of the future, if prefix is set it will be prefixed
   * @param {String} variableName name of the variable you need to get
   * @param {Object} [user] user/account object
   */
  const getFeatureVariable = (feature, variableName, user) => {
    logger.setMethodProcess('getFeatureVariable');

    try {
      if (shouldUseDefaults(config)) return null;
      const prefix = config.prefix || DEFAULT_PREFIX;
      return featureFlags.getFeatureVariable(`${prefix}${feature}`, variableName, user);
    } catch (error) {
      logger.error(error);
      console.error(error)
      return null;
    }
  }

  return {
    hasFeature,
    getFeatureVariable,
  }
}
