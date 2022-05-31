const optimizelySDK = require('@optimizely/optimizely-sdk');
const datafile = require('./optimizely-fallback-datafile.json');
const serializeEntityID = require('../serializeEntityID');

const FIVE_MINUTES_IN_MILLISECONDS = 300000;

const serialize = (value) => {
  if (value === '' || value === true || value === false) return value
  if (typeof value === 'number') return value
  return serializeEntityID(value)
}

const getUserProperties = (user = {}, config) => {
  const { userProperties } = config
  if (!userProperties || !Array.isArray(userProperties)) return {}
  return userProperties.reduce((attributes, property) => {
    if (user[property] !== undefined) attributes[property] = serialize(user[property])
    return attributes
  }, {})
};

module.exports = (config, logger, customManager) => {
  const optimizelyManager = optimizelySDK.createInstance({
    sdkKey: config.environmentKey,
    datafile,
    datafileOptions: {
      updateInterval: config.updateInterval || FIVE_MINUTES_IN_MILLISECONDS,
    },
  })

  optimizelyManager.onReady().then(() => {
    logger.info('Feature Flags are loaded')
    logger.info('Enabled Feature flags', optimizely.getEnabledFeatures('all'))
  })

  const optimizely = customManager || optimizelyManager

  const hasFeature = (featureName, user) => {
    const userProperties = getUserProperties(user, config)
    const userId = user ? serializeEntityID(user) : 'all'
    return optimizely.isFeatureEnabled(featureName, userId, userProperties)
  }

  const getFeatureVariable = (featureName, variableName, user) => {
    const userProperties = getUserProperties(user, config)
    const userId = user ? serializeEntityID(user) : 'all'
    return optimizely.getFeatureVariable(featureName, variableName, userId, userProperties)
  }

  return {
    hasFeature,
    getFeatureVariable,
  }
}
