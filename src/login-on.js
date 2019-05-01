import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/iron-pages/iron-pages.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MainInitGlobals.rootPath);

class LoginOn extends PolymerElement {
    static get template() {
        return html`
        <style>
            :host {
                background-color: var(--background-color, #3e495e);
                width: 100%;
                height: 100%;
                position: absolute;
            }

            .loginCard {
                width: 300px;
                left: 50%;
                margin-left: -150px;
                margin-top: 10%;
                background-color: #3e495e;
                border: none;
                box-shadow: none;
                padding: 0;
            }

            .loginCard .card-content {
                margin-top: 30px;
                padding: 8px;
            }

            .loginCard .card-actions {
                border: none !important;
                padding: 8px !important;
            }

            .loginCard .header {
                width: 300px;
            }

            .loginCard .loginInput {
                color: #ffffff;
                --primary-text-color: #ffffff;
                --paper-input-container-color: ffffff;
                --paper-input-container-focus-color: ffffff;
                --paper-input-container-invalid-color: ffffff;
                border-bottom: 1px solid #BDBDBD;               
            }

            .loginCard .card-actions .loginSubmit {
                width: 100%;
                margin: 0;
                border: 1px solid #ffffff;
                border-radius: 0;
                color: #fff;
                margin-top: 30px;
            }

            #tostadaError {
            --paper-toast-background-color: red;
            --paper-toast-color: white;
            }            
        </style>

        <iron-pages selected="[[page]]" attr-for-selected="name">
            <div name="login">
                <iron-form id="frmLoginOn">
                    <form method="post">
                        <paper-card class="loginCard" image="images/menu_negative_logo_expanded.svg">
                            <div class="card-content">
                                <paper-input name="username" class="loginInput" always-float-label label="Email" type="text" value={{login.username}}>
                                </paper-input>
                                <paper-input name="password" class="loginInput" always-float-label label="Contraseña" type="password" value={{login.password}}>
                                </paper-input>
                            </div>
                            <div class="card-actions">
                                <paper-button raised on-click="__loginOn" class="loginSubmit">
                                    LOG-IN
                                </paper-button>
                            </div>
                        </paper-card>
                    </form>
                </iron-form>
            </div>
            <div name="main">
                <main-init></main-init>
            </div>
        </iron-pages>

        <paper-toast id="tostadaError" positionTarget="absolute" duration="10000" class="fit-bottom"></paper-toast>
    `;
    }

    ready() {
        super.ready();

        this.$.frmLoginOn.addEventListener('iron-form-presubmit', (e) => {
            e.preventDefault();

            firebase.auth().signInWithEmailAndPassword(this.login.username, this.login.password)
            .then((result)=>{
                this.updateStyles({
                    '--background-color': '#eeeeee',
                });

                this.set('login.uid', result.user.uid);

                this.set('page','main');
                import("./main-init.js");
            })
            .catch((error)=>{
                this.$.tostadaError.text = "[" + error.code + "] " + error.message;
                this.$.tostadaError.open();
            });         
        });
    }

    static get properties() {
        return {
            page: {
                type: String,
                reflectToAttribute: true,
                value: "login"
            },
            login: {
                type: Object,
                value: {
                    username: "",
                    password: "",
                    uid: ""
                }
            }
        };
    }

    static get observers() {
        return [
            // '__checkLogin(login.uid)'
        ];
    }

    __loginOn(){
        this.$.frmLoginOn.submit();
    }
}

window.customElements.define('login-on', LoginOn);
