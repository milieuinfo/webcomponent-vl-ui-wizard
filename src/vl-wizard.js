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
 * @property {boolean} data-vl-next-panes-disabled - Attribuut zorgt ervoor dat de gebruiker niet verder kan naar de volgende stappen.
 * @property {boolean} data-vl-previous-panes-disabled - Attribuut zorgt ervoor dat de gebruiker niet verder kan naar de vorige stappen.
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-wizard.html|Demo}
 * 
 */
export class VlWizard extends VlElement(HTMLElement) {
    static get _observedAttributes() {
        return ['next-panes-disabled', 'previous-panes-disabled'];
    }

    constructor() {
        super(`
            <style>
                @import '/src/style.css';

                .vl-wizard__panes {
                    overflow: hidden;
                }
            </style>
            <section class="vl-wizard" data-vl-wizard>
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

    connectedCallback() {
        this._processPanes();
        this._dress();
    }

    /**
     * Geeft de callback functie die bepaalt of er naar de volgende/vorige pagina mag genavigeerd worden.
     * 
     * @return {Function}
     */
    get callback() {
        return this.__callback;
    }

    /**
     * Callback setter die bepaalt of er naar de volgende/vorige pagina mag genavigeerd worden.
     * 
     * @param {Promise} promise
     */
    set callback(promise) {
        this.__callback.callbackFn = promise;
    }

    /**
     * Navigeer naar de volgende pagina.
     */
    next() {
        this._activePane.next();
    }

    /**
     * Navigeer naar de vorige pagina.
     */
    previous() {
        this._activePane.previous();
    }

    get _panes() {
        return this.querySelectorAll('vl-wizard-pane');
    }

    get _activePane() {
        return [... this._panes].find(pane => pane.isActive);
    }

    get _activePaneNumber() {
        return [... this._panes].findIndex(pane => pane.isActive) + 1;
    }

    get _progressBar() {
        return this._shadow.querySelector('vl-progress-bar');
    }

    _getProgressBarStepTemplate(content) {
        return this._template(`
            <vl-progress-bar-step>
                ${content}
            </vl-progress-bar-step>
        `);
    }

    _processPanes() {
        this._panes.forEach(pane => {
            this._progressBar.appendChild(this._getProgressBarStepTemplate(pane.title));
        });
        this._observeProgressBarClick();
    }

    _dress() {
        setTimeout(() => {
            vl.wizard.dress(this._element, this.callback, this._panes, this._progressBar.buttons, this._progressBar.element);
        });
    }

    _observeProgressBarClick() {
        setTimeout(() => {
            this._progressBar.buttons.forEach(button => button.onclick = (event) => {
                const panes = [... this._panes];
                const number = event.target.getAttribute('data-vl-index');
                if (number < this._activePaneNumber) {
                    const panesBetween = panes.slice(Number(number) - 1, panes.indexOf(this._activePane));
                    const allPanesBetweenAreEnabled = panesBetween.every(pane => !pane.isPreviousPaneDisabled);
                    this.callback = allPanesBetweenAreEnabled ? Promise.resolve(true) : new Promise(() => { });
                } else {
                    const panesBetween = panes.slice(panes.indexOf(this._activePane), Number(number) - 1)
                    const allPanesBetweenAreEnabled = panesBetween.every(pane => !pane.isNextPaneDisabled);
                    this.callback = allPanesBetweenAreEnabled ? Promise.resolve(true) : new Promise(() => { });
                }
            });
        });
    }

    _next_panes_disabledChangedCallback(oldValue, newValue) {
        this._panes.forEach(pane => newValue != undefined ? pane.disableNextPane() : pane.enableNextPane());
    }

    _previous_panes_disabledChangedCallback(oldValue, newValue) {
        this._panes.forEach(pane => newValue != undefined ? pane.disablePreviousPane() : pane.enablePreviousPane());
    }
}

define('vl-wizard', VlWizard);