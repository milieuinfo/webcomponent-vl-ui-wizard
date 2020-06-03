const {VlElement} = require('vl-ui-core').Test;
const {By} = require('vl-ui-core').Test.Setup;
const {VlProgressBar} = require('vl-ui-progress-bar').Test;
const VlWizardPane = require('./vl-wizard-pane');

class VlWizard extends VlElement {
  async next() {
    const pane = await this.getActivePane();
    return pane.next();
  }

  async previous() {
    const pane = await this.getActivePane();
    return pane.previous();
  }

  async getTitleSlotElements() {
    const slot = await this.shadowRoot.findElement(By.css('header slot[name="title"]'));
    return this.getAssignedElements(slot);
  }

  async getHeaderSlotElements() {
    const slot = await this.shadowRoot.findElement(By.css('header slot[name="header"]'));
    return this.getAssignedElements(slot);
  }

  async getProgressBar() {
    const element = await this.shadowRoot.findElement(By.css('vl-progress-bar'));
    return new VlProgressBar(this.driver, element);
  }

  async getPanes() {
    const elements = await this.findElements(By.css('vl-wizard-pane'));
    return Promise.all(elements.map((element) => new VlWizardPane(this.driver, element)));
  }

  async getPane(number) {
    const panes = await this.getPanes();
    return panes[--number];
  }

  async getActivePane() {
    const panes = await this.getPanes();
    const isActive = await Promise.all(panes.map((pane) => pane.isActive()));
    return panes.find((pane, index) => isActive[index]);
  }
}

module.exports = VlWizard;
