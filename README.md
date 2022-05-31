# rever-feature-flags-nodejs
NodeJs wrapper for BE feature flags, currently we only have optimizely provider but the wrapper is designed to have different providers.


# initialization

The module providers a factory function:

`getFeatureFlagsManager(defaultValues, config, logger, provider)`

- defaultValues: literal Object where each key is the feature flag and the value is the value of the flag, these values are used when there is an error or when no environment key is defined or if the environment key is set to `none`
- config: config Object with the following properties:
  - environmentKey: sdk key for the environment (ie production sdk key). You can get this one from optimizely
  - userProperties: Array of strings with the user properties that the module will extract from account object that will send to the provider. These should be properties that we to create audiences such as location Ids.
  - prefix: String value that will be prefixed to feature flag names, in backend we usually segment our variables by prefixing "BE_". Defaults to empty string
  - updateInterval: Number with the update interval in milliseconds, defaults to five minutes.
- logger: ever logger instance, if not provided the module won't log anything.
- provider: String with the  feature flags provider name, defaults to optimizely. Currently optimizely is the only supported provider.

### Example initialization

```javascript
const getFeatureFlagsManager = require('rever-feature-flags-nodejs')
const defaultValues =  { enableLanguageDetection: true }
const config = { 
  environmentKey: 'KeyToDevtest',
  userProperties: ['organization', 'site', 'isCoach', 'isSiteAdmin' ],
  prefix: 'BE_',
}
const featureFlagsManager = getFeatureFlagsManager(defaultValues, config, logger)

```


# Usage

The library has two functions, `getFeature` and `getFeatureVariable`

- `getFeature(featureName, user?)`

  returns the boolean value of a feature flag if the feature flag does not exist then it will return false. 
  
  If an user object (Rever account object) is passed then the properties set in the config will be extracted to be send to the provider, this is necessary when the feature flag depends on an audience.

- `getFeatureVariable(featureName, variableName, user?)`

   returns the value of a variable associated to a feature flag, if the variable is not defined or if the feature flag does not exist then it will return null.

   This is useful for setting variables within the provider instead of hard coding them or passing them as env variables. One example is the "BE_mobileVersion" flag that contains the "minimumVersion". Frontend team can change the value from the provider without needing to re deploy the API.



