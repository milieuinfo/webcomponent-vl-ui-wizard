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


// import {LitElement, html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';
import {html, css} from 'https://unpkg.com/lit-element/lit-element.js?module';
// import {render} from 'https://unpkg.com/lit-html@1.2.1/lit-html.js?module';
import {WizardPane} from './wizard-pane.js';


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class WizardPaneOne extends WizardPane {
  // static get styles() {
  //   return css`
  //     :host {
  //       display: block;
  //       border: solid 1px gray;
  //       padding: 16px;
  //       max-width: 800px;
  //     }
  //   `;
  // }

  // static get properties() {
  //   return {
  //     /**
  //      * The name to say "Hello" to.
  //      */
  //     name: {type: String},

  //     /**
  //      * The number of times the button has been clicked.
  //      */
  //     count: {type: Number},
  //   };
  // }

  // constructor() {
  //   super();
  //   this.name = 'World';
  //   this.count = 0;
  // }


  render() {
    console.log('rendering panel 1');
    return html`
      ${this._renderActions(
      'Afmelden',
      'Volgende',
      this._gaNaarVolgende,
      this._gaNaarVolgende)}
    `;
  }

  firstUpdated() {
    super.firstUpdated();
    this._whenPaneDefined().then(() => this._paneTitle = this._titel());
  }

  _titel() {
    return 'panel 1';
  }

  _gaNaarVolgende() {
    this._enableNextPane();
    this._goNext();
  }

  stateChanged() {
    if (this._isPaneActive) {
      console.log('panel 1 statechanged');
    }
  }

  // render() {
  //   return html`
  //     <h1>Hello, ${this.name}!</h1>
  //     <button @click=${this._onClick} part="button">
  //       Click Count: ${this.count}
  //     </button>
  //     <slot></slot>
  //   `;
  // }

  // _onClick() {
  //   this.count++;
  // }
}

window.customElements.define('wizard-pane-one', WizardPaneOne);
