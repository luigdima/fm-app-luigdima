define(["./login-on.js","./account-add.js"],function(_loginOn,_accountAdd){"use strict";class AccountEdit extends _loginOn.PolymerElement{static get template(){return _loginOn.html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <account-add id="accountEditModuleAdd"></account-add>
    `}}window.customElements.define("account-edit",AccountEdit)});