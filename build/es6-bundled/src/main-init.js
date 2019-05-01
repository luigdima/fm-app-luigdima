define(["require","./login-on.js"],function(_require,_loginOn){"use strict";_require=babelHelpers.interopRequireWildcard(_require);(0,_loginOn.registerEffect)("blend-background",{/** @this Polymer.AppLayout.ElementWithBackground */setUp:function setUp(){var fx={backgroundFrontLayer:this._getDOMRef("backgroundFrontLayer"),backgroundRearLayer:this._getDOMRef("backgroundRearLayer")};fx.backgroundFrontLayer.style.willChange="opacity";fx.backgroundFrontLayer.style.transform="translateZ(0)";fx.backgroundRearLayer.style.willChange="opacity";fx.backgroundRearLayer.style.transform="translateZ(0)";fx.backgroundRearLayer.style.opacity=0;this._fxBlendBackground=fx},/** @this Polymer.AppLayout.ElementWithBackground */run:function run(p,y){var fx=this._fxBlendBackground;fx.backgroundFrontLayer.style.opacity=1-p;fx.backgroundRearLayer.style.opacity=p},/** @this Polymer.AppLayout.ElementWithBackground */tearDown:function tearDown(){delete this._fxBlendBackground}});(0,_loginOn.registerEffect)("fade-background",{/** @this Polymer.AppLayout.ElementWithBackground */setUp:function setUp(config){var fx={},duration=config.duration||"0.5s";fx.backgroundFrontLayer=this._getDOMRef("backgroundFrontLayer");fx.backgroundRearLayer=this._getDOMRef("backgroundRearLayer");fx.backgroundFrontLayer.style.willChange="opacity";fx.backgroundFrontLayer.style.webkitTransform="translateZ(0)";fx.backgroundFrontLayer.style.transitionProperty="opacity";fx.backgroundFrontLayer.style.transitionDuration=duration;fx.backgroundRearLayer.style.willChange="opacity";fx.backgroundRearLayer.style.webkitTransform="translateZ(0)";fx.backgroundRearLayer.style.transitionProperty="opacity";fx.backgroundRearLayer.style.transitionDuration=duration;this._fxFadeBackground=fx},/** @this Polymer.AppLayout.ElementWithBackground */run:function run(p,y){var fx=this._fxFadeBackground;if(1<=p){fx.backgroundFrontLayer.style.opacity=0;fx.backgroundRearLayer.style.opacity=1}else{fx.backgroundFrontLayer.style.opacity=1;fx.backgroundRearLayer.style.opacity=0}},/** @this Polymer.AppLayout.ElementWithBackground */tearDown:function tearDown(){delete this._fxFadeBackground}});(0,_loginOn.registerEffect)("waterfall",{/**
   *  @this Polymer.AppLayout.ElementWithBackground
   */run:function run(){this.shadow=this.isOnScreen()&&this.isContentBelow()}});function interpolate(progress,points,fn,ctx){fn.apply(ctx,points.map(function(point){return point[0]+(point[1]-point[0])*progress}))}/**
   * Transform the font size of a designated title element between two values
   * based on the scroll position.
   */(0,_loginOn.registerEffect)("resize-title",{/** @this Polymer.AppLayout.ElementWithBackground */setUp:function setUp(){var title=this._getDOMRef("mainTitle"),condensedTitle=this._getDOMRef("condensedTitle");if(!condensedTitle){console.warn("Scroll effect `resize-title`: undefined `condensed-title`");return!1}if(!title){console.warn("Scroll effect `resize-title`: undefined `main-title`");return!1}condensedTitle.style.willChange="opacity";condensedTitle.style.webkitTransform="translateZ(0)";condensedTitle.style.transform="translateZ(0)";condensedTitle.style.webkitTransformOrigin="left top";condensedTitle.style.transformOrigin="left top";title.style.willChange="opacity";title.style.webkitTransformOrigin="left top";title.style.transformOrigin="left top";title.style.webkitTransform="translateZ(0)";title.style.transform="translateZ(0)";var titleClientRect=title.getBoundingClientRect(),condensedTitleClientRect=condensedTitle.getBoundingClientRect(),fx={};fx.scale=parseInt(window.getComputedStyle(condensedTitle)["font-size"],10)/parseInt(window.getComputedStyle(title)["font-size"],10);fx.titleDX=titleClientRect.left-condensedTitleClientRect.left;fx.titleDY=titleClientRect.top-condensedTitleClientRect.top;fx.condensedTitle=condensedTitle;fx.title=title;this._fxResizeTitle=fx},/** @this PolymerElement */run:function run(p,y){var fx=this._fxResizeTitle;if(!this.condenses){y=0}if(1<=p){fx.title.style.opacity=0;fx.condensedTitle.style.opacity=1}else{fx.title.style.opacity=1;fx.condensedTitle.style.opacity=0}interpolate(Math.min(1,p),[[1,fx.scale],[0,-fx.titleDX],[y,y-fx.titleDY]],function(scale,translateX,translateY){this.transform("translate("+translateX+"px, "+translateY+"px) "+"scale3d("+scale+", "+scale+", 1)",fx.title)},this)},/** @this Polymer.AppLayout.ElementWithBackground */tearDown:function tearDown(){delete this._fxResizeTitle}});(0,_loginOn.registerEffect)("parallax-background",{/**
   * @param {{scalar: string}} config
   * @this Polymer.AppLayout.ElementWithBackground
   */setUp:function setUp(config){var fx={},scalar=parseFloat(config.scalar);fx.background=this._getDOMRef("background");fx.backgroundFrontLayer=this._getDOMRef("backgroundFrontLayer");fx.backgroundRearLayer=this._getDOMRef("backgroundRearLayer");fx.deltaBg=fx.backgroundFrontLayer.offsetHeight-fx.background.offsetHeight;if(0===fx.deltaBg){if(isNaN(scalar)){scalar=.8}fx.deltaBg=(this._dHeight||0)*scalar}else{if(isNaN(scalar)){scalar=1}fx.deltaBg=fx.deltaBg*scalar}this._fxParallaxBackground=fx},/** @this Polymer.AppLayout.ElementWithBackground */run:function run(p,y){var fx=this._fxParallaxBackground;this.transform("translate3d(0px, "+fx.deltaBg*Math.min(1,p)+"px, 0px)",fx.backgroundFrontLayer);if(fx.backgroundRearLayer){this.transform("translate3d(0px, "+fx.deltaBg*Math.min(1,p)+"px, 0px)",fx.backgroundRearLayer)}},/** @this Polymer.AppLayout.ElementWithBackground */tearDown:function tearDown(){delete this._fxParallaxBackground}});(0,_loginOn.registerEffect)("material",{/**
   * @this Polymer.AppLayout.ElementWithBackground
   */setUp:function setUp(){this.effects="waterfall resize-title blend-background parallax-background";return!1}});(0,_loginOn.registerEffect)("resize-snapped-title",{/**
   * @this Polymer.AppLayout.ElementWithBackground
   */setUp:function setUp(config){var title=this._getDOMRef("mainTitle"),condensedTitle=this._getDOMRef("condensedTitle"),duration=config.duration||"0.2s",fx={};if(!condensedTitle){console.warn("Scroll effect `resize-snapped-title`: undefined `condensed-title`");return!1}if(!title){console.warn("Scroll effect `resize-snapped-title`: undefined `main-title`");return!1}title.style.transitionProperty="opacity";title.style.transitionDuration=duration;condensedTitle.style.transitionProperty="opacity";condensedTitle.style.transitionDuration=duration;fx.condensedTitle=condensedTitle;fx.title=title;this._fxResizeSnappedTitle=fx},/** @this Polymer.AppLayout.ElementWithBackground */run:function run(p,y){var fx=this._fxResizeSnappedTitle;if(0<p){fx.title.style.opacity=0;fx.condensedTitle.style.opacity=1}else{fx.title.style.opacity=1;fx.condensedTitle.style.opacity=0}},/** @this Polymer.AppLayout.ElementWithBackground */tearDown:function tearDown(){var fx=this._fxResizeSnappedTitle;fx.title.style.transition="";fx.condensedTitle.style.transition="";delete this._fxResizeSnappedTitle}});// preventable, allowing for better scrolling performance.
(0,_loginOn.setPassiveTouchGestures)(!0);// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
(0,_loginOn.setRootPath)(MainInitGlobals.rootPath);class MainInit extends _loginOn.PolymerElement{static get template(){return _loginOn.html`
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
    `}static get properties(){return{title:{type:String,value:MainInitGlobals.title},page:{type:String,reflectToAttribute:!0,observer:"_pageChanged"},apiData:{type:Object,value:MainInitGlobals.apiData},loginToken:{type:Object},routeData:Object,subroute:Object}}static get observers(){return["_routePageChanged(routeData.page)"]}__saveToken(e){if(this.loginToken.token){MainInitGlobals.apiData.token=this.loginToken.token}else{console.log("none api connect")}}_routePageChanged(page){//Marcamos la página inicial, o bien, si no existe, mostramos error!
if(!page){this.page="list"}else if(-1!==["list","add","edit"].indexOf(page)){this.page=page}else{this.page="error404"}if(!this.$.drawer.persistent){this.$.drawer.close()}}_pageChanged(page){switch(page){case"list":new Promise((res,rej)=>_require.default(["./account-list.js"],res,rej)).then(bundle=>bundle&&bundle.$accountList||{});break;case"add":new Promise((res,rej)=>_require.default(["./account-add.js"],res,rej)).then(bundle=>bundle&&bundle.$accountAdd||{});break;case"edit":new Promise((res,rej)=>_require.default(["./account-edit.js"],res,rej)).then(bundle=>bundle&&bundle.$accountEdit||{});break;case"error404":new Promise((res,rej)=>_require.default(["./error-404.js"],res,rej)).then(bundle=>bundle&&bundle.$error$404||{});break;}}}window.customElements.define("main-init",MainInit)});