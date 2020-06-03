const {VlElement} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;

class VlWizardPane extends VlElement {
  async next() {
    const action = await this._getNextAction();
    return action.click();
  }

  async previous() {
    const action = await this._getPreviousAction();
    return action.click();
  }

  async isActive() {
    return this.hasClass('is-selected');
  }

  async getTitleSlotElements() {
    const slot = await this.shadowRoot.findElement(By.css('slot[name="title"]'));
    return this.getAssignedElements(slot);
  }

  async getContentSlotElements() {
    const slot = await this.shadowRoot.findElement(By.css('slot[name="content"]'));
    return this.getAssignedElements(slot);
  }

  async _getNextAction() {
    return this.findElement(By.css('[data-vl-wizard-next]'));
  }

  async _getPreviousAction() {
    return this.findElement(By.css('[data-vl-wizard-prev]'));
  }
}

module.exports = VlWizardPane;
