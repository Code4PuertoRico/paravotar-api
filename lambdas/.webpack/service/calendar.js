module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./calendar.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./calendar.ts":
/*!*********************!*\
  !*** ./calendar.ts ***!
  \*********************/
/*! exports provided: createEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createEvent\", function() { return createEvent; });\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! util */ \"util\");\n/* harmony import */ var util__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(util__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _middy_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @middy/core */ \"@middy/core\");\n/* harmony import */ var _middy_core__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_middy_core__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _middy_http_cors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @middy/http-cors */ \"@middy/http-cors\");\n/* harmony import */ var _middy_http_cors__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_middy_http_cors__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @middy/do-not-wait-for-empty-event-loop */ \"@middy/do-not-wait-for-empty-event-loop\");\n/* harmony import */ var _middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _middy_http_error_handler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @middy/http-error-handler */ \"@middy/http-error-handler\");\n/* harmony import */ var _middy_http_error_handler__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_middy_http_error_handler__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var ics__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ics */ \"ics\");\n/* harmony import */ var ics__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(ics__WEBPACK_IMPORTED_MODULE_6__);\n\n\n\n\n\n\n\nconst createICS = Object(util__WEBPACK_IMPORTED_MODULE_0__[\"promisify\"])(ics__WEBPACK_IMPORTED_MODULE_6__[\"createEvents\"]);\n\nconst dateToArray = (date, includeTime = false) => {\n  const d = [date.getFullYear(), date.getMonth() + 1, date.getDate()];\n  const t = [date.getHours(), date.getMinutes()];\n  return includeTime ? d.concat(t) : d;\n};\n\nfunction processEvent(event) {\n  return {\n    title: event.title,\n    description: event.description,\n    start: dateToArray(new Date(event.start)),\n    end: dateToArray(new Date(event.end || event.start)),\n    productId: 'code4puertorico/paravotar'\n  };\n}\n\nconst handler = async event => {\n  const body = JSON.parse(event.body);\n\n  const events = lodash__WEBPACK_IMPORTED_MODULE_1___default.a.get(body, 'events', []);\n\n  const ics = await createICS(events.map(processEvent));\n\n  try {\n    return {\n      statusCode: 200,\n      headers: {\n        'Content-Type': 'text/calendar',\n        'Content-Disposition': 'attachment; filename=paravotar.ics'\n      },\n      body: ics\n    };\n  } catch (e) {\n    return {\n      statusCode: 500,\n      body: JSON.stringify(e)\n    };\n  }\n};\n\nconst createEvent = _middy_core__WEBPACK_IMPORTED_MODULE_2___default()(handler).use(_middy_http_cors__WEBPACK_IMPORTED_MODULE_3___default()()).use(_middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_4___default()()).use(_middy_http_error_handler__WEBPACK_IMPORTED_MODULE_5___default()());\n\n//# sourceURL=webpack:///./calendar.ts?");

/***/ }),

/***/ "@middy/core":
/*!******************************!*\
  !*** external "@middy/core" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@middy/core\");\n\n//# sourceURL=webpack:///external_%22@middy/core%22?");

/***/ }),

/***/ "@middy/do-not-wait-for-empty-event-loop":
/*!**********************************************************!*\
  !*** external "@middy/do-not-wait-for-empty-event-loop" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@middy/do-not-wait-for-empty-event-loop\");\n\n//# sourceURL=webpack:///external_%22@middy/do-not-wait-for-empty-event-loop%22?");

/***/ }),

/***/ "@middy/http-cors":
/*!***********************************!*\
  !*** external "@middy/http-cors" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@middy/http-cors\");\n\n//# sourceURL=webpack:///external_%22@middy/http-cors%22?");

/***/ }),

/***/ "@middy/http-error-handler":
/*!********************************************!*\
  !*** external "@middy/http-error-handler" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@middy/http-error-handler\");\n\n//# sourceURL=webpack:///external_%22@middy/http-error-handler%22?");

/***/ }),

/***/ "ics":
/*!**********************!*\
  !*** external "ics" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"ics\");\n\n//# sourceURL=webpack:///external_%22ics%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"util\");\n\n//# sourceURL=webpack:///external_%22util%22?");

/***/ })

/******/ });