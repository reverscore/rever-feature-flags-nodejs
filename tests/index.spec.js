const { expect } = require('chai')
const getFeatureFlags = require('../index');

describe('Feature Flags factory', () => {
  it('Should throw an error when there provider is not supported', () => {
    const getManager = () => getFeatureFlags({}, {}, undefined, 'not-supported');

    expect(getManager).to.throw('Provider not-supported is not supported');
  });

  it('Should return an object with expected methods', () => {
    const flagManager = getFeatureFlags({}, {}, undefined, 'optimizely');

    expect(flagManager.hasFeature).to.be.a('function');
    expect(flagManager.getFeatureVariable).to.be.a('function');
  });
});

describe('Feater flags: optimizely provider ', () => {
  describe('hasFeature', () => {
    it('should use return true when calling hasFeature with environment set', () => {
      const flagManager = getFeatureFlags({}, { environmentKey: '1234' }, undefined, 'optimizely');
  
      const flagValue = flagManager.hasFeature('BE_useInsightsScoreCalculation');
  
      expect(flagValue).to.be.true;
    });
  
    it('should use use prefix value correctly', () => {
      const flagManager = getFeatureFlags({}, { environmentKey: '1234', prefix: 'BE_' }, undefined, 'optimizely');
  
      const flagValue = flagManager.hasFeature('useInsightsScoreCalculation');
  
      expect(flagValue).to.be.true;
    });

    it('should return undefined if feature flag does not exist', () => {
      const flagManager = getFeatureFlags({}, { environmentKey: '1234', prefix: 'BE_' }, undefined, 'optimizely');
  
      const flagValue = flagManager.hasFeature('madeUpFeature');
  
      expect(flagValue).to.be.false;
    });
  });

  describe('getFeatureVariable', () => {
    it('should return correct variable value', async () => {
      const flagManager = getFeatureFlags({}, { environmentKey: '1234' }, undefined, 'optimizely');

      const variableValue = flagManager.getFeatureVariable('BE_mobileVersion', 'minimumVersion');

      expect(variableValue).to.equal("3.4.5");
    });
  });
});