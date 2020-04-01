import { VlElement, define } from '/node_modules/vl-ui-core/dist/vl-core.js';
import '/node_modules/vl-ui-progress-bar/dist/vl-progress-bar-all.js';
import '/lib/wizard.js';
import './vl-wizard-pane.js';

/**
 * VlWizard
 * @class
 * @classdesc Gebruik de wizard om de gebruiker door een proces met meerdere stappen te begeleiden. Een wizard laat je toe om een complex proces op te splitsen in hapklare acties. Een wizard maakt het ook mogelijk om opties afhankelijk te maken van de keuzes in een voorgaande stap.
 * 
 * @extends VlElement
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-wizard.html|Demo}
 * 
 */
export class VlWizard extends VlElement(HTMLElement) {
    constructor() {
        super(`
            <style>
                @import '/src/style.css';
            </style>
            <section id="vl-wizard-id" class="vl-wizard" data-vl-wizard>
                <header class="vl-wizard__heading" role="none">
                    <slot name="title"></slot>
                    <slot name="header"></slot>
                </header>
                <vl-progress-bar></vl-progress-bar>
                <div class="vl-wizard__panes">
                <slot name="panes"></slot>
                </div>
            </section>
        `);

        this.__callback = {
            callbackFn: Promise.resolve(true)
        };
    }

    async connectedCallback() {
        await this._processPanes();
        this._dress();
    }

    set callback(callback) {
        this.__callback.callbackFn = callback;
    }

    get _panes() {
        return this.querySelectorAll('vl-wizard-pane');
    }

    get _progressBar() {
        return this._shadow.querySelector('vl-progress-bar');
    }

    get _panesContainer() {
        return this._shadow.querySelector('.vl-wizard__panes');
    }

    _getProgressBarStepTemplate(content) {
        return this._template(`
            <vl-progress-bar-step>
                ${content}
            </vl-progress-bar-step>
        `);
    }

    async _processPanes() {
        return customElements.whenDefined('vl-progress-bar-step').then(() => {
            this._panes.forEach(pane => {
                this._progressBar.appendChild(this._getProgressBarStepTemplate(pane.title));
            });
        });
    }

    _dress() {
        setTimeout(() => {
            vl.wizard.dress(this._element, this.__callback, this._panes, this._progressBar.buttons, this._progressBar.element);
        });
    }
}

define('vl-wizard', VlWizard);
