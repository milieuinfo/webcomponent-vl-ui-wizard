/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */


import {LitElement, html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';
// import {render} from 'https://unpkg.com/lit-html@1.2.1/lit-html.js?module';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class WizardPane extends LitElement {
  constructor() {
    super();

    this._whenPaneDefined().then(() => {
      this.__registerActiveObserver();
    });
  }

  async _whenPaneDefined() {
    return customElements.whenDefined('vl-wizard-pane');
  }

  __registerActiveObserver() {
    const component = this;
    const observer = new MutationObserver(async (mutations) => {
      if (mutations.some((mutation) => this.__paneHasBecomeActive(mutation))) {
        // when the pane becomes active
        // --> unhide pane
        // --> update state
        // --> render the component
        component.__wizardPane.removeAttribute('hidden');
        await component.stateChanged();
        component.requestUpdate();
        this.__scrollToTop();
        window.dispatchEvent(new Event('resize'));
      }
      if (mutations.some((mutation) => this.__paneHasBecomeInActive(mutation))) {
        this.__wizardPane.setAttribute('hidden', '');
      }
    });
    const config = {attributeFilter: ['class'], attributeOldValue: true};
    observer.observe(this.__wizardPane, config);
  }

  __paneHasBecomeActive(mutation) {
    return mutation.attributeName === 'class' &&
            mutation.target.classList.contains('is-selected') &&
            mutation.oldValue !== '' &&
            (mutation.oldValue === null || !mutation.oldValue.includes('is-selected'));
  }

  __scrollToTop() {
    window.scrollTo(0, 0);
  }

  __paneHasBecomeInActive(mutation) {
    // observe the classes of the pane, when "not-selected" appears, it means
    // the pane is active
    return mutation.attributeName === 'class' &&
            mutation.target.classList.contains('not-selected') &&
            mutation.oldValue &&
            mutation.oldValue.split(' ').includes('is-selected');
  }

  get __wizardPane() {
    if (this.__pane) {
      return this.__pane;
    }
    const pane = this.closest('vl-wizard-pane');
    if (!pane) {
      throw new Error(
          'When using this class, the component must exist inside a vl-wizard-pane');
    }
    this.__pane = pane;
    return pane;
  }

  set _paneTitle(title) {
    const titleSlot = this.__wizardPane.querySelector('[slot="title"]');
    if (titleSlot) {
      titleSlot.innerHTML = title;
    } else {
      console.warn('No title slot found');
    }
  }


  _renderActions(previousActionLabel, nextActionLabel, onPreviousAction, onNextAction) {
    return html`
        ${this._renderPreviousAction(previousActionLabel, onPreviousAction)}     
        ${this._renderNextAction(nextActionLabel, onNextAction)}         
    `;
  }

  _renderPreviousAction(previousActionLabel, onPreviousAction) {
    return html`
      <button id="previous-action"
              is="vl-button-link" 
              type="button" 
              slot="left"
              @click="${onPreviousAction}">
        <span is="vl-icon" data-vl-icon="arrow-left-fat" data-vl-before></span>
        ${previousActionLabel}
      </button>               
    `;
  }

  _renderNextAction(nextActionLabel, onNextAction) {
    return html`  
      <button id="next-action" 
              is="vl-button" 
              slot="right"
              @click="${onNextAction}">
        ${nextActionLabel}
      </button>             
    `;
  }

  _goNext() {
    this.__wizardPane.next();
  }

  _enableNextPane() {
    this.__wizardPane.enableNextPane();
  }

  _goPrevious() {
    this.__wizardPane.previous();
  }

  get _isPaneActive() {
    try {
      return this.__wizardPane.isActive;
    } catch (ignore) {
      return false; // for unit test purposes
    }
  }
}

window.customElements.define('wizard-pane', WizardPane);
