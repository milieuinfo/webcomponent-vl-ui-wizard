import { VlElement, define } from '/node_modules/vl-ui-core/dist/vl-core.js';

/**
 * VlWizardPane
 * @class
 * @classdesc Gebruik de wizard pane om een stap in de wizard voor te stellen.
 * 
 * @extends VlElement
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-wizard.html|Demo}
 * 
 */
export class VlWizardPane extends VlElement(HTMLElement) {
    static get EVENTS() {
        return {
            selected: 'selected'
        };
    }

    constructor() {
        super(`
            <style>
                @import '/src/style.css';

                :host {
                    display: block;
                    width: 100%;
                    height: auto;
                }
            </style>
            <section class="vl-wizard__pane">
                <slot name="title"></slot>
                <slot name="content"></slot>
            </section>
        `);
    }

    connectedCallback() {
        this._processTitle();
        this._processActions();
    }

    get allowStepChange() {
        return this.__allowStepChange;
    }

    set allowStepChange(promise) {
        this.__allowStepChange = promise;
    }

    get title() {
        return this._titleSlot.innerText;
    }

    get _titleSlot() {
        return this.querySelector('[slot="title"]');
    }

    get _previousAction() {
        // TODO select last one
        return this.querySelector('button[is="vl-button-link"]');
    }

    get _nextAction() {
        // TODO select last one
        return this.querySelector('button[is="vl-button"]');
    }

    _processTitle() {
        if (this._titleSlot) {
            this._titleSlot.setAttribute('data-vl-wizard-focus', '');
        }
    }

    _processActions() {
        if (this._previousAction) {
            this._previousAction.setAttribute('data-vl-wizard-prev', '');
        }
        if (this._nextAction) {
            this._nextAction.setAttribute('data-vl-wizard-next', '');
        }
    }

    _dispatchChangeEvent() {
        this.dispatchEvent(new CustomEvent(VlWizardPane.EVENTS.selected));
    }
}

define('vl-wizard-pane', VlWizardPane);
