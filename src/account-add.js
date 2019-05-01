import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-button/paper-button.js';
import '@luigdima/google-map/google-map.js';
import '@luigdima/google-map/google-map-marker.js';
import '@polymer/gold-phone-input/gold-phone-input.js';
import '@vaadin/vaadin-select/vaadin-select.js';
import '@vaadin/vaadin-select/theme/material/vaadin-select.js';

import './shared-styles.js';

class AccountAdd extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
          --paper-input-container-input: {
            font-size: 13px;
          };
        }

        #tostadaSuccess {
          --paper-toast-background-color: green;
          --paper-toast-color: white;
        }

        #tostadaError {
          --paper-toast-background-color: red;
          --paper-toast-color: white;
        }

        paper-toast {
          z-index: 9999;
          position: absolute !important;
          left: 0 !important;
        }

        .moreItems {
          width: 100%;
          border: 1px;
          border-style: dashed;
          margin-top: 20px;
        }

        h2 {
          font-size: 16px;
          font-weight: 400;
          border-left: 2px solid;
          padding-left: 8px;
          border-bottom: 1px solid;
          border-bottom-style: dotted;
          padding-bottom: 3px;
          background-color: #eee;
          padding-top: 5px;
        }

        h2:nth-of-type(2) {
          margin-top: 48px;
        }

        .botonCrear {
          margin-bottom: 4px;
          margin-top: 2px;
          color: blue;
        }

        .handler {
          color: var(--paper-blue-grey-200);
          line-height: 58px;
          width: 20px;
          padding: 0;
          margin: 0;
        }

        .delete {
          color: var(--paper-blue-grey-200);
          line-height: 58px;
          width: 20px;
          padding: 0;
          margin: 0;
        }

        .zonaAcciones {
          padding-top: 10px;
          float: left;
          padding-bottom: 21px;
          width: 100%;
        }

        .zonaAcciones paper-button {
          float: right;
          background-color: var(--paper-teal-500);
          color: #ffffff;
          font-size: 13px;
          padding-right: 12px;
          padding-bottom: 4px;
          padding-top: 4px;
          margin-top: 2px;
        }

        .zonaAcciones paper-button.save {
          background-color: var(--paper-green-400);
        }

        .zonaAcciones paper-button.cancel {
          background-color: var(--paper-red-400);
        }

        .zonaAcciones paper-button iron-icon {
          padding-right: 2px;
          width: 20px;
        }

        .list-group table {
          padding-bottom: 30px;
        }

        .tdTitle {
          color: #3e495e;
          padding-bottom: 8px;
          padding-top: 8px;
        }

        /* vaadin-item {
          font-size: 13px !important;
        } */

        vaadin-select {
          width: 100%;
          padding-top: 20px;
        }
    </style>

      <iron-ajax
          id="iaNuevaEmpresa"
          url="{{apiData.url}}/accounts"
          method="POST"
          handle-as="json"
          on-response="__retornoPost"
          on-error="__onError"
          debounce-duration="300">
      </iron-ajax>

      <iron-ajax
          id="iaEditarEmpresa"
          url="{{apiData.url}}/accounts{{subroute.path}}"
          method="PUT"
          handle-as="json"
          on-response="__retornoPost"
          on-error="__onError"
          debounce-duration="300">
      </iron-ajax>      

      <iron-ajax
        id="iaListaTipos"
        url="{{apiData.url}}/accountTypes"
        method="GET"
        handle-as="json"
        last-response="{{listadoTipos}}"
        debounce-duration="300">
      </iron-ajax>

      <iron-ajax
        id="iaShowAccount"
        url="{{apiData.url}}/accounts{{subroute.path}}"
        handle-as="json"
        method="get"
        last-response="{{account}}"
        on-response="__datosCarga"
        debounce-duration="300">
      </iron-ajax>   

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>      

      <div class="zonaAcciones">
        <paper-button raised on-click="__guardarDatos" class="save"><iron-icon icon="add"></iron-icon>GUARDAR</paper-button>
        <a href="[[rootPath]]list">
          <paper-button raised class="cancel"><iron-icon icon="clear"></iron-icon>CANCELAR</paper-button>
        </a>
      </div>

      <paper-card class="card">
        <div class="card-content">
          <iron-form id="frmNuevaEmpresa">
            <form method="post">
              <div id="records" class="list-group">
                <div class="list-group-item" >
                  <table width="100%">
                    <tr>
                      <td class="tdTitle">INFORMACIÓN</td>
                    </tr>
                    <tr>
                      <td width="50%">
                        <paper-input name="name" required always-float-label label="Nombre empresa*" type="text" value={{datosFormulario.name}}></paper-input>
                      </td>
                      <td width="50%">
                        <paper-input name="salesRepId1" required always-float-label label="Responsable*" type="number" value={{datosFormulario.salesRepId1}}></paper-input>
                      </td>
                    </tr>
                    <tr>
                      <td width="50%">
                        <vaadin-select class="vselect" label="Tipo empresa" theme="small" required value="{{datosFormulario.typeId}}">
                            <template>
                              <vaadin-list-box class="listabox">
                                <template is="dom-repeat" items="{{listadoTipos}}">
                                  <vaadin-item class="itemm" value="{{item.id}}">{{item.descriptionES}}</vaadin-item>
                                </template>
                              </vaadin-list-box>
                            </template>
                          </vaadin-select>
                      </td>                        
                      <td width="50%">
                        <paper-input name="comment" always-float-label label="Comentarios" type="text"value={{datosFormulario.comment}}></paper-input>
                      </td>
                    </tr>
                  </table>

                  <table width="100%">
                    <tr>
                      <td class="tdTitle">DATOS DE CONTACTO</td>
                    </tr>
                    <tr>
                      <td width="33%">
                        <gold-phone-input
                            name="phone"
                            always-float-label 
                            label="Teléfono 1" 
                            value={{datosFormulario.phone}}
                            country-code="34"
                            phone-number-pattern="XXXXXXXXX"
                            auto-validate>
                        </gold-phone-input>
                      </td>
                      <td width="33%">
                        <gold-phone-input
                          name="phone2"
                          always-float-label 
                          label="Teléfono 2" 
                          value={{datosFormulario.phone2}}
                          country-code="34"
                          phone-number-pattern="XXXXXXXXX"
                          auto-validate>
                        </gold-phone-input>
                      </td>
                      <td width="33%">
                        <gold-phone-input
                          name="phone3"
                          always-float-label 
                          label="Teléfono 3" 
                          value={{datosFormulario.phone3}}
                          country-code="34"
                          phone-number-pattern="XXXXXXXXX"
                          auto-validate>
                        </gold-phone-input>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="1">
                        <paper-input name="email" always-float-label label="Email" type="email" value={{datosFormulario.email}}></paper-input>
                      </td>
                      <td colspan="2">
                        <paper-input name="website" always-float-label label="Web" type="text" value={{datosFormulario.website}}></paper-input>
                      </td>
                    </tr>
                  </table>  
                  <table width="100%">
                    <tr>
                      <td class="tdTitle">DIRECCIÓN</td>
                    </tr>
                    <tr>
                      <td width="33%">
                        <paper-input name="address1" always-float-label label="Dirección" type="text" value={{datosFormulario.address1}}></paper-input>
                      </td>
                      <td width="33%">
                        <paper-input name="city" always-float-label label="Ciudad" type="text" value={{datosFormulario.city}}></paper-input>
                      </td>
                      <td width="33%">
                        <paper-input name="region" always-float-label label="Región" type="text" value={{datosFormulario.region}}></paper-input>
                      </td>                                              
                    </tr>
                    <tr>
                      <td width="33%">
                        <paper-input name="latitude" always-float-label label="Latitud" type="text" value={{datosFormulario.latitude}}></paper-input>
                      </td>
                      <td width="33%">
                        <paper-input name="longitude" always-float-label label="Longitud" type="text" value={{datosFormulario.longitude}}></paper-input>
                      </td>                        
                  
                      <td width="33%">
                        <paper-input name="postcode" always-float-label label="Código postal" type="number" value={{datosFormulario.postcode}}></paper-input>
                      </td>                      
                    </tr>
                    <tr>
                      <td colspan="3">
                        <br>
                        <google-map style="width:100%;height:400px;" fit-to-markers api-key="AIzaSyCTnOITjcRMP9o6un_oPJ4Dh_NcFqtjqjo" latitude="{{coords.latitud}}" longitude="{{coords.longitud}}">
                          <google-map-marker id="mapMarker" clickEvents="true" dragEvents="true" latitude="{{coords.latitud}}" longitude="{{coords.longitud}}" draggable="true"></google-map-marker>
                        </google-map>
                      </td>
                    </tr>
                  </table>                    
                </div>
              </div>
            </form>
          </iron-form>
        </div>
      </paper-card>
      
      <paper-toast id="tostadaError" positionTarget="absolute" duration="10000" class="fit-bottom" text="{{codeTostada}}">{{textoTostada}}</paper-toast>
      <paper-toast id="tostadaSuccess" duration="10000" class="fit-bottom" text="{{codeTostada}}">{{textoTostada}}</paper-toast>
    `;
  }

  ready() {
    super.ready();
    
    this.__callListaTipos();

    //@@note: Generamos el event para marcar direcciones en el mapa cuando el 'marker' se mueva
    this.$.mapMarker.addEventListener('longitude-changed', (e) => {
      this.$.mapMarker.getAddress();
      setTimeout(() => {
        this.__setDatosFormularioGPS();
      }, 500);
    });
 
    //@@note: Cargamos en global los datos geolocalización (llamamos al callback)
    navigator.geolocation.getCurrentPosition(this.__guardaGeo);
    //@@note: Cargamos los [globales] en [properties] internas
    this.__recopilaGeo();

    //@@note: Lanzamos el 'event' sobre el formulario
    this.$.frmNuevaEmpresa.addEventListener('iron-form-presubmit', (event)=>{
      event.preventDefault();

      //Revisamos el objeto
      var objetoFormulario = this.datosFormulario;

      //Formatamos los elementos a su tipo
      objetoFormulario.typeId = parseInt(objetoFormulario.typeId);
      objetoFormulario.salesRepId1 = parseInt(objetoFormulario.salesRepId1);
      objetoFormulario.latitude = parseFloat(objetoFormulario.latitude);
      objetoFormulario.longitude = parseFloat(objetoFormulario.longitude);

      //@@fix: Comprobamos que debemos de cargar, si add, o edit.
      switch(this.routeData.page){
        case "add":
          var t = this.$.iaNuevaEmpresa;          
        break;
        case "edit":
          var t = this.$.iaEditarEmpresa;          
        break;
      }
      
      t.body = JSON.stringify(objetoFormulario);
      t.headers = {
        "x-session-key": MainInitGlobals.apiData.token
      }

      //@@fix: Cargamos los datos del request
      t.generateRequest();
    });
  }

  static get properties() {
    return {      
      title: {
        type: String,
        value: "AÑADIR EMPRESA"
      },
      titleEdit: {
        type: String,
        value: "EDITAR EMPRESA"
      },
      seleccionado: Object,
      account: Object,
      routeData: Object,
      subroute: Object,      
      apiData: {
        type: Object,
        value: MainInitGlobals.apiData,
      },
      listadoTipos: Object,
      datosFormulario: {
        type: Object,
        value: {
          address1: "",
          address2: "",
          city: "",
          region: "",
          comment: "",
          email: "",
          name: "",
          phone: "",
          phone2: "",
          phone3: "",
          postcode: "",
          salesRepId1: 103,
          typeId: "40",
          website: "",
          latitude: 0,
          longitude: 0
        }
      },
      coords: {
        type: Object,
        value: {
          latitud: "41.5578478",
          longitud: "2.002487"
        }
      },
      textoTostada: {
        type: String,
        value: "Error desconocido, contacta con servicio técnico."
      },
      codeTostada: {
        type: String,
        value: "No code! :("
      }
    };
  }

  static get observers() {
    return [
      '__changeTitle(routeData.page)', 
      '__actionPage(routeData.page)'
    ];
  }

  /*
  @@@@ ACIONES DE CAMBIO [PAGE]  
  */

  __changeTitle(page){
    var a = $($('body').children("login-on")[0].shadowRoot)
      .children("iron-pages");
    var b = $($(a)[0].children.main).children("main-init");

    switch(page){
      case "add":
        b[0].title = this.title;
      break;
      case "edit":
        b[0].title = this.title;
      break;
    }
  }

  __actionPage(page){
    switch(page){
      case "add":
        this.__limpiarFormulario();
      break;
      case "edit":
        this.__callEmpresa();          
      break;
    }
  }

  /*
  @@@@ PREPARACIÓN DE FORMULARIO
  */

  __limpiarFormulario(){
    this.$.frmNuevaEmpresa.reset();

    var datosFormularioLimpios = {
        address1: "",
        address2: "",
        city: "",
        region: "",
        comment: "",
        email: "",
        name: "",
        phone: "",
        phone2: "",
        phone3: "",
        postcode: "",
        salesRepId1: 103,
        typeId: "",
        website: "",
        latitude: 0,
        longitude: 0
    };

    this.set("datosFormularios",datosFormularioLimpios);
    this.__setDatosFormularioGPS();
  }

  __datosCarga(){    
    //Seteamos a 0 / nulos todos los elementos 
    this.datosFormulario.address1 = '';
    this.datosFormulario.address2 = '';
    this.datosFormulario.city = '';
    this.datosFormulario.region = '';
    this.datosFormulario.comment = '';
    this.datosFormulario.email = '';
    this.datosFormulario.name = '';
    this.datosFormulario.phone = '';
    this.datosFormulario.phone2 = '';
    this.datosFormulario.phone3 = '';
    this.datosFormulario.postcode = '';
    this.datosFormulario.salesRepId1 = 103;
    this.datosFormulario.typeId = '';
    this.datosFormulario.website = '';
    this.datosFormulario.latitude = '';
    this.datosFormulario.longitude = '';
    this.coords.latitud = '';
    this.coords.longitud = '';

    console.log(this.account);

    if(this.account){
      this.set('datosFormulario.address1',this.account.address1);
      this.set('datosFormulario.address2',this.account.address2);
      this.set('datosFormulario.city',this.account.city);
      this.set('datosFormulario.region',this.account.region);
      this.set('datosFormulario.comment',this.account.comment);
      this.set('datosFormulario.email',this.account.email);
      this.set('datosFormulario.name',this.account.name);
      this.set('datosFormulario.phone',this.account.phone);
      this.set('datosFormulario.phone2',this.account.phone2);
      this.set('datosFormulario.phone3',this.account.phone3);
      this.set('datosFormulario.postcode',this.account.postcode);
      this.set('datosFormulario.salesRepId1',this.account.salesRepId1.id);
      this.set('datosFormulario.typeId',this.account.typeId.id);
      this.set('datosFormulario.website',this.account.website);
      this.set('datosFormulario.latitude',this.account.latitude);
      this.set('datosFormulario.longitude',this.account.longitude);   
      
      this.set('coords.latitud',this.account.latitude.toString());
      this.set('coords.longitud',this.account.longitude.toString());
    }else{
      setTimeout(() => {
        this.__datosCarga();
      }, 20);
    }
    
  }

  /*
  @@@@ GEOLOCALIZACIONES
  */

  __guardaGeo(position) {
    MainInitGlobals.coords = position.coords;   
  }

  __recopilaGeo(){
    setTimeout(() => {
      if(MainInitGlobals.coords){
        this.coords.latitud = MainInitGlobals.coords.latitude.toString();
        this.coords.longitud = MainInitGlobals.coords.longitude.toString();
      }else{
        this.__recopilaGeo();
      }
    }, 100);
  }

  __setDatosFormularioGPS(){
      var e = this.$.mapMarker.geocoder;

      if(e){
        this.set('datosFormulario.city',e.city);
        this.set('datosFormulario.postcode',e.postcode);
        this.set('datosFormulario.address1',e.address1 +", "+ e.address1_number);
        this.set('datosFormulario.region',e.region);
        this.set('datosFormulario.latitude',e.latitude.toString());
        this.set('datosFormulario.longitude',e.longitude.toString());
      }else{
        setTimeout(() => {
          this.__setDatosFormularioGPS();
        }, 100);
      }
  }

  /*
  @@@@ CARGAS HACÍA API
  */

  __callEmpresa(){
    if(this.apiData.token){
      this.$.iaShowAccount.headers = {
        "x-session-key": this.apiData.token
      }
  
      this.$.iaShowAccount.generateRequest();  
    }else{
      setTimeout(() => {
        this.__changeTitle(this.page);
      }, 10);
    }
  }

  __callListaTipos(){
    if(this.apiData.token){
      this.$.iaListaTipos.headers = {
        "x-session-key": this.apiData.token
      }
  
      this.$.iaListaTipos.generateRequest();  
    }else{
      setTimeout(() => {
        this.__callListaTipos();
      }, 10);
    }
  }

  __retornoPost(e){
    this.textoTostada = "["+e.detail.response.Message+"]";
    this.codeTostada = "ID_ENTITY: "+e.detail.response.id+" ";

    this.$.tostadaSuccess.open();
  }

  __onError(e){
    if(e.type == "error"){
      var respuesta = e.detail.request.response;
      this.$.tostadaError.open();
      this.textoTostada = "["+e.detail.request.response.error+"]";
      this.codeTostada = "Code: "+e.detail.request.response.code+" ";
    }
  }

  __guardarDatos(){
    this.$.frmNuevaEmpresa.submit();
  }
}

window.customElements.define('account-add', AccountAdd);
