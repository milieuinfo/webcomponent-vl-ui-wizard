const VlWizard = require('../components/vl-wizard');
const { Page, Config } = require('vl-ui-core').Test;

class VlWizardPage extends Page {
    async getWizard() {
        return this._getWizard('#vl-wizard');
    }

    async getCheckboxWizard() {
        return this._getWizard('#vl-wizard-checkbox');
    }

    async _getWizard(selector) {
        return new VlWizard(this.driver, selector);
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-wizard.html');
    }
}

module.exports = VlWizardPage;
