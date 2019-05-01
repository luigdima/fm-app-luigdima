import{Polymer,Base,html$1 as html,IronResizableBehavior,IronFormElementBehavior,PaperInputBehavior,idlePeriod,timeOut,Debouncer,enqueueDebouncer,PolymerElement,html as html$1,DomModule,FlattenedNodesObserver,templatize,afterNextRender,stylesFromTemplate,mixinBehaviors}from"./login-on.js";const IronJsonpLibraryBehavior={properties:{/**
     * True if library has been successfully loaded
     */libraryLoaded:{type:Boolean,value:!1,notify:!0,readOnly:!0},/**
     * Not null if library has failed to load
     */libraryErrorMessage:{type:String,value:null,notify:!0,readOnly:!0// Following properties are to be set by behavior users
/**
       * Library url. Must contain string `%%callback%%`.
       *
       * `%%callback%%` is a placeholder for jsonp wrapper function name
       *
       * Ex: https://maps.googleapis.com/maps/api/js?callback=%%callback%%
       * @property libraryUrl
       */ /**
           * Set if library requires specific callback name.
           * Name will be automatically generated if not set.
           * @property callbackName
           */ /**
               * name of event to be emitted when library loads. Standard is `api-load`
               * @property notifyEvent
               */ /**
                   * event with name specified in `notifyEvent` attribute
                   * will fire upon successful load2
                   * @event `notifyEvent`
                   */}},observers:["_libraryUrlChanged(libraryUrl)"],_libraryUrlChanged:function(libraryUrl){// can't load before ready because notifyEvent might not be set
if(this._isReady&&this.libraryUrl)this._loadLibrary()},_libraryLoadCallback:function(err,result){if(err){Base._warn("Library load failed:",err.message);this._setLibraryErrorMessage(err.message)}else{this._setLibraryErrorMessage(null);this._setLibraryLoaded(!0);if(this.notifyEvent)this.fire(this.notifyEvent,result,{composed:!0})}},/** loads the library, and fires this.notifyEvent upon completion */_loadLibrary:function(){LoaderMap.require(this.libraryUrl,this._libraryLoadCallback.bind(this),this.callbackName)},ready:function(){this._isReady=!0;if(this.libraryUrl)this._loadLibrary()}};/**
    * LoaderMap keeps track of all Loaders
    */var LoaderMap={apiMap:{},// { hash -> Loader }
/**
   * @param {Function} notifyCallback loaded callback fn(result)
   * @param {string} jsonpCallbackName name of jsonpcallback. If API does not provide it, leave empty. Optional.
   */require:function(url,notifyCallback,jsonpCallbackName){// make hashable string form url
var name=this.nameFromUrl(url);// create a loader as needed
if(!this.apiMap[name])this.apiMap[name]=new Loader(name,url,jsonpCallbackName);// ask for notification
this.apiMap[name].requestNotify(notifyCallback)},nameFromUrl:function(url){return url.replace(/[\:\/\%\?\&\.\=\-\,]/g,"_")+"_api"}},Loader=function(name,url,callbackName){this.notifiers=[];// array of notifyFn [ notifyFn* ]
// callback is specified either as callback name
// or computed dynamically if url has callbackMacro in it
if(!callbackName){if(0<=url.indexOf(this.callbackMacro)){callbackName=name+"_loaded";url=url.replace(this.callbackMacro,callbackName)}else{this.error=new Error("IronJsonpLibraryBehavior a %%callback%% parameter is required in libraryUrl");// TODO(sjmiles): we should probably fallback to listening to script.load
return}}this.callbackName=callbackName;window[this.callbackName]=this.success.bind(this);this.addScript(url)};/** @constructor */Loader.prototype={callbackMacro:"%%callback%%",loaded:!1,addScript:function(src){var script=document.createElement("script");script.src=src;script.onerror=this.handleError.bind(this);var s=document.querySelector("script")||document.body;s.parentNode.insertBefore(script,s);this.script=script},removeScript:function(){if(this.script.parentNode){this.script.parentNode.removeChild(this.script)}this.script=null},handleError:function(ev){this.error=new Error("Library failed to load");this.notifyAll();this.cleanup()},success:function(){this.loaded=!0;this.result=Array.prototype.slice.call(arguments);this.notifyAll();this.cleanup()},cleanup:function(){delete window[this.callbackName]},notifyAll:function(){this.notifiers.forEach(function(notifyCallback){notifyCallback(this.error,this.result)}.bind(this));this.notifiers=[]},requestNotify:function(notifyCallback){if(this.loaded||this.error){notifyCallback(this.error,this.result)}else{this.notifiers.push(notifyCallback)}}};/**
     Loads specified jsonp library.
   
     Example:
   
         <iron-jsonp-library
           library-url="https://apis.google.com/js/plusone.js?onload=%%callback%%"
           notify-event="api-load"
           library-loaded="{{loaded}}"></iron-jsonp-library>
   
     Will emit 'api-load' event when loaded, and set 'loaded' to true
   
     Implemented by  Polymer.IronJsonpLibraryBehavior. Use it
     to create specific library loader elements.
   
     @demo demo/index.html
   */Polymer({is:"iron-jsonp-library",behaviors:[IronJsonpLibraryBehavior],properties:{/**
     * Library url. Must contain string `%%callback%%`.
     *
     * `%%callback%%` is a placeholder for jsonp wrapper function name
     *
     * Ex: https://maps.googleapis.com/maps/api/js?callback=%%callback%%
     */libraryUrl:String,/**
     * Set if library requires specific callback name.
     * Name will be automatically generated if not set.
     */callbackName:String,/**
     * event with name specified in 'notifyEvent' attribute
     * will fire upon successful load
     */notifyEvent:String/**
                            * event with name specified in 'notifyEvent' attribute
                            * will fire upon successful load
                            * @event `notifyEvent`
                            */}});var ironJsonpLibrary={IronJsonpLibraryBehavior:IronJsonpLibraryBehavior};Polymer({is:"google-maps-api",behaviors:[IronJsonpLibraryBehavior],properties:{/** @private */mapsUrl:{type:String,value:"https://maps.googleapis.com/maps/api/js?callback=%%callback%%"},/**
     * A Maps API key. To obtain an API key, see developers.google.com/maps/documentation/javascript/tutorial#api_key.
     */apiKey:{type:String,value:""},/**
     * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see developers.google.com/maps/documentation/business/.
     * If set, a Client ID will take precedence over an API Key.
     */clientId:{type:String,value:""},/**
     * Version of the Maps API to use.
     */version:{type:String,value:"3.exp"},/**
     * The localized language to load the Maps API with. For more information
     * see https://developers.google.com/maps/documentation/javascript/basics#Language
     *
     * Note: the Maps API defaults to the preffered language setting of the browser.
     * Use this parameter to override that behavior.
     */language:{type:String,value:""},/**
     * If true, sign-in is enabled.
     * See https://developers.google.com/maps/documentation/javascript/signedin#enable_sign_in
     */signedIn:{type:Boolean,value:!1},/**
     * Fired when the Maps API library is loaded and ready.
     * @event api-load
     */ /**
         * Name of event fired when library is loaded and available.
         */notifyEvent:{type:String,value:"api-load"},/** @private */libraryUrl:{type:String,computed:"_computeUrl(mapsUrl, version, apiKey, clientId, language, signedIn)"}},_computeUrl(mapsUrl,version,apiKey,clientId,language,signedIn){let url=`${mapsUrl}&v=${version}`;// Always load all Maps API libraries.
url+="&libraries=drawing,geometry,places,visualization";if(apiKey&&!clientId){url+=`&key=${apiKey}`}if(clientId){url+=`&client=${clientId}`}// Log a warning if the user is not using an API Key or Client ID.
if(!apiKey&&!clientId){const warning="No Google Maps API Key or Client ID specified. "+"See https://developers.google.com/maps/documentation/javascript/get-api-key "+"for instructions to get started with a key or client id.";console.warn(warning)}if(language){url+=`&language=${language}`}if(signedIn){url+=`&signed_in=${signedIn}`}return url},/**
   * Provides the google.maps JS API namespace.
   */get api(){return google.maps}});function setupDragHandler_(){if(this.draggable){this.dragHandler_=google.maps.event.addListener(this.marker,"dragend",onDragEnd_.bind(this))}else{google.maps.event.removeListener(this.dragHandler_);this.dragHandler_=null}}function onDragEnd_(e,details,sender){this.latitude=e.latLng.lat();this.longitude=e.latLng.lng()}Polymer({_template:html`
    <style>
      :host {
        display: none;
      }
    </style>

    <slot></slot>
`,is:"google-map-marker",/**
   * Fired when the marker icon was clicked. Requires the clickEvents attribute to be true.
   *
   * @param {google.maps.MouseEvent} event The mouse event.
   * @event google-map-marker-click
   */ /**
       * Fired when the marker icon was double clicked. Requires the clickEvents attribute to be true.
       *
       * @param {google.maps.MouseEvent} event The mouse event.
       * @event google-map-marker-dblclick
       */ /**
           * Fired repeatedly while the user drags the marker. Requires the dragEvents attribute to be true.
           *
           * @event google-map-marker-drag
           */ /**
               * Fired when the user stops dragging the marker. Requires the dragEvents attribute to be true.
               *
               * @event google-map-marker-dragend
               */ /**
                   * Fired when the user starts dragging the marker. Requires the dragEvents attribute to be true.
                   *
                   * @event google-map-marker-dragstart
                   */ /**
                       * Fired for a mousedown on the marker. Requires the mouseEvents attribute to be true.
                       *
                       * @event google-map-marker-mousedown
                       * @param {google.maps.MouseEvent} event The mouse event.
                       */ /**
                           * Fired when the DOM `mousemove` event is fired on the marker. Requires the mouseEvents
                           * attribute to be true.
                           *
                           * @event google-map-marker-mousemove
                           * @param {google.maps.MouseEvent} event The mouse event.
                           */ /**
                               * Fired when the mouse leaves the area of the marker icon. Requires the mouseEvents attribute to be
                               * true.
                               *
                               * @event google-map-marker-mouseout
                               * @param {google.maps.MouseEvent} event The mouse event.
                               */ /**
                                   * Fired when the mouse enters the area of the marker icon. Requires the mouseEvents attribute to be
                                   * true.
                                   *
                                   * @event google-map-marker-mouseover
                                   * @param {google.maps.MouseEvent} event The mouse event.
                                   */ /**
                                       * Fired for a mouseup on the marker. Requires the mouseEvents attribute to be true.
                                       *
                                       * @event google-map-marker-mouseup
                                       * @param {google.maps.MouseEvent} event The mouse event.
                                       */ /**
                                           * Fired for a rightclick on the marker. Requires the clickEvents attribute to be true.
                                           *
                                           * @event google-map-marker-rightclick
                                           * @param {google.maps.MouseEvent} event The mouse event.
                                           */ /**
                                               * Fired when an infowindow is opened.
                                               *
                                               * @event google-map-marker-open
                                               */ /**
                                                   * Fired when the close button of the infowindow is pressed.
                                                   *
                                                   * @event google-map-marker-close
                                                   */properties:{/**
     * A Google Maps marker object.
     *
     * @type google.maps.Marker
     */marker:{type:Object,notify:!0},/**
     * The Google map object.
     *
     * @type google.maps.Map
     */map:{type:Object,observer:"_mapChanged"},/**
     * A Google Map Infowindow object.
     *
     * @type {?Object}
     */info:{type:Object,value:null},/**
     * When true, marker *click events are automatically registered.
     */clickEvents:{type:Boolean,value:!1,observer:"_clickEventsChanged"},/**
     * When true, marker drag* events are automatically registered.
     */dragEvents:{type:Boolean,value:!1,observer:"_dragEventsChanged"},/**
     * Image URL for the marker icon.
     *
     * @type string|google.maps.Icon|google.maps.Symbol
     */icon:{type:Object,value:null,observer:"_iconChanged"},/**
     * When true, marker mouse* events are automatically registered.
     */mouseEvents:{type:Boolean,value:!1,observer:"_mouseEventsChanged"},/**
     * Z-index for the marker icon.
     */zIndex:{type:Number,value:0,observer:"_zIndexChanged"},/**
     * The marker's longitude coordinate.
     */longitude:{type:Number,value:null,notify:!0},/**
     * The marker's latitude coordinate.
     */latitude:{type:Number,value:null,notify:!0},/**
     * The marker's label.
     */label:{type:String,value:null,observer:"_labelChanged"},/**
     * A animation for the marker. "DROP" or "BOUNCE". See
     * https://developers.google.com/maps/documentation/javascript/examples/marker-animations.
     */animation:{type:String,value:null,observer:"_animationChanged"},/**
     * Specifies whether the InfoWindow is open or not
     */open:{type:Boolean,value:!1,observer:"_openChanged"},geocoder:{type:Object}},observers:["_updatePosition(latitude, longitude)"],detached(){if(this.marker){google.maps.event.clearInstanceListeners(this.marker);this._listeners={};this.marker.setMap(null)}if(this._contentObserver){this._contentObserver.disconnect()}},attached(){// If element is added back to DOM, put it back on the map.
if(this.marker){this.marker.setMap(this.map)}},_updatePosition(){if(this.marker&&null!=this.latitude&&null!=this.longitude){this.marker.setPosition(new google.maps.LatLng(parseFloat(this.latitude),parseFloat(this.longitude)))}},_clickEventsChanged(){if(this.map){if(this.clickEvents){this._forwardEvent("click");this._forwardEvent("dblclick");this._forwardEvent("rightclick")}else{this._clearListener("click");this._clearListener("dblclick");this._clearListener("rightclick")}}},_dragEventsChanged(){if(this.map){if(this.dragEvents){this._forwardEvent("drag");this._forwardEvent("dragend");this._forwardEvent("dragstart")}else{this._clearListener("drag");this._clearListener("dragend");this._clearListener("dragstart")}}},_mouseEventsChanged(){if(this.map){if(this.mouseEvents){this._forwardEvent("mousedown");this._forwardEvent("mousemove");this._forwardEvent("mouseout");this._forwardEvent("mouseover");this._forwardEvent("mouseup")}else{this._clearListener("mousedown");this._clearListener("mousemove");this._clearListener("mouseout");this._clearListener("mouseover");this._clearListener("mouseup")}}},_animationChanged(){if(this.marker){this.marker.setAnimation(google.maps.Animation[this.animation])}},_labelChanged(){if(this.marker){this.marker.setLabel(this.label)}},_iconChanged(){if(this.marker){this.marker.setIcon(this.icon)}},_zIndexChanged(){if(this.marker){this.marker.setZIndex(this.zIndex)}},_mapChanged(){// Marker will be rebuilt, so disconnect existing one from old map and listeners.
if(this.marker){this.marker.setMap(null);google.maps.event.clearInstanceListeners(this.marker)}if(this.map&&this.map instanceof google.maps.Map){this._mapReady()}},_contentChanged(){if(this._contentObserver){this._contentObserver.disconnect()}// Watch for future updates.
this._contentObserver=new MutationObserver(this._contentChanged.bind(this));this._contentObserver.observe(this,{childList:!0,subtree:!0});const content=this.innerHTML.trim();if(content){if(!this.info){// Create a new infowindow
this.info=new google.maps.InfoWindow;this.openInfoHandler_=google.maps.event.addListener(this.marker,"click",()=>{this.open=!0});this.closeInfoHandler_=google.maps.event.addListener(this.info,"closeclick",()=>{this.open=!1})}this.info.setContent(content)}else if(this.info){// Destroy the existing infowindow.  It doesn't make sense to have an empty one.
google.maps.event.removeListener(this.openInfoHandler_);google.maps.event.removeListener(this.closeInfoHandler_);this.info=null}},_openChanged(){if(this.info){if(this.open){this.info.open(this.map,this.marker);this.fire("google-map-marker-open")}else{this.info.close();this.fire("google-map-marker-close")}}},_mapReady(){this._listeners={};this.marker=new google.maps.Marker({map:this.map,position:{lat:parseFloat(this.latitude),lng:parseFloat(this.longitude)},title:this.title,animation:google.maps.Animation[this.animation],draggable:this.draggable,visible:!this.hidden,icon:this.icon,label:this.label,zIndex:this.zIndex});this.getAddress();this._contentChanged();this._clickEventsChanged();this._dragEventsChanged();this._mouseEventsChanged();this._openChanged();setupDragHandler_.bind(this)()},_clearListener(name){if(this._listeners[name]){google.maps.event.removeListener(this._listeners[name]);this._listeners[name]=null}},_forwardEvent(name){this._listeners[name]=google.maps.event.addListener(this.marker,name,event=>{this.fire(`google-map-marker-${name}`,event)})},attributeChanged(attrName){if(!this.marker){return}// Cannot use *Changed watchers for native properties.
switch(attrName){case"hidden":this.marker.setVisible(!this.hidden);break;case"draggable":this.marker.setDraggable(this.draggable);setupDragHandler_.bind(this)();break;case"title":this.marker.setTitle(this.title);break;}},getAddress(){var latlng={lat:parseFloat(this.latitude),lng:parseFloat(this.longitude)},geocoder=new google.maps.Geocoder,objetoGeo={latitude:this.latitude.toString(),longitude:this.longitude.toString(),city:"",postcode:"",address1:"",address1_number:"",region:"",oo:""};geocoder.geocode({location:latlng},(results,status)=>{if("OK"===status){results[0].address_components.forEach((v,i,a)=>{switch(v.types[0]){case"route":objetoGeo.address1=v.short_name;break;case"street_number":objetoGeo.address1_number=v.short_name;break;case"locality":objetoGeo.city=v.short_name;break;case"administrative_area_level_2":objetoGeo.region=v.short_name;break;case"administrative_area_level_1"://objetoGeo.address1_number = v.short_name;
break;case"country"://objetoGeo.address1_number = v.short_name;
break;case"postal_code":objetoGeo.postcode=v.short_name;break;}});objetoGeo.oo=results[0];this.set("geocoder",objetoGeo)}})}});Polymer({_template:html`
    <style>
      :host {
        position: relative;
        display: block;
        height: 100%;
      }

      #map {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    </style>

    <google-maps-api id="api" api-key="[[apiKey]]" client-id="[[clientId]]" version="[[version]]" signed-in="[[signedIn]]" language="[[language]]" on-api-load="_mapApiLoaded" maps-url="[[mapsUrl]]">
    </google-maps-api>

    <div id="map"></div>

    <iron-selector id="selector" multi="[[!singleInfoWindow]]" selected-attribute="open" activate-event="google-map-marker-open" on-google-map-marker-close="_deselectMarker">
      <slot id="markers" name="markers"></slot>
    </iron-selector>

    <slot id="objects"></slot>
`,is:"google-map",/**
   * Fired when the Maps API has fully loaded.
   *
   * @event google-map-ready
   */ /**
       * Fired when the user clicks on the map (but not when they click on a marker, infowindow, or
       * other object). Requires the clickEvents attribute to be true.
       *
       * @event google-map-click
       * @param {google.maps.MouseEvent} event The mouse event.
       */ /**
           * Fired when the user double-clicks on the map. Note that the google-map-click event will also fire,
           * right before this one. Requires the clickEvents attribute to be true.
           *
           * @event google-map-dblclick
           * @param {google.maps.MouseEvent} event The mouse event.
           */ /**
               * Fired repeatedly while the user drags the map. Requires the dragEvents attribute to be true.
               *
               * @event google-map-drag
               */ /**
                   * Fired when the user stops dragging the map. Requires the dragEvents attribute to be true.
                   *
                   * @event google-map-dragend
                   */ /**
                       * Fired when the user starts dragging the map. Requires the dragEvents attribute to be true.
                       *
                       * @event google-map-dragstart
                       */ /**
                           * Fired whenever the user's mouse moves over the map container. Requires the mouseEvents attribute to
                           * be true.
                           *
                           * @event google-map-mousemove
                           * @param {google.maps.MouseEvent} event The mouse event.
                           */ /**
                               * Fired when the user's mouse exits the map container. Requires the mouseEvents attribute to be true.
                               *
                               * @event google-map-mouseout
                               * @param {google.maps.MouseEvent} event The mouse event.
                               */ /**
                                   * Fired when the user's mouse enters the map container. Requires the mouseEvents attribute to be true.
                                   *
                                   * @event google-map-mouseover
                                   * @param {google.maps.MouseEvent} event The mouse event.
                                   */ /**
                                       * Fired when the DOM `contextmenu` event is fired on the map container. Requires the clickEvents
                                       * attribute to be true.
                                       *
                                       * @event google-map-rightclick
                                       * @param {google.maps.MouseEvent} event The mouse event.
                                       */ /**
                                           * Fired when the map becomes idle after panning or zooming.
                                           *
                                           * @event google-map-idle
                                           */ /**
                                               * Polymer properties for the google-map custom element.
                                               */properties:{/**
     * A Maps API key. To obtain an API key, see https://developers.google.com/maps/documentation/javascript/tutorial#api_key.
     */apiKey:String,/**
     * Overrides the origin the Maps API is loaded from. Defaults to `https://maps.googleapis.com`.
     */mapsUrl:{type:String// Initial value set in google-maps-api.
},/**
     * A Maps API for Business Client ID. To obtain a Maps API for Business Client ID, see https://developers.google.com/maps/documentation/business/.
     * If set, a Client ID will take precedence over an API Key.
     */clientId:String,/**
     * A latitude to center the map on.
     */latitude:{type:Number,value:37.77493,notify:!0,reflectToAttribute:!0},/**
     * A Maps API object.
     */map:{type:Object,notify:!0,value:null},/**
     * A longitude to center the map on.
     */longitude:{type:Number,value:-122.41942,notify:!0,reflectToAttribute:!0},/**
     * A kml file to load.
     */kml:{type:String,value:null,observer:"_loadKml"},/**
     * A zoom level to set the map to.
     */zoom:{type:Number,value:10,observer:"_zoomChanged",notify:!0},/**
     * When set, prevents the map from tilting (when the zoom level and viewport supports it).
     */noAutoTilt:{type:Boolean,value:!1},/**
     * Map type to display. One of 'roadmap', 'satellite', 'hybrid', 'terrain'.
     */mapType:{type:String,value:"roadmap",// roadmap, satellite, hybrid, terrain,
observer:"_mapTypeChanged",notify:!0},/**
     * Version of the Google Maps API to use.
     */version:{type:String,value:"3.exp"},/**
     * If set, removes the map's default UI controls.
     */disableDefaultUi:{type:Boolean,value:!1,observer:"_disableDefaultUiChanged"},/**
     * If set, removes the map's 'map type' UI controls.
     */disableMapTypeControl:{type:Boolean,value:!1,observer:"_disableMapTypeControlChanged"},/**
     * If set, removes the map's 'street view' UI controls.
     */disableStreetViewControl:{type:Boolean,value:!1,observer:"_disableStreetViewControlChanged"},/**
     * If set, the zoom level is set such that all markers (google-map-marker children) are brought into view.
     */fitToMarkers:{type:Boolean,value:!1,observer:"_fitToMarkersChanged"},/**
     * If true, prevent the user from zooming the map interactively.
     */disableZoom:{type:Boolean,value:!1,observer:"_disableZoomChanged"},/**
     * If set, custom styles can be applied to the map.
     * For style documentation see https://developers.google.com/maps/documentation/javascript/reference#MapTypeStyle
     */styles:{type:Object,value(){return{}}},/**
     * A maximum zoom level which will be displayed on the map.
     */maxZoom:{type:Number,observer:"_maxZoomChanged"},/**
     * A minimum zoom level which will be displayed on the map.
     */minZoom:{type:Number,observer:"_minZoomChanged"},/**
     * If true, sign-in is enabled.
     * See https://developers.google.com/maps/documentation/javascript/signedin#enable_sign_in
     */signedIn:{type:Boolean,value:!1},/**
     * The localized language to load the Maps API with. For more information
     * see https://developers.google.com/maps/documentation/javascript/basics#Language
     *
     * Note: the Maps API defaults to the preffered language setting of the browser.
     * Use this parameter to override that behavior.
     */language:{type:String},/**
     * When true, map *click events are automatically registered.
     */clickEvents:{type:Boolean,value:!1,observer:"_clickEventsChanged"},/**
     * When true, map bounds and center change events are automatically
     * registered.
     */boundEvents:{type:Boolean,value:!0,observer:"_boundEventsChanged"},/**
     * When true, map drag* events are automatically registered.
     */dragEvents:{type:Boolean,value:!1,observer:"_dragEventsChanged"},/**
     * When true, map mouse* events are automatically registered.
     */mouseEvents:{type:Boolean,value:!1,observer:"_mouseEventsChanged"},/**
     * Additional map options for google.maps.Map constructor.
     * Use to specify additional options we do not expose as
     * properties.
     * Ex: `<google-map additional-map-options='{"mapTypeId":"satellite"}'>`
     *
     * Note, you can't use API enums like `google.maps.ControlPosition.TOP_RIGHT`
     * when using this property as an HTML attribute. Instead, use the actual
     * value (e.g. `3`) or set `.additionalMapOptions` in JS rather than using
     * the attribute.
     */additionalMapOptions:{type:Object,value(){return{}}},/**
     * The markers on the map.
     */markers:{type:Array,value(){return[]},readOnly:!0},/**
     * The non-marker objects on the map.
     */objects:{type:Array,value(){return[]},readOnly:!0},/**
     * If set, all other info windows on markers are closed when opening a new one.
     */singleInfoWindow:{type:Boolean,value:!1}},listeners:{"iron-resize":"resize"},observers:["_debounceUpdateCenter(latitude, longitude)"],attached(){this._initGMap()},detached(){if(this._markersChildrenListener){this.unlisten(this.$.selector,"items-changed","_updateMarkers");this._markersChildrenListener=null}if(this._objectsMutationObserver){this._objectsMutationObserver.disconnect();this._objectsMutationObserver=null}},behaviors:[IronResizableBehavior],_initGMap(){if(this.map){return;// already initialized
}if(!0!==this.$.api.libraryLoaded){return;// api not loaded
}if(!this.isAttached){return;// not attached
}this.map=new google.maps.Map(this.$.map,this._getMapOptions());this._listeners={};this._updateCenter();this._loadKml();this._updateMarkers();this._updateObjects();this._addMapListeners();this.fire("google-map-ready")},_mapApiLoaded(){this._initGMap()},_getMapOptions(){const mapOptions={zoom:this.zoom,tilt:this.noAutoTilt?0:45,mapTypeId:this.mapType,disableDefaultUI:this.disableDefaultUi,mapTypeControl:!this.disableDefaultUi&&!this.disableMapTypeControl,streetViewControl:!this.disableDefaultUi&&!this.disableStreetViewControl,disableDoubleClickZoom:this.disableZoom,scrollwheel:!this.disableZoom,styles:this.styles,maxZoom:+this.maxZoom,minZoom:+this.minZoom};// Only override the default if set.
// We use getAttribute here because the default value of this.draggable = false even when not set.
if(null!=this.getAttribute("draggable")){mapOptions.draggable=this.draggable}for(const p in this.additionalMapOptions){mapOptions[p]=this.additionalMapOptions[p]}return mapOptions},_attachChildrenToMap(children){if(this.map){for(var i=0,child;child=children[i];++i){child.map=this.map}}},// watch for future updates to marker objects
_observeMarkers(){// Watch for future updates.
if(this._markersChildrenListener){return}this._markersChildrenListener=this.listen(this.$.selector,"items-changed","_updateMarkers")},_updateMarkers(){const newMarkers=Array.prototype.slice.call(this.$.markers.assignedNodes({flatten:!0}));// do not recompute if markers have not been added or removed
if(newMarkers.length===this.markers.length){const added=newMarkers.filter(m=>this.markers&&-1===this.markers.indexOf(m));if(0===added.length){// set up observer first time around
if(!this._markersChildrenListener){this._observeMarkers()}return}}this._observeMarkers();this.markers=this._setMarkers(newMarkers);// Set the map on each marker and zoom viewport to ensure they're in view.
this._attachChildrenToMap(this.markers);if(this.fitToMarkers){this._fitToMarkersChanged()}},// watch for future updates to non-marker objects
_observeObjects(){if(this._objectsMutationObserver){return}this._objectsMutationObserver=new MutationObserver(this._updateObjects.bind(this));this._objectsMutationObserver.observe(this,{childList:!0})},_updateObjects(){const newObjects=Array.prototype.slice.call(this.$.objects.assignedNodes({flatten:!0}));// Do not recompute if objects have not been added or removed.
if(newObjects.length===this.objects.length){const added=newObjects.filter(o=>-1===this.objects.indexOf(o));if(0===added.length){// Set up observer first time around.
this._observeObjects();return}}this._observeObjects();this._setObjects(newObjects);this._attachChildrenToMap(this.objects)},/**
   * Clears all markers from the map.
   *
   * @method clear
   */clear(){for(var i=0,m;m=this.markers[i];++i){m.marker.setMap(null)}},/**
   * Explicitly resizes the map, updating its center. This is useful if the
   * map does not show after you have unhidden it.
   *
   * @method resize
   */resize(){if(this.map){// saves and restores latitude/longitude because resize can move the center
const oldLatitude=this.latitude,oldLongitude=this.longitude;google.maps.event.trigger(this.map,"resize");this.latitude=oldLatitude;// restore because resize can move our center
this.longitude=oldLongitude;if(this.fitToMarkers){// we might not have a center if we are doing fit-to-markers
this._fitToMarkersChanged()}}},_loadKml(){if(this.map&&this.kml){const kmlfile=new google.maps.KmlLayer({url:this.kml,map:this.map})}},_debounceUpdateCenter(){this.debounce("updateCenter",this._updateCenter)},_updateCenter(){this.cancelDebouncer("updateCenter");if(this.map&&this.latitude!==void 0&&this.longitude!==void 0){// allow for latitude and longitude to be String-typed, but still Number valued
const lati=+this.latitude;if(isNaN(lati)){throw new TypeError("latitude must be a number")}const longi=+this.longitude;if(isNaN(longi)){throw new TypeError("longitude must be a number")}const newCenter=new google.maps.LatLng(lati,longi);let oldCenter=this.map.getCenter();if(!oldCenter){// If the map does not have a center, set it right away.
this.map.setCenter(newCenter)}else{// Using google.maps.LatLng returns corrected lat/lngs.
oldCenter=new google.maps.LatLng(oldCenter.lat(),oldCenter.lng());// If the map currently has a center, slowly pan to the new one.
if(!oldCenter.equals(newCenter)){this.map.panTo(newCenter)}}}},_zoomChanged(){if(this.map){this.map.setZoom(+this.zoom)}},_idleEvent(){if(this.map){this._forwardEvent("idle")}else{this._clearListener("idle")}},_boundEventsChanged(){if(this.map){if(this.boundEvents){this._forwardEvent("center_changed");this._forwardEvent("bounds_changed")}else{this._clearListener("center_changed");this._clearListener("bounds_changed")}}},_clickEventsChanged(){if(this.map){if(this.clickEvents){this._forwardEvent("click");this._forwardEvent("dblclick");this._forwardEvent("rightclick")}else{this._clearListener("click");this._clearListener("dblclick");this._clearListener("rightclick")}}},_dragEventsChanged(){if(this.map){if(this.dragEvents){this._forwardEvent("drag");this._forwardEvent("dragend");this._forwardEvent("dragstart")}else{this._clearListener("drag");this._clearListener("dragend");this._clearListener("dragstart")}}},_mouseEventsChanged(){if(this.map){if(this.mouseEvents){this._forwardEvent("mousemove");this._forwardEvent("mouseout");this._forwardEvent("mouseover")}else{this._clearListener("mousemove");this._clearListener("mouseout");this._clearListener("mouseover")}}},_maxZoomChanged(){if(this.map){this.map.setOptions({maxZoom:+this.maxZoom})}},_minZoomChanged(){if(this.map){this.map.setOptions({minZoom:+this.minZoom})}},_mapTypeChanged(){if(this.map){this.map.setMapTypeId(this.mapType)}},_disableDefaultUiChanged(){if(!this.map){return}this.map.setOptions({disableDefaultUI:this.disableDefaultUi})},_disableMapTypeControlChanged(){if(!this.map){return}this.map.setOptions({mapTypeControl:!this.disableMapTypeControl})},_disableStreetViewControlChanged(){if(!this.map){return}this.map.setOptions({streetViewControl:!this.disableStreetViewControl})},_disableZoomChanged(){if(!this.map){return}this.map.setOptions({disableDoubleClickZoom:this.disableZoom,scrollwheel:!this.disableZoom})},attributeChanged(attrName){if(!this.map){return}// Cannot use *Changed watchers for native properties.
switch(attrName){case"draggable":this.map.setOptions({draggable:this.draggable});break;}},_fitToMarkersChanged(){// TODO(ericbidelman): respect user's zoom level.
if(this.map&&this.fitToMarkers&&0<this.markers.length){const latLngBounds=new google.maps.LatLngBounds;for(var i=0,m;m=this.markers[i];++i){latLngBounds.extend(new google.maps.LatLng(m.latitude,m.longitude))}// For one marker, don't alter zoom, just center it.
if(1<this.markers.length){this.map.fitBounds(latLngBounds)}this.map.setCenter(latLngBounds.getCenter())}},_addMapListeners(){google.maps.event.addListener(this.map,"center_changed",()=>{const center=this.map.getCenter();this.latitude=center.lat();this.longitude=center.lng()});google.maps.event.addListener(this.map,"zoom_changed",()=>{this.zoom=this.map.getZoom()});google.maps.event.addListener(this.map,"maptypeid_changed",()=>{this.mapType=this.map.getMapTypeId()});this._clickEventsChanged();this._boundEventsChanged();this._dragEventsChanged();this._mouseEventsChanged();this._idleEvent()},_clearListener(name){if(this._listeners[name]){google.maps.event.removeListener(this._listeners[name]);this._listeners[name]=null}},_forwardEvent(name){this._listeners[name]=google.maps.event.addListener(this.map,name,event=>{this.fire(`google-map-${name}`,event)})},_deselectMarker(e,detail){// If singleInfoWindow is set, update iron-selector's selected attribute to be null.
// Else remove the marker from iron-selector's selected array.
const markerIndex=this.$.selector.indexOf(e.target);if(this.singleInfoWindow){this.$.selector.selected=null}else if(this.$.selector.selectedValues){this.$.selector.selectedValues=this.$.selector.selectedValues.filter(i=>i!==markerIndex)}}});Polymer({_template:html`
    <style>
      :host {
        display: block;
      }

      /* TODO: This should be a dropdown */
      span {
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }

      .country-code {
        width: 40px;
        @apply --gold-phone-input-country-code;
      }

      input {
        @apply --layout-flex;
      }
      input
      {
        position: relative; /* to make a stacking context */
        outline: none;
        box-shadow: none;
        padding: 0;
        width: 100%;
        max-width: 100%;
        background: transparent;
        border: none;
        color: var(--paper-input-container-input-color, var(--primary-text-color));
        -webkit-appearance: none;
        text-align: inherit;
        vertical-align: bottom;
        /* Firefox sets a min-width on the input, which can cause layout issues */
        min-width: 0;
        @apply --paper-font-subhead;
        @apply --paper-input-container-input;
      }
      input::-webkit-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input::-moz-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
      input:-ms-input-placeholder {
        color: var(--paper-input-container-color, var(--secondary-text-color));
      }
    </style>
    <paper-input-container
        id="container"
        disabled$="[[disabled]]"
        no-label-float="[[noLabelFloat]]"
        always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]"
        invalid="[[invalid]]">

      <label slot="label" hidden$="[[!label]]">[[label]]</label>

      <span slot="prefix" prefix class="country-code">+[[countryCode]]</span>

      <iron-input
          id="input"
          slot="input"
          bind-value="{{value}}"
          allowed-pattern="[0-9\\-]"
          invalid="{{invalid}}">
        <input
            id="nativeInput"
            aria-labelledby$="[[_ariaLabelledBy]]"
            aria-describedby$="[[_ariaDescribedBy]]"
            required$="[[required]]"
            name$="[[name]]"
            autocomplete="tel"
            type="tel"
            disabled$="[[disabled]]"
            autofocus$="[[autofocus]]"
            inputmode$="[[inputmode]]"
            placeholder$="[[placeholder]]"
            readonly$="[[readonly]]"
            maxlength$="[[maxlength]]"
            size$="[[size]]">
      </iron-input>

      <template is="dom-if" if="[[errorMessage]]">
        <paper-input-error slot="add-on" id="error">
          [[errorMessage]]
        </paper-input-error>
      </template>
    </paper-input-container>
  `,is:"gold-phone-input",behaviors:[PaperInputBehavior,IronFormElementBehavior],properties:{/**
     * The label for this input.
     */label:{type:String,value:"Phone number"},/*
     * The country code that should be recognized and parsed.
     */countryCode:{type:String,value:"1"},/*
     * The format of a valid phone number, including formatting but excluding
     * the country code. Use 'X' to denote the digits separated by dashes.
     */phoneNumberPattern:{type:String,value:"XXX-XXX-XXXX",observer:"_phoneNumberPatternChanged"},value:{type:String,observer:"_onValueChanged"},/**
     * International format of the input value.
     *
     * @type {String}
     */internationalValue:{type:String,notify:!0,computed:"_computeInternationalValue(countryCode, value)"}},observers:["_onFocusedChanged(focused)"],/**
   * Returns a reference to the focusable element. Overridden from
   * PaperInputBehavior to correctly focus the native input.
   */get _focusableElement(){return this.inputElement._inputElement},// Note: This event is only available in the 2+ version of this element.
listeners:{"iron-input-ready":"_onIronInputReady","bind-value-changed":"_onBindValueChanged"},_onIronInputReady:function(){// Only validate when attached if the input already has a value.
if(!!this.inputElement.bindValue){this._handleAutoValidate();// Assign an empty string value if no value so if it becomes time
// to validate it is not undefined.
}else{this.value=""}},_onBindValueChanged:function(){this.value=this.bindValue=this.inputElement.value},_phoneNumberPatternChanged:function(){// Transform the pattern into a regex the iron-input understands.
var regex="";regex=this.phoneNumberPattern.replace(/\s/g,"\\s");regex=regex.replace(/X/gi,"\\d");regex=regex.replace(/\+/g,"\\+");if(this.$.nativeInput){this.$.nativeInput.pattern=regex}else{this.$.input.pattern=regex}},/**
   * A handler that is called on input
   */_onValueChanged:function(value,oldValue){// The initial property assignment is handled by `ready`.
if(oldValue==void 0||value===oldValue)return;// Ensure value is a string
value=value?value.toString():"";// Keep track of how many dashes the original value has. After
// reformatting the value, we might gain or lose some of them, which
// means we have to correctly move the caret to account for the difference.
var start=this.$.input.selectionStart,initialDashesBeforeCaret=value.substr(0,start).split("-").length-1;// Remove any already-applied formatting.
value=value.replace(/-/g,"");for(var shouldFormat=value.length<=this.phoneNumberPattern.replace(/-/g,"").length,formattedValue="",currentDashIndex=0,totalDashesAdded=0,i=0;i<value.length;i++){currentDashIndex=this.phoneNumberPattern.indexOf("-",currentDashIndex);// Since we remove any formatting first, we need to account added dashes
// when counting the position of new dashes in the pattern.
if(shouldFormat&&i==currentDashIndex-totalDashesAdded){formattedValue+="-";currentDashIndex++;totalDashesAdded++}formattedValue+=value[i]}var updatedDashesBeforeCaret=formattedValue.substr(0,start).split("-").length-1,dashesDifference=updatedDashesBeforeCaret-initialDashesBeforeCaret;// Note: this will call _onValueChanged again, which will move the
// cursor to the end of the value. Correctly adjust the caret afterwards.
this.updateValueAndPreserveCaret(formattedValue.trim());// Advance or back up the caret based on the change that happened before it.
this.$.input.selectionStart=this.$.input.selectionEnd=start+dashesDifference;this._handleAutoValidate()},/**
   * Overidden from Polymer.PaperInputBehavior.
   */validate:function(){// Update the container and its addons (i.e. the custom error-message).
var valid=this.$.input.validate();this.$.container.invalid=!valid;this.$.container.updateAddons({inputElement:this.$.input,value:this.value,invalid:!valid});return valid},/**
   * Overidden from Polymer.IronControlState.
   */_onFocusedChanged:function(focused){if(!focused){this._handleAutoValidate()}},/**
   * Returns the phone number value prefixed by the country code or simply
   * the value if the country code is not set. When	`value` equals
   * "3-44-55-66-77" and the `countryCode` is "33", the `internationalValue`
   * equals "+(33)3-44-55-66-77"
   */_computeInternationalValue:function(countryCode,value){return countryCode?"+("+countryCode+")"+value:value}});/**
    @license
    Copyright (c) 2017 Vaadin Ltd.
    This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
    */ /**
        * A private mixin to avoid problems with dynamic properties and Polymer Analyzer.
        * No need to expose these properties in the API docs.
        * @polymerMixin
        */const TabIndexMixin=superClass=>class VaadinTabIndexMixin extends superClass{static get properties(){var properties={/**
       * Internal property needed to listen to `tabindex` attribute changes.
       *
       * For changing the tabindex of this component use the native `tabIndex` property.
       * @private
       */tabindex:{type:Number,value:0,reflectToAttribute:!0,observer:"_tabindexChanged"}};if(window.ShadyDOM){// ShadyDOM browsers need the `tabIndex` in order to notify when the user changes it programmatically.
properties.tabIndex=properties.tabindex}return properties}},ControlStateMixin=superClass=>class VaadinControlStateMixin extends TabIndexMixin(superClass){static get properties(){return{/**
       * Specify that this control should have input focus when the page loads.
       */autofocus:{type:Boolean},/**
       * Stores the previous value of tabindex attribute of the disabled element
       */_previousTabIndex:{type:Number},/**
       * If true, the user cannot interact with this element.
       */disabled:{type:Boolean,observer:"_disabledChanged",reflectToAttribute:!0},_isShiftTabbing:{type:Boolean}}}ready(){this.addEventListener("focusin",e=>{if(e.composedPath()[0]===this){this._focus(e)}else if(-1!==e.composedPath().indexOf(this.focusElement)&&!this.disabled){this._setFocused(!0)}});this.addEventListener("focusout",e=>this._setFocused(!1));// In super.ready() other 'focusin' and 'focusout' listeners might be
// added, so we call it after our own ones to ensure they execute first.
// Issue to watch out: when incorrect, <vaadin-combo-box> refocuses the
// input field on iOS after “Done” is pressed.
super.ready();// This fixes the bug in Firefox 61 (https://bugzilla.mozilla.org/show_bug.cgi?id=1472887)
// where focusout event does not go out of shady DOM because composed property in the event is not true
const ensureEventComposed=e=>{if(!e.composed){e.target.dispatchEvent(new CustomEvent(e.type,{bubbles:!0,composed:!0,cancelable:!1}))}};this.shadowRoot.addEventListener("focusin",ensureEventComposed);this.shadowRoot.addEventListener("focusout",ensureEventComposed);this.addEventListener("keydown",e=>{if(!e.defaultPrevented&&9===e.keyCode){if(e.shiftKey){// Flag is checked in _focus event handler.
this._isShiftTabbing=!0;HTMLElement.prototype.focus.apply(this);this._setFocused(!1);// Event handling in IE is asynchronous and the flag is removed asynchronously as well
setTimeout(()=>this._isShiftTabbing=!1,0)}else{// Workaround for FF63-65 bug that causes the focus to get lost when
// blurring a slotted component with focusable shadow root content
// https://bugzilla.mozilla.org/show_bug.cgi?id=1528686
// TODO: Remove when safe
const firefox=window.navigator.userAgent.match(/Firefox\/(\d\d\.\d)/);if(firefox&&63<=parseFloat(firefox[1])&&66>parseFloat(firefox[1])&&this.parentNode&&this.nextSibling){const fakeTarget=document.createElement("input");fakeTarget.style.position="absolute";fakeTarget.style.opacity=0;fakeTarget.tabIndex=this.tabIndex;this.parentNode.insertBefore(fakeTarget,this.nextSibling);fakeTarget.focus();fakeTarget.addEventListener("focusout",()=>this.parentNode.removeChild(fakeTarget))}}}});if(this.autofocus&&!this.focused&&!this.disabled){window.requestAnimationFrame(()=>{this._focus();this._setFocused(!0);this.setAttribute("focus-ring","")})}this._boundKeydownListener=this._bodyKeydownListener.bind(this);this._boundKeyupListener=this._bodyKeyupListener.bind(this)}/**
     * @protected
     */connectedCallback(){super.connectedCallback();document.body.addEventListener("keydown",this._boundKeydownListener,!0);document.body.addEventListener("keyup",this._boundKeyupListener,!0)}/**
     * @protected
     */disconnectedCallback(){super.disconnectedCallback();document.body.removeEventListener("keydown",this._boundKeydownListener,!0);document.body.removeEventListener("keyup",this._boundKeyupListener,!0);// in non-Chrome browsers, blur does not fire on the element when it is disconnected.
// reproducible in `<vaadin-date-picker>` when closing on `Cancel` or `Today` click.
if(this.hasAttribute("focused")){this._setFocused(!1)}}_setFocused(focused){if(focused){this.setAttribute("focused","")}else{this.removeAttribute("focused")}// focus-ring is true when the element was focused from the keyboard.
// Focus Ring [A11ycasts]: https://youtu.be/ilj2P5-5CjI
if(focused&&this._tabPressed){this.setAttribute("focus-ring","")}else{this.removeAttribute("focus-ring")}}_bodyKeydownListener(e){this._tabPressed=9===e.keyCode}_bodyKeyupListener(){this._tabPressed=!1}/**
     * Any element extending this mixin is required to implement this getter.
     * It returns the actual focusable element in the component.
     */get focusElement(){window.console.warn(`Please implement the 'focusElement' property in <${this.localName}>`);return this}_focus(e){if(this._isShiftTabbing){return}this.focusElement.focus();this._setFocused(!0)}/**
     * Moving the focus from the host element causes firing of the blur event what leads to problems in IE.
     * @private
     */focus(){if(!this.focusElement||this.disabled){return}this.focusElement.focus();this._setFocused(!0)}/**
     * Native bluring in the host element does nothing because it does not have the focus.
     * In chrome it works, but not in FF.
     * @private
     */blur(){this.focusElement.blur();this._setFocused(!1)}_disabledChanged(disabled){this.focusElement.disabled=disabled;if(disabled){this.blur();this._previousTabIndex=this.tabindex;this.tabindex=-1;this.setAttribute("aria-disabled","true")}else{if("undefined"!==typeof this._previousTabIndex){this.tabindex=this._previousTabIndex}this.removeAttribute("aria-disabled")}}_tabindexChanged(tabindex){if(tabindex!==void 0){this.focusElement.tabIndex=tabindex}if(this.disabled&&this.tabindex){// If tabindex attribute was changed while checkbox was disabled
if(-1!==this.tabindex){this._previousTabIndex=this.tabindex}this.tabindex=tabindex=void 0}if(window.ShadyDOM){this.setProperties({tabIndex:tabindex,tabindex:tabindex})}}/**
     * @protected
     */click(){if(!this.disabled){super.click()}}};/**
    * Polymer.IronControlState is not a proper 2.0 class, also, its tabindex
    * implementation fails in the shadow dom, so we have this for vaadin elements.
    * @polymerMixin
    */var vaadinControlStateMixin={ControlStateMixin:ControlStateMixin};const DEV_MODE_CODE_REGEXP=/\/\*\*\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;function isMinified(){function test(){/** vaadin-dev-mode:start
    return false;
    vaadin-dev-mode:end **/return!0}return uncommentAndRun(test)}function isDevelopmentMode(){try{return isForcedDevelopmentMode()||isLocalhost()&&!isMinified()&&!isFlowProductionMode()}catch(e){// Some error in this code, assume production so no further actions will be taken
return!1}}function isForcedDevelopmentMode(){return localStorage.getItem("vaadin.developmentmode.force")}function isLocalhost(){return 0<=["localhost","127.0.0.1"].indexOf(window.location.hostname)}function isFlowProductionMode(){if(window.Vaadin&&window.Vaadin.Flow&&window.Vaadin.Flow.clients){const productionModeApps=Object.keys(window.Vaadin.Flow.clients).map(key=>window.Vaadin.Flow.clients[key]).filter(client=>client.productionMode);if(0<productionModeApps.length){return!0}}return!1}function uncommentAndRun(callback,args){if("function"!==typeof callback){return}const match=DEV_MODE_CODE_REGEXP.exec(callback.toString());if(match){try{// requires CSP: script-src 'unsafe-eval'
callback=new Function(match[1])}catch(e){// eat the exception
console.log("vaadin-development-mode-detector: uncommentAndRun() failed",e)}}return callback(args)}// A guard against polymer-modulizer removing the window.Vaadin
// initialization above.
window.Vaadin=window.Vaadin||{};/**
                                            * Inspects the source code of the given `callback` function for
                                            * specially-marked _commented_ code. If such commented code is found in the
                                            * callback source, uncomments and runs that code instead of the callback
                                            * itself. Otherwise runs the callback as is.
                                            *
                                            * The optional arguments are passed into the callback / uncommented code,
                                            * the result is returned.
                                            *
                                            * See the `isMinified()` function source code in this file for an example.
                                            *
                                            */const runIfDevelopmentMode=function(callback,args){if(window.Vaadin.developmentMode){return uncommentAndRun(callback,args)}};if(window.Vaadin.developmentMode===void 0){window.Vaadin.developmentMode=isDevelopmentMode()}var vaadinDevelopmentModeDetector={runIfDevelopmentMode:runIfDevelopmentMode};function maybeGatherAndSendStats(){/** vaadin-dev-mode:start
                                    (function () {
                                    'use strict';
                                    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
                                    return typeof obj;
                                    } : function (obj) {
                                    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
                                    };
                                    var classCallCheck = function (instance, Constructor) {
                                    if (!(instance instanceof Constructor)) {
                                      throw new TypeError("Cannot call a class as a function");
                                    }
                                    };
                                    var createClass = function () {
                                    function defineProperties(target, props) {
                                      for (var i = 0; i < props.length; i++) {
                                        var descriptor = props[i];
                                        descriptor.enumerable = descriptor.enumerable || false;
                                        descriptor.configurable = true;
                                        if ("value" in descriptor) descriptor.writable = true;
                                        Object.defineProperty(target, descriptor.key, descriptor);
                                      }
                                    }
                                     return function (Constructor, protoProps, staticProps) {
                                      if (protoProps) defineProperties(Constructor.prototype, protoProps);
                                      if (staticProps) defineProperties(Constructor, staticProps);
                                      return Constructor;
                                    };
                                    }();
                                    var getPolymerVersion = function getPolymerVersion() {
                                    return window.Polymer && window.Polymer.version;
                                    };
                                    var StatisticsGatherer = function () {
                                    function StatisticsGatherer(logger) {
                                      classCallCheck(this, StatisticsGatherer);
                                       this.now = new Date().getTime();
                                      this.logger = logger;
                                    }
                                     createClass(StatisticsGatherer, [{
                                      key: 'frameworkVersionDetectors',
                                      value: function frameworkVersionDetectors() {
                                        return {
                                          'Flow': function Flow() {
                                            if (window.Vaadin && window.Vaadin.Flow && window.Vaadin.Flow.clients) {
                                              var flowVersions = Object.keys(window.Vaadin.Flow.clients).map(function (key) {
                                                return window.Vaadin.Flow.clients[key];
                                              }).filter(function (client) {
                                                return client.getVersionInfo;
                                              }).map(function (client) {
                                                return client.getVersionInfo().flow;
                                              });
                                              if (flowVersions.length > 0) {
                                                return flowVersions[0];
                                              }
                                            }
                                          },
                                          'Vaadin Framework': function VaadinFramework() {
                                            if (window.vaadin && window.vaadin.clients) {
                                              var frameworkVersions = Object.values(window.vaadin.clients).filter(function (client) {
                                                return client.getVersionInfo;
                                              }).map(function (client) {
                                                return client.getVersionInfo().vaadinVersion;
                                              });
                                              if (frameworkVersions.length > 0) {
                                                return frameworkVersions[0];
                                              }
                                            }
                                          },
                                          'AngularJs': function AngularJs() {
                                            if (window.angular && window.angular.version && window.angular.version) {
                                              return window.angular.version.full;
                                            }
                                          },
                                          'Angular': function Angular() {
                                            if (window.ng) {
                                              var tags = document.querySelectorAll("[ng-version]");
                                              if (tags.length > 0) {
                                                return tags[0].getAttribute("ng-version");
                                              }
                                              return "Unknown";
                                            }
                                          },
                                          'Backbone.js': function BackboneJs() {
                                            if (window.Backbone) {
                                              return window.Backbone.VERSION;
                                            }
                                          },
                                          'React': function React() {
                                            var reactSelector = '[data-reactroot], [data-reactid]';
                                            if (!!document.querySelector(reactSelector)) {
                                              // React does not publish the version by default
                                              return "unknown";
                                            }
                                          },
                                          'Ember': function Ember() {
                                            if (window.Em && window.Em.VERSION) {
                                              return window.Em.VERSION;
                                            } else if (window.Ember && window.Ember.VERSION) {
                                              return window.Ember.VERSION;
                                            }
                                          },
                                          'jQuery': function (_jQuery) {
                                            function jQuery() {
                                              return _jQuery.apply(this, arguments);
                                            }
                                             jQuery.toString = function () {
                                              return _jQuery.toString();
                                            };
                                             return jQuery;
                                          }(function () {
                                            if (typeof jQuery === 'function' && jQuery.prototype.jquery !== undefined) {
                                              return jQuery.prototype.jquery;
                                            }
                                          }),
                                          'Polymer': function Polymer() {
                                            var version = getPolymerVersion();
                                            if (version) {
                                              return version;
                                            }
                                          },
                                          'LitElement': function LitElement() {
                                            var version = window.litElementVersions && window.litElementVersions[0];
                                            if (version) {
                                              return version;
                                            }
                                          },
                                          'LitHtml': function LitHtml() {
                                            var version = window.litHtmlVersions && window.litHtmlVersions[0];
                                            if (version) {
                                              return version;
                                            }
                                          },
                                          'Vue.js': function VueJs() {
                                            if (window.Vue) {
                                              return window.Vue.version;
                                            }
                                          }
                                        };
                                      }
                                    }, {
                                      key: 'getUsedVaadinElements',
                                      value: function getUsedVaadinElements(elements) {
                                        var version = getPolymerVersion();
                                        var elementClasses = void 0;
                                        if (version && version.indexOf('2') === 0) {
                                          // Polymer 2: components classes are stored in window.Vaadin
                                          elementClasses = Object.keys(window.Vaadin).map(function (c) {
                                            return window.Vaadin[c];
                                          }).filter(function (c) {
                                            return c.is;
                                          });
                                        } else {
                                          // Polymer 3: components classes are stored in window.Vaadin.registrations
                                          elementClasses = window.Vaadin.registrations || [];
                                        }
                                        elementClasses.forEach(function (klass) {
                                          var version = klass.version ? klass.version : "0.0.0";
                                          elements[klass.is] = { version: version };
                                        });
                                      }
                                    }, {
                                      key: 'getUsedVaadinThemes',
                                      value: function getUsedVaadinThemes(themes) {
                                        ['Lumo', 'Material'].forEach(function (themeName) {
                                          var theme;
                                          var version = getPolymerVersion();
                                          if (version && version.indexOf('2') === 0) {
                                            // Polymer 2: themes are stored in window.Vaadin
                                            theme = window.Vaadin[themeName];
                                          } else {
                                            // Polymer 3: themes are stored in custom element registry
                                            theme = customElements.get('vaadin-' + themeName.toLowerCase() + '-styles');
                                          }
                                          if (theme && theme.version) {
                                            themes[themeName] = { version: theme.version };
                                          }
                                        });
                                      }
                                    }, {
                                      key: 'getFrameworks',
                                      value: function getFrameworks(frameworks) {
                                        var detectors = this.frameworkVersionDetectors();
                                        Object.keys(detectors).forEach(function (framework) {
                                          var detector = detectors[framework];
                                          try {
                                            var version = detector();
                                            if (version) {
                                              frameworks[framework] = { "version": version };
                                            }
                                          } catch (e) {}
                                        });
                                      }
                                    }, {
                                      key: 'gather',
                                      value: function gather(storage) {
                                        var storedStats = storage.read();
                                        var gatheredStats = {};
                                        var types = ["elements", "frameworks", "themes"];
                                         types.forEach(function (type) {
                                          gatheredStats[type] = {};
                                          if (!storedStats[type]) {
                                            storedStats[type] = {};
                                          }
                                        });
                                         var previousStats = JSON.stringify(storedStats);
                                         this.getUsedVaadinElements(gatheredStats.elements);
                                        this.getFrameworks(gatheredStats.frameworks);
                                        this.getUsedVaadinThemes(gatheredStats.themes);
                                         var now = this.now;
                                        types.forEach(function (type) {
                                          var keys = Object.keys(gatheredStats[type]);
                                          keys.forEach(function (key) {
                                            if (!storedStats[type][key] || _typeof(storedStats[type][key]) != _typeof({})) {
                                              storedStats[type][key] = { "firstUsed": now };
                                            }
                                            // Discards any previously logged version numebr
                                            storedStats[type][key].version = gatheredStats[type][key].version;
                                            storedStats[type][key].lastUsed = now;
                                          });
                                        });
                                         var newStats = JSON.stringify(storedStats);
                                        storage.write(newStats);
                                        if (newStats != previousStats && Object.keys(storedStats).length > 0) {
                                          this.logger.debug("New stats: " + newStats);
                                        }
                                      }
                                    }]);
                                    return StatisticsGatherer;
                                    }();
                                    var StatisticsStorage = function () {
                                    function StatisticsStorage(key) {
                                      classCallCheck(this, StatisticsStorage);
                                       this.key = key;
                                    }
                                     createClass(StatisticsStorage, [{
                                      key: 'read',
                                      value: function read() {
                                        var localStorageStatsString = localStorage.getItem(this.key);
                                        try {
                                          return JSON.parse(localStorageStatsString ? localStorageStatsString : '{}');
                                        } catch (e) {
                                          return {};
                                        }
                                      }
                                    }, {
                                      key: 'write',
                                      value: function write(data) {
                                        localStorage.setItem(this.key, data);
                                      }
                                    }, {
                                      key: 'clear',
                                      value: function clear() {
                                        localStorage.removeItem(this.key);
                                      }
                                    }, {
                                      key: 'isEmpty',
                                      value: function isEmpty() {
                                        var storedStats = this.read();
                                        var empty = true;
                                        Object.keys(storedStats).forEach(function (key) {
                                          if (Object.keys(storedStats[key]).length > 0) {
                                            empty = false;
                                          }
                                        });
                                         return empty;
                                      }
                                    }]);
                                    return StatisticsStorage;
                                    }();
                                    var StatisticsSender = function () {
                                    function StatisticsSender(url, logger) {
                                      classCallCheck(this, StatisticsSender);
                                       this.url = url;
                                      this.logger = logger;
                                    }
                                     createClass(StatisticsSender, [{
                                      key: 'send',
                                      value: function send(data, errorHandler) {
                                        var logger = this.logger;
                                         if (navigator.onLine === false) {
                                          logger.debug("Offline, can't send");
                                          errorHandler();
                                          return;
                                        }
                                        logger.debug("Sending data to " + this.url);
                                         var req = new XMLHttpRequest();
                                        req.withCredentials = true;
                                        req.addEventListener("load", function () {
                                          // Stats sent, nothing more to do
                                          logger.debug("Response: " + req.responseText);
                                        });
                                        req.addEventListener("error", function () {
                                          logger.debug("Send failed");
                                          errorHandler();
                                        });
                                        req.addEventListener("abort", function () {
                                          logger.debug("Send aborted");
                                          errorHandler();
                                        });
                                        req.open("POST", this.url);
                                        req.setRequestHeader("Content-Type", "application/json");
                                        req.send(data);
                                      }
                                    }]);
                                    return StatisticsSender;
                                    }();
                                    var StatisticsLogger = function () {
                                    function StatisticsLogger(id) {
                                      classCallCheck(this, StatisticsLogger);
                                       this.id = id;
                                    }
                                     createClass(StatisticsLogger, [{
                                      key: '_isDebug',
                                      value: function _isDebug() {
                                        return localStorage.getItem("vaadin." + this.id + ".debug");
                                      }
                                    }, {
                                      key: 'debug',
                                      value: function debug(msg) {
                                        if (this._isDebug()) {
                                          console.info(this.id + ": " + msg);
                                        }
                                      }
                                    }]);
                                    return StatisticsLogger;
                                    }();
                                    var UsageStatistics = function () {
                                    function UsageStatistics() {
                                      classCallCheck(this, UsageStatistics);
                                       this.now = new Date();
                                      this.timeNow = this.now.getTime();
                                      this.gatherDelay = 10; // Delay between loading this file and gathering stats
                                      this.initialDelay = 24 * 60 * 60;
                                       this.logger = new StatisticsLogger("statistics");
                                      this.storage = new StatisticsStorage("vaadin.statistics.basket");
                                      this.gatherer = new StatisticsGatherer(this.logger);
                                      this.sender = new StatisticsSender("https://tools.vaadin.com/usage-stats/submit", this.logger);
                                    }
                                     createClass(UsageStatistics, [{
                                      key: 'maybeGatherAndSend',
                                      value: function maybeGatherAndSend() {
                                        var _this = this;
                                         if (localStorage.getItem(UsageStatistics.optOutKey)) {
                                          return;
                                        }
                                        this.gatherer.gather(this.storage);
                                        setTimeout(function () {
                                          _this.maybeSend();
                                        }, this.gatherDelay * 1000);
                                      }
                                    }, {
                                      key: 'lottery',
                                      value: function lottery() {
                                        return Math.random() <= 0.05;
                                      }
                                    }, {
                                      key: 'currentMonth',
                                      value: function currentMonth() {
                                        return this.now.getYear() * 12 + this.now.getMonth();
                                      }
                                    }, {
                                      key: 'maybeSend',
                                      value: function maybeSend() {
                                        var firstUse = Number(localStorage.getItem(UsageStatistics.firstUseKey));
                                        var monthProcessed = Number(localStorage.getItem(UsageStatistics.monthProcessedKey));
                                         if (!firstUse) {
                                          // Use a grace period to avoid interfering with tests, incognito mode etc
                                          firstUse = this.timeNow;
                                          localStorage.setItem(UsageStatistics.firstUseKey, firstUse);
                                        }
                                         if (this.timeNow < firstUse + this.initialDelay * 1000) {
                                          this.logger.debug("No statistics will be sent until the initial delay of " + this.initialDelay + "s has passed");
                                          return;
                                        }
                                        if (this.currentMonth() <= monthProcessed) {
                                          this.logger.debug("This month has already been processed");
                                          return;
                                        }
                                        localStorage.setItem(UsageStatistics.monthProcessedKey, this.currentMonth());
                                        // Use random sampling
                                        if (this.lottery()) {
                                          this.logger.debug("Congratulations, we have a winner!");
                                        } else {
                                          this.logger.debug("Sorry, no stats from you this time");
                                          return;
                                        }
                                         this.send();
                                      }
                                    }, {
                                      key: 'send',
                                      value: function send() {
                                        // Ensure we have the latest data
                                        this.gatherer.gather(this.storage);
                                         // Read, send and clean up
                                        var data = this.storage.read();
                                        data["firstUse"] = Number(localStorage.getItem(UsageStatistics.firstUseKey));
                                        data["usageStatisticsVersion"] = UsageStatistics.version;
                                        var info = 'This request contains usage statistics gathered from the application running in development mode. \n\nStatistics gathering is automatically disabled and excluded from production builds.\n\nFor details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.\n\n\n\n';
                                        var self = this;
                                        this.sender.send(info + JSON.stringify(data), function () {
                                          // Revert the 'month processed' flag
                                          localStorage.setItem(UsageStatistics.monthProcessedKey, self.currentMonth() - 1);
                                        });
                                      }
                                    }], [{
                                      key: 'version',
                                      get: function get$1() {
                                        return '2.0.1';
                                      }
                                    }, {
                                      key: 'firstUseKey',
                                      get: function get$1() {
                                        return 'vaadin.statistics.firstuse';
                                      }
                                    }, {
                                      key: 'monthProcessedKey',
                                      get: function get$1() {
                                        return 'vaadin.statistics.monthProcessed';
                                      }
                                    }, {
                                      key: 'optOutKey',
                                      get: function get$1() {
                                        return 'vaadin.statistics.optout';
                                      }
                                    }]);
                                    return UsageStatistics;
                                    }();
                                    try {
                                    window.Vaadin = window.Vaadin || {};
                                    window.Vaadin.usageStatsChecker = window.Vaadin.usageStatsChecker || new UsageStatistics();
                                    window.Vaadin.usageStatsChecker.maybeGatherAndSend();
                                    } catch (e) {
                                    // Intentionally ignored as this is not a problem in the app being developed
                                    }
                                    }());
                                     vaadin-dev-mode:end **/}const usageStatistics=function(){if("function"===typeof runIfDevelopmentMode){return runIfDevelopmentMode(maybeGatherAndSendStats)}};var vaadinUsageStatistics={usageStatistics:usageStatistics};if(!window.Vaadin){window.Vaadin={}}/**
   * Array of Vaadin custom element classes that have been finalized.
   */window.Vaadin.registrations=window.Vaadin.registrations||[];// Use the hack to prevent polymer-modulizer from converting to exports
