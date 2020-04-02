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

    async reset() {
        await this._resetWizard();
        await this._resetCheckboxWizard();
    }

    async _resetWizard() {
        const wizard = await this.getWizard();
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        await progressBarStep1.click();
    }

    async _resetCheckboxWizard() {
        const wizard = await this.getCheckboxWizard();
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        const checkboxes = await wizard.findElements(By.css('vl-checkbox'));
        checkboxes.filter(checkbox => !checkbox.checked).forEach(checkbox => checkbox.toggle());
        await progressBarStep1.click();
        checkboxes.filter(checkbox => checkbox.checked).forEach(checkbox => checkbox.toggle());
    }
}

module.exports = VlWizardPage;
