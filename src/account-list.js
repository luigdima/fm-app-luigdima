import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/app-layout/app-layout.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-card/paper-card.js';
import 'ag-grid-polymer/src/agGridPolymer.js';

import './shared-styles.js';

class AccountList extends PolymerElement {
  static get template() {
    return html`
      <link rel="stylesheet" href="/node_modules/ag-grid-community/dist/styles/ag-grid.css">
      <link rel="stylesheet" href="/node_modules/ag-grid-community/dist/styles/ag-theme-material.css">
    
      <style include="shared-styles">
        :host {
          display: block;
          --app-drawer-width: 80%;

          padding: 10px;
        }

        .ag-header-cell {
          background-color: #f8f8f8 !important;
          color: #636363;
          height: 15px;
        }

        .ag-cell {
          color: #212121 !important;
        }

        .ag-cell a {
          color: #212121 !important;
          padding: 25px;
          padding-right: 100%;
          margin-left: -30px;
        }

        .ag-cell a:hover {
          color: #212121 !important;
          font-weight: bold;
        }

        .zonaAcciones .filtros paper-input {
          float: left;
          margin-top: -2px;
          text-transform: uppercase;
          --paper-input-container-input: {
            font-size: 13px;
          };

          --paper-input-container-label: {
            font-size: 13px;
          }
        }

        .ag-theme-material {
          float: left;
        }

        .zonaAcciones .filtros paper-input iron-icon {
          color: #636363;
          margin-top: -7px;
          padding-right: 6px;
        }

        .zonaAcciones .filtros paper-checkbox {
          float: left;
          line-height: 36px;
          margin-left: 20px;
          text-transform: uppercase;
          font-size: 13px;
        }

        .zonaAcciones {
          padding-top: 10px;
          float: left;
          padding-bottom: 15px;
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

        paper-button {
          font-size: 13px;
          padding-right: 12px;
          padding-bottom: 4px;
          padding-top: 4px;
        }

        .zonaAcciones paper-button iron-icon {
          padding-right: 2px;
          width: 20px;
        }       
        
        .ventanaLateral {
          height: 100%; 
          width:100%; 
          background-color: #f9f9f9; 
          margin-top: 64px;
        }

        .ventanaLateral a {
          float: left;
          margin-top: 10px;
          margin-left: 10px;
          color: #f0f0f0;
        }

        .ventanaLateral a .eliminar {
          background-color: var(--paper-red-400);
        }

        .ventanaLateral a .editar {
          background-color: var(--paper-blue-400);
        }

        .ventanaLateral h2 {
          float: left;
          margin-top: 10px;          
          width: 100%;
          text-align: left;
          text-transform: uppercase;
          font-size: 18px;
          font-weight: 400;
          padding-bottom: 4px;
          border-bottom: 1px solid #e9e9e9;
          color: #636363;
          letter-spacing: 2px;
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

        .dialogoEliminar h2 {
          color: #ffffff;
          background-color: var(--paper-red-800);
          margin: 0;
          padding: 12px;
          font-size: 18px;
        }

        .dialogoEliminarScroll {
          color: #3e495e;
          margin: 0;
          padding: 0;
          left: 0;
          margin-left: -14px;
          padding-top: 20px;
          padding-bottom: 20px;
        }

        .ventanaEmpresa {
          --app-drawer-width: 500px;
        }

        .cardEmpresa {
          float: left;
          text-align: left;
          width: 100%;
        }

        .header .title-text {
          padding: 16px;
          font-size: 22px;
          font-weight: 400;
          color: #3e495e;
          padding-top: 24px;
          padding-bottom: 0;
        }

        .botonesVentanaLateral {
          float: right;
          margin-right: 10px;
          margin-top: 6px;
        }

        .datosEmpresa {          
          width: 100%;
          float: left;
          padding-left: 30px;
          padding-top: 12px;
        }

        .datosEmpresa ul {      
          padding-left: 0;
          list-style: none;
        }

        .datosEmpresa ul li {
          font-size: 13px;
          letter-spacing: 0.5px;
          padding-bottom: 4px;
          color: #3e495e;
        }

        .datosEmpresa ul li a {
          font-weight: 500;
          color: #000000;
          margin: 0;
          padding-right: 10px;
        }
      </style>
      
      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <iron-ajax
        id="iaListAccounts"
        url="{{apiData.url}}/accounts?where=deleted={{verEliminados}}"
        handle-as="json"
        method="get"
        last-response="{{accounts}}"
        debounce-duration="300">
      </iron-ajax>

      <iron-ajax
        id="iaShowAccount"
        url="{{apiData.url}}/accounts{{subroute.path}}"
        handle-as="json"
        method="get"
        last-response="{{account}}"
        debounce-duration="300">
      </iron-ajax>  
      
      <iron-ajax
        id="iaEliminarEmpresa"
        url="{{apiData.url}}/accounts{{subroute.path}}"
        handle-as="json"
        method="DELETE"
        on-response="__retornoEliminar"
        on-error="__onErrorEliminar"
        debounce-duration="300">
      </iron-ajax>   
      
      <div class="zonaAcciones">
        <div class="filtros">
            <paper-input no-label-float name="name" label="Buscar en tabla..." type="text" value={{filtros.texto.value}}>
              <iron-icon icon="search" slot="prefix"></iron-icon>
            </paper-input>
            <paper-checkbox checked="{{filtros.eliminados.value}}">Eliminados</paper-checkbox>
        </div>
        <a href="[[rootPath]]add">
          <paper-button raised><iron-icon icon="add"></iron-icon>Añadir</paper-button>
        </a>
      </div>

      <ag-grid-polymer id="agrid" style="width: 100%;"
        class="ag-theme-material"
        rowData="{{accounts}}"
        columnDefs="{{columnsAccounts}}"
        on-first-data-rendered="{{__render}}"
        gridOptions="{{gridOptions}}"
      ></ag-grid-polymer>     

      <app-drawer id="ventanaEmpresa" align="right">
        <div class="ventanaLateral">
          <!-- <h2>Opciones</h2> -->
          <div class="botonesVentanaLateral">
            <a href="[[rootPath]]edit[[subroute.path]]">
              <paper-button raised class="editar">
                <iron-icon icon="create"></iron-icon>Editar
              </paper-button>
            </a>
            <a>
              <paper-button raised class="eliminar" data-dialog="dialogDelete" on-click="__dialogDelete">
                <iron-icon icon="close"></iron-icon>Eliminar
              </paper-button>
            </a>
          </div>
          <div class="datosEmpresa">
            <paper-card class="cardEmpresa">
              <div class="card-content">
                <h2>Información</h2>
                <ul>
                  <li><a>Nombre empresa:</a> {{account.name}}</li>
                  <li><a>Responsable:</a> {{account.salesRepId1.value}}</li>
                  <li><a>Tipo de empresa:</a> {{account.typeId.value}}</li>
                  <li><a>Comentarios:</a> {{account.comment}}</li>
                </ul>
                <h2>Datos de contacto</h2>
                <ul>
                  <li><a>Teléfono 1:</a> {{account.phone}}</li>
                  <li><a>Teléfono 2:</a> {{account.phone2}}</li>
                  <li><a>Teléfono 3:</a> {{account.phone3}}</li>
                  <li><a>Email:</a> {{account.email}}</li>
                  <li><a>Web:</a> {{account.web}}</li>
                </ul>
                <h2>Dirección</h2>
                <ul>
                  <li><a>Dirección:</a> {{account.address1}}</li>
                  <li><a>Ciudad:</a> {{account.city}}</li>
                  <li><a>Región:</a> {{account.region}}</li>
                </ul>
              </div>
            </paper-card>
          </div>
        </div>
      </app-drawer>

      <paper-dialog id="dialogDelete" class="dialogoEliminar">
        <h2>Eliminar empresa ({{account.name}})</h2>
        <paper-dialog-scrollable class="dialogoEliminarScroll">
          ¿Estás seguro que quieres eliminar esta empresa?
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-dismiss>Cancelar</paper-button>
          <paper-button dialog-confirm autofocus on-click="__eliminarEmpresa">Eliminar</paper-button>
        </div>
      </paper-dialog>

      <paper-toast id="tostadaError" positionTarget="absolute" duration="10000" class="fit-bottom" text="{{codeTostada}}">{{textoTostada}}</paper-toast>
      <paper-toast id="tostadaSuccess" duration="10000" class="fit-bottom" text="{{codeTostada}}">{{textoTostada}}</paper-toast>
    `;
  }