window.Vaadin.developmentModeCallback=window.Vaadin.developmentModeCallback||{};window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]=function(){if(usageStatistics){usageStatistics()}};let statsJob;/**
               * @polymerMixin
               */const ElementMixin=superClass=>class VaadinElementMixin extends superClass{/** @protected */static _finalizeClass(){super._finalizeClass();// Registers a class prototype for telemetry purposes.
if(this.is){window.Vaadin.registrations.push(this);if(window.Vaadin.developmentModeCallback){statsJob=Debouncer.debounce(statsJob,idlePeriod,()=>{window.Vaadin.developmentModeCallback["vaadin-usage-statistics"]()});enqueueDebouncer(statsJob)}}}ready(){super.ready();if(null===document.doctype){console.warn("Vaadin components require the \"standards mode\" declaration. Please add <!DOCTYPE html> to the HTML document.")}}};var vaadinElementMixin={ElementMixin:ElementMixin};/**
   @license
   Copyright (c) 2017 Vaadin Ltd.
   This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
   */ /**
       * A mixin providing `focused`, `focus-ring`, `active`, `disabled` and `selected`.
       *
       * `focused`, `active` and `focus-ring` are set as only as attributes.
       * @polymerMixin
       */const ItemMixin=superClass=>class VaadinItemMixin extends superClass{static get properties(){return{/**
       * Used for mixin detection because `instanceof` does not work with mixins.
       * e.g. in VaadinListMixin it filters items by using the
       * `element._hasVaadinItemMixin` condition.
       */_hasVaadinItemMixin:{value:!0},/**
       * If true, the user cannot interact with this element.
       */disabled:{type:Boolean,value:!1,observer:"_disabledChanged",reflectToAttribute:!0},/**
       * If true, the item is in selected state.
       */selected:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_selectedChanged"},_value:String}}constructor(){super();/**
              * Submittable string value. The default value is the trimmed text content of the element.
              * @type {string}
              */this.value}get value(){return this._value!==void 0?this._value:this.textContent.trim()}set value(value){this._value=value}ready(){super.ready();const attrValue=this.getAttribute("value");if(null!==attrValue){this.value=attrValue}this.addEventListener("focus",e=>this._setFocused(!0),!0);this.addEventListener("blur",e=>this._setFocused(!1),!0);this.addEventListener("mousedown",e=>{this._setActive(this._mousedown=!0);const mouseUpListener=()=>{this._setActive(this._mousedown=!1);document.removeEventListener("mouseup",mouseUpListener)};document.addEventListener("mouseup",mouseUpListener)});this.addEventListener("keydown",e=>this._onKeydown(e));this.addEventListener("keyup",e=>this._onKeyup(e))}/**
     * @protected
     */disconnectedCallback(){super.disconnectedCallback();// in Firefox and Safari, blur does not fire on the element when it is removed,
// especially between keydown and keyup events, being active at the same time.
// reproducible in `<vaadin-dropdown-menu>` when closing overlay on select.
if(this.hasAttribute("active")){this._setFocused(!1)}}_selectedChanged(selected){this.setAttribute("aria-selected",selected)}_disabledChanged(disabled){if(disabled){this.selected=!1;this.setAttribute("aria-disabled","true");this.blur()}else{this.removeAttribute("aria-disabled")}}_setFocused(focused){if(focused){this.setAttribute("focused","");if(!this._mousedown){this.setAttribute("focus-ring","")}}else{this.removeAttribute("focused");this.removeAttribute("focus-ring");this._setActive(!1)}}_setActive(active){if(active){this.setAttribute("active","")}else{this.removeAttribute("active")}}_onKeydown(event){if(/^( |SpaceBar|Enter)$/.test(event.key)&&!event.defaultPrevented){event.preventDefault();this._setActive(!0)}}_onKeyup(event){if(this.hasAttribute("active")){this._setActive(!1);this.click()}}};var vaadinItemMixin={ItemMixin:ItemMixin};/**
    * @polymerMixin
    */const ThemePropertyMixin=superClass=>class VaadinThemePropertyMixin extends superClass{static get properties(){return{/**
       * Helper property with theme attribute value facilitating propagation
       * in shadow DOM. Allows using `theme$="[[theme]]"` in the template.
       *
       * @protected
       */theme:{type:String,readOnly:!0}}}/** @protected */attributeChangedCallback(name,oldValue,newValue){super.attributeChangedCallback(name,oldValue,newValue);if("theme"===name){this._setTheme(newValue)}}};var vaadinThemePropertyMixin={ThemePropertyMixin:ThemePropertyMixin};const ThemableMixin=superClass=>class VaadinThemableMixin extends ThemePropertyMixin(superClass){/** @protected */static finalize(){super.finalize();const template=this.prototype._template,hasOwnTemplate=this.template&&this.template.parentElement&&this.template.parentElement.id===this.is,inheritedTemplate=Object.getPrototypeOf(this.prototype)._template;if(inheritedTemplate&&!hasOwnTemplate){// The element doesn't define its own template -> include the theme modules from the inherited template
Array.from(inheritedTemplate.content.querySelectorAll("style[include]")).forEach(s=>{this._includeStyle(s.getAttribute("include"),template)})}this._includeMatchingThemes(template)}/** @protected */static _includeMatchingThemes(template){const domModule=DomModule,modules=domModule.prototype.modules;let hasThemes=!1;const defaultModuleName=this.is+"-default-theme";Object.keys(modules).sort((moduleNameA,moduleNameB)=>{const vaadinA=0===moduleNameA.indexOf("vaadin-"),vaadinB=0===moduleNameB.indexOf("vaadin-"),vaadinThemePrefixes=["lumo-","material-"],vaadinThemeA=0<vaadinThemePrefixes.filter(prefix=>0===moduleNameA.indexOf(prefix)).length,vaadinThemeB=0<vaadinThemePrefixes.filter(prefix=>0===moduleNameB.indexOf(prefix)).length;if(vaadinA!==vaadinB){// Include vaadin core styles first
return vaadinA?-1:1}else if(vaadinThemeA!==vaadinThemeB){// Include vaadin theme styles after that
return vaadinThemeA?-1:1}else{// Lastly include custom styles so they override all vaadin styles
return 0}}).forEach(moduleName=>{if(moduleName!==defaultModuleName){const themeFor=modules[moduleName].getAttribute("theme-for");if(themeFor){themeFor.split(" ").forEach(themeForToken=>{if(new RegExp("^"+themeForToken.split("*").join(".*")+"$").test(this.is)){hasThemes=!0;this._includeStyle(moduleName,template)}})}}});if(!hasThemes&&modules[defaultModuleName]){// No theme modules found, include the default module if it exists
this._includeStyle(defaultModuleName,template)}}/** @private */static _includeStyle(moduleName,template){if(template&&!template.content.querySelector(`style[include="${moduleName}"]`)){const styleEl=document.createElement("style");styleEl.setAttribute("include",moduleName);template.content.appendChild(styleEl)}}};var vaadinThemableMixin={ThemableMixin:ThemableMixin};class ItemElement extends ItemMixin(ThemableMixin(PolymerElement)){static get template(){return html`
    <style>
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }
    </style>
    <div part="content">
      <slot></slot>
    </div>
`}static get is(){return"vaadin-item"}static get version(){return"2.1.0"}}customElements.define(ItemElement.is,ItemElement);var vaadinItem={ItemElement:ItemElement};class Lumo extends HTMLElement{static get version(){return"1.4.2"}}customElements.define("vaadin-lumo-styles",Lumo);var version={Lumo:Lumo};const $_documentContainer=document.createElement("template");$_documentContainer.innerHTML=`<custom-style>
  <style>
    @font-face {
      font-family: 'lumo-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAABEgAAsAAAAAIiwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAAQwAAAFZAIUuKY21hcAAAAYgAAAD4AAADrsCU8d5nbHlmAAACgAAAC2MAABd4h9To2WhlYWQAAA3kAAAAMQAAADYSnCkuaGhlYQAADhgAAAAdAAAAJAbpA35obXR4AAAOOAAAABAAAACspBAAAGxvY2EAAA5IAAAAWAAAAFh55IAsbWF4cAAADqAAAAAfAAAAIAFKAXBuYW1lAAAOwAAAATEAAAIuUUJZCHBvc3QAAA/0AAABKwAAAelm8SzVeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYGS+yDiBgZWBgamKaQ8DA0MPhGZ8wGDIyAQUZWBlZsAKAtJcUxgcXjG+0mIO+p/FEMUcxDANKMwIkgMABn8MLQB4nO3SWW6DMABF0UtwCEnIPM/zhLK8LqhfXRybSP14XUYtHV9hGYQwQBNIo3cUIPkhQeM7rib1ekqnXg981XuC1qvy84lzojleh3puxL0hPjGjRU473teloEefAUNGjJkwZcacBUtWrNmwZceeA0dOnLlw5cadB09elPGhGf+j0NTI/65KfXerT6JhqKnpRKtgOpuqaTrtKjPUlqHmhto21I7pL6i6hlqY3q7qGWrfUAeGOjTUkaGODXViqFNDnRnq3FAXhro01JWhrg11Y6hbQ90Z6t5QD4Z6NNSToZ4N9WKoV0O9GerdUB+G+jTUl6GWRvkL24BkEXictVh9bFvVFb/nxvbz+7Rf/N6zHcd2bCfP+Wgc1Z9N0jpNnEL6kbRVS6HA2hQYGh9TGR1CbCqa2rXrWOkQE/sHNJgmtZvoVNZqE1B1DNHxzTQxCehUTYiJTQyENui0qSLezr3PduyQfgmRWOfde8+9551z7rnn/O4jLoJ/bRP0UaKQMLFJjpBAvphLZC3Dk0ok7WBzR2/upJs7Ryw/nfFbln/uuN/apCvwrKLrSvUqRufbm5pn0fs0w4gYxnGVP6qHnO4bWiDQGQgwtS6lm3lB3QoX1M2vwEmuzirF39y+Es2+DJ8d1pkyqBIqoze3D1+Zz4DrFoazxI8dWwMrDlZ2DMqQAR9AROsJU+2cmlTPazTco52F1xTa2a2+K8vvq92dVHmtLoPeQX/AZPRYGthDYOeZjBjKoFsVGulR3lWU95WeCK44qHU7MhWUGUKZDT3oKUcG2GWuh+EDDfUYA/jhAhl0TOsJNYSEu7mQmi3UzfXwZKA4BsVsHLXQYGgRW95uEtpJ1Vfn9XiLriRBlFEqxsDjA09yCNUoQxxwd7KWSTt2y3GTKiflqHRSoWZc3m11Wa/fJdFgXD4sSYfleJBKd8GMz7J8dZn/cGRCcKGDnA2Ge3fKzcvlnTDNthGWLXzX/WaXtUAmRgeLlHSr30r0G9UTXMb0AtmwzOoy73fkSlHZkduw/TYuU9cAD4YutPoxTTsA3797wVr4Z/1NC5zARHr4vtxJjxIfiZMhMkbWk+14BnJZKwqGZwDfswLyxWDSg11rFLJF7Nopxjd1h1/QOT+oezgfu3Yq+Hk+duf5x+40o1GTkaIgikK/IEnC6aYxCUBaZJSN4XTYFjU/YMNIKqJwhDGOCCI8FDXnXmXjtGhGJyShqjAOnBOkW2JG9S7GgYeMWAU5JzhnWmBOaOM+CKEPoqSfFDC2Unq+DLlUgUVUFFLZGJg6jtlojsdsa8kPObPuJdi5dnBdBsLJMGTWDa4t2JvtwuPo9s+Y86suv/W33QG1rAaOAUV+vx4K6f2D04PVKlC7WLSrZzAi45ZV6lIC7WoXqmRyvUqoVwrzUoVsIjeTXWQv+RH5GTlBXiB/In8ln0IbBCAFOajAJrgZYyOHWqOfUe/aHjI12R6OQo1jCgt215l+4f6XPb+0MNou0V+43n2F77tSfRb24d7zitgnKmvYHs69zugaPvBwv6ioXkb2LdL65Atw51uLkXlu1bhMMRcXSPcYoqKIRlh34lQP8/5JbuUFye4vxD6/6MxFF11C0uVLr9Ulgw44tS3pMViNLUExbycFgLIct+QDMibRimx1ydUz8FXZiuOIDBOMVX2nUZc+huNE5XUJ81uiJoiabwqaVF0uacKbau/pl4R2VW0XXlJra6boVrYG646TF5NYzwy4vjENVrDlcNpZPl8DH6XX8XWCx0mvWVZY6KFLrvsY66/zPict5FnxaNUR/juvZCM3TvD60E2W1tZizbXTPDuabcm0nbbzpWKpmA1ayBQ8giedLUM+A0kNjBjQjmuYz7YrgIXYvmF63ZLBwSXrpn9Tb9wwdd/U1H0PMQK3XcO8ul3WT7PyPPdpy0TemKxNRcJNauiXJnnUDpUppQWs4SnUIy0EESGYqJYQLGHxzaGWwVIaS6Y7mQFM8ZjYDQ3axjf61SWjU33JwOZA1pwaG1L9mzf71aHRdX1JHw6Fp0aXhNwbqyeGNg4NbdzGCBxoz4ZXjy4Nu69Zr6sDY6vMrLU5nA1P8JkbdWXJ6ERfMryvNh1JfQ9+T4dIhGvK9w3dxjBBzatsQ/MlOHVIDnYpDz6odAXlQ01t2Pa5Iafd8MMpxAeDKP0C6CjgVLT5osB6icUx01lWjXxzT/GyRF2welEM5Z/7jG3VjQ1SrNn5IbyzOG5dobB3/QHxyZvsXcoz8IoEwS7plCg+zxHQk424q9BfEpkESJbFHQusDBSWFkuBkoPO0kLKwRVYjxGXlHTcTDQMJ/H6TX9afkO7mnraTO1feTnZAXLu4cp7HAXMmNG1yeFk9TgS/NHhZR/4QoBTr/ZB+6hCgyl15Nq1UbN6nE1/ZnP1U2cizCBpvs8cJQZJ4LkYx5N/yZPAUZNQQ0V4f3BQllWrK3YRzl30dOT6RVn2upNur6woSa8CqpdT/aKnBM4o3jNur9d9xqtUT6veBEt9Ca9at+ERzEEhUkR8sa5mQ4aVvJoVeEA8zI4ei5mULXFGyU7z/6TAeYLVcpzSWZY8PYYF5yrTV60sT0+XV141vX++Wf16V2bFeGVPZXxFpkvyeKTWLlzfW0mnKxsY6Y3294/0998SCfX1blm5pbcvFGlq/r07MRAMhYIDiW5JFKWW3vdrEpCsZSJG+om7Zu/PSScZJhNkLbmW5Wsr12pWqW5zKtlwRS4bFOxUw17mCzy6lskCDl1WYOGWDYrADrMA7BDDweWWNd5koiJnR1dz+ytLP2q0SqPB1lnK2ccB7RYe4FSoPks3iB3t4txTSHctb2sy1ivk0pvHuCNm6w1f6wxv3+OCgN78LqdQnUVh7R0oTAp0zOf2rbW770Vu5C2dIyGdTnHo8zSji7dppj0USoVCz+lhRMTh53Teq9VbGfbjuSbAooSdXayY4PYHg374C6f7gl1B/DXuJ4/QXxOBdJFJspFsI3egpoWUUCjlTIFnNYNl+ZyZKmBeYKGHkD1QyDlhaKbKwKcIJqJ4TLJ2OmdY/JWXae4DdGBw8HZ7eXcgFF2zr2SoalDry5iKqoa0Puhe3hPQ2s3elTYM+MI+n3rK0KgL7/La3GeMLt6m7u912vGnvtORiIa0qBmhqVi+XW9XNBmqb8eVgKzIHfGI5bNoG7X0UCzeISmqIcO/nY8FH7U8avX9fx/ST+hx0sezPw9Qy8Mum3GWf2N4Uy/yIYGVBXbJHWIZp7dfTcptdMTr9Qmq7DaiK/ukqCL4kt4RUfS5XPnMtmT22/mQFqF7emSqtrlu8SVElxDRJrZODkpuwe0VfTfjdEp1f7A7v+fozNBXUJ/6WTuK2TtFlpFVZAZ3LcFvUi1Z2p2YT+EMAkGJVStOzLTAPg4IqWIAlzRSjOBkl2zxj3TKycpzT/MnvX3uaSMWM+gU0rkXjohhefVRMaps3/kLMSKv23lT23uxQrkQjyOJleMDsdhAnD6ZGElWZ5MjCXzCE/hkWX+WF4knzGhVOyK2eQZekV3eyo0zL8kuYWCnDCvjjhAkcTPOBDXVdoav3HVcFnQjLvtV9S2p0zA6JegPwMQxt+yFb3ll9zGlq/5dRKb3cEyQYoaNYpharJ7xCB7AWxsLY3jjZXY0XsZj0Wjwc9I6PP/dKABnCZaqHpaZEACxk4ZeLZSKNgZABl+lYQX1sJQOSX3n6r410evcoud5JeAGUXVP9H1tZOKejTq4Ono0z0erro1FrnOpohva1d/hTdtVsQdKN5W9RlT3NjD0nznyKNTgKAMfWNWcyodV0IGLPIHOF0o4JyqufaK4z6WIIzuGh3d8c8cwQg8ER+OVxyrjdm8vNuhts4LoOihGxIMuUdgzwiYN7xhh1+oZnJNuTG7gQZvu4XWZ9GAZZjGEubwePqYhtKDTH+9VQkl17/iGybsnJ+8+sKtyPrcll9ty65Zsdst/9iqpEKh7M5VdBxh3csOdNc6tW3I1uyM1PzOXegSOrLFsFNI2O27M+TF2ApnN9MUv5ud6LjxIvEQnHRzxIu4IsA9MLFkJn2tcZoZ7ON7dXe7ujrc8HrusPKamlqXwd77lQUuLpilau4PUMapueBb7irU4RoUXEYXuVuIGlRGmOp+2lNkaRPVziOqmlaZvaqG4dFgSj0jxEJWrv12IUWntmw+rfQarRE0Aph4ocI6nlUlGqs+u3/+T/ethW62PpHp2eHbZstnh/wOO95yDAHicY2BkYGAAYi2NOJ94fpuvDNzML4AiDNc/fzqEoP+/Zp7KdAvI5WBgAokCAGkcDfgAAAB4nGNgZGBgDvqfBSRfMAAB81QGRgZUoA0AVvYDbwAAAHicY2BgYGB+MTQwAM8EJo8AAAAAAE4AmgDoAQoBLAFOAXABmgHEAe4CGgKcAugEmgS8BNYE8gUOBSoFegXQBf4GRAZmBrYHGAeQCBgIUghqCP4JRgm+CdoKBAo8CoIKuArwC1ALlgu8eJxjYGRgYNBmTGEQZQABJiDmAkIGhv9gPgMAGJQBvAB4nG2RPU7DMBiG3/QP0UoIBGJh8QILavozdmRo9w7d09RpUzlx5LgVvQMn4BAcgoEzcAgOwVvzSZVQbcnf48fvFysJgGt8IcJxROiG9TgauODuj5ukG+EW+UG4jR4ehTv0Q+EunjER7uEWmk+IWpc0d3gVbuAKb8JN+nfhFvlDuI17fAp36L+Fu1jgR7iHp+jF7Arbz1Nb1nO93pnEncSJFtrVuS3VKB6e5EyX2iVer9TyoOr9eux9pjJnCzW1pdfGWFU5u9WpjzfeV5PBIBMfp7aAwQ4FLPrIkbKWqDHn+67pDRK4s4lzbsEux5qHvcIIMb/nueSMyTKkE3jWFdNLHLjW2PPmMa1Hxn3GjGW/wjT0HtOG09JU4WxLk9LH2ISuiv9twJn9y8fh9uIXI+BknAAAAHicbY7ZboMwEEW5CVBCSLrv+76kfJRjTwHFsdGAG+Xvy5JUfehIHp0rnxmNN/D6ir3/a4YBhvARIMQOIowQY4wEE0yxiz3s4wCHOMIxTnCKM5zjApe4wjVucIs73OMBj3jCM17wije84wMzfHqJ0EVmUkmmJo77oOmrHvfIRZbXsTCZplTZldlgb3TYGVHProwFs11t1A57tcON2rErR3PBqcwF1/6ctI6k0GSU4JHMSS6WghdJQ99sTbfuN7QLJ9vQ37dNrgyktnIxlDYLJNuqitpRbYWKFNuyDT6pog6oOYKHtKakeakqKjHXpPwlGRcsC+OqxLIiJpXqoqqDMreG2l5bv9Ri3TRX+c23DZna9WFFgmXuO6Ps1Jm/w6ErW8N3FbHn/QC444j0AA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --lumo-icons-align-center: "\\ea01";
      --lumo-icons-align-left: "\\ea02";
      --lumo-icons-align-right: "\\ea03";
      --lumo-icons-angle-down: "\\ea04";
      --lumo-icons-angle-left: "\\ea05";
      --lumo-icons-angle-right: "\\ea06";
      --lumo-icons-angle-up: "\\ea07";
      --lumo-icons-arrow-down: "\\ea08";
      --lumo-icons-arrow-left: "\\ea09";
      --lumo-icons-arrow-right: "\\ea0a";
      --lumo-icons-arrow-up: "\\ea0b";
      --lumo-icons-bar-chart: "\\ea0c";
      --lumo-icons-bell: "\\ea0d";
      --lumo-icons-calendar: "\\ea0e";
      --lumo-icons-checkmark: "\\ea0f";
      --lumo-icons-chevron-down: "\\ea10";
      --lumo-icons-chevron-left: "\\ea11";
      --lumo-icons-chevron-right: "\\ea12";
      --lumo-icons-chevron-up: "\\ea13";
      --lumo-icons-clock: "\\ea14";
      --lumo-icons-cog: "\\ea15";
      --lumo-icons-cross: "\\ea16";
      --lumo-icons-download: "\\ea17";
      --lumo-icons-dropdown: "\\ea18";
      --lumo-icons-edit: "\\ea19";
      --lumo-icons-error: "\\ea1a";
      --lumo-icons-eye: "\\ea1b";
      --lumo-icons-eye-disabled: "\\ea1c";
      --lumo-icons-menu: "\\ea1d";
      --lumo-icons-minus: "\\ea1e";
      --lumo-icons-ordered-list: "\\ea1f";
      --lumo-icons-phone: "\\ea20";
      --lumo-icons-photo: "\\ea21";
      --lumo-icons-play: "\\ea22";
      --lumo-icons-plus: "\\ea23";
      --lumo-icons-redo: "\\ea24";
      --lumo-icons-reload: "\\ea25";
      --lumo-icons-search: "\\ea26";
      --lumo-icons-undo: "\\ea27";
      --lumo-icons-unordered-list: "\\ea28";
      --lumo-icons-upload: "\\ea29";
      --lumo-icons-user: "\\ea2a";
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer.content);/* NOTICE: Generated with 'gulp icons' */ /*
                                                                                                    FIXME(polymer-modulizer): the above comments were extracted
                                                                                                    from HTML and may be out of place here. Review them and
                                                                                                    then delete this comment!
                                                                                                  */;const $_documentContainer$1=document.createElement("template");$_documentContainer$1.innerHTML=`<custom-style>
  <style>
    html {
      --lumo-size-xs: 1.625rem;
      --lumo-size-s: 1.875rem;
      --lumo-size-m: 2.25rem;
      --lumo-size-l: 2.75rem;
      --lumo-size-xl: 3.5rem;

      /* Icons */
      --lumo-icon-size-s: 1.25em;
      --lumo-icon-size-m: 1.5em;
      --lumo-icon-size-l: 2.25em;
      /* For backwards compatibility */
      --lumo-icon-size: var(--lumo-icon-size-m);
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$1.content);const $_documentContainer$2=document.createElement("template");$_documentContainer$2.innerHTML=`<custom-style>
  <style>
    html {
      /* Square */
      --lumo-space-xs: 0.25rem;
      --lumo-space-s: 0.5rem;
      --lumo-space-m: 1rem;
      --lumo-space-l: 1.5rem;
      --lumo-space-xl: 2.5rem;

      /* Wide */
      --lumo-space-wide-xs: calc(var(--lumo-space-xs) / 2) var(--lumo-space-xs);
      --lumo-space-wide-s: calc(var(--lumo-space-s) / 2) var(--lumo-space-s);
      --lumo-space-wide-m: calc(var(--lumo-space-m) / 2) var(--lumo-space-m);
      --lumo-space-wide-l: calc(var(--lumo-space-l) / 2) var(--lumo-space-l);
      --lumo-space-wide-xl: calc(var(--lumo-space-xl) / 2) var(--lumo-space-xl);

      /* Tall */
      --lumo-space-tall-xs: var(--lumo-space-xs) calc(var(--lumo-space-xs) / 2);
      --lumo-space-tall-s: var(--lumo-space-s) calc(var(--lumo-space-s) / 2);
      --lumo-space-tall-m: var(--lumo-space-m) calc(var(--lumo-space-m) / 2);
      --lumo-space-tall-l: var(--lumo-space-l) calc(var(--lumo-space-l) / 2);
      --lumo-space-tall-xl: var(--lumo-space-xl) calc(var(--lumo-space-xl) / 2);
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$2.content);const $_documentContainer$3=document.createElement("template");$_documentContainer$3.innerHTML=`<custom-style>
  <style>
    html {
      /* Border radius */
      --lumo-border-radius-s: 0.25em; /* Checkbox, badge, date-picker year indicator, etc */
      --lumo-border-radius-m: var(--lumo-border-radius, 0.25em); /* Button, text field, menu overlay, etc */
      --lumo-border-radius-l: 0.5em; /* Dialog, notification, etc */
      --lumo-border-radius: 0.25em; /* Deprecated */

      /* Shadow */
      --lumo-box-shadow-xs: 0 1px 4px -1px var(--lumo-shade-50pct);
      --lumo-box-shadow-s: 0 2px 4px -1px var(--lumo-shade-20pct), 0 3px 12px -1px var(--lumo-shade-30pct);
      --lumo-box-shadow-m: 0 2px 6px -1px var(--lumo-shade-20pct), 0 8px 24px -4px var(--lumo-shade-40pct);
      --lumo-box-shadow-l: 0 3px 18px -2px var(--lumo-shade-20pct), 0 12px 48px -6px var(--lumo-shade-40pct);
      --lumo-box-shadow-xl: 0 4px 24px -3px var(--lumo-shade-20pct), 0 18px 64px -8px var(--lumo-shade-40pct);

      /* Clickable element cursor */
      --lumo-clickable-cursor: default;
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$3.content);const $_documentContainer$4=document.createElement("template");$_documentContainer$4.innerHTML=`<custom-style>
  <style>
    html {
      /* Font families */
      --lumo-font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";

      /* Font sizes */
      --lumo-font-size-xxs: .75rem;
      --lumo-font-size-xs: .8125rem;
      --lumo-font-size-s: .875rem;
      --lumo-font-size-m: 1rem;
      --lumo-font-size-l: 1.125rem;
      --lumo-font-size-xl: 1.375rem;
      --lumo-font-size-xxl: 1.75rem;
      --lumo-font-size-xxxl: 2.5rem;

      /* Line heights */
      --lumo-line-height-xs: 1.25;
      --lumo-line-height-s: 1.375;
      --lumo-line-height-m: 1.625;
    }

  </style>
</custom-style><dom-module id="lumo-typography">
  <template>
    <style>
      html {
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size, var(--lumo-font-size-m));
        line-height: var(--lumo-line-height-m);
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Can’t combine with the above selector because that doesn’t work in browsers without native shadow dom */
      :host {
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size, var(--lumo-font-size-m));
        line-height: var(--lumo-line-height-m);
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      small,
      [theme~="font-size-s"] {
        font-size: var(--lumo-font-size-s);
        line-height: var(--lumo-line-height-s);
      }

      [theme~="font-size-xs"] {
        font-size: var(--lumo-font-size-xs);
        line-height: var(--lumo-line-height-xs);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: 600;
        line-height: var(--lumo-line-height-xs);
        margin-top: 1.25em;
      }

      h1 {
        font-size: var(--lumo-font-size-xxxl);
        margin-bottom: 0.75em;
      }

      h2 {
        font-size: var(--lumo-font-size-xxl);
        margin-bottom: 0.5em;
      }

      h3 {
        font-size: var(--lumo-font-size-xl);
        margin-bottom: 0.5em;
      }

      h4 {
        font-size: var(--lumo-font-size-l);
        margin-bottom: 0.5em;
      }

      h5 {
        font-size: var(--lumo-font-size-m);
        margin-bottom: 0.25em;
      }

      h6 {
        font-size: var(--lumo-font-size-xs);
        margin-bottom: 0;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }

      p,
      blockquote {
        margin-top: 0.5em;
        margin-bottom: 0.75em;
      }

      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      hr {
        display: block;
        align-self: stretch;
        height: 1px;
        border: 0;
        padding: 0;
        margin: var(--lumo-space-s) calc(var(--lumo-border-radius-m) / 2);
        background-color: var(--lumo-contrast-10pct);
      }

      blockquote {
        border-left: 2px solid var(--lumo-contrast-30pct);
      }

      b,
      strong {
        font-weight: 600;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$4.content);const $_documentContainer$5=document.createElement("template");$_documentContainer$5.innerHTML=`<dom-module id="lumo-item" theme-for="vaadin-item">
  <template>
    <style>
      :host {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size-m);
        line-height: var(--lumo-line-height-xs);
        padding: 0.5em 1em;
        min-height: var(--lumo-size-m);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: transparent;
      }

      /* Selectable items have a checkmark icon */
      :host([tabindex])::before {
        display: var(--_lumo-item-selected-icon-display, none);
        content: var(--lumo-icons-checkmark);
        font-family: lumo-icons;
        font-size: var(--lumo-icon-size-m);
        line-height: 1;
        font-weight: normal;
        width: 1em;
        height: 1em;
        margin: calc((1 - var(--lumo-line-height-xs)) * var(--lumo-font-size-m) / 2) 0;
        color: var(--lumo-primary-text-color);
        flex: none;
        opacity: 0;
        transition: transform 0.2s cubic-bezier(.12, .32, .54, 2), opacity 0.1s;
      }

      :host([selected])::before {
        opacity: 1;
      }

      :host([active]:not([selected]))::before {
        transform: scale(0.8);
        opacity: 0;
        transition-duration: 0s;
      }

      [part="content"] {
        flex: auto;
      }

      /* Disabled item */

      :host([disabled]) {
        color: var(--lumo-disabled-text-color);
        cursor: default;
        pointer-events: none;
      }

      /* Slotted icons */

      :host ::slotted(iron-icon) {
        width: var(--lumo-icon-size-m);
        height: var(--lumo-icon-size-m);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$5.content);class Material extends HTMLElement{static get version(){return"1.2.2"}}customElements.define("vaadin-material-styles",Material);var version$1={Material:Material};const $_documentContainer$6=document.createElement("template");$_documentContainer$6.innerHTML=`<custom-style>
  <style>
    @font-face {
      font-family: 'material-icons';
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAjAAAsAAAAADZQAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAADsAAABUIIslek9TLzIAAAFEAAAARAAAAFZSk09oY21hcAAAAYgAAACNAAACNOuCXH5nbHlmAAACGAAABDwAAAXsdK8UGGhlYWQAAAZUAAAAMAAAADYX9T2IaGhlYQAABoQAAAAgAAAAJBGyCLpobXR4AAAGpAAAABQAAABAjXoAAGxvY2EAAAa4AAAAIgAAACIKMgjUbWF4cAAABtwAAAAfAAAAIAEeAFRuYW1lAAAG/AAAATQAAAJe3l764XBvc3QAAAgwAAAAjwAAAMqJEjDWeJxjYGRgYOBiMGCwY2BycfMJYeDLSSzJY5BiYGGAAJA8MpsxJzM9kYEDxgPKsYBpDiBmg4gCACY7BUgAeJxjYOS4wTiBgZWBgYGfbQIDA2MAhGZpYChlymZgYGJgZWbACgLSXFMYHF4xvuJnv/CvgOEG+wXG6UBhRpAcAMyUDJN4nO2R2Q0DIQxEHwt7HzSSGlJQvlJkqqGJjYdJGbH0PPJgELKBEcjBIyiQ3iQUr3BT9zNb9wvP3lPkt3rfkZNy1KXnIXpLvDgxs7DGvZ2Dk4saxxP/OHr+/KqqCZo+08EgzUa7acVoym002lubDNLZIF0M0tUg3Yz22XaD9DD6XTsN0ssgrYb6BZEQJiUAAAB4nH1UbUhbVxg+77259yZMJbfko7DhbnJtrjYuWfNxsx9qBFu32ljHWqWO6VD6MW1G4uYPsfSDdQOHXOuPrtYfKytKJziYEJkQZLQ/BqHCpsUfghZX1jHBjBUWWqfes51zE1dloyfJyXvOed5znvO+z3sQINKEeb4WmRECBURZBAGEeU1fyOgPhliJlTT9geneVpTxD23/jPbinSAGRYgADGuMP8P4CILgGd9W1HRPXyDeiEEIL5pvCnH0MnqVeMhh2e4iP9ldAnbRVgpBV6AGwmLIB6xLdAnzpzPb+zOn1fdU8uVr8/9/3eVr+fEMacZg1+LGBmfLczKHuNuIQ8gCggUU9lP8/hDjN01pcBluk8sQK4/jOa6P4kCxEOI8p+kTzCkNq6Z1YukTGswVcLUFHNnOCeyaBvexqjGnuD4Nh3GYWIVYxLkV9FJ+PwqluwpxcqK+QGJidIyfDLkm0hnW8wXiziL09xskPma0Hx1CEbKPW+CRwFudDuR0SBEVRVSr4kGKh3UrPlA81kgNRFTJWQpOh1UoAYFnZZoC07dz6RRejx0/HgN7Kg0j6RTYY01NMbyeSs+NXR9+WB2NVj8cvg71z+2eG0zxMVwjmAksO53G3elpnKVOYJtOw430NNhiTRsb//HDacPmbPoE/uEC0OsbMRtn12jGLQwzCznIsWu4CHJ77vgKkl50RzkcDMti0DQ1939M8izPUSG8mPJmWSZDEkSaieivy7IqzKMSdABVoTcROsDLEj1N3RehuQLebjOiGQxEFF52Kx7FEw5FLKCGQ0bEZbegqEGJkuUZMh0MOB1Oh93G/7b4GOdy63i0veruJSwMmlcGN1vLvQdHOs8kzndOFxW3xhoqK8HUiX9SvRV09mLy91+eQdGfWTjXHv1R/xJfktwGqL2x+yx8/McoWD6AjcFnZYPc153nE2c6Ryq85Sl4zdsQay0u1jNwKHmRzh70qtl3u85i7clXOAsfwVW+0tvQ2Ooy9ERqYZsvQfuQQu5biPW/gS4oyUOFpFIdOaiMeKIiN+1tdBygKyGKMU09XV3CMy0tcHRpFbKrS3C0pQXPLK0+HejtqTt8uK6nF6w71sA79XXlFRXldfXjOwZf0tGGJ5eX8WRbR0cbNC8vQ3Nbx1bpXkf8hFqstMfVMNCuGiO6AhFYyRTjVjYHmFm06y3ykQGhKxn1YN3JJkmwTCfkfOWEjMqhyQOXyP+auJaXcVU0WkUkPTYzdutR5XzFRLL3Sn8ifsfn9/vuxBO5RPcJ/D0zyzUn9mqfCE78pve7QKgAox6v+05SLKXF0M7SQbiVIW+enaEkyod+djTnMoIdNqINInkByStyzd3dNXorNXT18v3oFxf6j7xlHNHP2YygR6u74noXTuJFo8QeTw5+3vh2MDDTZz154spnN/PcjXx8kvyw7gh+hJMwDDlc9A+3XcsFeJxjYGRgYADi5PtWjvH8Nl8ZuDkTgCIM16srKhH0v0zO++wXgFwOBiaQKAA6hAuJeJxjYGRgYL/wr4CBgcuKgeH/f877DEARFCAAAIewBYJ4nGNgYGDgTCAOc1lhigEAvMIGAwAAAAAAGAAwAGIAdgCKAJ4AwAEkATIBcAHoAlACXgKsAvYAAHicY2BkYGAQYPBgYGEAASYg5gJCBob/YD4DABFeAXMAeJx9kL1uwjAUhU8gUJVIVaWqnRgsVepSEX5G1BkkRgb2EBwIcuLIMUi8QR+kT9CH6NgH6VP0xHiBAVtyvvvdc50oAB7xgwDNCvDgzma1cMfqzG3Ss+eQ/Oq5gwhjz136D889vGPhOcITDrwhCO9p+vj03GL+y3Ob/ttzSP713MEL/jx30Q/guYdV0Pcc4S0wRWKlyRM1yFNd1ku5PajkSl5WK2nqXJdiHI8uG3NZSkOzEeuTqI/bibWZyIwuxEyXViqlRWX0XqY23llbTYfDzPs41QUKJLCQMMhJCgM+U2iUqLGk3/JfKHbMzeSt3sr5mqapBf9/jNHNiTl96XrnzIZTa5x41jjyiya0FhnrjBnNuwRmbrZJK25NU7nenialj7FzUxWmGHJnV/nYvb34BzHZcLZ4nG2MQQ6CMBREO0ARtSjuvASHqu1XCD+0+YKE20tD3DmLmbxk8lSm9tzV/zTIkKOARokDKhxxwhkGNS64osFNXaxIWFoflnGx4s2Oc0xQOcs0eivadeQGs/VHwtgyPaf6B9K/ukk7pnTj4IbKS4jJp2lziaGVWt+/7YPJ5xsUke1aCnGwvpxjGqW+tN8xfgA=) format('woff');
      font-weight: normal;
      font-style: normal;
    }

    html {
      --material-icons-arrow-downward: "\\ea01";
      --material-icons-arrow-upward: "\\ea02";
      --material-icons-calendar: "\\ea03";
      --material-icons-check: "\\ea04";
      --material-icons-chevron-left: "\\ea05";
      --material-icons-chevron-right: "\\ea06";
      --material-icons-clear: "\\ea07";
      --material-icons-clock: "\\ea08";
      --material-icons-dropdown: "\\ea09";
      --material-icons-error: "\\ea0a";
      --material-icons-eye-disabled: "\\ea0b";
      --material-icons-eye: "\\ea0c";
      --material-icons-play: "\\ea0d";
      --material-icons-reload: "\\ea0e";
      --material-icons-upload: "\\ea0f";
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$6.content);/* NOTICE: Generated with 'gulp icons' */ /*
                                                                                                    FIXME(polymer-modulizer): the above comments were extracted
                                                                                                    from HTML and may be out of place here. Review them and
                                                                                                    then delete this comment!
                                                                                                    */;const $_documentContainer$7=document.createElement("template");$_documentContainer$7.innerHTML=`<dom-module id="material-color-light">
  <template>
    <style>
      :host {
        /* Text colors */
        --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));
        --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));
        --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));

        /* Primary colors */
        --material-primary-color: var(--primary-color, #6200ee);
        --material-primary-contrast-color: var(--dark-theme-base-color, #fff);
        --material-primary-text-color: var(--material-primary-color);

        /* Error colors */
        --material-error-color: var(--error-color, #b00020);
        --material-error-text-color: var(--material-error-color);

        /* Background colors */
        --material-background-color: var(--light-theme-background-color, #fff);
        --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);
        --material-disabled-color: rgba(0, 0, 0, 0.26);

        /* Divider colors */
        --material-divider-color: rgba(0, 0, 0, 0.12);

        /* Undocumented internal properties (prefixed with three dashes) */

        /* Text field tweaks */
        --_material-text-field-input-line-background-color: initial;
        --_material-text-field-input-line-opacity: initial;
        --_material-text-field-input-line-hover-opacity: initial;
        --_material-text-field-focused-label-opacity: initial;

        /* Button tweaks */
        --_material-button-raised-background-color: initial;
        --_material-button-outline-color: initial;

        /* Grid tweaks */
        --_material-grid-row-hover-background-color: initial;

        /* Split layout tweaks */
        --_material-split-layout-splitter-background-color: initial;

        background-color: var(--material-background-color);
        color: var(--material-body-text-color);
      }

      [theme~="dark"] {
        /* Text colors */
        --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));
        --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));
        --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));

        /* Primary colors */
        --material-primary-color: var(--light-primary-color, #7e3ff2);
        --material-primary-text-color: #b794f6;

        /* Error colors */
        --material-error-color: var(--error-color, #de2839);
        --material-error-text-color: var(--material-error-color);

        /* Background colors */
        --material-background-color: var(--dark-theme-background-color, #303030);
        --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);
        --material-disabled-color: rgba(255, 255, 255, 0.3);

        /* Divider colors */
        --material-divider-color: rgba(255, 255, 255, 0.12);

        /* Undocumented internal properties (prefixed with three dashes) */

        /* Text field tweaks */
        --_material-text-field-input-line-background-color: #fff;
        --_material-text-field-input-line-opacity: 0.7;
        --_material-text-field-input-line-hover-opacity: 1;
        --_material-text-field-focused-label-opacity: 1;

        /* Button tweaks */
        --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);
        --_material-button-outline-color: rgba(255, 255, 255, 0.2);

        /* Grid tweaks */
        --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);
        --_material-grid-row-selected-overlay-opacity: 0.16;

        /* Split layout tweaks */
        --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);

        background-color: var(--material-background-color);
        color: var(--material-body-text-color);
      }

      a {
        color: inherit;
      }
    </style>
  </template>
