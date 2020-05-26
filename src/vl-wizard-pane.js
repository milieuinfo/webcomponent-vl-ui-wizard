import { VlElement, define } from '/node_modules/vl-ui-core/dist/vl-core.js';
import '/node_modules/vl-ui-grid/dist/vl-grid.js';
import '/node_modules/vl-ui-action-group/dist/vl-action-group.js';

/**
 * VlWizardPane
 * @class
 * @classdesc Gebruik de wizard pane om een stap in de wizard voor te stellen.
 * 
 * @extends VlElement
 * 
 * @property {boolean} data-vl-next-pane-disabled - Attribuut zorgt ervoor dat de gebruiker niet verder kan naar de volgende stap.
 * @property {boolean} data-vl-previous-pane-disabled - Attribuut zorgt ervoor dat de gebruiker niet terug kan naar de vorige stap.
 * 
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/releases/latest|Release notes}
 * @see {@link https://www.github.com/milieuinfo/webcomponent-vl-ui-wizard/issues|Issues}
 * @see {@link https://webcomponenten.omgeving.vlaanderen.be/demo/vl-wizard.html|Demo}
 * 
 */
export class VlWizardPane extends VlElement(HTMLElement) {
    constructor() {
        super(`
            <style>
                @import '/src/style.css';
                @import '/node_modules/vl-ui-action-group/dist/style.css';
                @import '/node_modules/vl-ui-grid/dist/style.css';

                :host {
                    width: 100%;
                }

                slot[name="previous-action"], slot[name="next-action"] {
                    display: inline-block;
                }
            </style>
            <section class="vl-wizard__pane">
                <slot name="title"></slot>
                <div is="vl-grid" is-stacked>
                    <div is="vl-column" size="12">
                        <slot name="content"></slot>
                    </div>
                    <div id="actions-column" is="vl-column" size="12">
                        <div is="vl-action-group">
                            <slot name="previous-action"></slot>
                            <slot name="next-action"></slot>
                        </div>
                    </div>
                </div>
            </section>
        `);
    }

    connectedCallback() {
        this._processActions();
        this._observeActionsClick();
    }

    /**
     * Geeft terug of de pagina actief is.
     * 
     * @return {Boolean}
     */
    get isActive() {
        return this.classList.contains('is-selected') && !this.classList.contains('not-selected');
    }

    /**
     * Geeft de titel van de pagina terug.
     * 
     * @return {String}
     */
    get title() {
        return this._titleSlot ? this._titleSlot.innerText : undefined;
    }

    /**
     * Geeft terug of de volgende pagina bereikt mag worden.
     * 
     * @return {Boolean}
     */
    get isNextPaneDisabled() {
        return this.hasAttribute('data-vl-next-pane-disabled');
    }

    /**
     * Geeft terug of de vorige pagina bereikt mag worden
     * 
     * @return {Boolean}
     */
    get isPreviousPaneDisabled() {
        return this.hasAttribute('data-vl-previous-pane-disabled');
    }

    /**
     * Sta navigatie naar de volgende pagina toe.
     */
    enableNextPane() {
        this._setNextPaneDisabledAttribute(false);
        this._wizard.callback = Promise.resolve();
    }

    /**
     * Blokkeer navigatie naar de volgende pagina.
     */
    disableNextPane() {
        this._setNextPaneDisabledAttribute(true);
        this._wizard.callback = new Promise(() => { });
    }

    /**
     * Sta navigatie naar de vorige pagina toe
     */
    enablePreviousPane() {
        this._setPreviousPaneDisabledAttribute(false);
        this.removeAttribute('data-vl-previous-pane-disabled');
        this._wizard.callback = Promise.resolve(true);
    }

    /**
     * Blokkeer navigatie naar de vorige pagina.
     */
    disablePreviousPane() {
        this._setPreviousPaneDisabledAttribute(true);
        this._wizard.callback = new Promise(() => { });
    }

    /**
     * Navigeer naar de volgende pagina.
     */
    next() {
        this._nextAction.click();
    }

    /**
     * Navigeer naar de vorige pagina.
     */
    previous() {
        this._previousAction.click();
    }

    get _titleSlot() {
        return this.querySelector('[slot="title"]');
    }

    get _actionsColumn() {
        return this._shadow.querySelector('#actions-column');
    }

    get _nextActionSlot() {
        return this.querySelector('[slot="next-action"]');
    }

    get _nextActionSlotPlaceholder() {
        return this._shadow.querySelector('slot[name="next-action"]');
    }

    get _previousActionSlot() {
        return this.querySelector('[slot="previous-action"]');
    }

    get _previousActionSlotPlaceholder() {
        return this._shadow.querySelector('slot[name="previous-action"]');
    }

    get _previousAction() {
        const slot = this._previousActionSlotPlaceholder;
        if (slot && slot.assignedElements() && slot.assignedElements().length > 0) {
            return slot.assignedElements()[0];
        }
    }

    get _nextAction() {
        const slot = this._nextActionSlotPlaceholder;
        if (slot && slot.assignedElements() && slot.assignedElements().length > 0) {
            return slot.assignedElements()[0];
        }
    }

    get _wizard() {
        return this.closest('vl-wizard');
    }

    _setNextPaneDisabledAttribute(value) {
        this.toggleAttribute('data-vl-next-pane-disabled', value);
    }

    _setPreviousPaneDisabledAttribute(value) {
        this.toggleAttribute('data-vl-previous-pane-disabled', value);
    }

    _prepareActions() {
        if (!this._previousActionSlot && !this._nextActionSlot) {
            this._actionsColumn.hidden = true;
        }
        if (!this._previousActionSlot) {
            this._previousActionSlotPlaceholder.hidden = true;
            this.insertAdjacentHTML('beforeend', `
                <button type="button" slot="previous-action" hidden></button>
            `);
        }
        if (!this._nextActionSlot) {
            this._nextActionSlotPlaceholder.hidden = true;
            this.insertAdjacentHTML('beforeend', `
                <button type="button" slot="next-action" hidden></button>
            `);
        }
    }

    _processActions() {
        this._prepareActions();
        if (this._previousAction) {
            this._previousAction.setAttribute('data-vl-wizard-prev', '');
        }
        if (this._nextAction) {
            this._nextAction.setAttribute('data-vl-wizard-next', '');
        }
    }

    _observeActionsClick() {
        const nextAction = this._nextAction;
        const previousAction = this._previousAction;
        if (previousAction) {
            this._previousAction.addEventListener('click', () => {
                this.isPreviousPaneDisabled ? this.disablePreviousPane() : this.enablePreviousPane();
            });
        }
        if (nextAction) {
            this._nextAction.addEventListener('click', () => {
                this.isNextPaneDisabled ? this.disableNextPane() : this.enableNextPane();
            });
        }
    }
}

define('vl-wizard-pane', VlWizardPane);
