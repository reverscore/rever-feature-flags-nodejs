const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const getFeatureFlagManager = require('../getFeatureFlagManager');
const emptyLogger = require('../emptyLogger');

chai.use(sinonChai)
const { expect } = chai;

const defaultFlags = {
  'firstFeature': true,
}

describe('Feature Flag Manager', () => {
  describe('hasFeature', () => {
    it('should use default flags when calling hasFeature with no environment set', () => {
      const flagManager = getFeatureFlagManager('custom', {}, defaultFlags, emptyLogger);
  
      const flagValue = flagManager.hasFeature('firstFeature');
  
      expect(flagValue).to.be.true
    });
  
    it('should use return undefined when calling hasFeature with no environment set', () => {
      const flagManager = getFeatureFlagManager('custom', {}, defaultFlags, emptyLogger);
  
      const flagValue = flagManager.hasFeature('notExistingFlag');
  
      expect(flagValue).to.be.undefined
    });
  
    it('should use return undefined when calling hasFeature with environment set as none', () => {
      const flagManager = getFeatureFlagManager('custom', { environmentKey: 'none' }, defaultFlags, emptyLogger);
  
      const flagValue = flagManager.hasFeature('firstFeature');
  
      expect(flagValue).to.be.true
    });

    it('should use configured prefix when calling hasFeature with environment set', () => {
      const hasFeatureStub = sinon.stub();
      const getCustomProvider = () => ({ hasFeature: hasFeatureStub });
      const config = { environmentKey: 'test', prefix: 'BE_' };
      const flagManager = getFeatureFlagManager('custom', config , defaultFlags, emptyLogger, getCustomProvider);
  
      flagManager.hasFeature('firstFeature');
  
      expect(hasFeatureStub).to.have.been.calledWith('BE_firstFeature');
    });
  });

  describe('getFeatureVariable', () => {
    it('should return null when not environment is set', () => {
      const flagManager = getFeatureFlagManager('custom', {}, defaultFlags, emptyLogger);

      const variableValue = flagManager.getFeatureVariable('firstFeature', 'testVariable');

      expect(variableValue).to.be.null;
    });

    it('should use configured prefix when calling hasFeature with environment set', () => {
      const getFeatureVariableStub = sinon.stub();
      const getCustomProvider = () => ({ getFeatureVariable: getFeatureVariableStub });
      const config = { environmentKey: 'test', prefix: 'BE_' };
      const flagManager = getFeatureFlagManager('custom', config, defaultFlags, emptyLogger, getCustomProvider);
  
      flagManager.getFeatureVariable('firstFeature', 'testVariable');
  
      expect(getFeatureVariableStub).to.have.been.calledWith('BE_firstFeature');
    });
  });
});