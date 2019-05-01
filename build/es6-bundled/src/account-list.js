define(["exports","./login-on.js"],function(_exports,_loginOn){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PaperDialogBehaviorImpl=_exports.PaperDialogBehavior=_exports.PaperCheckedElementBehaviorImpl=_exports.PaperCheckedElementBehavior=_exports.NeonAnimationRunnerBehaviorImpl=_exports.NeonAnimationRunnerBehavior=_exports.NeonAnimatableBehavior=_exports.IronCheckedElementBehaviorImpl=_exports.IronCheckedElementBehavior=_exports.$paperDialogBehavior=_exports.$paperCheckedElementBehavior=_exports.$neonAnimationRunnerBehavior=_exports.$neonAnimatableBehavior=_exports.$ironCheckedElementBehavior=_exports.$agGridPolymerDefault=_exports.$agGridPolymer=_exports.$PolymerFrameworkFactoryDefault=_exports.$PolymerFrameworkFactory=_exports.$PolymerFrameworkComponentWrapperDefault=_exports.$PolymerFrameworkComponentWrapper=_exports.$PolymerComponentFactoryDefault=_exports.$PolymerComponentFactory=_exports.$BaseFrameworkComponentDefault=_exports.$BaseFrameworkComponent=void 0;const IronCheckedElementBehaviorImpl={properties:{/**
     * Fired when the checked state changes.
     *
     * @event iron-change
     */ /**
         * Gets or sets the state, `true` is checked and `false` is unchecked.
         */checked:{type:Boolean,value:!1,reflectToAttribute:!0,notify:!0,observer:"_checkedChanged"},/**
     * If true, the button toggles the active state with each tap or press
     * of the spacebar.
     */toggles:{type:Boolean,value:!0,reflectToAttribute:!0},/* Overriden from IronFormElementBehavior */value:{type:String,value:"on",observer:"_valueChanged"}},observers:["_requiredChanged(required)"],created:function(){// Used by `iron-form` to handle the case that an element with this behavior
// doesn't have a role of 'checkbox' or 'radio', but should still only be
// included when the form is serialized if `this.checked === true`.
this._hasIronCheckedElementBehavior=!0},/**
   * Returns false if the element is required and not checked, and true
   * otherwise.
   * @param {*=} _value Ignored.
   * @return {boolean} true if `required` is false or if `checked` is true.
   */_getValidity:function(_value){return this.disabled||!this.required||this.checked},/**
   * Update the aria-required label when `required` is changed.
   */_requiredChanged:function(){if(this.required){this.setAttribute("aria-required","true")}else{this.removeAttribute("aria-required")}},/**
   * Fire `iron-changed` when the checked state changes.
   */_checkedChanged:function(){this.active=this.checked;this.fire("iron-change")},/**
   * Reset value to 'on' if it is set to `undefined`.
   */_valueChanged:function(){if(this.value===void 0||null===this.value){this.value="on"}}};/** @polymerBehavior */_exports.IronCheckedElementBehaviorImpl=IronCheckedElementBehaviorImpl;const IronCheckedElementBehavior=[_loginOn.IronFormElementBehavior,_loginOn.IronValidatableBehavior,IronCheckedElementBehaviorImpl];_exports.IronCheckedElementBehavior=IronCheckedElementBehavior;var ironCheckedElementBehavior={IronCheckedElementBehaviorImpl:IronCheckedElementBehaviorImpl,IronCheckedElementBehavior:IronCheckedElementBehavior};_exports.$ironCheckedElementBehavior=ironCheckedElementBehavior;const NeonAnimatableBehavior={properties:{/**
     * Animation configuration. See README for more info.
     */animationConfig:{type:Object},/**
     * Convenience property for setting an 'entry' animation. Do not set
     * `animationConfig.entry` manually if using this. The animated node is set
     * to `this` if using this property.
     */entryAnimation:{observer:"_entryAnimationChanged",type:String},/**
     * Convenience property for setting an 'exit' animation. Do not set
     * `animationConfig.exit` manually if using this. The animated node is set
     * to `this` if using this property.
     */exitAnimation:{observer:"_exitAnimationChanged",type:String}},_entryAnimationChanged:function(){this.animationConfig=this.animationConfig||{};this.animationConfig.entry=[{name:this.entryAnimation,node:this}]},_exitAnimationChanged:function(){this.animationConfig=this.animationConfig||{};this.animationConfig.exit=[{name:this.exitAnimation,node:this}]},_copyProperties:function(config1,config2){// shallowly copy properties from config2 to config1
for(var property in config2){config1[property]=config2[property]}},_cloneConfig:function(config){var clone={isClone:!0};this._copyProperties(clone,config);return clone},_getAnimationConfigRecursive:function(type,map,allConfigs){if(!this.animationConfig){return}if(this.animationConfig.value&&"function"===typeof this.animationConfig.value){this._warn(this._logf("playAnimation","Please put 'animationConfig' inside of your components 'properties' object instead of outside of it."));return}// type is optional
var thisConfig;if(type){thisConfig=this.animationConfig[type]}else{thisConfig=this.animationConfig}if(!Array.isArray(thisConfig)){thisConfig=[thisConfig]}// iterate animations and recurse to process configurations from child nodes
if(thisConfig){for(var config,index=0;config=thisConfig[index];index++){if(config.animatable){config.animatable._getAnimationConfigRecursive(config.type||type,map,allConfigs)}else{if(config.id){var cachedConfig=map[config.id];if(cachedConfig){// merge configurations with the same id, making a clone lazily
if(!cachedConfig.isClone){map[config.id]=this._cloneConfig(cachedConfig);cachedConfig=map[config.id]}this._copyProperties(cachedConfig,config)}else{// put any configs with an id into a map
map[config.id]=config}}else{allConfigs.push(config)}}}}},/**
   * An element implementing `NeonAnimationRunnerBehavior` calls this
   * method to configure an animation with an optional type. Elements
   * implementing `NeonAnimatableBehavior` should define the property
   * `animationConfig`, which is either a configuration object or a map of
   * animation type to array of configuration objects.
   */getAnimationConfig:function(type){var map={},allConfigs=[];this._getAnimationConfigRecursive(type,map,allConfigs);// append the configurations saved in the map to the array
for(var key in map){allConfigs.push(map[key])}return allConfigs}};_exports.NeonAnimatableBehavior=NeonAnimatableBehavior;var neonAnimatableBehavior={NeonAnimatableBehavior:NeonAnimatableBehavior};_exports.$neonAnimatableBehavior=neonAnimatableBehavior;const NeonAnimationRunnerBehaviorImpl={_configureAnimations:function(configs){var results=[],resultsToPlay=[];if(0<configs.length){for(let config,index=0,neonAnimation;config=configs[index];index++){neonAnimation=document.createElement(config.name);// is this element actually a neon animation?
if(neonAnimation.isNeonAnimation){let result=null;// Closure compiler does not work well with a try / catch here.
// .configure needs to be explicitly defined
if(!neonAnimation.configure){/**
             * @param {Object} config
             * @return {AnimationEffectReadOnly}
             */neonAnimation.configure=function(config){return null}}result=neonAnimation.configure(config);resultsToPlay.push({result:result,config:config,neonAnimation:neonAnimation})}else{console.warn(this.is+":",config.name,"not found!")}}}for(var i=0;i<resultsToPlay.length;i++){let result=resultsToPlay[i].result,config=resultsToPlay[i].config,neonAnimation=resultsToPlay[i].neonAnimation;// configuration or play could fail if polyfills aren't loaded
try{// Check if we have an Effect rather than an Animation
if("function"!=typeof result.cancel){result=document.timeline.play(result)}}catch(e){result=null;console.warn("Couldnt play","(",config.name,").",e)}if(result){results.push({neonAnimation:neonAnimation,config:config,animation:result})}}return results},_shouldComplete:function(activeEntries){for(var finished=!0,i=0;i<activeEntries.length;i++){if("finished"!=activeEntries[i].animation.playState){finished=!1;break}}return finished},_complete:function(activeEntries){for(var i=0;i<activeEntries.length;i++){activeEntries[i].neonAnimation.complete(activeEntries[i].config)}for(var i=0;i<activeEntries.length;i++){activeEntries[i].animation.cancel()}},/**
   * Plays an animation with an optional `type`.
   * @param {string=} type
   * @param {!Object=} cookie
   */playAnimation:function(type,cookie){var configs=this.getAnimationConfig(type);if(!configs){return}this._active=this._active||{};if(this._active[type]){this._complete(this._active[type]);delete this._active[type]}var activeEntries=this._configureAnimations(configs);if(0==activeEntries.length){this.fire("neon-animation-finish",cookie,{bubbles:!1});return}this._active[type]=activeEntries;for(var i=0;i<activeEntries.length;i++){activeEntries[i].animation.onfinish=function(){if(this._shouldComplete(activeEntries)){this._complete(activeEntries);delete this._active[type];this.fire("neon-animation-finish",cookie,{bubbles:!1})}}.bind(this)}},/**
   * Cancels the currently running animations.
   */cancelAnimation:function(){for(var k in this._active){var entries=this._active[k];for(var j in entries){entries[j].animation.cancel()}}this._active={}}};/** @polymerBehavior */_exports.NeonAnimationRunnerBehaviorImpl=NeonAnimationRunnerBehaviorImpl;const NeonAnimationRunnerBehavior=[NeonAnimatableBehavior,NeonAnimationRunnerBehaviorImpl];_exports.NeonAnimationRunnerBehavior=NeonAnimationRunnerBehavior;var neonAnimationRunnerBehavior={NeonAnimationRunnerBehaviorImpl:NeonAnimationRunnerBehaviorImpl,NeonAnimationRunnerBehavior:NeonAnimationRunnerBehavior};_exports.$neonAnimationRunnerBehavior=neonAnimationRunnerBehavior;const PaperCheckedElementBehaviorImpl={/**
   * Synchronizes the element's checked state with its ripple effect.
   */_checkedChanged:function(){IronCheckedElementBehaviorImpl._checkedChanged.call(this);if(this.hasRipple()){if(this.checked){this._ripple.setAttribute("checked","")}else{this._ripple.removeAttribute("checked")}}},/**
   * Synchronizes the element's `active` and `checked` state.
   */_buttonStateChanged:function(){_loginOn.PaperRippleBehavior._buttonStateChanged.call(this);if(this.disabled){return}if(this.isAttached){this.checked=this.active}}};/** @polymerBehavior */_exports.PaperCheckedElementBehaviorImpl=PaperCheckedElementBehaviorImpl;const PaperCheckedElementBehavior=[_loginOn.PaperInkyFocusBehavior,IronCheckedElementBehavior,PaperCheckedElementBehaviorImpl];_exports.PaperCheckedElementBehavior=PaperCheckedElementBehavior;var paperCheckedElementBehavior={PaperCheckedElementBehaviorImpl:PaperCheckedElementBehaviorImpl,PaperCheckedElementBehavior:PaperCheckedElementBehavior};_exports.$paperCheckedElementBehavior=paperCheckedElementBehavior;const template=_loginOn.html$1`<style>
  :host {
    display: inline-block;
    white-space: nowrap;
    cursor: pointer;
    --calculated-paper-checkbox-size: var(--paper-checkbox-size, 18px);
    /* -1px is a sentinel for the default and is replaced in \`attached\`. */
    --calculated-paper-checkbox-ink-size: var(--paper-checkbox-ink-size, -1px);
    @apply --paper-font-common-base;
    line-height: 0;
    -webkit-tap-highlight-color: transparent;
  }

  :host([hidden]) {
    display: none !important;
  }

  :host(:focus) {
    outline: none;
  }

  .hidden {
    display: none;
  }

  #checkboxContainer {
    display: inline-block;
    position: relative;
    width: var(--calculated-paper-checkbox-size);
    height: var(--calculated-paper-checkbox-size);
    min-width: var(--calculated-paper-checkbox-size);
    margin: var(--paper-checkbox-margin, initial);
    vertical-align: var(--paper-checkbox-vertical-align, middle);
    background-color: var(--paper-checkbox-unchecked-background-color, transparent);
  }

  #ink {
    position: absolute;

    /* Center the ripple in the checkbox by negative offsetting it by
     * (inkWidth - rippleWidth) / 2 */
    top: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    width: var(--calculated-paper-checkbox-ink-size);
    height: var(--calculated-paper-checkbox-ink-size);
    color: var(--paper-checkbox-unchecked-ink-color, var(--primary-text-color));
    opacity: 0.6;
    pointer-events: none;
  }

  #ink:dir(rtl) {
    right: calc(0px - (var(--calculated-paper-checkbox-ink-size) - var(--calculated-paper-checkbox-size)) / 2);
    left: auto;
  }

  #ink[checked] {
    color: var(--paper-checkbox-checked-ink-color, var(--primary-color));
  }

  #checkbox {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    border: solid 2px;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    border-radius: 2px;
    pointer-events: none;
    -webkit-transition: background-color 140ms, border-color 140ms;
    transition: background-color 140ms, border-color 140ms;

    -webkit-transition-duration: var(--paper-checkbox-animation-duration, 140ms);
    transition-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  /* checkbox checked animations */
  #checkbox.checked #checkmark {
    -webkit-animation: checkmark-expand 140ms ease-out forwards;
    animation: checkmark-expand 140ms ease-out forwards;

    -webkit-animation-duration: var(--paper-checkbox-animation-duration, 140ms);
    animation-duration: var(--paper-checkbox-animation-duration, 140ms);
  }

  @-webkit-keyframes checkmark-expand {
    0% {
      -webkit-transform: scale(0, 0) rotate(45deg);
    }
    100% {
      -webkit-transform: scale(1, 1) rotate(45deg);
    }
  }

  @keyframes checkmark-expand {
    0% {
      transform: scale(0, 0) rotate(45deg);
    }
    100% {
      transform: scale(1, 1) rotate(45deg);
    }
  }

  #checkbox.checked {
    background-color: var(--paper-checkbox-checked-color, var(--primary-color));
    border-color: var(--paper-checkbox-checked-color, var(--primary-color));
  }

  #checkmark {
    position: absolute;
    width: 36%;
    height: 70%;
    border-style: solid;
    border-top: none;
    border-left: none;
    border-right-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-bottom-width: calc(2/15 * var(--calculated-paper-checkbox-size));
    border-color: var(--paper-checkbox-checkmark-color, white);
    -webkit-transform-origin: 97% 86%;
    transform-origin: 97% 86%;
    box-sizing: content-box; /* protect against page-level box-sizing */
  }

  #checkmark:dir(rtl) {
    -webkit-transform-origin: 50% 14%;
    transform-origin: 50% 14%;
  }

  /* label */
  #checkboxLabel {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    padding-left: var(--paper-checkbox-label-spacing, 8px);
    white-space: normal;
    line-height: normal;
    color: var(--paper-checkbox-label-color, var(--primary-text-color));
    @apply --paper-checkbox-label;
  }

  :host([checked]) #checkboxLabel {
    color: var(--paper-checkbox-label-checked-color, var(--paper-checkbox-label-color, var(--primary-text-color)));
    @apply --paper-checkbox-label-checked;
  }

  #checkboxLabel:dir(rtl) {
    padding-right: var(--paper-checkbox-label-spacing, 8px);
    padding-left: 0;
  }

  #checkboxLabel[hidden] {
    display: none;
  }

  /* disabled state */

  :host([disabled]) #checkbox {
    opacity: 0.5;
    border-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
  }

  :host([disabled][checked]) #checkbox {
    background-color: var(--paper-checkbox-unchecked-color, var(--primary-text-color));
    opacity: 0.5;
  }

  :host([disabled]) #checkboxLabel  {
    opacity: 0.65;
  }

  /* invalid state */
  #checkbox.invalid:not(.checked) {
    border-color: var(--paper-checkbox-error-color, var(--error-color));
  }
</style>

<div id="checkboxContainer">
  <div id="checkbox" class$="[[_computeCheckboxClass(checked, invalid)]]">
    <div id="checkmark" class$="[[_computeCheckmarkClass(checked)]]"></div>
  </div>
</div>

<div id="checkboxLabel"><slot></slot></div>`;template.setAttribute("strip-whitespace","");/**
                                               Material design:
                                               [Checkbox](https://www.google.com/design/spec/components/selection-controls.html#selection-controls-checkbox)
                                               
                                               `paper-checkbox` is a button that can be either checked or unchecked. User can
                                               tap the checkbox to check or uncheck it. Usually you use checkboxes to allow
                                               user to select multiple options from a set. If you have a single ON/OFF option,
                                               avoid using a single checkbox and use `paper-toggle-button` instead.
                                               
                                               Example:
                                               
                                                   <paper-checkbox>label</paper-checkbox>
                                               
                                                   <paper-checkbox checked> label</paper-checkbox>
                                               
                                               ### Styling
                                               
                                               The following custom properties and mixins are available for styling:
                                               
                                               Custom property | Description | Default
                                               ----------------|-------------|----------
                                               `--paper-checkbox-unchecked-background-color` | Checkbox background color when the input is not checked | `transparent`
                                               `--paper-checkbox-unchecked-color` | Checkbox border color when the input is not checked | `--primary-text-color`
                                               `--paper-checkbox-unchecked-ink-color` | Selected/focus ripple color when the input is not checked | `--primary-text-color`
                                               `--paper-checkbox-checked-color` | Checkbox color when the input is checked | `--primary-color`
                                               `--paper-checkbox-checked-ink-color` | Selected/focus ripple color when the input is checked | `--primary-color`
                                               `--paper-checkbox-checkmark-color` | Checkmark color | `white`
                                               `--paper-checkbox-label-color` | Label color | `--primary-text-color`
                                               `--paper-checkbox-label-checked-color` | Label color when the input is checked | `--paper-checkbox-label-color`
                                               `--paper-checkbox-label-spacing` | Spacing between the label and the checkbox | `8px`
                                               `--paper-checkbox-label` | Mixin applied to the label | `{}`
                                               `--paper-checkbox-label-checked` | Mixin applied to the label when the input is checked | `{}`
                                               `--paper-checkbox-error-color` | Checkbox color when invalid | `--error-color`
                                               `--paper-checkbox-size` | Size of the checkbox | `18px`
                                               `--paper-checkbox-ink-size` | Size of the ripple | `48px`
                                               `--paper-checkbox-margin` | Margin around the checkbox container | `initial`
                                               `--paper-checkbox-vertical-align` | Vertical alignment of the checkbox container | `middle`
                                               
                                               This element applies the mixin `--paper-font-common-base` but does not import
                                               `paper-styles/typography.html`. In order to apply the `Roboto` font to this
                                               element, make sure you've imported `paper-styles/typography.html`.
                                               
                                               @demo demo/index.html
                                               */(0,_loginOn.Polymer)({_template:template,is:"paper-checkbox",behaviors:[PaperCheckedElementBehavior],/** @private */hostAttributes:{role:"checkbox","aria-checked":!1,tabindex:0},properties:{/**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */ /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */ariaActiveAttribute:{type:String,value:"aria-checked"}},attached:function(){// Wait until styles have resolved to check for the default sentinel.
// See polymer#4009 for more details.
(0,_loginOn.afterNextRender)(this,function(){var inkSize=this.getComputedStyleValue("--calculated-paper-checkbox-ink-size").trim();// If unset, compute and set the default `--paper-checkbox-ink-size`.
if("-1px"===inkSize){var checkboxSizeText=this.getComputedStyleValue("--calculated-paper-checkbox-size").trim(),units="px",unitsMatches=checkboxSizeText.match(/[A-Za-z]+$/);if(null!==unitsMatches){units=unitsMatches[0]}var checkboxSize=parseFloat(checkboxSizeText),defaultInkSize=8/3*checkboxSize;if("px"===units){defaultInkSize=Math.floor(defaultInkSize);// The checkbox and ripple need to have the same parity so that their
// centers align.
if(defaultInkSize%2!==checkboxSize%2){defaultInkSize++}}this.updateStyles({"--paper-checkbox-ink-size":defaultInkSize+units})}})},_computeCheckboxClass:function(checked,invalid){var className="";if(checked){className+="checked "}if(invalid){className+="invalid"}return className},_computeCheckmarkClass:function(checked){return checked?"":"hidden"},// create ripple inside the checkboxContainer
_createRipple:function(){this._rippleContainer=this.$.checkboxContainer;return _loginOn.PaperInkyFocusBehaviorImpl._createRipple.call(this)}});const PaperDialogBehaviorImpl={hostAttributes:{role:"dialog",tabindex:"-1"},properties:{/**
     * If `modal` is true, this implies `no-cancel-on-outside-click`,
     * `no-cancel-on-esc-key` and `with-backdrop`.
     */modal:{type:Boolean,value:!1},__readied:{type:Boolean,value:!1}},observers:["_modalChanged(modal, __readied)"],listeners:{tap:"_onDialogClick"},/**
   * @return {void}
   */ready:function(){// Only now these properties can be read.
this.__prevNoCancelOnOutsideClick=this.noCancelOnOutsideClick;this.__prevNoCancelOnEscKey=this.noCancelOnEscKey;this.__prevWithBackdrop=this.withBackdrop;this.__readied=!0},_modalChanged:function(modal,readied){// modal implies noCancelOnOutsideClick, noCancelOnEscKey and withBackdrop.
// We need to wait for the element to be ready before we can read the
// properties values.
if(!readied){return}if(modal){this.__prevNoCancelOnOutsideClick=this.noCancelOnOutsideClick;this.__prevNoCancelOnEscKey=this.noCancelOnEscKey;this.__prevWithBackdrop=this.withBackdrop;this.noCancelOnOutsideClick=!0;this.noCancelOnEscKey=!0;this.withBackdrop=!0}else{// If the value was changed to false, let it false.
this.noCancelOnOutsideClick=this.noCancelOnOutsideClick&&this.__prevNoCancelOnOutsideClick;this.noCancelOnEscKey=this.noCancelOnEscKey&&this.__prevNoCancelOnEscKey;this.withBackdrop=this.withBackdrop&&this.__prevWithBackdrop}},_updateClosingReasonConfirmed:function(confirmed){this.closingReason=this.closingReason||{};this.closingReason.confirmed=confirmed},/**
   * Will dismiss the dialog if user clicked on an element with dialog-dismiss
   * or dialog-confirm attribute.
   */_onDialogClick:function(event){// Search for the element with dialog-confirm or dialog-dismiss,
// from the root target until this (excluded).
for(var path=(0,_loginOn.dom)(event).path,i=0,l=path.indexOf(this),target;i<l;i++){target=path[i];if(target.hasAttribute&&(target.hasAttribute("dialog-dismiss")||target.hasAttribute("dialog-confirm"))){this._updateClosingReasonConfirmed(target.hasAttribute("dialog-confirm"));this.close();event.stopPropagation();break}}}};/** @polymerBehavior */_exports.PaperDialogBehaviorImpl=PaperDialogBehaviorImpl;const PaperDialogBehavior=[_loginOn.IronOverlayBehavior,PaperDialogBehaviorImpl];_exports.PaperDialogBehavior=PaperDialogBehavior;var paperDialogBehavior={PaperDialogBehaviorImpl:PaperDialogBehaviorImpl,PaperDialogBehavior:PaperDialogBehavior};_exports.$paperDialogBehavior=paperDialogBehavior;const $_documentContainer=document.createElement("template");$_documentContainer.setAttribute("style","display: none;");$_documentContainer.innerHTML=`<dom-module id="paper-dialog-shared-styles">
  <template>
    <style>
      :host {
        display: block;
        margin: 24px 40px;

        background: var(--paper-dialog-background-color, var(--primary-background-color));
        color: var(--paper-dialog-color, var(--primary-text-color));

        @apply --paper-font-body1;
        @apply --shadow-elevation-16dp;
        @apply --paper-dialog;
      }

      :host > ::slotted(*) {
        margin-top: 20px;
        padding: 0 24px;
      }

      :host > ::slotted(.no-padding) {
        padding: 0;
      }

      
      :host > ::slotted(*:first-child) {
        margin-top: 24px;
      }

      :host > ::slotted(*:last-child) {
        margin-bottom: 24px;
      }

      /* In 1.x, this selector was \`:host > ::content h2\`. In 2.x <slot> allows
      to select direct children only, which increases the weight of this
      selector, so we have to re-define first-child/last-child margins below. */
      :host > ::slotted(h2) {
        position: relative;
        margin: 0;

        @apply --paper-font-title;
        @apply --paper-dialog-title;
      }

      /* Apply mixin again, in case it sets margin-top. */
      :host > ::slotted(h2:first-child) {
        margin-top: 24px;
        @apply --paper-dialog-title;
      }

      /* Apply mixin again, in case it sets margin-bottom. */
      :host > ::slotted(h2:last-child) {
        margin-bottom: 24px;
        @apply --paper-dialog-title;
      }

      :host > ::slotted(.paper-dialog-buttons),
      :host > ::slotted(.buttons) {
        position: relative;
        padding: 8px 8px 8px 24px;
        margin: 0;

        color: var(--paper-dialog-button-color, var(--primary-color));

        @apply --layout-horizontal;
        @apply --layout-end-justified;
      }
    </style>
  </template>
</dom-module>`;document.head.appendChild($_documentContainer.content);(0,_loginOn.Polymer)({_template:_loginOn.html$1`
    <style>

      :host {
        display: block;
        @apply --layout-relative;
      }

      :host(.is-scrolled:not(:first-child))::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--divider-color);
      }

      :host(.can-scroll:not(.scrolled-to-bottom):not(:last-child))::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--divider-color);
      }

      .scrollable {
        padding: 0 24px;

        @apply --layout-scroll;
        @apply --paper-dialog-scrollable;
      }

      .fit {
        @apply --layout-fit;
      }
    </style>

    <div id="scrollable" class="scrollable" on-scroll="updateScrollState">
      <slot></slot>
    </div>
`,is:"paper-dialog-scrollable",properties:{/**
     * The dialog element that implements `Polymer.PaperDialogBehavior`
     * containing this element.
     * @type {?Node}
     */dialogElement:{type:Object}},/**
   * Returns the scrolling element.
   */get scrollTarget(){return this.$.scrollable},ready:function(){this._ensureTarget();this.classList.add("no-padding")},attached:function(){this._ensureTarget();requestAnimationFrame(this.updateScrollState.bind(this))},updateScrollState:function(){this.toggleClass("is-scrolled",0<this.scrollTarget.scrollTop);this.toggleClass("can-scroll",this.scrollTarget.offsetHeight<this.scrollTarget.scrollHeight);this.toggleClass("scrolled-to-bottom",this.scrollTarget.scrollTop+this.scrollTarget.offsetHeight>=this.scrollTarget.scrollHeight)},_ensureTarget:function(){// Read parentElement instead of parentNode in order to skip shadowRoots.
this.dialogElement=this.dialogElement||this.parentElement;// Check if dialog implements paper-dialog-behavior. If not, fit
// scrollTarget to host.
if(this.dialogElement&&this.dialogElement.behaviors&&0<=this.dialogElement.behaviors.indexOf(PaperDialogBehaviorImpl)){this.dialogElement.sizingTarget=this.scrollTarget;this.scrollTarget.classList.remove("fit")}else if(this.dialogElement){this.scrollTarget.classList.add("fit")}}});(0,_loginOn.Polymer)({_template:_loginOn.html$1`
    <style include="paper-dialog-shared-styles"></style>
    <slot></slot>
`,is:"paper-dialog",behaviors:[PaperDialogBehavior,NeonAnimationRunnerBehavior],listeners:{"neon-animation-finish":"_onNeonAnimationFinish"},_renderOpened:function(){this.cancelAnimation();this.playAnimation("entry")},_renderClosed:function(){this.cancelAnimation();this.playAnimation("exit")},_onNeonAnimationFinish:function(){if(this.opened){this._finishRenderOpened()}else{this._finishRenderClosed()}}});class BaseGuiComponent$1{constructor(element){this.element=element}init(params){this._params=params;this._agAwareComponent=this.createComponent();this._agAwareComponent.agInit(this._params)}getGui(){return this._agAwareComponent}destroy(){if(this._agAwareComponent&&this._agAwareComponent.destroy){this._agAwareComponent.destroy()}}getFrameworkComponentInstance(){return this._agAwareComponent}createComponent(){if(!customElements.get(this.element)){console.error(`${this.element} not found in the registry - has it been registered?`)}return document.createElement(this.element)}}_exports.$BaseFrameworkComponentDefault=BaseGuiComponent$1;var BaseFrameworkComponent={default:BaseGuiComponent$1};_exports.$BaseFrameworkComponent=BaseFrameworkComponent;class PolymerComponentFactory{createRendererFromComponent(componentType){return this.adaptComponentToRenderer(componentType)}createEditorFromComponent(componentType){return this.adaptComponentToEditor(componentType)}createFilterFromComponent(componentType){return this.adaptComponentToFilter(componentType)}adaptComponentToRenderer(componentType){let that=this;class CellRenderer extends BaseGuiComponent{constructor(){super(componentType)}init(params){super.init(params)}refresh(params){this._params=params;if(this._agAwareComponent.refresh){this._agAwareComponent.refresh(params);return!0}else{return!1}}}return CellRenderer}adaptComponentToEditor(componentType){let that=this;class CellEditor extends BaseGuiComponent{constructor(){super(componentType)}init(params){super.init(params)}getValue(){return this._agAwareComponent.getValue()}isPopup(){return this._agAwareComponent.isPopup?this._agAwareComponent.isPopup():!1}isCancelBeforeStart(){return this._agAwareComponent.isCancelBeforeStart?this._agAwareComponent.isCancelBeforeStart():!1}isCancelAfterEnd(){return this._agAwareComponent.isCancelAfterEnd?this._agAwareComponent.isCancelAfterEnd():!1}focusIn(){if(this._agAwareComponent.focusIn){this._agAwareComponent.focusIn()}}focusOut(){if(this._agAwareComponent.focusOut){this._agAwareComponent.focusOut()}}}return CellEditor}adaptComponentToFilter(componentType){let that=this;class Filter extends BaseGuiComponent{constructor(){super(componentType)}init(params){super.init(params)}isFilterActive(){return this._agAwareComponent.isFilterActive()}doesFilterPass(params){return this._agAwareComponent.doesFilterPass(params)}getModel(){return this._agAwareComponent.getModel()}setModel(model){this._agAwareComponent.setModel(model)}afterGuiAttached(params){if(this._agAwareComponent.afterGuiAttached){this._agAwareComponent.afterGuiAttached(params)}}onNewRowsLoaded(){if(this._agAwareComponent.onNewRowsLoaded){this._agAwareComponent.onNewRowsLoaded()}}getModelAsString(model){let agAwareComponent=this._agAwareComponent;if(agAwareComponent.getModelAsString){return agAwareComponent.getModelAsString(model)}return null}getFrameworkComponentInstance(){return this._agAwareComponent}}return Filter}}_exports.$PolymerComponentFactoryDefault=PolymerComponentFactory;var PolymerComponentFactory$1={default:PolymerComponentFactory};_exports.$PolymerComponentFactory=PolymerComponentFactory$1;class PolymerFrameworkComponentWrapper{wrap(element,mandatoryMethodList,optionalMethodList){function addMethod(wrapper,methodName,mandatory){let methodProxy=function(){if(wrapper.getFrameworkComponentInstance()[methodName]){var componentRef=this.getFrameworkComponentInstance();return wrapper.getFrameworkComponentInstance()[methodName].apply(componentRef,arguments)}else{if(mandatory){console.warn("ag-Grid: Polymer Element is missing the method "+methodName+"()")}return null}};wrapper[methodName]=methodProxy}let wrapper=new BaseGuiComponent$1(element);mandatoryMethodList.forEach(methodName=>{addMethod(wrapper,methodName,!0)});if(optionalMethodList){optionalMethodList.forEach(methodName=>{addMethod(wrapper,methodName,!1)})}return wrapper}}_exports.$PolymerFrameworkComponentWrapperDefault=PolymerFrameworkComponentWrapper;var PolymerFrameworkComponentWrapper$1={default:PolymerFrameworkComponentWrapper};_exports.$PolymerFrameworkComponentWrapper=PolymerFrameworkComponentWrapper$1;class PolymerFrameworkFactory{constructor(baseFrameworkFactory,componentFactory){this._baseFrameworkFactory=baseFrameworkFactory;this._componentFactory=componentFactory}colDefCellEditor(colDef){if(colDef.cellEditorFramework&&colDef.cellEditorFramework.component){console.warn("colDef.cellEditorFramework.component is deprecated - please refer to https://ag-grid.com/best-angular-2-data-grid/");colDef.cellEditorFramework=colDef.cellEditorFramework.component}if(colDef.cellEditorFramework){return this._componentFactory.createEditorFromComponent(colDef.cellEditorFramework)}else{return this._baseFrameworkFactory.colDefCellEditor(colDef)}}colDefFilter(colDef){if(colDef.filterFramework&&colDef.filterFramework.component){console.warn("colDef.filterFramework.component is deprecated - please refer to https://ag-grid.com/best-angular-2-data-grid/");colDef.filterFramework=colDef.filterFramework.component}if(colDef.filterFramework){return this._componentFactory.createFilterFromComponent(colDef.filterFramework)}else{return this._baseFrameworkFactory.colDefFilter(colDef)}}setTimeout(action,timeout){this._baseFrameworkFactory.setTimeout(action,timeout)}}_exports.$PolymerFrameworkFactoryDefault=PolymerFrameworkFactory;var PolymerFrameworkFactory$1={default:PolymerFrameworkFactory};_exports.$PolymerFrameworkFactory=PolymerFrameworkFactory$1;class AgGridPolymer extends _loginOn.PolymerElement{static get properties(){const properties={};this.addProperties(properties,agGrid.ComponentUtil.BOOLEAN_PROPERTIES,Boolean);this.addProperties(properties,agGrid.ComponentUtil.STRING_PROPERTIES,String);this.addProperties(properties,agGrid.ComponentUtil.OBJECT_PROPERTIES,Object);this.addProperties(properties,agGrid.ComponentUtil.ARRAY_PROPERTIES,Array);this.addProperties(properties,agGrid.ComponentUtil.FUNCTION_PROPERTIES,Object);return properties}static addProperties(target,properties,type){properties.forEach(key=>{target[key.toLowerCase()]=type;target[key]=type})}constructor(){super();this._gridOptions={};this._attributes={};this.defaultPopupParentSet=!1;this._propertyMap=this.createPropertyMap();agGrid.ComponentUtil.ALL_PROPERTIES.forEach(property=>{let observerName=property+"PropertyChanged";this[observerName]=newVal=>{this._gridPropertyChanged(property,newVal)};this._createPropertyObserver(property,observerName);let propertyToLowerCase=property.toLowerCase();observerName=propertyToLowerCase+"PropertyChanged";this[observerName]=newVal=>{this._gridPropertyChanged(propertyToLowerCase,newVal)};this._createPropertyObserver(propertyToLowerCase,observerName)})}createPropertyMap(){return agGrid.ComponentUtil.ALL_PROPERTIES.concat(agGrid.ComponentUtil.getEventCallbacks()).reduce((map,property)=>{map[property.toLowerCase()]=property;map[this.hypenateAndLowercase(property)]=property;return map},{})}ready(){// if providing properties via the element (as opposed to via gridOptions etc), then the order can be such
// that the grid is initialised and then updated for each property
// waiting for the next tick ensure all the properties will be set _first_ after which the grid will be initialised
// this makes for a much smoother initial render
if(0===Object.keys(this._attributes).length&&0===Object.keys(this._gridOptions).length){window.setTimeout(()=>{this.initialiseGrid()},0)}else{this.initialiseGrid()}}set gridOptions(options){if(!this._initialised){this._gridOptions=options;this.initialiseGrid()}}initialiseGrid(){// prevent instantiating multiple grids
if(!this._initialised){let globalEventListener=this.globalEventListener.bind(this);if(this.gridoptions){this._gridOptions=this.gridoptions}// read un-bound properties directly off the element
this._gridOptions=agGrid.ComponentUtil.copyAttributesToGridOptions(this._gridOptions,this);// ready bound properties off of the mapped attributes property
this._gridOptions=agGrid.ComponentUtil.copyAttributesToGridOptions(this._gridOptions,this._attributes);let gridParams={globalEventListener:globalEventListener,frameworkFactory:new PolymerFrameworkFactory(new agGrid.BaseFrameworkFactory(),new PolymerComponentFactory()),seedBeanInstances:{frameworkComponentWrapper:new PolymerFrameworkComponentWrapper}};this._agGrid=new agGrid.Grid(this,this._gridOptions,gridParams);this.api=this._gridOptions.api;this.columnApi=this._gridOptions.columnApi;this._initialised=!0}}_gridPropertyChanged(name,newValue){let gridPropertyName=this._propertyMap[name]||name;// for properties set before gridOptions is called
this._attributes[gridPropertyName]=newValue;if(this._initialised){// for subsequent (post gridOptions) changes
let changeObject={};changeObject[gridPropertyName]={currentValue:newValue};agGrid.ComponentUtil.processOnChange(changeObject,this._gridOptions,this.api,this.columnApi)}}globalEventListener(eventType,event){let eventLowerCase=eventType.toLowerCase(),browserEvent=new Event(eventLowerCase),browserEventNoType=browserEvent;browserEventNoType.agGridDetails=event;if("gridready"===eventLowerCase){this.setDefaultPopupParent()}// for when defining events via myGrid.addEventListener('columnresized', function (event) {...
this.dispatchEvent(browserEvent);// for when defining events via myGrid.oncolumnresized = function (event) {....
let callbackMethod="on"+eventLowerCase;if("function"===typeof this[callbackMethod]){this[callbackMethod](browserEvent)}}setDefaultPopupParent(){if(!this.defaultPopupParentSet&&this.api&&!this._gridOptions.popupParent){this.defaultPopupParentSet=!0;this.api.setPopupParent(this.querySelector(".ag-root"))}}hypenateAndLowercase(property){return property.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}}_exports.$agGridPolymerDefault=AgGridPolymer;customElements.define("ag-grid-polymer",AgGridPolymer);var agGridPolymer={default:AgGridPolymer};_exports.$agGridPolymer=agGridPolymer;class AccountList extends _loginOn.PolymerElement{static get template(){return _loginOn.html`
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
    `}ready(){super.ready();//@@fix: Llamamos desde el inicio func. para listar las empresas
this.__callListAccounts();//@@fix: Cuando cerramos la [ventanaEmpresa], cambiamos el 'path'
this.$.ventanaEmpresa.addEventListener("opened-changed",e=>{if(!e.detail.value){this.set("route.path",this.subroute.prefix)}})}static get properties(){return{title:{type:String,value:"EMPRESAS"},route:Object,subroute:Object,apiData:{type:Object,value:MainInitGlobals.apiData},accounts:{type:Object},account:{type:Object},filtros:{type:Object,value:{eliminados:{type:Boolean,value:!1},texto:{type:String,value:""}}},verEliminados:Number,gridOptions:{type:Object},columnsAccounts:{type:Object,value:[{headerName:"EMPRESA",field:"name",pinned:"left",sortable:!0,cellRenderer:function(e){var thtml=`
                <a href="/list/`+e.data.id+`">`+e.value+`</a>
              `;return thtml}},{headerName:"RESPONSABLE",field:"salesRepId1.value",sortable:!0},{headerName:"CREACION",field:"dateCreated",sortable:!0,cellRenderer:function(e){var fecha=new Date(e.value),tfecha=fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();return tfecha}},{headerName:"TIPO",field:"typeId.value",sortable:!0},{headerName:"DIRECCI\xD3N",field:"address1",sortable:!0},{headerName:"POBLACI\xD3N",field:"city",sortable:!0},{headerName:"C\xD3DIGO POSTAL",field:"postcode",sortable:!0},{headerName:"PA\xCDS",field:"countryId.value",sortable:!0}]},textoTostada:{type:String,value:"Error desconocido, contacta con servicio t\xE9cnico."},codeTostada:{type:String,value:"No code! :("}}}static get observers(){return["__subRouteChanged(subroute.path)","__actualizarDatos(route.*)","__changeTitle(routeData.page)","__filtraEliminados(filtros.eliminados.value)","__filtrarTexto(filtros.texto.value)"]}__filtraEliminados(){if(this.filtros.eliminados.value){this.set("verEliminados",1)}else{this.set("verEliminados",0)}this.__callListAccounts()}__filtrarTexto(){setTimeout(()=>{var a=this.$.agrid.api.setQuickFilter(this.filtros.texto.value)},50)}__render(params){params.api.setDomLayout("autoHeight")}/*
    @__changeTitle({pagina}):
      - Cambiamos el título de la página dentro del objeto paper-toolbar del
        camponente main-init.
    */__changeTitle(page){//@@note: Comprobamos que la página es la que toca,
if("list"==page){var a=$($("body").children("login-on")[0].shadowRoot).children("iron-pages"),b=$($(a)[0].children.main).children("main-init");b[0].title=this.title}//@@fix: Cerramos las ventanas emergentes que estén abiertas
if("list"==page&&""==this.subroute.path){this.$.ventanaEmpresa.close()}}/*
    @__callListAccounts():
      - Lanzamos la llamada hacía la API, en petición de los datos del listado
        de empresas. Adjuntos el token.
    */__actualizarDatos(){if(""==this.subroute.path){this.__callListAccounts()}}__callListAccounts(){//@@note: Comprobamos que existe el token!
if(this.apiData.token){this.$.iaListAccounts.headers={"x-session-key":this.apiData.token//@@note: lanzamos petición...
};this.$.iaListAccounts.generateRequest()}else{//@@fix: Pese a que no me guste, deberemos de esperar 10ms...
setTimeout(()=>{this.__callListAccounts()},10)}}__cargarEmpresa(){//@@note: Comprobamos que existe el token!
if(this.apiData.token){this.$.iaShowAccount.headers={"x-session-key":this.apiData.token//@@note: lanzamos petición...
};this.$.iaShowAccount.generateRequest()}else{//@@fix: Pese a que no me guste, deberemos de esperar 10ms...
setTimeout(()=>{this.__cargarEmpresa()},10)}}__abrirVentanaLateral(){this.$.ventanaEmpresa.open()}/*
    @__subRouteChanged({page}):
      - Acción de salto desde [observer]. Nos permite saber si estamos
        en una subpágina para así generar los eventos correspondientes
    */__subRouteChanged(page){if(page){this.__cargarEmpresa();//->Cargamos la empresa en cuestión (mediante su id)
this.__abrirVentanaLateral();//->Abrimos la ventana lateral de [opciones]/[datos]
}}__dialogDelete(){this.$.dialogDelete.open()}__eliminarEmpresa(){if(this.apiData.token){this.$.iaEliminarEmpresa.headers={"x-session-key":this.apiData.token//@@note: lanzamos petición...
};this.$.iaEliminarEmpresa.generateRequest()}else{//@@fix: Pese a que no me guste, deberemos de esperar 10ms...
setTimeout(()=>{this.__eliminarEmpresa()},10)}}__retornoEliminar(e){this.textoTostada="["+e.detail.response.Message+"]";this.codeTostada="ID_ENTITY: "+e.detail.response.id+" ";this.$.tostadaSuccess.open();this.$.ventanaEmpresa.close();this.__callListAccounts()}__onErrorEliminar(e){if("error"==e.type){var respuesta=e.detail.request.response;this.$.tostadaError.open();this.textoTostada="["+e.detail.request.response.error+"]";this.codeTostada="Code: "+e.detail.request.response.code+" "}}}window.customElements.define("account-list",AccountList)});