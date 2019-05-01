import{PolymerElement,html}from"./login-on.js";import"./account-add.js";class AccountEdit extends PolymerElement{static get template(){return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <account-add id="accountEditModuleAdd"></account-add>
    `}}window.customElements.define("account-edit",AccountEdit);