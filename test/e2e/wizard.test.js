const { assert, driver, By } = require('vl-ui-core').Test.Setup;
const { VlH2, VlH3 } = require('vl-ui-titles').Test.VlTitles;
const { VlElement } = require('vl-ui-core').Test;
const VlWizardPage = require('./pages/vl-wizard.page');

describe('vl-wizard', async () => {
    const vlWizardPage = new VlWizardPage(driver);

    before(() => {
        return vlWizardPage.load();
    });

    afterEach(async () => {
        await vlWizardPage.reset();
    });

    it('als gebruiker kan ik de titel en header van de wizard zien', async () => {
        const wizard = await vlWizardPage.getWizard();
        const titleSlotElements = await wizard.getTitleSlotElements();
        const headerSlotElements = await wizard.getHeaderSlotElements();
        const title = await new VlH2(driver, titleSlotElements[0]);
        const header = await new VlElement(driver, headerSlotElements[0]);
        await assert.eventually.isTrue(title.isH(2));
        await assert.eventually.equal(title.getText(), 'Wizard title');
        await assert.eventually.equal(header.getText(), "You're a wizard Harry");
    });

    it('als gebruiker kan ik alleen het actief paneel van de wizard zien', async () => {
        const wizard = await vlWizardPage.getWizard();
        const pane1 = await wizard.getPane(1);
        const pane2 = await wizard.getPane(2);
        const pane3 = await wizard.getPane(3);
        const pane4 = await wizard.getPane(4);
        await assert.eventually.isTrue(pane1.isActive());
        await assert.eventually.isFalse(pane2.isActive());
        await assert.eventually.isFalse(pane3.isActive());
        await assert.eventually.isFalse(pane4.isActive());
    });

    it('als gebruiker kan ik via de progress bar doorheen de wizard panelen navigeren', async () => {
        const wizard = await vlWizardPage.getWizard();
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        const progressBarStep2 = await progressBar.getStep(2);
        const progressBarStep3 = await progressBar.getStep(3);
        const progressBarStep4 = await progressBar.getStep(4);
        await assert.eventually.isTrue(progressBarStep1.isActive());
        await assert.eventually.isFalse(progressBarStep2.isActive());
        await assert.eventually.isFalse(progressBarStep3.isActive());
        await assert.eventually.isFalse(progressBarStep4.isActive());
        let pane = await wizard.getActivePane();
        let title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 1');

        await progressBarStep2.click();
        await assert.eventually.isFalse(progressBarStep1.isActive());
        await assert.eventually.isTrue(progressBarStep2.isActive());
        await assert.eventually.isFalse(progressBarStep3.isActive());
        await assert.eventually.isFalse(progressBarStep4.isActive());
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 2');

        await progressBarStep3.click();
        await assert.eventually.isFalse(progressBarStep1.isActive());
        await assert.eventually.isFalse(progressBarStep2.isActive());
        await assert.eventually.isTrue(progressBarStep3.isActive());
        await assert.eventually.isFalse(progressBarStep4.isActive());
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 3');

        await progressBarStep4.click();
        await assert.eventually.isFalse(progressBarStep1.isActive());
        await assert.eventually.isFalse(progressBarStep2.isActive());
        await assert.eventually.isFalse(progressBarStep3.isActive());
        await assert.eventually.isTrue(progressBarStep4.isActive());
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 4');
    });

    it('als gebruiker kan ik via de acties doorheen de wizard panelen navigeren', async () => {
        const wizard = await vlWizardPage.getWizard();
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 1');

        await wizard.next();
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 2');

        await wizard.previous();
        pane = await wizard.getActivePane();
        title = await new VlH3(driver, (await pane.getTitleSlotElements())[0]);
        await assert.eventually.equal(title.getText(), 'Stap 1');
    });

    it('als gebruiker kan ik via de actie knoppen alleen door de panelen van de wizard navigeren wanneer ik de checkbox aanzet', async () => {
        const wizard = await vlWizardPage.getCheckboxWizard();
        const pane1 = await wizard.getPane(1);
        const pane2 = await wizard.getPane(2);
        const pane3 = await wizard.getPane(3);

        let activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane1));
        await wizard.next();
        await activePane.equals(pane1);
        let content = (await activePane.getContentSlotElements())[0];
        let checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-1-next'));

        await checkbox.click();
        await wizard.next();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane2));
        await wizard.previous();
        await activePane.equals(pane2);
        await wizard.next();
        await assert.eventually.isTrue(activePane.equals(pane2));
        content = (await activePane.getContentSlotElements())[0];
        checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-2-previous'));

        await checkbox.click();
        await wizard.previous();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane1));
        await wizard.next();
        activePane = await wizard.getActivePane();
        content = (await activePane.getContentSlotElements())[0];
        checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-2-next'));

        await checkbox.click();
        await wizard.next();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane3));
    });

    it('als gebruiker kan ik via de progress bar alleen door de panelen van de wizard navigeren wanneer ik de checkbox aanzet', async () => {
        const wizard = await vlWizardPage.getCheckboxWizard();
        const progressBar = await wizard.getProgressBar();
        const progressBarStep1 = await progressBar.getStep(1);
        const progressBarStep2 = await progressBar.getStep(2);
        const progressBarStep3 = await progressBar.getStep(3);
        const pane1 = await wizard.getPane(1);
        const pane2 = await wizard.getPane(2);
        const pane3 = await wizard.getPane(3);

        let activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane1));
        await progressBarStep2.click();
        await activePane.equals(pane1);
        let content = (await activePane.getContentSlotElements())[0];
        let checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-1-next'));

        await checkbox.click();
        await progressBarStep2.click();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane2));
        await progressBarStep1.click();
        await activePane.equals(pane2);
        await progressBarStep3.click();
        await assert.eventually.isTrue(activePane.equals(pane2));
        content = (await activePane.getContentSlotElements())[0];
        checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-2-previous'));

        await checkbox.click();
        await progressBarStep1.click();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane1));
        await progressBarStep2.click();
        activePane = await wizard.getActivePane();
        content = (await activePane.getContentSlotElements())[0];
        checkbox = await content.findElement(By.css('#vl-wizard-checkbox-pane-2-next'));
        
        await checkbox.click();
        await progressBarStep3.click();
        activePane = await wizard.getActivePane();
        await assert.eventually.isTrue(activePane.equals(pane3));
    });
});
