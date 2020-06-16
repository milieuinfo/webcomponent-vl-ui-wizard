import {vlElement, define} from '/node_modules/vl-ui-core/dist/vl-core.js';

export class TestComponent extends vlElement(HTMLElement) {
  constructor() {
    super(`
        <style>

        .vl-wizard__panes {
            overflow: hidden;
        }
    </style>
    <section id="sectie">
       <p>Some Content</p>
    </section>
        `);
    console.log('constructor');

    this._whenDefined().then(() => {
      // let foo = this._shadow;
      // let that = this;
      // setInterval(function() { that._addMoreContent(foo)}, 2000)


      this._haalDataOp();
    });
  }

  async _whenDefined() {
    return customElements.whenDefined('test-component');
  }


  connectedCallback() {
    console.log('connectedCallback');

    //   this._addMoreContent(this._shadow);
    //   let foo = this._shadow;
    //   let that = this;

    //   setInterval(function() { that._addMoreContent(foo)}, 2000)
    //   setTimeout(this._addMoreContent,
    //   2000);
  }

  _addMoreContent(element) {
    const sectie = element.querySelector('#sectie');
    const p = document.createElement('p');
    sectie.append('More', p);

    console.log('adding more content');
  }

  _haalDataOp() {
    fetch('data/data.json')
        .then((response) => response.json())
        .then((data) => this._render(data));
  }

  _render(data) {
    const sectie = this._shadow.querySelector('#sectie');
    const codes = data['codes'].map((codes) => codes);
    codes.forEach((element) => {
      const p = document.createElement('p');
      sectie.append(element.code, p);
    });
  }
}

define('test-component', TestComponent);