</dom-module><dom-module id="material-color-dark">
  <template>
    <style>
      :host {
        /* Text colors */
        --material-body-text-color: var(--dark-theme-text-color, rgba(255, 255, 255, 1));
        --material-secondary-text-color: var(--dark-theme-secondary-color, rgba(255, 255, 255, 0.7));
        --material-disabled-text-color: var(--dark-theme-disabled-color, rgba(255, 255, 255, 0.5));

        /* Primary colors */
        --material-primary-color: var(--light-primary-color, #7e3ff2);
        --material-primary-text-color: #b794f6;

        /* Error colors */
        --material-error-color: var(--error-color, #de2839);
        --material-error-text-color: var(--material-error-color);

        /* Background colors */
        --material-background-color: var(--dark-theme-background-color, #303030);
        --material-secondary-background-color: var(--dark-theme-secondary-background-color, #3b3b3b);
        --material-disabled-color: rgba(255, 255, 255, 0.3);

        /* Divider colors */
        --material-divider-color: rgba(255, 255, 255, 0.12);

        /* Undocumented internal properties (prefixed with three dashes) */

        /* Text field tweaks */
        --_material-text-field-input-line-background-color: #fff;
        --_material-text-field-input-line-opacity: 0.7;
        --_material-text-field-input-line-hover-opacity: 1;
        --_material-text-field-focused-label-opacity: 1;

        /* Button tweaks */
        --_material-button-raised-background-color: rgba(255, 255, 255, 0.08);
        --_material-button-outline-color: rgba(255, 255, 255, 0.2);

        /* Grid tweaks */
        --_material-grid-row-hover-background-color: rgba(255, 255, 255, 0.08);
        --_material-grid-row-selected-overlay-opacity: 0.16;

        /* Split layout tweaks */
        --_material-split-layout-splitter-background-color: rgba(255, 255, 255, 0.8);

        background-color: var(--material-background-color);
        color: var(--material-body-text-color);
      }
    </style>
  </template>
</dom-module><custom-style>
  <style>
    :root {
      /* Text colors */
      --material-body-text-color: var(--light-theme-text-color, rgba(0, 0, 0, 0.87));
      --material-secondary-text-color: var(--light-theme-secondary-color, rgba(0, 0, 0, 0.54));
      --material-disabled-text-color: var(--light-theme-disabled-color, rgba(0, 0, 0, 0.38));

      /* Primary colors */
      --material-primary-color: var(--primary-color, #6200ee);
      --material-primary-contrast-color: var(--dark-theme-base-color, #fff);
      --material-primary-text-color: var(--material-primary-color);

      /* Error colors */
      --material-error-color: var(--error-color, #b00020);
      --material-error-text-color: var(--material-error-color);

      /* Background colors */
      --material-background-color: var(--light-theme-background-color, #fff);
      --material-secondary-background-color: var(--light-theme-secondary-background-color, #f5f5f5);
      --material-disabled-color: rgba(0, 0, 0, 0.26);

      /* Divider colors */
      --material-divider-color: rgba(0, 0, 0, 0.12);
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$7.content);const font="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic",link=document.createElement("link");link.rel="stylesheet";link.type="text/css";link.crossOrigin="anonymous";link.href=font;document.head.appendChild(link);const $_documentContainer$8=html`<custom-style>
  <style>
    html {
      /* Font family */
      --material-font-family: 'Roboto', sans-serif;

      /* Font sizes */
      --material-h1-font-size: 6rem;
      --material-h2-font-size: 3.75rem;
      --material-h3-font-size: 3rem;
      --material-h4-font-size: 2.125rem;
      --material-h5-font-size: 1.5rem;
      --material-h6-font-size: 1.25rem;
      --material-body-font-size: 1rem;
      --material-small-font-size: 0.875rem;
      --material-button-font-size: 0.875rem;
      --material-caption-font-size: 0.75rem;

      /* Icon size */
      --material-icon-font-size: 20px;
    }
  </style>
</custom-style><dom-module id="material-typography">
  <template>
    <style>
      body {
        font-family: var(--material-font-family);
        font-size: var(--material-body-font-size);
        line-height: 1.4;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: inherit;
        line-height: 1.1;
        margin-top: 1.5em;
      }

      h1 {
        font-size: var(--material-h3-font-size);
        font-weight: 300;
        letter-spacing: -0.015em;
        margin-bottom: 1em;
        text-indent: -0.07em;
      }

      h2 {
        font-size: var(--material-h4-font-size);
        font-weight: 300;
        letter-spacing: -0.01em;
        margin-bottom: 0.75em;
        text-indent: -0.07em;
      }

      h3 {
        font-size: var(--material-h5-font-size);
        font-weight: 400;
        margin-bottom: 0.75em;
        text-indent: -0.05em;
      }

      h4 {
        font-size: var(--material-h6-font-size);
        font-weight: 400;
        letter-spacing: 0.01em;
        margin-bottom: 0.75em;
        text-indent: -0.05em;
      }

      h5 {
        font-size: var(--material-body-font-size);
        font-weight: 500;
        margin-bottom: 0.5em;
        text-indent: -0.025em;
      }

      h6 {
        font-size: var(--material-small-font-size);
        font-weight: 500;
        letter-spacing: 0.01em;
        margin-bottom: 0.25em;
        text-indent: -0.025em;
      }

      a,
      b,
      strong {
        font-weight: 500;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$8.content);const $_documentContainer$9=document.createElement("template");$_documentContainer$9.innerHTML=`<dom-module id="material-item" theme-for="vaadin-item">
  <template>
    <style>
      :host {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        overflow: hidden;
        font-family: var(--material-font-family);
        font-size: var(--material-body-font-size);
        line-height: 24px;
        padding: 4px 0;
      }

      /* It's the list-box's responsibility to add the focus style */
      :host([focused]) {
        outline: none;
      }

      /* Selected item has an icon */

      :host::before {
        display: var(--_material-item-selected-icon-display, none);
        content: "";
        font-family: material-icons;
        font-size: 24px;
        line-height: 1;
        font-weight: 400;
        width: 24px;
        text-align: center;
        margin-right: 10px;
        color: var(--material-secondary-text-color);
        flex: none;
      }

      :host([selected])::before {
        content: var(--material-icons-check);
      }

      /* Disabled item */

      :host([disabled]) {
        color: var(--material-disabled-text-color);
        cursor: default;
        pointer-events: none;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$9.content);const ListMixin=superClass=>class VaadinListMixin extends superClass{static get properties(){return{/**
       * Used for mixin detection because `instanceof` does not work with mixins.
       */_hasVaadinListMixin:{value:!0},/**
       * The index of the item selected in the items array
       */selected:{type:Number,reflectToAttribute:!0,notify:!0},/**
       * Define how items are disposed in the dom.
       * Possible values are: `horizontal|vertical`.
       * It also changes navigation keys from left/right to up/down.
       */orientation:{type:String,reflectToAttribute:!0,value:""},/**
       * The list of items from which a selection can be made.
       * It is populated from the elements passed to the light DOM,
       * and updated dynamically when adding or removing items.
       *
       * The item elements must implement `Vaadin.ItemMixin`.
       *
       * Note: unlike `<vaadin-combo-box>`, this property is read-only,
       * so if you want to provide items by iterating array of data,
       * you have to use `dom-repeat` and place it to the light DOM.
       */items:{type:Array,readOnly:!0,notify:!0},/**
       * The search buffer for the keyboard selection feature.
       */_searchBuf:{type:String,value:""}}}static get observers(){return["_enhanceItems(items, orientation, selected)"]}ready(){super.ready();this.addEventListener("keydown",e=>this._onKeydown(e));this.addEventListener("click",e=>this._onClick(e));this._observer=new FlattenedNodesObserver(this,info=>{this._setItems(this._filterItems(Array.from(this.children)))})}_enhanceItems(items,orientation,selected){if(items){this.setAttribute("aria-orientation",orientation||"vertical");this.items.forEach(item=>{orientation?item.setAttribute("orientation",orientation):item.removeAttribute("orientation");item.updateStyles()});this._setFocusable(selected);const itemToSelect=items[selected];items.forEach(item=>item.selected=item===itemToSelect);if(itemToSelect&&!itemToSelect.disabled){this._scrollToItem(selected)}}}get focused(){return this.getRootNode().activeElement}_filterItems(array){return array.filter(e=>e._hasVaadinItemMixin)}_onClick(event){if(event.metaKey||event.shiftKey||event.ctrlKey){return}const item=this._filterItems(event.composedPath())[0];let idx;if(item&&!item.disabled&&0<=(idx=this.items.indexOf(item))){this.selected=idx}}_searchKey(currentIdx,key){this._searchReset=Debouncer.debounce(this._searchReset,timeOut.after(500),()=>this._searchBuf="");this._searchBuf+=key.toLowerCase();const increment=1,condition=item=>!item.disabled&&0===item.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase().indexOf(this._searchBuf);if(!this.items.some(item=>0===item.textContent.replace(/[^a-zA-Z0-9]/g,"").toLowerCase().indexOf(this._searchBuf))){this._searchBuf=key.toLowerCase()}const idx=1===this._searchBuf.length?currentIdx+1:currentIdx;return this._getAvailableIndex(idx,increment,condition)}_onKeydown(event){if(event.metaKey||event.ctrlKey){return}// IE names for arrows do not include the Arrow prefix
const key=event.key.replace(/^Arrow/,""),currentIdx=this.items.indexOf(this.focused);if(/[a-zA-Z0-9]/.test(key)&&1===key.length){const idx=this._searchKey(currentIdx,key);if(0<=idx){this._focus(idx)}return}const condition=item=>!item.disabled;let idx,increment;if(this._vertical&&"Up"===key||!this._vertical&&"Left"===key){increment=-1;idx=currentIdx-1}else if(this._vertical&&"Down"===key||!this._vertical&&"Right"===key){increment=1;idx=currentIdx+1}else if("Home"===key){increment=1;idx=0}else if("End"===key){increment=-1;idx=this.items.length-1}idx=this._getAvailableIndex(idx,increment,condition);if(0<=idx){this._focus(idx);event.preventDefault()}}_getAvailableIndex(idx,increment,condition){const totalItems=this.items.length;for(let i=0;"number"==typeof idx&&i<totalItems;i++,idx+=increment||1){if(0>idx){idx=totalItems-1}else if(idx>=totalItems){idx=0}const item=this.items[idx];if(condition(item)){return idx}}return-1}_setFocusable(idx){idx=this._getAvailableIndex(idx,1,item=>!item.disabled);const item=this.items[idx]||this.items[0];this.items.forEach(e=>e.tabIndex=e===item?0:-1)}_focus(idx){const item=this.items[idx];this.items.forEach(e=>e.focused=e===item);this._setFocusable(idx);this._scrollToItem(idx);item.focus()}focus(){// In initialisation (e.g vaadin-select) observer might not been run yet.
this._observer&&this._observer.flush();const firstItem=this.querySelector("[tabindex=\"0\"]")||(this.items?this.items[0]:null);firstItem&&firstItem.focus()}/* @protected */get _scrollerElement(){}// Returning scroller element of the component
// Scroll the container to have the next item by the edge of the viewport
_scrollToItem(idx){const item=this.items[idx];if(!item){return}const props=this._vertical?["top","bottom"]:["left","right"],scrollerRect=this._scrollerElement.getBoundingClientRect(),nextItemRect=(this.items[idx+1]||item).getBoundingClientRect(),prevItemRect=(this.items[idx-1]||item).getBoundingClientRect();let scrollDistance=0;if(nextItemRect[props[1]]>=scrollerRect[props[1]]){scrollDistance=nextItemRect[props[1]]-scrollerRect[props[1]]}else if(prevItemRect[props[0]]<=scrollerRect[props[0]]){scrollDistance=prevItemRect[props[0]]-scrollerRect[props[0]]}this._scroll(scrollDistance)}/* @protected */get _vertical(){return"horizontal"!==this.orientation}_scroll(pixels){this._scrollerElement["scroll"+(this._vertical?"Top":"Left")]+=pixels}};var vaadinListMixin={ListMixin:ListMixin};class ListBoxElement extends ElementMixin(ListMixin(ThemableMixin(PolymerElement))){static get template(){return html`
    <style>
      :host {
        display: flex;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part="items"] {
        height: 100%;
        width: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
    </style>
    <div part="items">
      <slot></slot>
    </div>
`}static get is(){return"vaadin-list-box"}static get version(){return"1.1.0"}static get properties(){return{// We don't need to define this property since super default is vertical,
// but we don't want it to be modified, or be shown in the API docs.
/** @private */orientation:{readOnly:!0}}}ready(){super.ready();this.setAttribute("role","list")}get _scrollerElement(){return this.shadowRoot.querySelector("[part=\"items\"]")}}customElements.define(ListBoxElement.is,ListBoxElement);var vaadinListBox={ListBoxElement:ListBoxElement};const $_documentContainer$a=document.createElement("template");$_documentContainer$a.innerHTML=`<custom-style>
  <style>
    html {
      /* Base (background) */
      --lumo-base-color: #FFF;

      /* Tint */
      --lumo-tint-5pct: hsla(0, 0%, 100%, 0.3);
      --lumo-tint-10pct: hsla(0, 0%, 100%, 0.37);
      --lumo-tint-20pct: hsla(0, 0%, 100%, 0.44);
      --lumo-tint-30pct: hsla(0, 0%, 100%, 0.5);
      --lumo-tint-40pct: hsla(0, 0%, 100%, 0.57);
      --lumo-tint-50pct: hsla(0, 0%, 100%, 0.64);
      --lumo-tint-60pct: hsla(0, 0%, 100%, 0.7);
      --lumo-tint-70pct: hsla(0, 0%, 100%, 0.77);
      --lumo-tint-80pct: hsla(0, 0%, 100%, 0.84);
      --lumo-tint-90pct: hsla(0, 0%, 100%, 0.9);
      --lumo-tint: #FFF;

      /* Shade */
      --lumo-shade-5pct: hsla(214, 61%, 25%, 0.05);
      --lumo-shade-10pct: hsla(214, 57%, 24%, 0.1);
      --lumo-shade-20pct: hsla(214, 53%, 23%, 0.16);
      --lumo-shade-30pct: hsla(214, 50%, 22%, 0.26);
      --lumo-shade-40pct: hsla(214, 47%, 21%, 0.38);
      --lumo-shade-50pct: hsla(214, 45%, 20%, 0.5);
      --lumo-shade-60pct: hsla(214, 43%, 19%, 0.61);
      --lumo-shade-70pct: hsla(214, 42%, 18%, 0.72);
      --lumo-shade-80pct: hsla(214, 41%, 17%, 0.83);
      --lumo-shade-90pct: hsla(214, 40%, 16%, 0.94);
      --lumo-shade: hsl(214, 35%, 15%);

      /* Contrast */
      --lumo-contrast-5pct: var(--lumo-shade-5pct);
      --lumo-contrast-10pct: var(--lumo-shade-10pct);
      --lumo-contrast-20pct: var(--lumo-shade-20pct);
      --lumo-contrast-30pct: var(--lumo-shade-30pct);
      --lumo-contrast-40pct: var(--lumo-shade-40pct);
      --lumo-contrast-50pct: var(--lumo-shade-50pct);
      --lumo-contrast-60pct: var(--lumo-shade-60pct);
      --lumo-contrast-70pct: var(--lumo-shade-70pct);
      --lumo-contrast-80pct: var(--lumo-shade-80pct);
      --lumo-contrast-90pct: var(--lumo-shade-90pct);
      --lumo-contrast: var(--lumo-shade);

      /* Text */
      --lumo-header-text-color: var(--lumo-contrast);
      --lumo-body-text-color: var(--lumo-contrast-90pct);
      --lumo-secondary-text-color: var(--lumo-contrast-70pct);
      --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
      --lumo-disabled-text-color: var(--lumo-contrast-30pct);

      /* Primary */
      --lumo-primary-color: hsl(214, 90%, 52%);
      --lumo-primary-color-50pct: hsla(214, 90%, 52%, 0.5);
      --lumo-primary-color-10pct: hsla(214, 90%, 52%, 0.1);
      --lumo-primary-text-color: var(--lumo-primary-color);
      --lumo-primary-contrast-color: #FFF;

      /* Error */
      --lumo-error-color: hsl(3, 100%, 61%);
      --lumo-error-color-50pct: hsla(3, 100%, 60%, 0.5);
      --lumo-error-color-10pct: hsla(3, 100%, 60%, 0.1);
      --lumo-error-text-color: hsl(3, 92%, 53%);
      --lumo-error-contrast-color: #FFF;

      /* Success */
      --lumo-success-color: hsl(145, 80%, 42%); /* hsl(144,82%,37%); */
      --lumo-success-color-50pct: hsla(145, 76%, 44%, 0.55);
      --lumo-success-color-10pct: hsla(145, 76%, 44%, 0.12);
      --lumo-success-text-color: hsl(145, 100%, 32%);
      --lumo-success-contrast-color: #FFF;
    }
  </style>
</custom-style><dom-module id="lumo-color">
  <template>
    <style>
      [theme~="dark"] {
        /* Base (background) */
        --lumo-base-color: hsl(214, 35%, 21%);

        /* Tint */
        --lumo-tint-5pct: hsla(214, 65%, 85%, 0.06);
        --lumo-tint-10pct: hsla(214, 60%, 80%, 0.14);
        --lumo-tint-20pct: hsla(214, 64%, 82%, 0.23);
        --lumo-tint-30pct: hsla(214, 69%, 84%, 0.32);
        --lumo-tint-40pct: hsla(214, 73%, 86%, 0.41);
        --lumo-tint-50pct: hsla(214, 78%, 88%, 0.5);
        --lumo-tint-60pct: hsla(214, 82%, 90%, 0.6);
        --lumo-tint-70pct: hsla(214, 87%, 92%, 0.7);
        --lumo-tint-80pct: hsla(214, 91%, 94%, 0.8);
        --lumo-tint-90pct: hsla(214, 96%, 96%, 0.9);
        --lumo-tint: hsl(214, 100%, 98%);

        /* Shade */
        --lumo-shade-5pct: hsla(214, 0%, 0%, 0.07);
        --lumo-shade-10pct: hsla(214, 4%, 2%, 0.15);
        --lumo-shade-20pct: hsla(214, 8%, 4%, 0.23);
        --lumo-shade-30pct: hsla(214, 12%, 6%, 0.32);
        --lumo-shade-40pct: hsla(214, 16%, 8%, 0.41);
        --lumo-shade-50pct: hsla(214, 20%, 10%, 0.5);
        --lumo-shade-60pct: hsla(214, 24%, 12%, 0.6);
        --lumo-shade-70pct: hsla(214, 28%, 13%, 0.7);
        --lumo-shade-80pct: hsla(214, 32%, 13%, 0.8);
        --lumo-shade-90pct: hsla(214, 33%, 13%, 0.9);
        --lumo-shade: hsl(214, 33%, 13%);

        /* Contrast */
        --lumo-contrast-5pct: var(--lumo-tint-5pct);
        --lumo-contrast-10pct: var(--lumo-tint-10pct);
        --lumo-contrast-20pct: var(--lumo-tint-20pct);
        --lumo-contrast-30pct: var(--lumo-tint-30pct);
        --lumo-contrast-40pct: var(--lumo-tint-40pct);
        --lumo-contrast-50pct: var(--lumo-tint-50pct);
        --lumo-contrast-60pct: var(--lumo-tint-60pct);
        --lumo-contrast-70pct: var(--lumo-tint-70pct);
        --lumo-contrast-80pct: var(--lumo-tint-80pct);
        --lumo-contrast-90pct: var(--lumo-tint-90pct);
        --lumo-contrast: var(--lumo-tint);

        /* Text */
        --lumo-header-text-color: var(--lumo-contrast);
        --lumo-body-text-color: var(--lumo-contrast-90pct);
        --lumo-secondary-text-color: var(--lumo-contrast-70pct);
        --lumo-tertiary-text-color: var(--lumo-contrast-50pct);
        --lumo-disabled-text-color: var(--lumo-contrast-30pct);

        /* Primary */
        --lumo-primary-color: hsl(214, 86%, 55%);
        --lumo-primary-color-50pct: hsla(214, 86%, 55%, 0.5);
        --lumo-primary-color-10pct: hsla(214, 90%, 63%, 0.1);
        --lumo-primary-text-color: hsl(214, 100%, 70%);
        --lumo-primary-contrast-color: #FFF;

        /* Error */
        --lumo-error-color: hsl(3, 90%, 63%);
        --lumo-error-color-50pct: hsla(3, 90%, 63%, 0.5);
        --lumo-error-color-10pct: hsla(3, 90%, 63%, 0.1);
        --lumo-error-text-color: hsl(3, 100%, 67%);

        /* Success */
        --lumo-success-color: hsl(145, 65%, 42%);
        --lumo-success-color-50pct: hsla(145, 65%, 42%, 0.5);
        --lumo-success-color-10pct: hsla(145, 65%, 42%, 0.1);
        --lumo-success-text-color: hsl(145, 85%, 47%);
      }

      html {
        color: var(--lumo-body-text-color);
        background-color: var(--lumo-base-color);
      }

      [theme~="dark"] {
        color: var(--lumo-body-text-color);
        background-color: var(--lumo-base-color);
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        color: var(--lumo-header-text-color);
      }

      a {
        color: var(--lumo-primary-text-color);
      }

      blockquote {
        color: var(--lumo-secondary-text-color);
      }

      code,
      pre {
        background-color: var(--lumo-contrast-10pct);
        border-radius: var(--lumo-border-radius-m);
      }
    </style>
  </template>
</dom-module><dom-module id="lumo-color-legacy">
  <template>
    <style include="lumo-color">
      :host {
        color: var(--lumo-body-text-color) !important;
        background-color: var(--lumo-base-color) !important;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$a.content);/* Only needed for IE11 when you want to use the dark palette inside the light palette */ /*
                                                                                                                                                    FIXME(polymer-modulizer): the above comments were extracted
                                                                                                                                                    from HTML and may be out of place here. Review them and
                                                                                                                                                    then delete this comment!
                                                                                                                                                    */;const $_documentContainer$b=document.createElement("template");$_documentContainer$b.innerHTML=`<dom-module id="lumo-list-box" theme-for="vaadin-list-box">
  <template>
    <style>
      :host {
        -webkit-tap-highlight-color: transparent;
        --_lumo-item-selected-icon-display: var(--_lumo-list-box-item-selected-icon-display, block);
      }

      /* IE11 flexbox issue workaround (vaadin-items are flex containers with min-height) */
      [part="items"] {
        display: flex;
        flex-direction: column;
      }

      [part="items"] ::slotted(*) {
        flex: none;
      }

      /* Normal item */

      [part="items"] ::slotted(vaadin-item) {
        -webkit-tap-highlight-color: var(--lumo-primary-color-10pct);
        cursor: default;
      }

      [part="items"] ::slotted(vaadin-item) {
        outline: none;
        border-radius: var(--lumo-border-radius);
        padding-left: var(--_lumo-list-box-item-padding-left, calc(var(--lumo-border-radius) / 4));
        padding-right: calc(var(--lumo-space-l) + var(--lumo-border-radius) / 4);
      }

      /* Workaround to display checkmark in IE11 when list-box is not used in dropdown-menu */
      [part="items"] ::slotted(vaadin-item)::before {
        display: var(--_lumo-item-selected-icon-display);
      }

      /* Hovered item */
      /* TODO a workaround until we have "focus-follows-mouse". After that, use the hover style for focus-ring as well */

      [part="items"] ::slotted(vaadin-item:hover:not([disabled])) {
        background-color: var(--lumo-primary-color-10pct);
      }

      /* Focused item */

      [part="items"] ::slotted([focus-ring]:not([disabled])) {
        box-shadow: inset 0 0 0 2px var(--lumo-primary-color-50pct);
      }

      @media (pointer: coarse) {
        [part="items"] ::slotted(vaadin-item:hover:not([disabled])) {
          background-color: transparent;
        }

        [part="items"] ::slotted([focus-ring]:not([disabled])) {
          box-shadow: none;
        }
      }

      /* Easily add section dividers */

      [part="items"] ::slotted(hr) {
        height: 1px;
        border: 0;
        padding: 0;
        margin: var(--lumo-space-s) var(--lumo-border-radius);
        background-color: var(--lumo-contrast-10pct);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$b.content);const $_documentContainer$c=document.createElement("template");$_documentContainer$c.innerHTML=`<dom-module id="material-list-box" theme-for="vaadin-list-box">
  <template>
    <style>
      :host {
        -webkit-tap-highlight-color: transparent;
        --_material-item-selected-icon-display: block;
      }

      /* ShadyCSS workaround */
      [part="items"] ::slotted(vaadin-item)::before {
        display: block;
      }

      /* IE11 flexbox fix (https://github.com/philipwalton/flexbugs#3-min-height-on-a-flex-container-wont-apply-to-its-flex-items) */
      [part="items"] {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      [part="items"] ::slotted(*) {
        cursor: default;
      }

      [part="items"] ::slotted(vaadin-item) {
        min-height: 36px;
        padding: 8px 32px 8px 10px;
        font-size: var(--material-small-font-size);
        line-height: 24px;
      }

      [part="items"] ::slotted(vaadin-item:hover:not([disabled])) {
        background-color: var(--material-secondary-background-color);
      }

      [part="items"] ::slotted(vaadin-item[focused]:not([disabled])) {
        background-color: var(--material-divider-color);
      }

      @media (pointer: coarse) {
        [part="items"] ::slotted(vaadin-item:hover:not([disabled])),
        [part="items"] ::slotted(vaadin-item[focused]:not([disabled])) {
          background-color: transparent;
        }
      }

      /* Easily add section dividers */

      [part="items"] ::slotted(hr) {
        height: 1px;
        border: 0;
        padding: 0;
        margin: 8px 0;
        background-color: var(--material-divider-color);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$c.content);const $_documentContainer$d=document.createElement("template");$_documentContainer$d.innerHTML=`<dom-module id="lumo-field-button">
  <template>
    <style>
      [part\$="button"] {
        flex: none;
        width: 1em;
        height: 1em;
        line-height: 1;
        font-size: var(--lumo-icon-size-m);
        text-align: center;
        color: var(--lumo-contrast-60pct);
        transition: 0.2s color;
        cursor: var(--lumo-clickable-cursor);
      }

      :host(:not([readonly])) [part\$="button"]:hover {
        color: var(--lumo-contrast-90pct);
      }

      :host([disabled]) [part\$="button"],
      :host([readonly]) [part\$="button"] {
        color: var(--lumo-contrast-20pct);
      }

      [part\$="button"]::before {
        font-family: "lumo-icons";
        display: block;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$d.content);const $_documentContainer$e=document.createElement("template");$_documentContainer$e.innerHTML=`<dom-module id="lumo-overlay">
  <template>
    <style>
      :host {
        top: var(--lumo-space-m);
        right: var(--lumo-space-m);
        bottom: var(--lumo-space-m);
        left: var(--lumo-space-m);
        /* Workaround for Edge issue (only on Surface), where an overflowing vaadin-list-box inside vaadin-select-overlay makes the overlay transparent */
        /* stylelint-disable-next-line */
        outline: 0px solid transparent;
      }

      [part="overlay"] {
        background-color: var(--lumo-base-color);
        background-image: linear-gradient(var(--lumo-tint-5pct), var(--lumo-tint-5pct));
        border-radius: var(--lumo-border-radius-m);
        box-shadow: 0 0 0 1px var(--lumo-shade-5pct), var(--lumo-box-shadow-m);
        color: var(--lumo-body-text-color);
        font-family: var(--lumo-font-family);
        font-size: var(--lumo-font-size-m);
        font-weight: 400;
        line-height: var(--lumo-line-height-m);
        letter-spacing: 0;
        text-transform: none;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      [part="content"] {
        padding: var(--lumo-space-xs);
      }

      [part="backdrop"] {
        background-color: var(--lumo-shade-20pct);
        animation: 0.2s lumo-overlay-backdrop-enter both;
        will-change: opacity;
      }

      @keyframes lumo-overlay-backdrop-enter {
        0% {
          opacity: 0;
        }
      }

      :host([closing]) [part="backdrop"] {
        animation: 0.2s lumo-overlay-backdrop-exit both;
      }

      @keyframes lumo-overlay-backdrop-exit {
        100% {
          opacity: 0;
        }
      }

      @keyframes lumo-overlay-dummy-animation {
        0% { opacity: 1; }
        100% { opacity: 1; }
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$e.content);const $_documentContainer$f=document.createElement("template");$_documentContainer$f.innerHTML=`<dom-module id="lumo-menu-overlay-core">
  <template>
    <style>
      :host([opening]),
      :host([closing]) {
        animation: 0.14s lumo-overlay-dummy-animation;
      }

      [part="overlay"] {
        will-change: opacity, transform;
      }

      :host([opening]) [part="overlay"] {
        animation: 0.1s lumo-menu-overlay-enter ease-out both;
      }

      @keyframes lumo-menu-overlay-enter {
        0% {
          opacity: 0;
          transform: translateY(-4px);
        }
      }

      :host([closing]) [part="overlay"] {
        animation: 0.1s lumo-menu-overlay-exit both;
      }

      @keyframes lumo-menu-overlay-exit {
        100% {
          opacity: 0;
        }
      }
    </style>
  </template>
</dom-module><dom-module id="lumo-menu-overlay">
  <template>
    <style include="lumo-overlay lumo-menu-overlay-core">
      /* Small viewport (bottom sheet) styles */
      /* Use direct media queries instead of the state attributes (\`[phone]\` and \`[fullscreen]\`) provided by the elements */
      @media (max-width: 420px), (max-height: 420px) {
        :host {
          top: 0 !important;
          right: 0 !important;
          bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
          left: 0 !important;
          align-items: stretch !important;
          justify-content: flex-end !important;
        }

        [part="overlay"] {
          max-height: 50vh;
          width: 100vw;
          border-radius: 0;
          box-shadow: var(--lumo-box-shadow-xl);
        }

        /* The content part scrolls instead of the overlay part, because of the gradient fade-out */
        [part="content"] {
          padding: 30px var(--lumo-space-m);
          max-height: inherit;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          -webkit-mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
          mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
        }

        [part="backdrop"] {
          display: block;
        }

        /* Animations */

        :host([opening]) [part="overlay"] {
          animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(.215, .61, .355, 1) both;
        }

        :host([closing]),
        :host([closing]) [part="backdrop"] {
          animation-delay: 0.14s;
        }

        :host([closing]) [part="overlay"] {
          animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(.55, .055, .675, .19) both;
        }
      }

      @keyframes lumo-mobile-menu-overlay-enter {
        0% {
          transform: translateY(150%);
        }
      }

      @keyframes lumo-mobile-menu-overlay-exit {
        100% {
          transform: translateY(150%);
        }
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$f.content);/* Split as a separate module because combo box can only use the "fullscreen" styles */ /*
                                                                                                                                                  FIXME(polymer-modulizer): the above comments were extracted
                                                                                                                                                  from HTML and may be out of place here. Review them and
                                                                                                                                                  then delete this comment!
                                                                                                                                                  */;const $_documentContainer$g=document.createElement("template");$_documentContainer$g.innerHTML=`<dom-module id="lumo-required-field">
  <template>
    <style>
      [part="label"] {
        align-self: flex-start;
        color: var(--lumo-secondary-text-color);
        font-weight: 500;
        font-size: var(--lumo-font-size-s);
        margin-left: calc(var(--lumo-border-radius-m) / 4);
        transition: color 0.2s;
        line-height: 1;
        padding-bottom: 0.5em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        max-width: 100%;
        box-sizing: border-box;
      }

      :host([has-label])::before {
        margin-top: calc(var(--lumo-font-size-s) * 1.5);
      }

      :host([has-label]) {
        padding-top: var(--lumo-space-m);
      }

      :host([required]) [part="label"] {
        padding-right: 1em;
      }

      [part="label"]::after {
        content: var(--lumo-required-field-indicator, "•");
        transition: opacity 0.2s;
        opacity: 0;
        color: var(--lumo-primary-text-color);
        position: absolute;
        right: 0;
        width: 1em;
        text-align: center;
      }

      :host([required]:not([has-value])) [part="label"]::after {
        opacity: 1;
      }

      :host([invalid]) [part="label"]::after {
        color: var(--lumo-error-text-color);
      }

      [part="error-message"] {
        margin-left: calc(var(--lumo-border-radius-m) / 4);
        font-size: var(--lumo-font-size-xs);
        line-height: var(--lumo-line-height-xs);
        color: var(--lumo-error-text-color);
        will-change: max-height;
        transition: 0.4s max-height;
        max-height: 5em;
      }

      /* Margin that doesn’t reserve space when there’s no error message */
      [part="error-message"]:not(:empty)::before,
      [part="error-message"]:not(:empty)::after {
        content: "";
        display: block;
        height: 0.4em;
      }

      :host(:not([invalid])) [part="error-message"] {
        max-height: 0;
        overflow: hidden;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$g.content);const $_documentContainer$h=document.createElement("template");$_documentContainer$h.innerHTML=`<dom-module id="material-field-button">
  <template>
    <style>
      /* TODO(platosha): align icon sizes with other elements */
      [part\$="button"] {
        flex: none;
        width: 24px;
        height: 24px;
        padding: 4px;
        color: var(--material-secondary-text-color);
        font-size: var(--material-icon-font-size);
        line-height: 24px;
        text-align: center;
      }

      :host(:not([readonly])) [part\$="button"] {
        cursor: pointer;
      }

      :host(:not([readonly])) [part\$="button"]:hover {
        color: var(--material-text-color);
      }

      :host([disabled]) [part\$="button"],
      :host([readonly]) [part\$="button"] {
        color: var(--material-disabled-text-color);
      }

      :host([disabled]) [part="clear-button"] {
        display: none;
      }

      [part\$="button"]::before {
        font-family: "material-icons";
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$h.content);const $_documentContainer$i=document.createElement("template");$_documentContainer$i.innerHTML=`<custom-style>
  <style is="custom-style">
    html {
      /* from http://codepen.io/shyndman/pen/c5394ddf2e8b2a5c9185904b57421cdb */
      --material-shadow-elevation-2dp: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      --material-shadow-elevation-3dp: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 1px 8px 0 rgba(0, 0, 0, 0.12), 0 3px 3px -2px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-4dp: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-6dp: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-8dp: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-12dp: 0 12px 16px 1px rgba(0, 0, 0, 0.14), 0 4px 22px 3px rgba(0, 0, 0, 0.12), 0 6px 7px -4px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-16dp: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.4);
      --material-shadow-elevation-24dp: 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12), 0 11px 15px -7px rgba(0, 0, 0, 0.4);
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$i.content);const $_documentContainer$j=document.createElement("template");$_documentContainer$j.innerHTML=`<dom-module id="material-overlay">
  <template>
    <style>
      :host {
        top: 16px;
        right: 16px;
        /* TODO (@jouni): remove unnecessary multiplication after https://github.com/vaadin/vaadin-overlay/issues/90 is fixed */
        bottom: calc(1px * var(--vaadin-overlay-viewport-bottom) + 16px);
        left: 16px;
      }

      [part="overlay"] {
        background-color: var(--material-background-color);
        border-radius: 4px;
        box-shadow: var(--material-shadow-elevation-4dp);
        color: var(--material-body-text-color);
        font-family: var(--material-font-family);
        font-size: var(--material-body-font-size);
        font-weight: 400;
      }

      [part="content"] {
        padding: 8px 0;
      }

      [part="backdrop"] {
        opacity: 0.2;
        animation: 0.2s vaadin-overlay-backdrop-enter;
        will-change: opacity;
      }

      @keyframes vaadin-overlay-backdrop-enter {
        0% {
          opacity: 0;
        }
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$j.content);const $_documentContainer$k=document.createElement("template");$_documentContainer$k.innerHTML=`<dom-module id="material-menu-overlay">
  <template>
    <style include="material-overlay">
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$k.content);const $_documentContainer$l=document.createElement("template");$_documentContainer$l.innerHTML=`<dom-module id="material-required-field">
  <template>
    <style>
      [part="label"] {
        display: block;
        position: absolute;
        top: 8px;
        font-size: 1em;
        line-height: 1;
        height: 20px;
        margin-bottom: -4px;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        color: var(--material-secondary-text-color);
        transform-origin: 0 75%;
        transform: scale(0.75);
      }

      :host([required]) [part="label"]::after {
        content: " *";
        color: inherit;
      }

      :host([invalid]) [part="label"] {
        color: var(--material-error-text-color);
      }

      [part="error-message"] {
        font-size: .75em;
        line-height: 1;
        color: var(--material-error-text-color);
      }

      /* Margin that doesn’t reserve space when there’s no error message */
      [part="error-message"]:not(:empty)::before {
        content: "";
        display: block;
        height: 6px;
      }

      :host(:not([invalid])) [part="error-message"] {
        margin-top: 0;
        max-height: 0;
        overflow: hidden;
      }

      :host([invalid]) [part="error-message"] {
        animation: reveal 0.2s;
      }

      @keyframes reveal {
        0% {
          opacity: 0;
        }
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$l.content);const p=Element.prototype,matches=p.matches||p.matchesSelector||p.mozMatchesSelector||p.msMatchesSelector||p.oMatchesSelector||p.webkitMatchesSelector,FocusablesHelper={/**
   * Returns a sorted array of tabbable nodes, including the root node.
   * It searches the tabbable nodes in the light and shadow dom of the children,
   * sorting the result by tabindex.
   * @param {!Node} node
   * @return {!Array<!HTMLElement>}
   */getTabbableNodes:function(node){const result=[],needsSortByTabIndex=this._collectTabbableNodes(node,result);// If there is at least one element with tabindex > 0, we need to sort
// the final array by tabindex.
if(needsSortByTabIndex){return this._sortByTabIndex(result)}return result},/**
   * Returns if a element is focusable.
   * @param {!HTMLElement} element
   * @return {boolean}
   */isFocusable:function(element){// From http://stackoverflow.com/a/1600194/4228703:
// There isn't a definite list, it's up to the browser. The only
// standard we have is DOM Level 2 HTML
// https://www.w3.org/TR/DOM-Level-2-HTML/html.html, according to which the
// only elements that have a focus() method are HTMLInputElement,
// HTMLSelectElement, HTMLTextAreaElement and HTMLAnchorElement. This
// notably omits HTMLButtonElement and HTMLAreaElement. Referring to these
// tests with tabbables in different browsers
// http://allyjs.io/data-tables/focusable.html
// Elements that cannot be focused if they have [disabled] attribute.
if(matches.call(element,"input, select, textarea, button, object")){return matches.call(element,":not([disabled])")}// Elements that can be focused even if they have [disabled] attribute.
return matches.call(element,"a[href], area[href], iframe, [tabindex], [contentEditable]")},/**
   * Returns if a element is tabbable. To be tabbable, a element must be
   * focusable, visible, and with a tabindex !== -1.
   * @param {!HTMLElement} element
   * @return {boolean}
   */isTabbable:function(element){return this.isFocusable(element)&&matches.call(element,":not([tabindex=\"-1\"])")&&this._isVisible(element)},/**
   * Returns the normalized element tabindex. If not focusable, returns -1.
   * It checks for the attribute "tabindex" instead of the element property
   * `tabIndex` since browsers assign different values to it.
   * e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
   * @param {!HTMLElement} element
   * @return {!number}
   * @private
   */_normalizedTabIndex:function(element){if(this.isFocusable(element)){const tabIndex=element.getAttribute("tabindex")||0;return+tabIndex}return-1},/**
   * Searches for nodes that are tabbable and adds them to the `result` array.
   * Returns if the `result` array needs to be sorted by tabindex.
   * @param {!Node} node The starting point for the search; added to `result` if tabbable.
   * @param {!Array<!HTMLElement>} result
   * @return {boolean}
   * @private
   */_collectTabbableNodes:function(node,result){// If not an element or not visible, no need to explore children.
if(node.nodeType!==Node.ELEMENT_NODE||!this._isVisible(node)){return!1}const element=/** @type {!HTMLElement} */node,tabIndex=this._normalizedTabIndex(element);let needsSort=0<tabIndex;if(0<=tabIndex){result.push(element)}// In ShadowDOM v1, tab order is affected by the order of distribution.
// E.g. getTabbableNodes(#root) in ShadowDOM v1 should return [#A, #B];
// in ShadowDOM v0 tab order is not affected by the distribution order,
// in fact getTabbableNodes(#root) returns [#B, #A].
//  <div id="root">
//   <!-- shadow -->
//     <slot name="a">
//     <slot name="b">
//   <!-- /shadow -->
//   <input id="A" slot="a">
//   <input id="B" slot="b" tabindex="1">
//  </div>
let children;if("slot"===element.localName){children=element.assignedNodes({flatten:!0})}else{// Use shadow root if possible, will check for distributed nodes.
children=(element.shadowRoot||element).children}for(let i=0;i<children.length;i++){// Ensure method is always invoked to collect tabbable children.
needsSort=this._collectTabbableNodes(children[i],result)||needsSort}return needsSort},/**
   * Returns false if the element has `visibility: hidden` or `display: none`
   * @param {!HTMLElement} element
   * @return {boolean}
   * @private
   */_isVisible:function(element){// Check inline style first to save a re-flow. If looks good, check also
// computed style.
let style=element.style;if("hidden"!==style.visibility&&"none"!==style.display){style=window.getComputedStyle(element);return"hidden"!==style.visibility&&"none"!==style.display}return!1},/**
   * Sorts an array of tabbable elements by tabindex. Returns a new array.
   * @param {!Array<!HTMLElement>} tabbables
   * @return {!Array<!HTMLElement>}
   * @private
   */_sortByTabIndex:function(tabbables){// Implement a merge sort as Array.prototype.sort does a non-stable sort
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
const len=tabbables.length;if(2>len){return tabbables}const pivot=Math.ceil(len/2),left=this._sortByTabIndex(tabbables.slice(0,pivot)),right=this._sortByTabIndex(tabbables.slice(pivot));return this._mergeSortByTabIndex(left,right)},/**
   * Merge sort iterator, merges the two arrays into one, sorted by tab index.
   * @param {!Array<!HTMLElement>} left
   * @param {!Array<!HTMLElement>} right
   * @return {!Array<!HTMLElement>}
   * @private
   */_mergeSortByTabIndex:function(left,right){const result=[];while(0<left.length&&0<right.length){if(this._hasLowerTabOrder(left[0],right[0])){result.push(right.shift())}else{result.push(left.shift())}}return result.concat(left,right)},/**
   * Returns if element `a` has lower tab order compared to element `b`
   * (both elements are assumed to be focusable and tabbable).
   * Elements with tabindex = 0 have lower tab order compared to elements
   * with tabindex > 0.
   * If both have same tabindex, it returns false.
   * @param {!HTMLElement} a
   * @param {!HTMLElement} b
   * @return {boolean}
   * @private
   */_hasLowerTabOrder:function(a,b){// Normalize tabIndexes
// e.g. in Firefox `<div contenteditable>` has `tabIndex = -1`
const ati=Math.max(a.tabIndex,0),bti=Math.max(b.tabIndex,0);return 0===ati||0===bti?bti>ati:ati>bti}};var vaadinFocusablesHelper={FocusablesHelper:FocusablesHelper};let overlayContentCounter=0;const overlayContentCache={},createOverlayContent=cssText=>{const is=overlayContentCache[cssText]||processOverlayStyles(cssText);return document.createElement(is)},processOverlayStyles=cssText=>{overlayContentCounter++;const is=`vaadin-overlay-content-${overlayContentCounter}`,styledTemplate=document.createElement("template"),style=document.createElement("style");style.textContent=":host { display: block; }"+cssText;styledTemplate.content.appendChild(style);if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(styledTemplate,is)}// NOTE(platosha): Have to use an awkward IIFE returning class here
// to prevent this class from showing up in analysis.json & API docs.
/** @private */const klass=(()=>class extends HTMLElement{static get is(){return is}connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}if(!this.shadowRoot){this.attachShadow({mode:"open"});this.shadowRoot.appendChild(document.importNode(styledTemplate.content,!0))}}})();customElements.define(klass.is,klass);overlayContentCache[cssText]=is;return is};/**
    *
    * `<vaadin-overlay>` is a Web Component for creating overlays. The content of the overlay
    * can be populated in two ways: imperatively by using renderer callback function and
    * declaratively by using Polymer's Templates.
    *
    * ### Rendering
    *
    * By default, the overlay uses the content provided by using the renderer callback function.
    *
    * The renderer function provides `root`, `owner`, `model` arguments when applicable.
    * Generate DOM content by using `model` object properties if needed, append it to the `root`
    * element and control the state of the host element by accessing `owner`. Before generating new
    * content, users are able to check if there is already content in `root` for reusing it.
    *
    * ```html
    * <vaadin-overlay id="overlay"></vaadin-overlay>
    * ```
    * ```js
    * const overlay = document.querySelector('#overlay');
    * overlay.renderer = function(root) {
    *  root.textContent = "Overlay content";
    * };
    * ```
    *
    * Renderer is called on the opening of the overlay and each time the related model is updated.
    * DOM generated during the renderer call can be reused
    * in the next renderer call and will be provided with the `root` argument.
    * On first call it will be empty.
    *
    * **NOTE:** when the renderer property is defined, the `<template>` content is not used.
    *
    * ### Templating
    *
    * Alternatively, the content can be provided with Polymer Template.
    * Overlay finds the first child template and uses that in case renderer callback function
    * is not provided. You can also set a custom template using the `template` property.
    *
    * After the content from the template is stamped, the `content` property
    * points to the content container.
    *
    * The overlay provides `forwardHostProp` when calling
    * `Polymer.Templatize.templatize` for the template, so that the bindings
    * from the parent scope propagate to the content.  You can also pass
    * custom `instanceProps` object using the `instanceProps` property.
    *
    * ```html
    * <vaadin-overlay>
    *   <template>Overlay content</template>
    * </vaadin-overlay>
    * ```
    *
    * **NOTE:** when using `instanceProps`: because of the Polymer limitation,
    * every template can only be templatized once, so it is important
    * to set `instanceProps` before the `template` is assigned to the overlay.
    *
    * ### Styling
    *
    * To style the overlay content, use styles in the parent scope:
    *
    * - If the overlay is used in a component, then the component styles
    *   apply the overlay content.
    * - If the overlay is used in the global DOM scope, then global styles
    *   apply to the overlay content.
    *
    * See examples for styling the overlay content in the live demos.
    *
    * The following Shadow DOM parts are available for styling the overlay component itself:
    *
    * Part name  | Description
    * -----------|---------------------------------------------------------|
    * `backdrop` | Backdrop of the overlay
    * `overlay`  | Container for position/sizing/alignment of the content
    * `content`  | Content of the overlay
    *
    * The following state attributes are available for styling:
    *
    * Attribute | Description | Part
    * ---|---|---
    * `opening` | Applied just after the overlay is attached to the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
    * `closing` | Applied just before the overlay is detached from the DOM. You can apply a CSS @keyframe animation for this state. | `:host`
    *
    * The following custom CSS properties are available for styling:
    *
    * Custom CSS property | Description | Default value
    * ---|---|---
    * `--vaadin-overlay-viewport-bottom` | Bottom offset of the visible viewport area | `0` or detected offset
    *
    * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
    *
    * @memberof Vaadin
    * @mixes Vaadin.ThemableMixin
    * @demo demo/index.html
    */class OverlayElement extends ThemableMixin(PolymerElement){static get template(){return html`
    <style>
      :host {
        z-index: 200;
        position: fixed;

        /*
          Despite of what the names say, <vaadin-overlay> is just a container
          for position/sizing/alignment. The actual overlay is the overlay part.
        */

        /*
          Default position constraints: the entire viewport. Note: themes can
          override this to introduce gaps between the overlay and the viewport.
        */
        top: 0;
        right: 0;
        bottom: var(--vaadin-overlay-viewport-bottom);
        left: 0;

        /* Use flexbox alignment for the overlay part. */
        display: flex;
        flex-direction: column; /* makes dropdowns sizing easier */
        /* Align to center by default. */
        align-items: center;
        justify-content: center;

        /* Allow centering when max-width/max-height applies. */
        margin: auto;

        /* The host is not clickable, only the overlay part is. */
        pointer-events: none;

        /* Remove tap highlight on touch devices. */
        -webkit-tap-highlight-color: transparent;

        /* CSS API for host */
        --vaadin-overlay-viewport-bottom: 0;
      }

      :host([hidden]),
      :host(:not([opened]):not([closing])) {
        display: none !important;
      }

      [part="overlay"] {
        -webkit-overflow-scrolling: touch;
        overflow: auto;
        pointer-events: auto;

        /* Prevent overflowing the host in MSIE 11 */
        max-width: 100%;
        box-sizing: border-box;

        -webkit-tap-highlight-color: initial; /* reenable tap highlight inside */
      }

      [part="backdrop"] {
        z-index: -1;
        content: "";
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        pointer-events: auto;
      }
    </style>

    <div id="backdrop" part="backdrop" hidden\$="{{!withBackdrop}}"></div>
    <div part="overlay" id="overlay" tabindex="0">
      <div part="content" id="content">
        <slot></slot>
      </div>
    </div>
`}static get is(){return"vaadin-overlay"}static get properties(){return{opened:{type:Boolean,notify:!0,observer:"_openedChanged",reflectToAttribute:!0},/**
       * Owner element passed with renderer function
       */owner:Element,/**
       * Custom function for rendering the content of the overlay.
       * Receives three arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `owner` The host element of the renderer function.
       * - `model` The object with the properties related with rendering.
       */renderer:Function,/**
       * The template of the overlay content.
       */template:{type:Object,notify:!0},/**
       * Optional argument for `Polymer.Templatize.templatize`.
       */instanceProps:{type:Object},/**
       * References the content container after the template is stamped.
       */content:{type:Object,notify:!0},withBackdrop:{type:Boolean,value:!1,reflectToAttribute:!0},/**
       * Object with properties that is passed to `renderer` function
       */model:Object,/**
       * When true the overlay won't disable the main content, showing
       * it doesn’t change the functionality of the user interface.
       */modeless:{type:Boolean,value:!1,reflectToAttribute:!0,observer:"_modelessChanged"},/**
       * When set to true, the overlay is hidden. This also closes the overlay
       * immediately in case there is a closing animation in progress.
       */hidden:{type:Boolean,reflectToAttribute:!0,observer:"_hiddenChanged"},/**
       * When true move focus to the first focusable element in the overlay,
       * or to the overlay if there are no focusable elements.
       */focusTrap:{type:Boolean,value:!1},/**
       * Set to true to enable restoring of focus when overlay is closed.
       */restoreFocusOnClose:{type:Boolean,value:!1},_mouseDownInside:{type:Boolean},_mouseUpInside:{type:Boolean},_instance:{type:Object},_originalContentPart:Object,_contentNodes:Array,_oldOwner:Element,_oldModel:Object,_oldTemplate:Object,_oldInstanceProps:Object,_oldRenderer:Object,_oldOpened:Boolean}}static get observers(){return["_templateOrRendererChanged(template, renderer, owner, model, instanceProps, opened)"]}constructor(){super();this._boundMouseDownListener=this._mouseDownListener.bind(this);this._boundMouseUpListener=this._mouseUpListener.bind(this);this._boundOutsideClickListener=this._outsideClickListener.bind(this);this._boundKeydownListener=this._keydownListener.bind(this);this._observer=new FlattenedNodesObserver(this,info=>{this._setTemplateFromNodes(info.addedNodes)});// Listener for preventing closing of the paper-dialog and all components extending `iron-overlay-behavior`.
this._boundIronOverlayCanceledListener=this._ironOverlayCanceled.bind(this);if(/iPad|iPhone|iPod/.test(navigator.userAgent)){this._boundIosResizeListener=()=>this._detectIosNavbar()}}ready(){super.ready();this._observer.flush();// Need to add dummy click listeners to this and the backdrop or else
// the document click event listener (_outsideClickListener) may never
// get invoked on iOS Safari (reproducible in <vaadin-dialog>
// and <vaadin-context-menu>).
this.addEventListener("click",()=>{});this.$.backdrop.addEventListener("click",()=>{})}_detectIosNavbar(){if(!this.opened){return}const innerHeight=window.innerHeight,innerWidth=window.innerWidth,landscape=innerWidth>innerHeight,clientHeight=document.documentElement.clientHeight;if(landscape&&clientHeight>innerHeight){this.style.setProperty("--vaadin-overlay-viewport-bottom",clientHeight-innerHeight+"px")}else{this.style.setProperty("--vaadin-overlay-viewport-bottom","0")}}_setTemplateFromNodes(nodes){this.template=nodes.filter(node=>node.localName&&"template"===node.localName)[0]||this.template}/**
     * @event vaadin-overlay-close
     * fired before the `vaadin-overlay` will be closed. If canceled the closing of the overlay is canceled as well.
     */close(sourceEvent){var evt=new CustomEvent("vaadin-overlay-close",{bubbles:!0,cancelable:!0,detail:{sourceEvent:sourceEvent}});this.dispatchEvent(evt);if(!evt.defaultPrevented){this.opened=!1}}connectedCallback(){super.connectedCallback();if(this._boundIosResizeListener){this._detectIosNavbar();window.addEventListener("resize",this._boundIosResizeListener)}}disconnectedCallback(){super.disconnectedCallback();this._boundIosResizeListener&&window.removeEventListener("resize",this._boundIosResizeListener)}_ironOverlayCanceled(event){event.preventDefault()}_mouseDownListener(event){this._mouseDownInside=0<=event.composedPath().indexOf(this.$.overlay)}_mouseUpListener(event){this._mouseUpInside=0<=event.composedPath().indexOf(this.$.overlay)}/**
     * We need to listen on 'click' / 'tap' event and capture it and close the overlay before
     * propagating the event to the listener in the button. Otherwise, if the clicked button would call
     * open(), this would happen: https://www.youtube.com/watch?v=Z86V_ICUCD4
     *
     * @event vaadin-overlay-outside-click
     * fired before the `vaadin-overlay` will be closed on outside click. If canceled the closing of the overlay is canceled as well.
     */_outsideClickListener(event){if(-1!==event.composedPath().indexOf(this.$.overlay)||this._mouseDownInside||this._mouseUpInside){this._mouseDownInside=!1;this._mouseUpInside=!1;return}if(!this._last){return}const evt=new CustomEvent("vaadin-overlay-outside-click",{bubbles:!0,cancelable:!0,detail:{sourceEvent:event}});this.dispatchEvent(evt);if(this.opened&&!evt.defaultPrevented){this.close(event)}}/**
     * @event vaadin-overlay-escape-press
     * fired before the `vaadin-overlay` will be closed on ESC button press. If canceled the closing of the overlay is canceled as well.
     */_keydownListener(event){if(!this._last){return}// TAB
if("Tab"===event.key&&this.focusTrap){// if only tab key is pressed, cycle forward, else cycle backwards.
this._cycleTab(event.shiftKey?-1:1);event.preventDefault();// ESC
}else if("Escape"===event.key||"Esc"===event.key){const evt=new CustomEvent("vaadin-overlay-escape-press",{bubbles:!0,cancelable:!0,detail:{sourceEvent:event}});this.dispatchEvent(evt);if(this.opened&&!evt.defaultPrevented){this.close(event)}}}_ensureTemplatized(){this._setTemplateFromNodes(Array.from(this.children))}/**
     * @event vaadin-overlay-open
     * fired after the `vaadin-overlay` is opened.
     */_openedChanged(opened,wasOpened){if(!this._instance){this._ensureTemplatized()}if(opened){// Store focused node.
this.__restoreFocusNode=this._getActiveElement();this._animatedOpening();afterNextRender(this,()=>{if(this.focusTrap&&!this.contains(document._activeElement||document.activeElement)){this._cycleTab(0,0)}const evt=new CustomEvent("vaadin-overlay-open",{bubbles:!0});this.dispatchEvent(evt)});if(!this.modeless){this._addGlobalListeners()}}else if(wasOpened){this._animatedClosing();if(!this.modeless){this._removeGlobalListeners()}}}_hiddenChanged(hidden){if(hidden&&this.hasAttribute("closing")){this._flushAnimation("closing")}}_shouldAnimate(){const name=getComputedStyle(this).getPropertyValue("animation-name"),hidden="none"===getComputedStyle(this).getPropertyValue("display");return!hidden&&name&&"none"!=name}_enqueueAnimation(type,callback){const handler=`__${type}Handler`,listener=()=>{callback();this.removeEventListener("animationend",listener);delete this[handler]};this[handler]=listener;this.addEventListener("animationend",listener)}_flushAnimation(type){const handler=`__${type}Handler`;if("function"===typeof this[handler]){this[handler]()}}_animatedOpening(){if(this.parentNode===document.body&&this.hasAttribute("closing")){this._flushAnimation("closing")}this._attachOverlay();this.setAttribute("opening","");const finishOpening=()=>{this.removeAttribute("opening");document.addEventListener("iron-overlay-canceled",this._boundIronOverlayCanceledListener);if(!this.modeless){this._enterModalState()}};if(this._shouldAnimate()){this._enqueueAnimation("opening",finishOpening)}else{finishOpening()}}_attachOverlay(){this._placeholder=document.createComment("vaadin-overlay-placeholder");this.parentNode.insertBefore(this._placeholder,this);document.body.appendChild(this)}_animatedClosing(){if(this.hasAttribute("opening")){this._flushAnimation("opening")}if(this._placeholder){this.setAttribute("closing","");const finishClosing=()=>{this.shadowRoot.querySelector("[part=\"overlay\"]").style.removeProperty("pointer-events");this._exitModalState();document.removeEventListener("iron-overlay-canceled",this._boundIronOverlayCanceledListener);this._detachOverlay();this.removeAttribute("closing");if(this.restoreFocusOnClose&&this.__restoreFocusNode){// If the activeElement is `<body>` or inside the overlay,
// we are allowed to restore the focus. In all the other
// cases focus might have been moved elsewhere by another
// component or by the user interaction (e.g. click on a
// button outside the overlay).
const activeElement=this._getActiveElement();if(activeElement===document.body||this._deepContains(activeElement)){this.__restoreFocusNode.focus()}this.__restoreFocusNode=null}};if(this._shouldAnimate()){this._enqueueAnimation("closing",finishClosing)}else{finishClosing()}}}_detachOverlay(){this._placeholder.parentNode.insertBefore(this,this._placeholder);this._placeholder.parentNode.removeChild(this._placeholder)}/**
     * Returns all attached overlays.
     */static get __attachedInstances(){return Array.from(document.body.children).filter(el=>el instanceof OverlayElement)}/**
     * returns true if this is the last one in the opened overlays stack
     */get _last(){return this===OverlayElement.__attachedInstances.pop()}_modelessChanged(modeless){if(!modeless){if(this.opened){this._addGlobalListeners();this._enterModalState()}}else{this._removeGlobalListeners();this._exitModalState()}}_addGlobalListeners(){document.addEventListener("mousedown",this._boundMouseDownListener);document.addEventListener("mouseup",this._boundMouseUpListener);// Firefox leaks click to document on contextmenu even if prevented
// https://bugzilla.mozilla.org/show_bug.cgi?id=990614
document.documentElement.addEventListener("click",this._boundOutsideClickListener,!0);document.addEventListener("keydown",this._boundKeydownListener)}_enterModalState(){if("none"!==document.body.style.pointerEvents){// Set body pointer-events to 'none' to disable mouse interactions with
// other document nodes.
this._previousDocumentPointerEvents=document.body.style.pointerEvents;document.body.style.pointerEvents="none"}// Disable pointer events in other attached overlays
OverlayElement.__attachedInstances.forEach(el=>{if(el!==this){el.shadowRoot.querySelector("[part=\"overlay\"]").style.pointerEvents="none"}})}_removeGlobalListeners(){document.removeEventListener("mousedown",this._boundMouseDownListener);document.removeEventListener("mouseup",this._boundMouseUpListener);document.documentElement.removeEventListener("click",this._boundOutsideClickListener,!0);document.removeEventListener("keydown",this._boundKeydownListener)}_exitModalState(){if(this._previousDocumentPointerEvents!==void 0){// Restore body pointer-events
document.body.style.pointerEvents=this._previousDocumentPointerEvents;delete this._previousDocumentPointerEvents}// Restore pointer events in the previous overlay(s)
const instances=OverlayElement.__attachedInstances;let el;// Use instances.pop() to ensure the reverse order
while(el=instances.pop()){if(el===this){// Skip the current instance
continue}el.shadowRoot.querySelector("[part=\"overlay\"]").style.removeProperty("pointer-events");if(!el.modeless){// Stop after the last modal
break}}}_removeOldContent(){if(!this.content||!this._contentNodes){return}this._observer.disconnect();this._contentNodes.forEach(node=>{if(node.parentNode===this.content){this.content.removeChild(node)}});if(this._originalContentPart){// Restore the original <div part="content">
this.$.content.parentNode.replaceChild(this._originalContentPart,this.$.content);this.$.content=this._originalContentPart;this._originalContentPart=void 0}this._observer.connect();this._contentNodes=void 0;this.content=void 0}_stampOverlayTemplate(template,instanceProps){this._removeOldContent();if(!template._Templatizer){template._Templatizer=templatize(template,this,{instanceProps:instanceProps,forwardHostProp:function(prop,value){if(this._instance){this._instance.forwardHostProp(prop,value)}}})}this._instance=new template._Templatizer({});this._contentNodes=Array.from(this._instance.root.childNodes);const templateRoot=template._templateRoot||(template._templateRoot=template.getRootNode()),_isScoped=templateRoot!==document;if(_isScoped){if(!this.$.content.shadowRoot){this.$.content.attachShadow({mode:"open"})}let scopeCssText="";const host=templateRoot.host;if(host&&host._template){scopeCssText=stylesFromTemplate(host._template).reduce((result,style)=>result+style.textContent,"")}// The overlay root’s :host styles should not apply inside the overlay
scopeCssText=scopeCssText.replace(/:host/g,":host-nomatch");if(scopeCssText){if(window.ShadyCSS&&!window.ShadyCSS.nativeShadow){// ShadyDOM: replace the <div part="content"> with a generated
// styled custom element
const contentPart=createOverlayContent(scopeCssText);contentPart.id="content";contentPart.setAttribute("part","content");this.$.content.parentNode.replaceChild(contentPart,this.$.content);// NOTE(platosha): carry the style scope of the content part
contentPart.className=this.$.content.className;this._originalContentPart=this.$.content;this.$.content=contentPart}else{// Shadow DOM: append a style to the content shadowRoot
const style=document.createElement("style");style.textContent=scopeCssText;this.$.content.shadowRoot.appendChild(style);this._contentNodes.unshift(style)}}this.$.content.shadowRoot.appendChild(this._instance.root);this.content=this.$.content.shadowRoot}else{this.appendChild(this._instance.root);this.content=this}}_removeNewRendererOrTemplate(template,oldTemplate,renderer,oldRenderer){if(template!==oldTemplate){this.template=void 0}else if(renderer!==oldRenderer){this.renderer=void 0}}/**
     * Manually invoke existing renderer.
     */render(){if(this.renderer){this.renderer.call(this.owner,this.content,this.owner,this.model)}}_templateOrRendererChanged(template,renderer,owner,model,instanceProps,opened){if(template&&renderer){this._removeNewRendererOrTemplate(template,this._oldTemplate,renderer,this._oldRenderer);throw new Error("You should only use either a renderer or a template for overlay content")}const ownerOrModelChanged=this._oldOwner!==owner||this._oldModel!==model;this._oldModel=model;this._oldOwner=owner;const templateOrInstancePropsChanged=this._oldInstanceProps!==instanceProps||this._oldTemplate!==template;this._oldInstanceProps=instanceProps;this._oldTemplate=template;const rendererChanged=this._oldRenderer!==renderer;this._oldRenderer=renderer;const openedChanged=this._oldOpened!==opened;this._oldOpened=opened;if(template&&templateOrInstancePropsChanged){this._stampOverlayTemplate(template,instanceProps)}else if(renderer&&(rendererChanged||openedChanged||ownerOrModelChanged)){this.content=this;if(rendererChanged){while(this.content.firstChild){this.content.removeChild(this.content.firstChild)}}if(opened){this.render()}}}_isFocused(element){return element&&element.getRootNode().activeElement===element}_focusedIndex(elements){elements=elements||this._getFocusableElements();return elements.indexOf(elements.filter(this._isFocused).pop())}_cycleTab(increment,index){const focusableElements=this._getFocusableElements();if(index===void 0){index=this._focusedIndex(focusableElements)}index+=increment;// rollover to first item
if(index>=focusableElements.length){index=0;// go to last item
}else if(0>index){index=focusableElements.length-1}focusableElements[index].focus()}_getFocusableElements(){// collect all focusable elements
return FocusablesHelper.getTabbableNodes(this.$.overlay)}_getActiveElement(){let active=document._activeElement||document.activeElement;// document.activeElement can be null
// https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
// In IE 11, it can also be an object when operating in iframes
// or document.documentElement (when overlay closed on outside click).
// In these cases, default it to document.body.
if(!active||active===document.documentElement||!1===active instanceof Element){active=document.body}while(active.shadowRoot&&active.shadowRoot.activeElement){active=active.shadowRoot.activeElement}return active}_deepContains(node){if(this.contains(node)){return!0}let n=node;const doc=node.ownerDocument;// walk from node to `this` or `document`
while(n&&n!==doc&&n!==this){n=n.parentNode||n.host}return n===this}}customElements.define(OverlayElement.is,OverlayElement);var vaadinOverlay={OverlayElement:OverlayElement};const $_documentContainer$m=document.createElement("template");$_documentContainer$m.innerHTML=`<dom-module id="vaadin-select-overlay-styles" theme-for="vaadin-select-overlay">
  <template>
    <style>
      :host {
        align-items: flex-start;
        justify-content: flex-start;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$m.content);/**
                                                          * The overlay element.
                                                          *
                                                          * ### Styling
                                                          *
                                                          * See [`<vaadin-overlay>` documentation](https://github.com/vaadin/vaadin-overlay/blob/master/src/vaadin-overlay.html)
                                                          * for `<vaadin-select-overlay>` parts.
                                                          *
                                                          * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
                                                          *
                                                          * @memberof Vaadin
                                                          * @extends Vaadin.OverlayElement
                                                          */class SelectOverlayElement extends OverlayElement{static get is(){return"vaadin-select-overlay"}}customElements.define(SelectOverlayElement.is,SelectOverlayElement);const $_documentContainer$n=document.createElement("template");$_documentContainer$n.innerHTML=`<dom-module id="vaadin-text-field-shared-styles">
  <template>
    <style>
      :host {
        display: inline-flex;
        outline: none;
      }

      :host::before {
        content: "\\2003";
        width: 0;
        display: inline-block;
        /* Size and position this element on the same vertical position as the input-field element
           to make vertical align for the host element work as expected */
      }

      :host([hidden]) {
        display: none !important;
      }

      .vaadin-text-field-container,
      .vaadin-text-area-container {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        max-width: 100%;
        width: var(--vaadin-text-field-default-width, 12em);
      }

      [part="label"]:empty {
        display: none;
      }

      [part="input-field"] {
        display: flex;
        align-items: center;
        flex: auto;
      }

      .vaadin-text-field-container [part="input-field"] {
        flex-grow: 0;
      }

      /* Reset the native input styles */
      [part="value"],
      [part="input-field"] ::slotted(input),
      [part="input-field"] ::slotted(textarea) {
        -webkit-appearance: none;
        -moz-appearance: none;
        outline: none;
        margin: 0;
        padding: 0;
        border: 0;
        border-radius: 0;
        min-width: 0;
        font: inherit;
        font-size: 1em;
        line-height: normal;
        color: inherit;
        background-color: transparent;
        /* Disable default invalid style in Firefox */
        box-shadow: none;
      }

      [part="input-field"] ::slotted(*) {
        flex: none;
      }

      [part="value"],
      [part="input-field"] ::slotted(input),
      [part="input-field"] ::slotted(textarea),
      /* Slotted by vaadin-select-text-field */
      [part="input-field"] ::slotted([part="value"]) {
        flex: auto;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }

      [part="input-field"] ::slotted(textarea) {
        resize: none;
      }

      [part="value"]::-ms-clear,
      [part="input-field"] ::slotted(input)::-ms-clear {
        display: none;
      }

      [part="clear-button"] {
        cursor: default;
      }

      [part="clear-button"]::before {
        content: "✕";
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$n.content);const HOST_PROPS={default:["list","autofocus","pattern","autocapitalize","autocorrect","maxlength","minlength","name","placeholder","autocomplete","title"],accessible:["disabled","readonly","required","invalid"]},PROP_TYPE={DEFAULT:"default",ACCESSIBLE:"accessible"},TextFieldMixin=subclass=>class VaadinTextFieldMixin extends ControlStateMixin(subclass){static get properties(){return{/**
       * Whether the value of the control can be automatically completed by the browser.
       * List of available options at:
       * https://developer.mozilla.org/en/docs/Web/HTML/Element/input#attr-autocomplete
       */autocomplete:{type:String},/**
       * This is a property supported by Safari that is used to control whether
       * autocorrection should be enabled when the user is entering/editing the text.
       * Possible values are:
       * on: Enable autocorrection.
       * off: Disable autocorrection.
       */autocorrect:{type:String},/**
       * This is a property supported by Safari and Chrome that is used to control whether
       * autocapitalization should be enabled when the user is entering/editing the text.
       * Possible values are:
       * characters: Characters capitalization.
       * words: Words capitalization.
       * sentences: Sentences capitalization.
       * none: No capitalization.
       */autocapitalize:{type:String},/**
       * Specify that the value should be automatically selected when the field gains focus.
       */autoselect:{type:Boolean,value:!1},/**
       * Set to true to display the clear icon which clears the input.
       */clearButtonVisible:{type:Boolean,value:!1},/**
       * Error to show when the input value is invalid.
       */errorMessage:{type:String,value:""},/**
       * String used for the label element.
       */label:{type:String,value:"",observer:"_labelChanged"},/**
       * Maximum number of characters (in Unicode code points) that the user can enter.
       */maxlength:{type:Number},/**
       * Minimum number of characters (in Unicode code points) that the user can enter.
       */minlength:{type:Number},/**
       * The name of the control, which is submitted with the form data.
       */name:{type:String},/**
       * A hint to the user of what can be entered in the control.
       */placeholder:{type:String},/**
       * This attribute indicates that the user cannot modify the value of the control.
       */readonly:{type:Boolean,reflectToAttribute:!0},/**
       * Specifies that the user must fill in a value.
       */required:{type:Boolean,reflectToAttribute:!0},/**
       * The initial value of the control.
       * It can be used for two-way data binding.
       */value:{type:String,value:"",observer:"_valueChanged",notify:!0},/**
       * This property is set to true when the control value is invalid.
       */invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},/**
       * Specifies that the text field has value.
       */hasValue:{type:Boolean,reflectToAttribute:!0},/**
       * When set to true, user is prevented from typing a value that
       * conflicts with the given `pattern`.
       */preventInvalidInput:{type:Boolean},_labelId:{type:String},_errorId:{type:String}}}static get observers(){return["_stateChanged(disabled, readonly, clearButtonVisible, hasValue)","_hostPropsChanged("+HOST_PROPS.default.join(", ")+")","_hostAccessiblePropsChanged("+HOST_PROPS.accessible.join(", ")+")","_getActiveErrorId(invalid, errorMessage, _errorId)","_getActiveLabelId(label, _labelId)"]}get focusElement(){if(!this.shadowRoot){return}const slotted=this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);if(slotted){return slotted}return this.shadowRoot.querySelector("[part=\"value\"]")}/**
     * @private
     */get inputElement(){return this.focusElement}get _slottedTagName(){return"input"}_onInput(e){if(this.__preventInput){e.stopImmediatePropagation();this.__preventInput=!1;return}if(this.preventInvalidInput){const input=this.inputElement;if(0<input.value.length&&!this.checkValidity()){input.value=this.value||"";// add input-prevented attribute for 200ms
this.setAttribute("input-prevented","");this._inputDebouncer=Debouncer.debounce(this._inputDebouncer,timeOut.after(200),()=>{this.removeAttribute("input-prevented")});return}}this.__userInput=!0;this.value=e.target.value}// NOTE(yuriy): Workaround needed for IE11 and Edge for proper displaying
// of the clear button instead of setting display property for it depending on state.
_stateChanged(disabled,readonly,clearButtonVisible,hasValue){if(!disabled&&!readonly&&clearButtonVisible&&hasValue){this.$.clearButton.removeAttribute("hidden")}else{this.$.clearButton.setAttribute("hidden",!0)}}_onChange(e){if(this._valueClearing){return}// In the Shadow DOM, the `change` event is not leaked into the
// ancestor tree, so we must do this manually.
const changeEvent=new CustomEvent("change",{detail:{sourceEvent:e},bubbles:e.bubbles,cancelable:e.cancelable});this.dispatchEvent(changeEvent)}_valueChanged(newVal,oldVal){// setting initial value to empty string, skip validation
if(""===newVal&&oldVal===void 0){return}if(""!==newVal&&null!=newVal){this.hasValue=!0}else{this.hasValue=!1}if(this.__userInput){this.__userInput=!1;return}else if(newVal!==void 0){this.inputElement.value=newVal}else{this.value=this.inputElement.value=""}if(this.invalid){this.validate()}}_labelChanged(label){if(""!==label&&null!=label){this.setAttribute("has-label","")}else{this.removeAttribute("has-label")}}_onSlotChange(){const slotted=this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);if(this.value){this.inputElement.value=this.value;this.validate()}if(slotted&&!this._slottedInput){this._validateSlottedValue(slotted);this._addInputListeners(slotted);this._addIEListeners(slotted);this._slottedInput=slotted}else if(!slotted&&this._slottedInput){this._removeInputListeners(this._slottedInput);this._removeIEListeners(this._slottedInput);this._slottedInput=void 0}Object.keys(PROP_TYPE).map(key=>PROP_TYPE[key]).forEach(type=>this._propagateHostAttributes(HOST_PROPS[type].map(attr=>this[attr]),type))}_hostPropsChanged(...attributesValues){this._propagateHostAttributes(attributesValues,PROP_TYPE.DEFAULT)}_hostAccessiblePropsChanged(...attributesValues){this._propagateHostAttributes(attributesValues,PROP_TYPE.ACCESSIBLE)}_validateSlottedValue(slotted){if(slotted.value!==this.value){console.warn("Please define value on the vaadin-text-field component!");slotted.value=""}}_propagateHostAttributes(attributesValues,type){const input=this.inputElement,attributeNames=HOST_PROPS[type];if("accessible"===type){attributeNames.forEach((attr,index)=>{this._setOrToggleAttribute(attr,attributesValues[index],input);this._setOrToggleAttribute(`aria-${attr}`,attributesValues[index],input)})}else{attributeNames.forEach((attr,index)=>{this._setOrToggleAttribute(attr,attributesValues[index],input)})}}_setOrToggleAttribute(name,value,node){if(!name||!node){return}if(value){node.setAttribute(name,"boolean"===typeof value?"":value)}else{node.removeAttribute(name)}}/**
     * Returns true if the current input value satisfies all constraints (if any)
     * @returns {boolean}
     */checkValidity(){if(this.required||this.pattern||this.maxlength||this.minlength){return this.inputElement.checkValidity()}else{return!this.invalid}}_addInputListeners(node){node.addEventListener("input",this._boundOnInput);node.addEventListener("change",this._boundOnChange);node.addEventListener("blur",this._boundOnBlur);node.addEventListener("focus",this._boundOnFocus)}_removeInputListeners(node){node.removeEventListener("input",this._boundOnInput);node.removeEventListener("change",this._boundOnChange);node.removeEventListener("blur",this._boundOnBlur);node.removeEventListener("focus",this._boundOnFocus)}ready(){super.ready();this._boundOnInput=this._onInput.bind(this);this._boundOnChange=this._onChange.bind(this);this._boundOnBlur=this._onBlur.bind(this);this._boundOnFocus=this._onFocus.bind(this);const defaultInput=this.shadowRoot.querySelector("[part=\"value\"]");this._slottedInput=this.querySelector(`${this._slottedTagName}[slot="${this._slottedTagName}"]`);this._addInputListeners(defaultInput);this._addIEListeners(defaultInput);if(this._slottedInput){this._addIEListeners(this._slottedInput);this._addInputListeners(this._slottedInput)}this.shadowRoot.querySelector("[name=\"input\"], [name=\"textarea\"]").addEventListener("slotchange",this._onSlotChange.bind(this));if(!(window.ShadyCSS&&window.ShadyCSS.nativeCss)){this.updateStyles()}this.$.clearButton.addEventListener("mousedown",()=>this._valueClearing=!0);this.$.clearButton.addEventListener("click",this._onClearButtonClick.bind(this));this.addEventListener("keydown",this._onKeyDown.bind(this));var uniqueId=TextFieldMixin._uniqueId=1+TextFieldMixin._uniqueId||0;this._errorId=`${this.constructor.is}-error-${uniqueId}`;this._labelId=`${this.constructor.is}-label-${uniqueId}`}/**
     * Returns true if `value` is valid.
     * `<iron-form>` uses this to check the validity or all its elements.
     *
     * @return {boolean} True if the value is valid.
     */validate(){return!(this.invalid=!this.checkValidity())}clear(){this.value=""}_onBlur(){this.validate()}_onFocus(){if(this.autoselect){this.inputElement.select();// iOS 9 workaround: https://stackoverflow.com/a/7436574
setTimeout(()=>{this.inputElement.setSelectionRange(0,9999)})}}_onClearButtonClick(e){// NOTE(yuriy): This line won't affect focus on the host. Cannot be properly tested.
this.inputElement.focus();this.clear();this._valueClearing=!1;this.inputElement.dispatchEvent(new Event("change",{bubbles:!this._slottedInput}))}_onKeyDown(e){if(27===e.keyCode&&this.clearButtonVisible){this.clear()}}_addIEListeners(node){/* istanbul ignore if */if(navigator.userAgent.match(/Trident/)){// IE11 dispatches `input` event in following cases:
// - focus or blur, when placeholder attribute is set
// - placeholder attribute value changed
// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101220/
this._shouldPreventInput=()=>{this.__preventInput=!0;requestAnimationFrame(()=>{this.__preventInput=!1})};node.addEventListener("focusin",this._shouldPreventInput);node.addEventListener("focusout",this._shouldPreventInput);this._createPropertyObserver("placeholder",this._shouldPreventInput)}}_removeIEListeners(node){/* istanbul ignore if */if(navigator.userAgent.match(/Trident/)){node.removeEventListener("focusin",this._shouldPreventInput);node.removeEventListener("focusout",this._shouldPreventInput)}}_getActiveErrorId(invalid,errorMessage,errorId){this._setOrToggleAttribute("aria-describedby",errorMessage&&invalid?errorId:void 0,this.inputElement)}_getActiveLabelId(label,labelId){this._setOrToggleAttribute("aria-labelledby",label?labelId:void 0,this.inputElement)}_getErrorMessageAriaHidden(invalid,errorMessage,errorId){return(!(errorMessage&&invalid?errorId:void 0)).toString()}/**
     * @protected
     */attributeChangedCallback(prop,oldVal,newVal){super.attributeChangedCallback(prop,oldVal,newVal);// Needed until Edge has CSS Custom Properties (present in Edge Preview)
/* istanbul ignore if */if(!(window.ShadyCSS&&window.ShadyCSS.nativeCss)&&/^(focused|focus-ring|invalid|disabled|placeholder|has-value)$/.test(prop)){this.updateStyles()}// Safari has an issue with repainting shadow root element styles when a host attribute changes.
// Need this workaround (toggle any inline css property on and off) until the issue gets fixed.
const isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent);/* istanbul ignore if */if(isSafari&&this.root){const WEBKIT_PROPERTY="-webkit-backface-visibility";this.root.querySelectorAll("*").forEach(el=>{el.style[WEBKIT_PROPERTY]="visible";el.style[WEBKIT_PROPERTY]=""})}}/**
     * Fired when the user commits a value change.
     *
     * @event change
     */};var vaadinTextFieldMixin={TextFieldMixin:TextFieldMixin};class TextFieldElement extends ElementMixin(TextFieldMixin(ThemableMixin(PolymerElement))){static get template(){return html`
    <style include="vaadin-text-field-shared-styles">
      /* polymer-cli linter breaks with empty line */
    </style>

    <div class="vaadin-text-field-container">

      <label part="label" on-click="focus" id="[[_labelId]]">[[label]]</label>

      <div part="input-field">

        <slot name="prefix"></slot>

        <slot name="input">
          <input part="value">
        </slot>

        <div part="clear-button" id="clearButton" role="button" aria-label="Clear"></div>
        <slot name="suffix"></slot>

      </div>

      <div part="error-message" id="[[_errorId]]" aria-live="assertive" aria-hidden\$="[[_getErrorMessageAriaHidden(invalid, errorMessage, _errorId)]]">[[errorMessage]]</div>

    </div>
`}static get is(){return"vaadin-text-field"}static get version(){return"2.3.7"}static get properties(){return{/**
       * Identifies a list of pre-defined options to suggest to the user.
       * The value must be the id of a <datalist> element in the same document.
       */list:{type:String},/**
       * A regular expression that the value is checked against.
       * The pattern must match the entire value, not just some subset.
       */pattern:{type:String},/**
       * Message to show to the user when validation fails.
       */title:{type:String}}}}customElements.define(TextFieldElement.is,TextFieldElement);var vaadinTextField={TextFieldElement:TextFieldElement};let memoizedTemplate;/**
                        * The text-field element.
                        *
                        * ### Styling
                        *
                        * See [`<vaadin-text-field>` documentation](https://github.com/vaadin/vaadin-text-field/blob/master/src/vaadin-text-field.html)
                        * for `<vaadin-select-text-field>` parts and available slots (prefix, suffix etc.)
                        *
                        * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
                        *
                        * @memberof Vaadin
                        * @extends Vaadin.TextFieldElement
                        */class SelectTextFieldElement extends TextFieldElement{static get is(){return"vaadin-select-text-field"}static get template(){// Check if text-field is using slotted input
if(super.template.content.querySelector("slot[name=\"input\"]")){return super.template}if(!memoizedTemplate){// Clone the superclass template
memoizedTemplate=super.template.cloneNode(!0);// Create a slot for the value element
const slot=document.createElement("slot");slot.setAttribute("name","value");// Insert the slot before the text-field
const input=memoizedTemplate.content.querySelector("input");input.parentElement.replaceChild(slot,input);slot.appendChild(input)}return memoizedTemplate}get focusElement(){return this.shadowRoot.querySelector("[part=input-field]")}get inputElement(){return this.shadowRoot.querySelector("input")}}customElements.define(SelectTextFieldElement.is,SelectTextFieldElement);const $_documentContainer$o=document.createElement("template");$_documentContainer$o.innerHTML=`<custom-style>
  <style>
    @font-face {
      font-family: "vaadin-select-icons";
      src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAASEAAsAAAAABDgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABPUy8yAAABCAAAAGAAAABgDxIGKmNtYXAAAAFoAAAAVAAAAFQXVtKHZ2FzcAAAAbwAAAAIAAAACAAAABBnbHlmAAABxAAAAHwAAAB8CohkJ2hlYWQAAAJAAAAANgAAADYOavgEaGhlYQAAAngAAAAkAAAAJAarA8ZobXR4AAACnAAAABQAAAAUCAABP2xvY2EAAAKwAAAADAAAAAwAKABSbWF4cAAAArwAAAAgAAAAIAAHABduYW1lAAAC3AAAAYYAAAGGmUoJ+3Bvc3QAAARkAAAAIAAAACAAAwAAAAMEAAGQAAUAAAKZAswAAACPApkCzAAAAesAMwEJAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAAAAAQAAA6QADwP/AAEADwABAAAAAAQAAAAAAAAAAAAAAIAAAAAAAAwAAAAMAAAAcAAEAAwAAABwAAwABAAAAHAAEADgAAAAKAAgAAgACAAEAIOkA//3//wAAAAAAIOkA//3//wAB/+MXBAADAAEAAAAAAAAAAAAAAAEAAf//AA8AAQAAAAAAAAAAAAIAADc5AQAAAAABAAAAAAAAAAAAAgAANzkBAAAAAAEAAAAAAAAAAAACAAA3OQEAAAAAAQE/AUAC6QIVABQAAAEwFx4BFxYxMDc+ATc2MTAjKgEjIgE/ISJPIiEhIk8iIUNCoEJDAhUhIk8iISEiTyIhAAEAAAABAABvL5bdXw889QALBAAAAAAA1jHaeQAAAADWMdp5AAAAAALpAhUAAAAIAAIAAAAAAAAAAQAAA8D/wAAABAAAAAAAAukAAQAAAAAAAAAAAAAAAAAAAAUEAAAAAAAAAAAAAAAAAAAABAABPwAAAAAACgAUAB4APgABAAAABQAVAAEAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAADgCuAAEAAAAAAAEABwAAAAEAAAAAAAIABwBgAAEAAAAAAAMABwA2AAEAAAAAAAQABwB1AAEAAAAAAAUACwAVAAEAAAAAAAYABwBLAAEAAAAAAAoAGgCKAAMAAQQJAAEADgAHAAMAAQQJAAIADgBnAAMAAQQJAAMADgA9AAMAAQQJAAQADgB8AAMAAQQJAAUAFgAgAAMAAQQJAAYADgBSAAMAAQQJAAoANACkaWNvbW9vbgBpAGMAbwBtAG8AbwBuVmVyc2lvbiAxLjAAVgBlAHIAcwBpAG8AbgAgADEALgAwaWNvbW9vbgBpAGMAbwBtAG8AbwBuaWNvbW9vbgBpAGMAbwBtAG8AbwBuUmVndWxhcgBSAGUAZwB1AGwAYQByaWNvbW9vbgBpAGMAbwBtAG8AbwBuRm9udCBnZW5lcmF0ZWQgYnkgSWNvTW9vbi4ARgBvAG4AdAAgAGcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAASQBjAG8ATQBvAG8AbgAuAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==) format('woff');
      font-weight: normal;
      font-style: normal;
    }
  </style>
</custom-style>`;document.head.appendChild($_documentContainer$o.content);/**
                                                          *
                                                          * `<vaadin-select>` is a Web Component for selecting values from a list of items. The content of the
                                                          * the select can be populated in two ways: imperatively by using renderer callback function and
                                                          * declaratively by using Polymer's Templates.
                                                          *
                                                          * ### Rendering
                                                          *
                                                          * By default, the select uses the content provided by using the renderer callback function.
                                                          *
                                                          * The renderer function provides `root`, `select` arguments.
                                                          * Generate DOM content, append it to the `root` element and control the state
                                                          * of the host element by accessing `select`.
                                                          *
                                                          * ```html
                                                          * <vaadin-select id="select"></vaadin-select>
                                                          * ```
                                                          * ```js
                                                          * const select = document.querySelector('#select');
                                                          * select.renderer = function(root, select) {
                                                          *   const listBox = document.createElement('vaadin-list-box');
                                                          *   // append 3 <vaadin-item> elements
                                                          *   ['Jose', 'Manolo', 'Pedro'].forEach(function(name) {
                                                          *     const item = document.createElement('vaadin-item');
                                                          *     item.textContent = name;
                                                          *     listBox.appendChild(item);
                                                          *   });
                                                          *
                                                          *   // update the content
                                                          *   root.appendChild(listBox);
                                                          * };
                                                          * ```
                                                          *
                                                          * Renderer is called on initialization of new select and on its opening.
                                                          * DOM generated during the renderer call can be reused
                                                          * in the next renderer call and will be provided with the `root` argument.
                                                          * On first call it will be empty.
                                                          *
                                                          * ### Polymer Templates
                                                          *
                                                          * Alternatively, the content can be provided with Polymer's Template.
                                                          * Select finds the first child template and uses that in case renderer callback function
                                                          * is not provided. You can also set a custom template using the `template` property.
                                                          *
                                                          * ```
                                                          * <vaadin-select>
                                                          *   <template>
                                                          *     <vaadin-list-box>
                                                          *       <vaadin-item label="foo">Foo</vaadin-item>
                                                          *       <vaadin-item>Bar</vaadin-item>
                                                          *       <vaadin-item>Baz</vaadin-item>
                                                          *     </vaadin-list-box>
                                                          *   </template>
                                                          * </vaadin-select>
                                                          * ```
                                                          *
                                                          * Hint: By setting the `label` property of inner vaadin-items you will
                                                          * be able to change the visual representation of the selected value in the input part.
                                                          *
                                                          * ### Styling
                                                          *
                                                          * The following shadow DOM parts are available for styling:
                                                          *
                                                          * Part name | Description
                                                          * ----------------|----------------
                                                          * `toggle-button` | The toggle button
                                                          *
                                                          * The following state attributes are available for styling:
                                                          *
                                                          * Attribute    | Description | Part name
                                                          * -------------|-------------|------------
                                                          * `opened` | Set when the select is open | :host
                                                          * `invalid` | Set when the element is invalid | :host
                                                          * `focused` | Set when the element is focused | :host
                                                          * `focus-ring` | Set when the element is keyboard focused | :host
                                                          * `readonly` | Set when the select is read only | :host
                                                          *
                                                          * `<vaadin-select>` element sets these custom CSS properties:
                                                          *
                                                          * Property name | Description | Theme for element
                                                          * --- | --- | ---
                                                          * `--vaadin-select-text-field-width` | Width of the select text field | `vaadin-select-overlay`
                                                          *
                                                          * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
                                                          *
                                                          * In addition to `<vaadin-select>` itself, the following internal
                                                          * components are themable:
                                                          *
                                                          * - `<vaadin-select-text-field>`
                                                          * - `<vaadin-select-overlay>`
                                                          *
                                                          * Note: the `theme` attribute value set on `<vaadin-select>` is
                                                          * propagated to the internal themable components listed above.
                                                          *
                                                          * @memberof Vaadin
                                                          * @mixes Vaadin.ElementMixin
                                                          * @mixes Vaadin.ControlStateMixin
                                                          * @mixes Vaadin.ThemableMixin
                                                          * @mixes Vaadin.ThemePropertyMixin
                                                          * @demo demo/index.html
                                                          */class SelectElement extends ElementMixin(ControlStateMixin(ThemableMixin(ThemePropertyMixin(mixinBehaviors(IronResizableBehavior,PolymerElement))))){static get template(){return html`
    <style>
      :host {
        display: inline-block;
      }

      vaadin-select-text-field {
        width: 100%;
        min-width: 0;
      }

      :host([hidden]) {
        display: none !important;
      }

      [part="toggle-button"] {
        font-family: "vaadin-select-icons";
      }

      [part="toggle-button"]::before {
        content: "\\e900";
      }
    </style>

    <vaadin-select-text-field placeholder="[[placeholder]]" label="[[label]]" required="[[required]]" invalid="[[invalid]]" error-message="[[errorMessage]]" readonly\$="[[readonly]]" theme\$="[[theme]]">
      <slot name="prefix" slot="prefix"></slot>
      <div part="value"></div>
      <div part="toggle-button" slot="suffix" role="button" aria-label="Toggle"></div>
    </vaadin-select-text-field>
    <vaadin-select-overlay opened="{{opened}}" with-backdrop="[[_phone]]" phone\$="[[_phone]]" theme\$="[[theme]]"></vaadin-select-overlay>

    <iron-media-query query="[[_phoneMediaQuery]]" query-matches="{{_phone}}"></iron-media-query>
`}static get is(){return"vaadin-select"}static get version(){return"2.1.0"}static get properties(){return{/**
       * Set when the select is open
       */opened:{type:Boolean,value:!1,notify:!0,reflectToAttribute:!0,observer:"_openedChanged"},/**
       * Custom function for rendering the content of the `<vaadin-select>`.
       * Receives two arguments:
       *
       * - `root` The `<vaadin-select-overlay>` internal container
       *   DOM element. Append your content to it.
       * - `select` The reference to the `<vaadin-select>` element.
       */renderer:Function,/**
       * The error message to display when the select value is invalid
       */errorMessage:{type:String,value:""},/**
       * String used for the label element.
       */label:{type:String},/**
       * It stores the the `value` property of the selected item, providing the
       * value for iron-form.
       * When there’s an item selected, it's the value of that item, otherwise
       * it's an empty string.
       * On change or initialization, the component finds the item which matches the
       * value and displays it.
       * If no value is provided to the component, it selects the first item without
       * value or empty value.
       * Hint: If you do not want to select any item by default, you can either set all
       * the values of inner vaadin-items, or set the vaadin-select value to
       * an inexistent value in the items list.
       */value:{type:String,value:"",notify:!0,observer:"_valueChanged"},/**
       * The current required state of the select. True if required.
       */required:{type:Boolean,reflectToAttribute:!0,observer:"_requiredChanged"},/**
       * Set to true if the value is invalid.
       */invalid:{type:Boolean,reflectToAttribute:!0,notify:!0,value:!1},/**
       * The name of this element.
       */name:{type:String,reflectToAttribute:!0},/**
       * A hint to the user of what can be entered in the control.
       * The placeholder will be displayed in the case that there
       * is no item selected, or the selected item has an empty
       * string label, or the selected item has no label and it's
       * DOM content is empty.
       */placeholder:{type:String},/**
       * When present, it specifies that the element is read-only.
       */readonly:{type:Boolean,value:!1,reflectToAttribute:!0},_phone:Boolean,_phoneMediaQuery:{value:"(max-width: 420px), (max-height: 420px)"},_overlayElement:Object,_inputElement:Object,_toggleElement:Object,_items:Object,_contentTemplate:Object,_oldTemplate:Object,_oldRenderer:Object}}static get observers(){return["_updateSelectedItem(value, _items)","_updateAriaExpanded(opened, _toggleElement)","_templateOrRendererChanged(_contentTemplate, renderer, _overlayElement)"]}/** @private */constructor(){super();this._boundSetPosition=this._setPosition.bind(this)}/** @private */connectedCallback(){super.connectedCallback();this.addEventListener("iron-resize",this._boundSetPosition)}ready(){super.ready();this._overlayElement=this.shadowRoot.querySelector("vaadin-select-overlay");this._valueElement=this.shadowRoot.querySelector("[part=\"value\"]");this._toggleElement=this.shadowRoot.querySelector("[part=\"toggle-button\"]");this._nativeInput=this.focusElement.shadowRoot.querySelector("input");this._nativeInput.setAttribute("aria-hidden",!0);this._nativeInput.setAttribute("tabindex",-1);this._nativeInput.style.pointerEvents="none";this.focusElement.addEventListener("click",e=>this.opened=!this.readonly);this.focusElement.addEventListener("keydown",e=>this._onKeyDown(e));this._observer=new FlattenedNodesObserver(this,info=>this._setTemplateFromNodes(info.addedNodes));this._observer.flush()}_setTemplateFromNodes(nodes){const template=Array.from(nodes).filter(node=>node.localName&&"template"===node.localName)[0]||this._contentTemplate;this._overlayElement.template=this._contentTemplate=template;this._setForwardHostProps()}_setForwardHostProps(){if(this._overlayElement.content){const origForwardHostProp=this._overlayElement._instance&&this._overlayElement._instance.forwardHostProp;if(this._overlayElement._instance){this._overlayElement._instance.forwardHostProp=(...args)=>{origForwardHostProp.apply(this._overlayElement._instance,args);setTimeout(()=>{this._updateValueSlot()})};this._assignMenuElement()}}}/**
     * Manually invoke existing renderer.
     */render(){this._overlayElement.render()}_removeNewRendererOrTemplate(template,oldTemplate,renderer,oldRenderer){if(template!==oldTemplate){this._contentTemplate=void 0}else if(renderer!==oldRenderer){this.renderer=void 0}}_templateOrRendererChanged(template,renderer,overlay){if(!overlay){return}if(template&&renderer){this._removeNewRendererOrTemplate(template,this._oldTemplate,renderer,this._oldRenderer);throw new Error("You should only use either a renderer or a template for select content")}this._oldTemplate=template;this._oldRenderer=renderer;if(renderer){overlay.setProperties({owner:this,renderer:renderer});this.render();if(overlay.content.firstChild){this._assignMenuElement()}}}_assignMenuElement(){this._menuElement=Array.from(this._overlayElement.content.children).filter(element=>"style"!==element.localName)[0];if(this._menuElement){this._menuElement.addEventListener("items-changed",e=>{this._items=this._menuElement.items});this._menuElement.addEventListener("selected-changed",e=>this._updateValueSlot());this._menuElement.addEventListener("keydown",e=>this._onKeyDownInside(e));this._menuElement.addEventListener("click",e=>this.opened=!1)}}/** @protected */get focusElement(){return this._inputElement||(this._inputElement=this.shadowRoot.querySelector("vaadin-select-text-field"))}/** @private */disconnectedCallback(){super.disconnectedCallback();this.removeEventListener("iron-resize",this._boundSetPosition);// Making sure the select is closed and removed from DOM after detaching the select.
this.opened=!1}/** @private */notifyResize(){super.notifyResize();if(this.positionTarget&&this.opened){this._setPosition();// Schedule another position update (to cover virtual keyboard opening for example)
requestAnimationFrame(this._setPosition.bind(this))}}_requiredChanged(required){this.setAttribute("aria-required",required)}_valueChanged(value,oldValue){if(""===value){this.focusElement.removeAttribute("has-value")}else{this.focusElement.setAttribute("has-value","")}// Skip validation for the initial empty string value
if(""===value&&oldValue===void 0){return}this.validate()}_onKeyDown(e){if(!this.readonly&&!this.opened){if(/^(Enter|SpaceBar|\s|ArrowDown|Down|ArrowUp|Up)$/.test(e.key)){e.preventDefault();this.opened=!0}else if(/[a-zA-Z0-9]/.test(e.key)&&1===e.key.length){const selected=this._menuElement.selected,currentIdx=selected!==void 0?selected:-1,newIdx=this._menuElement._searchKey(currentIdx,e.key);if(0<=newIdx){this._updateSelectedItem(this._items[newIdx].value,this._items)}}}}_onKeyDownInside(e){if(/^(Tab)$/.test(e.key)){this.opened=!1}}_openedChanged(opened,wasOpened){if(opened){if(!this._overlayElement||!this._menuElement||!this._toggleElement||!this.focusElement||this.disabled||this.readonly){this.opened=!1;return}this._openedWithFocusRing=this.hasAttribute("focus-ring")||this.focusElement.hasAttribute("focus-ring");this._menuElement.focus();this._setPosition();window.addEventListener("scroll",this._boundSetPosition,!0)}else if(wasOpened){if(this._phone){this._setFocused(!1)}else{this.focusElement.focus();if(this._openedWithFocusRing){this.focusElement.setAttribute("focus-ring","")}}this.validate();window.removeEventListener("scroll",this._boundSetPosition,!0)}}_hasContent(selected){if(!selected){return!1}return!!(selected.hasAttribute("label")?selected.getAttribute("label"):selected.textContent.trim()||selected.children.length)}_attachSelectedItem(selected){if(!selected){return}let labelItem;if(selected.hasAttribute("label")){labelItem=document.createElement("vaadin-item");labelItem.textContent=selected.getAttribute("label")}else{labelItem=selected.cloneNode(!0)}// store reference to the original item
labelItem._sourceItem=selected;labelItem.removeAttribute("tabindex");this._valueElement.appendChild(labelItem);labelItem.selected=!0}_updateAriaExpanded(opened,toggleElement){toggleElement&&toggleElement.setAttribute("aria-expanded",opened)}_updateValueSlot(){this.opened=!1;this._valueElement.innerHTML="";const selected=this._items[this._menuElement.selected],hasContent=this._hasContent(selected),slotName=this._inputElement.shadowRoot.querySelector("slot[name=\"input\"]")?"input":"value";// Toggle visibility of _valueElement vs fallback input with placeholder
this._valueElement.slot=hasContent?slotName:"";// Ensure the slot distribution to apply correct style scope for cloned item
if(hasContent&&window.ShadyDOM){window.ShadyDOM.flush()}this._attachSelectedItem(selected);if(!this._valueChanging&&selected){this._selectedChanging=!0;this.value=selected.value||"";delete this._selectedChanging}}_updateSelectedItem(value,items){if(items){this._menuElement.selected=items.reduce((prev,item,idx)=>{return prev===void 0&&item.value===value?idx:prev},void 0);if(!this._selectedChanging){this._valueChanging=!0;this._updateValueSlot();delete this._valueChanging}}}/** @override */_setFocused(focused){// Keep `focused` state when opening the overlay for styling purpose.
super._setFocused(this.opened||focused);this.focusElement._setFocused(this.hasAttribute("focused"));this.hasAttribute("focused")||this.validate()}_setPosition(){const inputRect=this._inputElement.shadowRoot.querySelector("[part~=\"input-field\"]").getBoundingClientRect(),viewportHeight=Math.min(window.innerHeight,document.documentElement.clientHeight),bottomAlign=inputRect.top>(viewportHeight-inputRect.height)/2;this._overlayElement.style.left=inputRect.left+"px";if(bottomAlign){this._overlayElement.setAttribute("bottom-aligned","");this._overlayElement.style.removeProperty("top");this._overlayElement.style.bottom=viewportHeight-inputRect.bottom+"px"}else{this._overlayElement.removeAttribute("bottom-aligned");this._overlayElement.style.removeProperty("bottom");this._overlayElement.style.top=inputRect.top+"px"}this._overlayElement.updateStyles({"--vaadin-select-text-field-width":inputRect.width+"px"})}/**
     * Returns true if `value` is valid, and sets the `invalid` flag appropriately.
     *
     * @return {boolean} True if the value is valid and sets the `invalid` flag appropriately
     */validate(){return!(this.invalid=!(this.disabled||!this.required||this.value))}}customElements.define(SelectElement.is,SelectElement);var vaadinSelect={SelectElement:SelectElement};const $_documentContainer$p=html`<dom-module id="lumo-text-field" theme-for="vaadin-text-field">
  <template>
    <style include="lumo-required-field lumo-field-button">
      :host {
        --lumo-text-field-size: var(--lumo-size-m);
        color: var(--lumo-body-text-color);
        font-size: var(--lumo-font-size-m);
        font-family: var(--lumo-font-family);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-tap-highlight-color: transparent;
        padding: var(--lumo-space-xs) 0;
      }

      :host::before {
        height: var(--lumo-text-field-size);
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
      }

      :host([focused]:not([readonly])) [part="label"] {
        color: var(--lumo-primary-text-color);
      }

      [part="value"],
      [part="input-field"] ::slotted(input),
      [part="input-field"] ::slotted(textarea),
      /* Slotted by vaadin-select-text-field */
      [part="input-field"] ::slotted([part="value"]) {
        cursor: inherit;
        min-height: var(--lumo-text-field-size);
        padding: 0 0.25em;
        --_lumo-text-field-overflow-mask-image: linear-gradient(to left, transparent, #000 1.25em);
        -webkit-mask-image: var(--_lumo-text-field-overflow-mask-image);
      }

      [part="value"]:focus,
      [part="input-field"] ::slotted(input):focus,
      [part="input-field"] ::slotted(textarea):focus {
        -webkit-mask-image: none;
        mask-image: none;
      }

      /*
        TODO: CSS custom property in \`mask-image\` causes crash in Edge
        see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/15415089/
      */
      @-moz-document url-prefix() {
        [part="value"],
        [part="input-field"] ::slotted(input),
        [part="input-field"] ::slotted(textarea),
        [part="input-field"] ::slotted([part="value"]) {
          mask-image: var(--_lumo-text-field-overflow-mask-image);
        }
      }

      [part="value"]::-webkit-input-placeholder {
        color: inherit;
        transition: opacity 0.175s 0.05s;
        opacity: 0.5;
      }

      [part="value"]:-ms-input-placeholder {
        color: inherit;
        opacity: 0.5;
      }

      [part="value"]::-moz-placeholder {
        color: inherit;
        transition: opacity 0.175s 0.05s;
        opacity: 0.5;
      }

      [part="value"]::placeholder {
        color: inherit;
        transition: opacity 0.175s 0.1s;
        opacity: 0.5;
      }

      [part="input-field"] {
        border-radius: var(--lumo-border-radius);
        background-color: var(--lumo-contrast-10pct);
        padding: 0 calc(0.375em + var(--lumo-border-radius) / 4 - 1px);
        font-weight: 500;
        line-height: 1;
        position: relative;
        cursor: text;
        box-sizing: border-box;
      }

      /* Used for hover and activation effects */
      [part="input-field"]::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-radius: inherit;
        pointer-events: none;
        background-color: var(--lumo-contrast-50pct);
        opacity: 0;
        transition: transform 0.15s, opacity 0.2s;
        transform-origin: 100% 0;
      }

      /* Hover */

      :host(:hover:not([readonly]):not([focused])) [part="label"] {
        color: var(--lumo-body-text-color);
      }

      :host(:hover:not([readonly]):not([focused])) [part="input-field"]::after {
        opacity: 0.1;
      }

      /* Touch device adjustment */
      @media (pointer: coarse) {
        :host(:hover:not([readonly]):not([focused])) [part="label"] {
          color: var(--lumo-secondary-text-color);
        }

        :host(:hover:not([readonly]):not([focused])) [part="input-field"]::after {
          opacity: 0;
        }

        :host(:active:not([readonly]):not([focused])) [part="input-field"]::after {
          opacity: 0.2;
        }
      }

      /* Trigger when not focusing using the keyboard */
      :host([focused]:not([focus-ring]):not([readonly])) [part="input-field"]::after {
        transform: scaleX(0);
        transition-duration: 0.15s, 1s;
      }

      /* Focus-ring */

      :host([focus-ring]) [part="input-field"] {
        box-shadow: 0 0 0 2px var(--lumo-primary-color-50pct);
      }

      /* Read-only and disabled */
      :host([readonly]) [part="value"]::-webkit-input-placeholder,
      :host([disabled]) [part="value"]::-webkit-input-placeholder {
        opacity: 0;
      }

      :host([readonly]) [part="value"]:-ms-input-placeholder,
      :host([disabled]) [part="value"]:-ms-input-placeholder {
        opacity: 0;
      }

      :host([readonly]) [part="value"]::-moz-placeholder,
      :host([disabled]) [part="value"]::-moz-placeholder {
        opacity: 0;
      }

      :host([readonly]) [part="value"]::placeholder,
      :host([disabled]) [part="value"]::placeholder {
        opacity: 0;
      }

      /* Read-only */

      :host([readonly]) [part="input-field"] {
        color: var(--lumo-secondary-text-color);
        background-color: transparent;
        cursor: default;
      }

      :host([readonly]) [part="input-field"]::after {
        background-color: transparent;
        opacity: 1;
        border: 1px dashed var(--lumo-contrast-30pct);
      }

      /* Disabled style */

      :host([disabled]) {
        pointer-events: none;
      }

      :host([disabled]) [part="input-field"] {
        background-color: var(--lumo-contrast-5pct);
      }

      :host([disabled]) [part="label"],
      :host([disabled]) [part="value"],
      :host([disabled]) [part="input-field"] ::slotted(*) {
        color: var(--lumo-disabled-text-color);
        -webkit-text-fill-color: var(--lumo-disabled-text-color);
      }

      /* Invalid style */

      :host([invalid]) [part="input-field"] {
        background-color: var(--lumo-error-color-10pct);
      }

      :host([invalid]) [part="input-field"]::after {
        background-color: var(--lumo-error-color-50pct);
      }

      :host([invalid][focus-ring]) [part="input-field"] {
        box-shadow: 0 0 0 2px var(--lumo-error-color-50pct);
      }

      :host([input-prevented]) [part="input-field"] {
        color: var(--lumo-error-text-color);
      }

      /* Small theme */

      :host([theme~="small"]) {
        font-size: var(--lumo-font-size-s);
        --lumo-text-field-size: var(--lumo-size-s);
      }

      :host([theme~="small"][has-label]) [part="label"] {
        font-size: var(--lumo-font-size-xs);
      }

      :host([theme~="small"][has-label]) [part="error-message"] {
        font-size: var(--lumo-font-size-xxs);
      }

      /* Text align */

      :host([theme~="align-center"]) [part="value"] {
        text-align: center;
        --_lumo-text-field-overflow-mask-image: none;
      }

      :host([theme~="align-right"]) [part="value"] {
        text-align: right;
        --_lumo-text-field-overflow-mask-image: none;
      }

      @-moz-document url-prefix() {
        /* Firefox is smart enough to align overflowing text to right */
        :host([theme~="align-right"]) [part="value"] {
          --_lumo-text-field-overflow-mask-image: linear-gradient(to right, transparent 0.25em, #000 1.5em);
        }
      }

      /* Slotted content */

      [part="input-field"] ::slotted(:not([part]):not(iron-icon):not(input):not(textarea)) {
        color: var(--lumo-secondary-text-color);
        font-weight: 400;
      }

      /* Slotted icons */

      [part="input-field"] ::slotted(iron-icon) {
        color: var(--lumo-contrast-60pct);
        width: var(--lumo-icon-size-m);
        height: var(--lumo-icon-size-m);
      }

      /* Vaadin icons are based on a 16x16 grid (unlike Lumo and Material icons with 24x24), so they look too big by default */
      [part="input-field"] ::slotted(iron-icon[icon^="vaadin:"]) {
        padding: 0.25em;
        box-sizing: border-box !important;
      }

      [part="clear-button"]::before {
        content: var(--lumo-icons-cross);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$p.content);const $_documentContainer$q=html`<dom-module id="lumo-select" theme-for="vaadin-select">
  <template>
    <style include="lumo-field-button">
      :host {
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }

      [selected] {
        padding-left: 0;
        padding-right: 0;
      }

      :host([theme~="small"]) [selected] {
        padding: 0;
        min-height: var(--lumo-size-s);
      }

      [part="toggle-button"]::before {
        content: var(--lumo-icons-dropdown);
      }

      /* Highlight the toggle button when hovering over the entire component */
      :host(:hover:not([readonly]):not([disabled])) [part="toggle-button"] {
        color: var(--lumo-contrast-80pct);
      }
    </style>
  </template>
</dom-module><dom-module id="lumo-select-text-field" theme-for="vaadin-select-text-field">
  <template>
    <style>
      [part="input-field"] {
        cursor: default;
      }

      [part="input-field"] ::slotted([part="value"]) {
        display: flex;
      }

      /* ShadyCSS limitation workaround */
      [part="input-field"] ::slotted([part="value"]) [selected]::before {
        display: none;
      }

      [part="input-field"]:focus {
        outline: none;
      }
    </style>
  </template>
</dom-module><dom-module id="lumo-select-overlay" theme-for="vaadin-select-overlay">
  <template>
    <style include="lumo-menu-overlay">
      :host {
        --_lumo-item-selected-icon-display: block;
      }

      :host([bottom-aligned]) {
        justify-content: flex-end;
      }

      [part~="overlay"] {
        min-width: var(--vaadin-select-text-field-width);
      }

      /* Small viewport adjustment */
      :host([phone]) {
        top: 0 !important;
        right: 0 !important;
        bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
        left: 0 !important;
        align-items: stretch;
        justify-content: flex-end;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$q.content);const $_documentContainer$r=html`<dom-module id="material-text-field" theme-for="vaadin-text-field">
  <template>
    <style include="material-required-field material-field-button">
      :host {
        display: inline-flex;
        position: relative;
        padding-top: 8px;
        margin-bottom: 8px;
        outline: none;
        color: var(--material-body-text-color);
        font-size: var(--material-body-font-size);
        line-height: 24px;
        font-family: var(--material-font-family);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      :host::before {
        line-height: 32px;
      }

      /* Strange gymnastics to make fields vertically align nicely in most cases
         (no label, with label, without prefix, with prefix, etc.) */

      :host([has-label]) {
        padding-top: 24px;
      }

      [part="label"]:empty {
        display: none;
      }

      [part="label"]:empty::before {
        content: " ";
        position: absolute;
      }

      [part="input-field"] {
        position: relative;
        top: -0.2px; /* NOTE(platosha): Adjusts for wrong flex baseline in Chrome & Safari */
        height: 32px;
        padding-left: 0;
        background-color: transparent;
        margin: 0;
      }

      [part="input-field"]::before,
      [part="input-field"]::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        transform-origin: 50% 0%;
        background-color: var(--_material-text-field-input-line-background-color, #000);
        opacity: var(--_material-text-field-input-line-opacity, 0.42);
      }

      [part="input-field"]::after {
        background-color: var(--material-primary-color);
        opacity: 0;
        height: 2px;
        bottom: 0;
        transform: scaleX(0);
        transition: opacity 0.175s;
      }

      :host([disabled]) [part="label"],
      :host([disabled]) [part="value"],
      :host([disabled]) [part="input-field"] ::slotted(input),
      :host([disabled]) [part="input-field"] ::slotted(textarea),
      :host([disabled]) [part="input-field"] ::slotted([part="value"]) {
        color: var(--material-disabled-text-color);
        -webkit-text-fill-color: var(--material-disabled-text-color);
      }

      [part="value"],
      :host([disabled]) [part="input-field"] ::slotted(input),
      :host([disabled]) [part="input-field"] ::slotted(textarea),
      /* Slotted by vaadin-select-text-field */
      [part="input-field"] ::slotted([part="value"]) {
        outline: none;
        margin: 0;
        border: 0;
        border-radius: 0;
        padding: 8px 0;
        width: 100%;
        height: 100%;
        font-family: inherit;
        font-size: 1em;
        line-height: inherit;
        color: inherit;
        background-color: transparent;
        /* Disable default invalid style in Firefox */
        box-shadow: none;
      }

      /* TODO: the text opacity should be 42%, but the disabled style is 38%.
      Would need to introduce another property for it if we want to be 100% accurate. */
      [part="value"]::-webkit-input-placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.05s;
        opacity: 1;
      }

      [part="value"]:-ms-input-placeholder {
        color: var(--material-disabled-text-color);
      }

      [part="value"]::-moz-placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.05s;
        opacity: 1;
      }

      [part="value"]::placeholder {
        color: var(--material-disabled-text-color);
        transition: opacity 0.175s 0.1s;
        opacity: 1;
      }

      :host([has-label]:not([focused]):not([invalid]):not([theme="always-float-label"])) [part="value"]::-webkit-input-placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      :host([has-label]:not([focused]):not([invalid]):not([theme="always-float-label"])) [part="value"]::-moz-placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      :host([has-label]:not([focused]):not([invalid]):not([theme="always-float-label"])) [part="value"]::placeholder {
        opacity: 0;
        transition-delay: 0;
      }

      /* IE11 doesn’t show the placeholder when the input is focused, so it’s basically useless for this theme */
      :host([has-label]) [part="value"]:-ms-input-placeholder {
        opacity: 0;
      }

      [part="label"] {
        transition: transform 0.175s, color 0.175s, width 0.175s;
        transition-timing-function: ease, ease, step-end;
      }

      /* TODO: using unsupported selector to fix IE11 (even thought the label element is scaled down,
         the 133% width still takes the same space as an unscaled element */
      ::-ms-backdrop,
      .vaadin-text-field-container {
        overflow: hidden;
      }

      /* Same fix for MS Edge ^^   */
      @supports (-ms-ime-align:auto) {
        .vaadin-text-field-container {
          overflow: hidden;
        }
      }

      :host(:hover:not([readonly]):not([invalid])) [part="input-field"]::before {
        opacity: var(--_material-text-field-input-line-hover-opacity, 0.87);
      }

      :host([focused]:not([invalid])) [part="label"] {
        color: var(--material-primary-text-color);
      }

      :host([focused]) [part="input-field"]::after,
      :host([invalid]) [part="input-field"]::after {
        opacity: 1;
        transform: none;
        transition: transform 0.175s, opacity 0.175s;
      }

      :host([invalid]) [part="input-field"]::after {
        background-color: var(--material-error-color);
      }

      :host([input-prevented]) [part="input-field"] {
        color: var(--material-error-text-color);
      }

      :host([disabled]) {
        pointer-events: none;
      }

      :host([disabled]) [part="input-field"] {
        color: var(--material-disabled-text-color);
      }

      :host([disabled]) [part="input-field"]::before {
        background-color: transparent;
        background-image: linear-gradient(90deg, var(--_material-text-field-input-line-background-color, #000) 0, var(--_material-text-field-input-line-background-color, #000) 2px, transparent 2px);
        background-size: 4px 1px;
        background-repeat: repeat-x;
      }

      /* Only target the visible floating label */
      :host([has-label]:not([has-value]):not([focused]):not([invalid]):not([theme~="always-float-label"])) [part="label"] {
        /* IE11 doesn’t work with calc inside the translate function, so we need to have a fixed pixel value instead of 50% + 16px */
        transform: scale(1) translateY(24px);
        transition-timing-function: ease, ease, step-start;
        pointer-events: none;
        left: auto;
        transition-delay: 0.1s;
      }

      /* Slotted content */

      [part="input-field"] ::slotted(*:not([part="value"]):not([part\$="-button"]):not(input):not(textarea)) {
        color: var(--material-secondary-text-color);
      }

      [part="clear-button"]::before {
        content: var(--material-icons-clear);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$r.content);const $_documentContainer$s=html`<dom-module id="material-select" theme-for="vaadin-select">
  <template>
    <style include="material-field-button">
      :host {
        display: inline-flex;
        -webkit-tap-highlight-color: transparent;
      }

      [part="toggle-button"]::before {
        content: var(--material-icons-select);
      }

      :host([opened]) [part="toggle-button"] {
        transform: rotate(180deg);
      }

      /* Disabled */

      :host([disabled]) {
        pointer-events: none;
      }
    </style>
  </template>
</dom-module><dom-module id="material-select-text-field" theme-for="vaadin-select-text-field">
  <template>
    <style>
      :host {
        width: 100%;
      }

      :host([disabled]) [part="input-field"],
      [part="input-field"],
      [part="value"] {
        cursor: default;
      }

      [part="input-field"]:focus {
        outline: none;
      }

      ::slotted([part="value"]) {
        display: flex;
      }
    </style>
  </template>
</dom-module><dom-module id="material-select-overlay" theme-for="vaadin-select-overlay">
  <template>
    <style include="material-menu-overlay">
      :host([bottom-aligned]) {
        justify-content: flex-end;
      }

      [part="overlay"] {
        min-width: var(--vaadin-select-text-field-width);
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer$s.content);class AccountAdd extends PolymerElement{static get template(){return html$1`
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
    `}ready(){super.ready();this.__callListaTipos();//@@note: Generamos el event para marcar direcciones en el mapa cuando el 'marker' se mueva
this.$.mapMarker.addEventListener("longitude-changed",e=>{this.$.mapMarker.getAddress();setTimeout(()=>{this.__setDatosFormularioGPS()},500)});//@@note: Cargamos en global los datos geolocalización (llamamos al callback)
navigator.geolocation.getCurrentPosition(this.__guardaGeo);//@@note: Cargamos los [globales] en [properties] internas
this.__recopilaGeo();//@@note: Lanzamos el 'event' sobre el formulario
this.$.frmNuevaEmpresa.addEventListener("iron-form-presubmit",event=>{event.preventDefault();//Revisamos el objeto
var objetoFormulario=this.datosFormulario;//Formatamos los elementos a su tipo
objetoFormulario.typeId=parseInt(objetoFormulario.typeId);objetoFormulario.salesRepId1=parseInt(objetoFormulario.salesRepId1);objetoFormulario.latitude=parseFloat(objetoFormulario.latitude);objetoFormulario.longitude=parseFloat(objetoFormulario.longitude);//@@fix: Comprobamos que debemos de cargar, si add, o edit.
switch(this.routeData.page){case"add":var t=this.$.iaNuevaEmpresa;break;case"edit":var t=this.$.iaEditarEmpresa;break;}t.body=JSON.stringify(objetoFormulario);t.headers={"x-session-key":MainInitGlobals.apiData.token//@@fix: Cargamos los datos del request
};t.generateRequest()})}static get properties(){return{title:{type:String,value:"A\xD1ADIR EMPRESA"},titleEdit:{type:String,value:"EDITAR EMPRESA"},seleccionado:Object,account:Object,routeData:Object,subroute:Object,apiData:{type:Object,value:MainInitGlobals.apiData},listadoTipos:Object,datosFormulario:{type:Object,value:{address1:"",address2:"",city:"",region:"",comment:"",email:"",name:"",phone:"",phone2:"",phone3:"",postcode:"",salesRepId1:103,typeId:"40",website:"",latitude:0,longitude:0}},coords:{type:Object,value:{latitud:"41.5578478",longitud:"2.002487"}},textoTostada:{type:String,value:"Error desconocido, contacta con servicio t\xE9cnico."},codeTostada:{type:String,value:"No code! :("}}}static get observers(){return["__changeTitle(routeData.page)","__actionPage(routeData.page)"]}/*
    @@@@ ACIONES DE CAMBIO [PAGE]  
    */__changeTitle(page){var a=$($("body").children("login-on")[0].shadowRoot).children("iron-pages"),b=$($(a)[0].children.main).children("main-init");switch(page){case"add":b[0].title=this.title;break;case"edit":b[0].title=this.title;break;}}__actionPage(page){switch(page){case"add":this.__limpiarFormulario();break;case"edit":this.__callEmpresa();break;}}/*
    @@@@ PREPARACIÓN DE FORMULARIO
    */__limpiarFormulario(){this.$.frmNuevaEmpresa.reset();var datosFormularioLimpios={address1:"",address2:"",city:"",region:"",comment:"",email:"",name:"",phone:"",phone2:"",phone3:"",postcode:"",salesRepId1:103,typeId:"",website:"",latitude:0,longitude:0};this.set("datosFormularios",datosFormularioLimpios);this.__setDatosFormularioGPS()}__datosCarga(){//Seteamos a 0 / nulos todos los elementos 
this.datosFormulario.address1="";this.datosFormulario.address2="";this.datosFormulario.city="";this.datosFormulario.region="";this.datosFormulario.comment="";this.datosFormulario.email="";this.datosFormulario.name="";this.datosFormulario.phone="";this.datosFormulario.phone2="";this.datosFormulario.phone3="";this.datosFormulario.postcode="";this.datosFormulario.salesRepId1=103;this.datosFormulario.typeId="";this.datosFormulario.website="";this.datosFormulario.latitude="";this.datosFormulario.longitude="";this.coords.latitud="";this.coords.longitud="";console.log(this.account);if(this.account){this.set("datosFormulario.address1",this.account.address1);this.set("datosFormulario.address2",this.account.address2);this.set("datosFormulario.city",this.account.city);this.set("datosFormulario.region",this.account.region);this.set("datosFormulario.comment",this.account.comment);this.set("datosFormulario.email",this.account.email);this.set("datosFormulario.name",this.account.name);this.set("datosFormulario.phone",this.account.phone);this.set("datosFormulario.phone2",this.account.phone2);this.set("datosFormulario.phone3",this.account.phone3);this.set("datosFormulario.postcode",this.account.postcode);this.set("datosFormulario.salesRepId1",this.account.salesRepId1.id);this.set("datosFormulario.typeId",this.account.typeId.id);this.set("datosFormulario.website",this.account.website);this.set("datosFormulario.latitude",this.account.latitude);this.set("datosFormulario.longitude",this.account.longitude);this.set("coords.latitud",this.account.latitude.toString());this.set("coords.longitud",this.account.longitude.toString())}else{setTimeout(()=>{this.__datosCarga()},20)}}/*
    @@@@ GEOLOCALIZACIONES
    */__guardaGeo(position){MainInitGlobals.coords=position.coords}__recopilaGeo(){setTimeout(()=>{if(MainInitGlobals.coords){this.coords.latitud=MainInitGlobals.coords.latitude.toString();this.coords.longitud=MainInitGlobals.coords.longitude.toString()}else{this.__recopilaGeo()}},100)}__setDatosFormularioGPS(){var e=this.$.mapMarker.geocoder;if(e){this.set("datosFormulario.city",e.city);this.set("datosFormulario.postcode",e.postcode);this.set("datosFormulario.address1",e.address1+", "+e.address1_number);this.set("datosFormulario.region",e.region);this.set("datosFormulario.latitude",e.latitude.toString());this.set("datosFormulario.longitude",e.longitude.toString())}else{setTimeout(()=>{this.__setDatosFormularioGPS()},100)}}/*
    @@@@ CARGAS HACÍA API
    */__callEmpresa(){if(this.apiData.token){this.$.iaShowAccount.headers={"x-session-key":this.apiData.token};this.$.iaShowAccount.generateRequest()}else{setTimeout(()=>{this.__changeTitle(this.page)},10)}}__callListaTipos(){if(this.apiData.token){this.$.iaListaTipos.headers={"x-session-key":this.apiData.token};this.$.iaListaTipos.generateRequest()}else{setTimeout(()=>{this.__callListaTipos()},10)}}__retornoPost(e){this.textoTostada="["+e.detail.response.Message+"]";this.codeTostada="ID_ENTITY: "+e.detail.response.id+" ";this.$.tostadaSuccess.open()}__onError(e){if("error"==e.type){var respuesta=e.detail.request.response;this.$.tostadaError.open();this.textoTostada="["+e.detail.request.response.error+"]";this.codeTostada="Code: "+e.detail.request.response.code+" "}}__guardarDatos(){this.$.frmNuevaEmpresa.submit()}}window.customElements.define("account-add",AccountAdd);export{ironJsonpLibrary as $ironJsonpLibrary,vaadinControlStateMixin as $vaadinControlStateMixin,vaadinDevelopmentModeDetector as $vaadinDevelopmentModeDetector,vaadinElementMixin as $vaadinElementMixin,vaadinFocusablesHelper as $vaadinFocusablesHelper,vaadinItem as $vaadinItem,vaadinItemMixin as $vaadinItemMixin,vaadinListBox as $vaadinListBox,vaadinListMixin as $vaadinListMixin,vaadinOverlay as $vaadinOverlay,vaadinSelect as $vaadinSelect,vaadinTextField as $vaadinTextField,vaadinTextFieldMixin as $vaadinTextFieldMixin,vaadinThemableMixin as $vaadinThemableMixin,vaadinThemePropertyMixin as $vaadinThemePropertyMixin,vaadinUsageStatistics as $vaadinUsageStatistics,version as $version,version$1 as $version$1,ControlStateMixin,ElementMixin,FocusablesHelper,IronJsonpLibraryBehavior,ItemElement,ItemMixin,ListBoxElement,ListMixin,Lumo,Material,OverlayElement,SelectElement,TextFieldElement,TextFieldMixin,ThemableMixin,ThemePropertyMixin,runIfDevelopmentMode,usageStatistics};