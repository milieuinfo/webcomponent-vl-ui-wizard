const VlWizard = require('../components/vl-wizard');
const { By } = require('vl-ui-core').Test.Setup;
const { Page, Config } = require('vl-ui-core').Test;
const { VlCheckbox } = require('vl-ui-checkbox').Test;

class VlWizardPage extends Page {
    async getWizard() {
        return this._getWizard('#vl-wizard');
    }

    async getDisabledWizard() {
        return this._getWizard('#vl-wizard-disabled');
    }

    async getDisabledAttributeWizard() {
        return this._getWizard('#vl-wizard-disabled-attribute');
    }

    async getProgressBarTitleWizard() {
        return this._getWizard('#vl-wizard-progress-bar-title');
    }

    async _getWizard(selector) {
        return new VlWizard(this.driver, selector);
    }

    async load() {
        await super.load(Config.baseUrl + '/demo/vl-wizard.html');
    }

    async reset() {
        await this._resetWizard();
        await this._resetDisabledWizard(await this.getDisabledWizard());
        await this._resetDisabledWizard(await this.getDisabledAttributeWizard());
    }

    async _resetWizard() {
        const wizard = await this.getWizard();
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        await progressBarStep1.click();
    }

    async _resetDisabledWizard(wizard) {
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        const panes = await wizard.getPanes();
        let checkboxes = (await Promise.all(panes.map(pane => pane.findElements(By.css('vl-checkbox'))))).flat();
        checkboxes = await Promise.all(checkboxes.map(element => new VlCheckbox(this.driver, element)));
        const inputs = await Promise.all(checkboxes.map(checkbox => checkbox.shadowRoot.findElement(By.css('input'))));
        await Promise.all(inputs.map(input => this.driver.executeScript('return arguments[0].checked = true;', input)));
        await progressBarStep1.click();
        await Promise.all(inputs.map(input => this.driver.executeScript('return arguments[0].checked = false;', input)));
    }

    async _resetDisabledWizard(wizard) {
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