  ready() {
    super.ready();
    
    //@@fix: Llamamos desde el inicio func. para listar las empresas
    this.__callListAccounts();

    //@@fix: Cuando cerramos la [ventanaEmpresa], cambiamos el 'path'
    this.$.ventanaEmpresa.addEventListener('opened-changed', (e)=>{
      if(!e.detail.value){
        this.set('route.path',this.subroute.prefix)
      }
    });
  }

  static get properties() {
    return {
      title: {
        type: String,
        value: "EMPRESAS"
      },
      route: Object,
      subroute: Object,
      apiData: {
        type: Object,
        value: MainInitGlobals.apiData,
      },
      accounts: {
        type: Object
      },
      account: {
        type: Object
      },   
      filtros: {
        type: Object,
        value: {
          eliminados: {
            type: Boolean,
            value: false
          },
          texto: {
            type: String,
            value: ""
          }
        }
      },  
      verEliminados: Number,
      gridOptions: {
        type: Object
      },
      columnsAccounts: {
        type: Object,
        value: [
          { headerName: "EMPRESA", field: "name", pinned: "left", sortable: true,  cellRenderer: function(e){
              var thtml = `
                <a href="/list/`+e.data.id+`">`+e.value+`</a>
              `;

              return thtml;
            },
          },
          { headerName: "RESPONSABLE", field: "salesRepId1.value", sortable: true},
          { headerName: "CREACION", field: "dateCreated", sortable: true, cellRenderer: function(e){
              var fecha = new Date(e.value);
              var tfecha = fecha.getDate() +"/"+ (fecha.getMonth()+1) +"/"+ fecha.getFullYear()
              return tfecha;
            },
          },
          { headerName: "TIPO", field: "typeId.value", sortable: true },
          { headerName: "DIRECCIÓN", field: "address1", sortable: true },
          { headerName: "POBLACIÓN", field: "city", sortable: true },
          { headerName: "CÓDIGO POSTAL", field: "postcode", sortable: true },
          { headerName: "PAÍS", field: "countryId.value", sortable: true },
        ]
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
      '__subRouteChanged(subroute.path)',
      '__actualizarDatos(route.*)',
      '__changeTitle(routeData.page)',
      '__filtraEliminados(filtros.eliminados.value)',
      '__filtrarTexto(filtros.texto.value)'
    ];
  }

  __filtraEliminados(){   
    if(this.filtros.eliminados.value){
      this.set('verEliminados',1);
    }else{
      this.set('verEliminados',0);
    }

    this.__callListAccounts();
  }

  __filtrarTexto(){
    setTimeout(() => {
      var a  = this.$.agrid.api.setQuickFilter(this.filtros.texto.value);     
    }, 50);
  }

  __render(params) {
    params.api.setDomLayout('autoHeight');    
  }
  
  /*
  @__changeTitle({pagina}):
    - Cambiamos el título de la página dentro del objeto paper-toolbar del
      camponente main-init.
  */
  __changeTitle(page){
    //@@note: Comprobamos que la página es la que toca,
    if(page == "list"){
      var a = $($('body').children("login-on")[0].shadowRoot)
        .children("iron-pages");
      var b = $($(a)[0].children.main).children("main-init");    

      b[0].title = this.title;
    }

    //@@fix: Cerramos las ventanas emergentes que estén abiertas
    if((page == "list") && (this.subroute.path == "")){
      this.$.ventanaEmpresa.close();
    }
  }

  /*
  @__callListAccounts():
    - Lanzamos la llamada hacía la API, en petición de los datos del listado
      de empresas. Adjuntos el token.
  */

  __actualizarDatos(){
    if(this.subroute.path == ""){
      this.__callListAccounts();
    }
  }

  __callListAccounts(){
    //@@note: Comprobamos que existe el token!
    if(this.apiData.token){
      this.$.iaListAccounts.headers = {
        "x-session-key": this.apiData.token
      }
      //@@note: lanzamos petición...
      this.$.iaListAccounts.generateRequest();  
    }else{
      //@@fix: Pese a que no me guste, deberemos de esperar 10ms...
      setTimeout(() => {
        this.__callListAccounts();
      }, 10);
    }
  }

  __cargarEmpresa(){
    //@@note: Comprobamos que existe el token!
    if(this.apiData.token){
      this.$.iaShowAccount.headers = {
        "x-session-key": this.apiData.token
      }
      //@@note: lanzamos petición...
      this.$.iaShowAccount.generateRequest();
    }else{
      //@@fix: Pese a que no me guste, deberemos de esperar 10ms...
      setTimeout(() => {
        this.__cargarEmpresa();
      }, 10);
    }
  }

  __abrirVentanaLateral(){
    this.$.ventanaEmpresa.open();
  }

  /*
  @__subRouteChanged({page}):
    - Acción de salto desde [observer]. Nos permite saber si estamos
      en una subpágina para así generar los eventos correspondientes
  */
  __subRouteChanged(page) {
    if(page){
      this.__cargarEmpresa();       //->Cargamos la empresa en cuestión (mediante su id)
      this.__abrirVentanaLateral(); //->Abrimos la ventana lateral de [opciones]/[datos]
    }
  }

  __dialogDelete(){
    this.$.dialogDelete.open();
  }

  __eliminarEmpresa(){
    if(this.apiData.token){
      this.$.iaEliminarEmpresa.headers = {
        "x-session-key": this.apiData.token
      }
      //@@note: lanzamos petición...
      this.$.iaEliminarEmpresa.generateRequest();
    }else{
      //@@fix: Pese a que no me guste, deberemos de esperar 10ms...
      setTimeout(() => {
        this.__eliminarEmpresa();
      }, 10);
    }
  }

  __retornoEliminar(e){
    this.textoTostada = "["+e.detail.response.Message+"]";
    this.codeTostada = "ID_ENTITY: "+e.detail.response.id+" ";

    this.$.tostadaSuccess.open();
    this.$.ventanaEmpresa.close();
    this.__callListAccounts();
  }

  __onErrorEliminar(e){
    if(e.type == "error"){
      var respuesta = e.detail.request.response;
      this.$.tostadaError.open();
      this.textoTostada = "["+e.detail.request.response.error+"]";
      this.codeTostada = "Code: "+e.detail.request.response.code+" ";
    }
  }

}

window.customElements.define('account-list', AccountList);
