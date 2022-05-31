const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const getOptimizelyManager = require('../providers/optimizely');
const emptyLogger = require('../emptyLogger');

chai.use(sinonChai)
const { expect } = chai;

const config = {
  userProperties: [
    'organization',
    'businessUnit',
    'country',
    'site',
    'isCoach',
    'isOrganizationAdmin',
    'isBusinessUnitAdmin',
    'isSiteAdmin',
    'canDoFinancialValidation',
  ]
} 

describe('Feature Flag Manager: Optimizely Provider', () => {
  describe('hasFeature', () => {
    const flagManager = {}

    beforeEach(() => {
      flagManager.isFeatureEnabled = sinon.stub().returns(true);
    });

    it('Should send the proper userId when using account object', () => {
      const user = { _id: 'testId', organization: 'orgId' }
      const optimizelyManager = getOptimizelyManager({}, emptyLogger, flagManager);

      const featureFlag = optimizelyManager.hasFeature('test', user)

      expect(flagManager.isFeatureEnabled).to.be.called
      expect(flagManager.isFeatureEnabled).to.be.calledWith('test', 'testId')
      expect(featureFlag).to.be.true
    });

    it('Should send correct user properties when present', () => {
      const optimizelyManager = getOptimizelyManager(config, emptyLogger, flagManager);

      const featureFlag = optimizelyManager.hasFeature('test', {
        _id: 'testId',
        organization: 'orgId',
        site: { _id: 'siteId' },
        country: 3,
        isCoach: true,
        isSiteAdmin: false,
        randomStuff: 'yes',
      });
  
      expect(flagManager.isFeatureEnabled).to.be.called;
      expect(flagManager.isFeatureEnabled).to.be.calledWith('test', 'testId', {
        organization: 'orgId',
        site: 'siteId',
        country: 3,
        isCoach: true,
        isSiteAdmin: false,
      });
      expect(featureFlag).to.be.true;
    });

    it('Should send correct user properties when not present', () => {
      const optimizelyManager = getOptimizelyManager(config, emptyLogger, flagManager);

      const featureFlag = optimizelyManager.hasFeature('test', { _id: 'testId' });

      expect(flagManager.isFeatureEnabled).to.be.called;
      expect(flagManager.isFeatureEnabled).to.be.calledWithExactly('test', 'testId', {});
      expect(featureFlag).to.be.true;
    });

    it('Should send correct user properties when userProperties is not defined', () => {
      const optimizelyManager = getOptimizelyManager({}, emptyLogger, flagManager);

      const featureFlag = optimizelyManager.hasFeature('test', {
        id: 'testId',
        organization: 'orgId',
        site: { _id: 'siteId' },
      });

      expect(flagManager.isFeatureEnabled).to.be.called;
      expect(flagManager.isFeatureEnabled).to.be.calledWithExactly('test', 'testId', {});
      expect(featureFlag).to.be.true;
    });
  });
});