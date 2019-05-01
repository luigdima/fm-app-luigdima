define(["./login-on.js"],function(_loginOn){"use strict";class MyView404 extends _loginOn.PolymerElement{static get template(){return _loginOn.html`
      <style>
        :host {
          display: block;

          padding: 10px 20px;
        }
      </style>

      Oops you hit a 404. <a href="[[rootPath]]">Head back to home.</a>
    `}}window.customElements.define("my-view404",MyView404)});