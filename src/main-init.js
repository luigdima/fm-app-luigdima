import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-icon-button/paper-icon-button.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MainInitGlobals.rootPath);

class MainInit extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          --app-primary-color: #ffffff;
          --app-secondary-color: black;
          --app-drawer-content-container: {
            background-color: #3e495e;
            
          }
          display: block;
        }

        app-drawer-layout:not([narrow]) [drawer-toggle] {
          display: none;
        }

        app-header {
          color: #636363;
          background-color: var(--app-primary-color);
          letter-spacing: 2px;
        }

        app-header paper-icon-button {
          --paper-icon-button-ink-color: white;
        }

        .drawer-list {
          margin: 0 20px;
        }

        .drawer-list a {
          display: block;
          padding: 0 16px;
          text-decoration: none;
          color: #f0f0f0;;
          line-height: 40px;
        }

        .drawer-list a.iron-selected {
          color: black;
          font-weight: bold;
        }

        .logo {
          /* background-color: red; */
          margin-left: 12px;
          margin-top: 20px;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <iron-ajax
        auto
        id="iaApiLogin"
        url="{{apiData.url}}/login"
        content-type="application/json"
        body="{{apiData.credentials}}"
        handle-as="json"
        method="post"
        last-response="{{loginToken}}"
        on-response="__saveToken"
        debounce-duration="300">
      </iron-ajax>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>
            <img class="logo" src="../images/menu_negative_logo_expanded.svg" alt="">
          </app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="accountList" href="[[rootPath]]list">Empresas</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" fixed condenses="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="my-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title id="mainTitle">{{title}}</div>
            </app-toolbar>
          </app-header>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <account-list name="list"></account-list>
            <account-add name="add"></account-add>
            <account-edit name="edit"></account-edit>
            <error-404 name="error404"></error-404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: MainInitGlobals.title,
      },
      page: {
        type: String,
        reflectToAttribute: true,
        observer: '_pageChanged'
      },
      apiData: {
        type: Object,
        value: MainInitGlobals.apiData,
      },
      loginToken: {
        type: Object
      },
      routeData: Object,
      subroute: Object
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  __saveToken(e) {
    if(this.loginToken.token){
      MainInitGlobals.apiData.token = this.loginToken.token;
    }else{
      console.log('none api connect');
    }
  }

  _routePageChanged(page) {
    //Marcamos la página inicial, o bien, si no existe, mostramos error!
    if (!page) {
      this.page = 'list';
    } else if (['list', 'add', 'edit'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'error404';
    }

    
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    switch (page) {
      case 'list':
        import('./account-list.js');
        break;
      case 'add':
        import('./account-add.js');
        break;
      case 'edit':
        import('./account-edit.js');
        break;
      case 'error404':
        import('./error-404.js');
        break;
    }
  }
}

window.customElements.define('main-init', MainInit);
