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
/******/ 	return __webpack_require__(__webpack_require__.s = "./voterStatus.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./voterStatus.ts":
/*!************************!*\
  !*** ./voterStatus.ts ***!
  \************************/
/*! exports provided: getVoterStatus, consulta */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getVoterStatus\", function() { return getVoterStatus; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"consulta\", function() { return consulta; });\n/* harmony import */ var chrome_aws_lambda__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! chrome-aws-lambda */ \"chrome-aws-lambda\");\n/* harmony import */ var chrome_aws_lambda__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(chrome_aws_lambda__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var puppeteer_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! puppeteer-core */ \"puppeteer-core\");\n/* harmony import */ var puppeteer_core__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(puppeteer_core__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash */ \"lodash\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _middy_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @middy/core */ \"@middy/core\");\n/* harmony import */ var _middy_core__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_middy_core__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _middy_http_cors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @middy/http-cors */ \"@middy/http-cors\");\n/* harmony import */ var _middy_http_cors__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_middy_http_cors__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @middy/do-not-wait-for-empty-event-loop */ \"@middy/do-not-wait-for-empty-event-loop\");\n/* harmony import */ var _middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _middy_http_error_handler__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @middy/http-error-handler */ \"@middy/http-error-handler\");\n/* harmony import */ var _middy_http_error_handler__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_middy_http_error_handler__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! aws-sdk */ \"aws-sdk\");\n/* harmony import */ var aws_sdk__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(aws_sdk__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! qs */ \"qs\");\n/* harmony import */ var qs__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(qs__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! axios */ \"axios\");\n/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! node-html-parser */ \"node-html-parser\");\n/* harmony import */ var node_html_parser__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(node_html_parser__WEBPACK_IMPORTED_MODULE_10__);\n\n\n\n\n\n\n\n\n\n\n\nconst S3 = new aws_sdk__WEBPACK_IMPORTED_MODULE_7___default.a.S3();\nconst ceeUrl = \"http://consulta.ceepur.org\";\nconst bucket = \"paravotar\";\nconst precintsFile = \"precints.json\";\nconst countiesFile = \"counties.json\";\nconst papeletasFile = \"papeletas.json\";\nconst folder = \"/papeletas/2016\";\n\nconst handler = async event => {\n  try {\n    const executablePath = await chrome_aws_lambda__WEBPACK_IMPORTED_MODULE_0___default.a.executablePath;\n    const browser = await puppeteer_core__WEBPACK_IMPORTED_MODULE_1___default.a.launch({\n      args: chrome_aws_lambda__WEBPACK_IMPORTED_MODULE_0___default.a.args,\n      executablePath\n    });\n\n    const voterId = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(event, \"queryStringParameters.voterId\", null);\n\n    if (!voterId) {\n      return {\n        statusCode: 400,\n        body: JSON.stringify({\n          error: \"invalid or missing voterId\"\n        })\n      };\n    }\n\n    const page = await browser.newPage();\n    await page.goto(ceeUrl);\n    await page.evaluate(n => {\n      document.querySelector('input[name=\"txtNumElectoral\"]').value = n;\n    }, voterId);\n    await page.$eval('input[name=\"btnConsulta\"]', el => el.click());\n    await page.waitFor(2000);\n    const rawData = await page.evaluate(() => {\n      return Array.from(document.querySelector(\"#info\").children).reduce((acum, curr) => acum.concat(curr), []).map(t => t.innerText).reduce((acum, curr) => ({ ...acum,\n        [curr.split(\":\")[0]]: curr.split(\":\")[1].trim()\n      }), {});\n    });\n    const data = Object.keys(rawData).map(k => ({\n      [lodash__WEBPACK_IMPORTED_MODULE_2___default.a.camelCase(k)]: rawData[k]\n    })).reduce((acum, curr) => {\n      return { ...acum,\n        ...curr\n      };\n    }, {});\n    const precintos = JSON.parse((await S3.getObject({\n      Bucket: bucket,\n      Key: precintsFile,\n      ResponseContentType: \"application/json\"\n    }).promise()).Body.toString());\n    const counties = JSON.parse((await S3.getObject({\n      Bucket: bucket,\n      Key: countiesFile,\n      ResponseContentType: \"application/json\"\n    }).promise()).Body.toString());\n    const papeletas = JSON.parse((await S3.getObject({\n      Bucket: bucket,\n      Key: papeletasFile,\n      ResponseContentType: \"application/json\"\n    }).promise()).Body.toString());\n\n    const p = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(precintos, data.precinto, null);\n\n    let legislativo = p.papeleta.split(\"/\");\n    legislativo = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(legislativo[legislativo.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n\n    let municipal = counties[lodash__WEBPACK_IMPORTED_MODULE_2___default.a.camelCase(p.pueblo)].split(\"/\");\n\n    municipal = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(municipal[municipal.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n    let estatal = papeletas[0].papeletaLink.split(\"/\");\n    estatal = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(estatal[estatal.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n    const payload = { ...data,\n      pueblo: p.pueblo,\n      papeletas: {\n        legislativo,\n        municipal,\n        estatal\n      }\n    };\n    return {\n      statusCode: 200,\n      body: JSON.stringify(payload, null, 2)\n    };\n  } catch (e) {\n    console.log(e);\n    return {\n      statusCode: 500,\n      body: JSON.stringify(e)\n    };\n  }\n};\n\nconst getVoterStatus = _middy_core__WEBPACK_IMPORTED_MODULE_3___default()(handler).use(_middy_http_cors__WEBPACK_IMPORTED_MODULE_4___default()()).use(_middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_5___default()()).use(_middy_http_error_handler__WEBPACK_IMPORTED_MODULE_6___default()());\n\nconst getConsulta = async event => {\n  const voterId = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(event, \"queryStringParameters.voterId\", null);\n\n  if (!voterId) {\n    return {\n      statusCode: 400,\n      body: JSON.stringify({\n        error: \"invalid or missing voterId\"\n      })\n    };\n  }\n\n  const formURLFields = {\n    __EVENTTARGET: \"\",\n    __EVENTARGUMENT: \"\",\n    __VIEWSTATE: \"j8e9Ob/a0bGuyuMpEyF8NXnyvV13igDM7a2M5Kq0eXZZ7GF2wZHN66rB9tUtHjzluJd29d5Nx/Q8xPSonfTaxJZ4Xc72qbuiuhDF9pZcxtHC0SomzwyVFIxd/SNz/YKx\",\n    __VIEWSTATEGENERATOR: \"D331ABD5\",\n    __EVENTVALIDATION: \"IcbJ6MBc2CH2sWiUW2edrQ5IKWiYYHDIPAMPZZZteP2OdYiVeH40S/UQTGXAG6mYxZol/GsBtqkeOKXVYFsY4xg7BUJjk31QN0/1HQwJUeHH7t+fRYXZKjWOFWelJO4h56mtJS4js8c80KnMY/eZomzavt+J4bWW4Q7HJagvkOwge/E/yjogoPO3xeh2yX8R/5H6A71WMzY1Y+ICAT2t3jfJWum3jOpWY0a/I7ZMDs9flYk/07f4kpNd/J00/Wo5SPEmATld062Jde3jleuKLfadz1oMXKvZG0yLcrFUnBgIs6sDhhuLgCaHCzUiJ2HtlpGnZr4dJL0jgvCJS2szA78BzGKn2xZaEOjfTxIEWo2ZXUohXJg9ACUqy+/qQQg3wQg4lcmkBVlvKC+GK7wy5g==\",\n    txtNumElectoral: voterId,\n    btnConsulta: \"Buscar\",\n    txtNumeroElectoral: \"\",\n    txtFechaNacimiento: \"\",\n    txtNombreEvento: \"\",\n    txtFechaEvento: \"\",\n    txtPrecinto: \"\",\n    txtUnidad: \"\",\n    txtColegio: \"\",\n    txtEstatus: \"\",\n    txtPagina: \"\",\n    txtLinea: \"\",\n    txtCentro: \"\",\n    txtDireccion: \"\"\n  };\n  let resp;\n\n  try {\n    resp = await axios__WEBPACK_IMPORTED_MODULE_9___default()({\n      method: \"post\",\n      url: \"http://consulta.ceepur.org\",\n      data: qs__WEBPACK_IMPORTED_MODULE_8___default.a.stringify(formURLFields),\n      headers: {\n        \"Content-Type\": \"application/x-www-form-urlencoded;charset=utf-8\"\n      }\n    });\n  } catch (e) {\n    console.log(e);\n    return {\n      statusCode: 500,\n      body: \"Failed to fetch from consulta.ceepur.org\"\n    };\n  }\n\n  const root = Object(node_html_parser__WEBPACK_IMPORTED_MODULE_10__[\"parse\"])(resp.data);\n  const data = {\n    numeroElectoral: voterId,\n    precinto: lodash__WEBPACK_IMPORTED_MODULE_2___default.a.padStart(root.querySelector(\"#txtPrecinto\").rawAttributes.value, 3, \"0\"),\n    unidad: root.querySelector(\"#txtUnidad\").rawAttributes.value,\n    colegio: root.querySelector(\"#txtColegio\").rawAttributes.value,\n    pagina: root.querySelector(\"#txtPagina\").rawAttributes.value,\n    linea: root.querySelector(\"#txtLinea\").rawAttributes.value,\n    estatus: root.querySelector(\"#txtEstatus\").rawAttributes.value,\n    fechaDeNacimiento: root.querySelector(\"#txtFechaNacimiento\").rawAttributes.value,\n    centroDeVotacion: root.querySelector(\"#txtCentro\").rawAttributes.value,\n    direccion: root.querySelector(\"#txtDireccion\").text\n  };\n\n  if (!data.precinto) {\n    return {\n      statusCode: 404,\n      body: \"Voter Id not found\"\n    };\n  }\n\n  const precintos = JSON.parse((await S3.getObject({\n    Bucket: bucket,\n    Key: precintsFile,\n    ResponseContentType: \"application/json\"\n  }).promise()).Body.toString());\n  const counties = JSON.parse((await S3.getObject({\n    Bucket: bucket,\n    Key: countiesFile,\n    ResponseContentType: \"application/json\"\n  }).promise()).Body.toString());\n  const papeletas = JSON.parse((await S3.getObject({\n    Bucket: bucket,\n    Key: papeletasFile,\n    ResponseContentType: \"application/json\"\n  }).promise()).Body.toString());\n\n  const p = lodash__WEBPACK_IMPORTED_MODULE_2___default.a.get(precintos, data.precinto, null);\n\n  if (!p) {\n    return {\n      statusCode: 400,\n      body: \"Unable to find ballots for precint \" + data.precinto\n    };\n  }\n\n  let legislativo = p.papeleta.split(\"/\");\n  legislativo = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(legislativo[legislativo.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n\n  let municipal = counties[lodash__WEBPACK_IMPORTED_MODULE_2___default.a.camelCase(p.pueblo)].split(\"/\");\n\n  municipal = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(municipal[municipal.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n  let estatal = papeletas[0].papeletaLink.split(\"/\");\n  estatal = `${folder}/${lodash__WEBPACK_IMPORTED_MODULE_2___default.a.lowerCase(decodeURIComponent(estatal[estatal.length - 1].split(\".\").slice(0, -1).join(\".\"))).split(\" \").join(\"-\")}`;\n  const payload = { ...data,\n    pueblo: p.pueblo,\n    papeletas: {\n      legislativo,\n      municipal,\n      estatal\n    }\n  };\n  return {\n    statusCode: 200,\n    body: JSON.stringify(payload, null, 2)\n  };\n};\n\nconst consulta = _middy_core__WEBPACK_IMPORTED_MODULE_3___default()(getConsulta).use(_middy_http_cors__WEBPACK_IMPORTED_MODULE_4___default()()).use(_middy_do_not_wait_for_empty_event_loop__WEBPACK_IMPORTED_MODULE_5___default()()).use(_middy_http_error_handler__WEBPACK_IMPORTED_MODULE_6___default()());\n\n//# sourceURL=webpack:///./voterStatus.ts?");

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

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"aws-sdk\");\n\n//# sourceURL=webpack:///external_%22aws-sdk%22?");

/***/ }),

/***/ "axios":
/*!************************!*\
  !*** external "axios" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"axios\");\n\n//# sourceURL=webpack:///external_%22axios%22?");

/***/ }),

/***/ "chrome-aws-lambda":
/*!************************************!*\
  !*** external "chrome-aws-lambda" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"chrome-aws-lambda\");\n\n//# sourceURL=webpack:///external_%22chrome-aws-lambda%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "node-html-parser":
/*!***********************************!*\
  !*** external "node-html-parser" ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"node-html-parser\");\n\n//# sourceURL=webpack:///external_%22node-html-parser%22?");

/***/ }),

/***/ "puppeteer-core":
/*!*********************************!*\
  !*** external "puppeteer-core" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"puppeteer-core\");\n\n//# sourceURL=webpack:///external_%22puppeteer-core%22?");

/***/ }),

/***/ "qs":
/*!*********************!*\
  !*** external "qs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"qs\");\n\n//# sourceURL=webpack:///external_%22qs%22?");

/***/ })

/******/ });