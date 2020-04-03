const VlWizard = require('../components/vl-wizard');
const { By } = require('vl-ui-core').Test.Setup;
const { Page, Config } = require('vl-ui-core').Test;
const { VlCheckbox } = require('vl-ui-checkbox').Test;

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
        let checkboxes = await wizard.findElements(By.css('vl-checkbox'));
        checkboxes = await Promise.all(checkboxes.map(element => new VlCheckbox(this.driver, element)));
        const isChecked = await Promise.all(checkboxes.map(checkbox => checkbox.isChecked()));
        const uncheckedCheckboxes = checkboxes.filter((checkbox, index) => !isChecked[index]);
        await Promise.all(uncheckedCheckboxes.map(checkbox => this.driver.executeScript('return arguments[0].toggle()', checkbox)));
        await progressBarStep1.click();
        await Promise.all(checkboxes.map(checkbox => this.driver.executeScript('return arguments[0].toggle()', checkbox)));
    }
}

module.exports = VlWizardPage;
