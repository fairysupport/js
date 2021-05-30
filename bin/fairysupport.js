function ___fairysupport(){

    let scriptObj = document.getElementById("fs-js");

    let pageUrl = new URL(window.location.href);
    let reqLang = pageUrl.searchParams.get("lang")
    let confLang = window.navigator.language;
    let jsFwUrl = new URL(scriptObj.src);
    this.version = ('dataset' in scriptObj && 'version' in scriptObj.dataset) ? scriptObj.dataset.version : Date.now();
    let jsFwPath = jsFwUrl.origin + jsFwUrl.pathname.trim();
    let jsFwPathSplit = jsFwPath.split('/');
    let jsRoot = jsFwPath.substring(0, jsFwPath.length - jsFwPathSplit[jsFwPathSplit.length - 1].length);
    let moduleRoot = jsRoot + 'modules/';
    let componentRoot = jsRoot + 'components/';
    let templateRoot = jsRoot + 'templates/';

    this.clazz = {};
    this.controllerMethodList = {};
    this.controllerEventMethodList = {};

    this.componentControllerList = {};
    this.componentControllerMethodList = {};
    this.componentControllerEventMethodList = {};
    this.targetDomMap = new WeakMap();
    this.componentDomInitFuncMap = new Map();
    this.componentDomInitCntMap = new Map();
    this.componentDomInitTotalMap = new Map();
    this.componentDomComponentInitMarkMap = new Map();
    this.componentPackageList = {};
    this.eventMap = new Map();
    this.eventNameDataNameMap = new Map();

    this.bindDomInitFuncMap = new Map();
    this.bindDomInitCntMap = new Map();
    this.bindDomInitTotalMap = new Map();
    this.bindDomComponentInitMarkMap = new Map();

    let metaMap = new Map();

    let fsTimeout = ('dataset' in scriptObj && 'timeout' in scriptObj.dataset) ? scriptObj.dataset.timeout : 0;
    fsTimeout = fsTimeout - 0;

    let pageRoot = scriptObj.dataset.pageRoot;

    let envTxt = "";

    this.instanceMap = {};

    const msgObj = Object.create(null);
    const envValueObj = Object.create(null);

    const componentMsgObj = Object.create(null);
    const componentEnvValueObj = Object.create(null);

    if (!('fairysupportInitFail' in window)) {
        window.fairysupportInitFail = function (retryCount, error) {
            alert('network error');
            return false;
        }
    }
    if (!('fairysupportTemplateFail' in window)) {
        window.fairysupportTemplateFail = function (retryCount, error) {
            alert('network error');
            return false;
        }
    }
    if (!('fairysupportComponentFail' in window)) {
        window.fairysupportComponentFail = function (retryCount, error) {
            alert('network error');
            return false;
        }
    }

    let fairysupportClear = class FairysupportClear {
        constructor() {
        }
    };

    this.getEnv = function () {
        return envTxt;
    };

    let initEnvTxtFlg = false;
    this.initEnvTxt = function (val) {
        if (!initEnvTxtFlg) {
            envTxt = val;
        }
        initEnvTxtFlg = true;
    };

    let initEnvValueObjFlg = false;
    this.initEnvValueObj = function (jsonObj) {
        if (!initEnvValueObjFlg) {
            Object.assign(envValueObj, jsonObj);
        }
        initEnvValueObjFlg = true;
    };

    this.getModulePath = function (pageRoot, pageUrl) {

        let reqPath = pageUrl.origin + pageUrl.pathname.trim();

        let modulePath = '';
        let reqPathTail = reqPath.substring(pageRoot.length);
        let pathList = reqPathTail.split('/');
        for (let pathIdx = 0; pathIdx < pathList.length; pathIdx++) {
            if (pathList[pathIdx] === '') {
                continue;
            }
            if ((pathIdx + 1) >= pathList.length) {
                modulePath += pathList[pathIdx].split('.')[0];
            } else {
                modulePath += pathList[pathIdx] + '/';
            }
        }
        if (modulePath === '') {
            modulePath = 'index';
        }

        return modulePath;
    };

    this.init = function () {
        let modulePath = this.getModulePath(pageRoot, pageUrl);
        this.loadModuleReqMsg(jsRoot, this.version, modulePath, 0);
        return this;
    };

    this.loadModuleReqMsg = function (jsRoot, version, modulePath, retryCount){

        if (reqLang !== null && reqLang !== undefined && reqLang !== '') {

            let queryLangStr = '.' + reqLang;
            let req = this.ajax(jsRoot + 'msg/' + modulePath + '/msg' + queryLangStr + '.json' + '?' + version, null, 'GET', 'query');
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, jsRoot, version, modulePath, retryCount){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            Object.assign(msgObj, json);
                            fs.loadModuleController(version, moduleRoot, modulePath, 0);
                        } else if (404 === xhr.status) {
                            fs.loadModuleBrowserMsg(jsRoot, version, modulePath, 0);
                        } else {
                            let failResult = fairysupportInitFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadModuleReqMsg(jsRoot, version, modulePath, ++retryCount);
                            }
                        }
                    }
                }
            )(this, jsRoot, version, modulePath, retryCount);
            req.send();

        } else {
            this.loadModuleBrowserMsg(jsRoot, version, modulePath, 0);
        }

    };

    this.loadModuleBrowserMsg = function (jsRoot, version, modulePath, retryCount){

        if (confLang !== null && confLang !== undefined && confLang !== '') {

            let queryLangStr = '.' + confLang;
            let req = this.ajax(jsRoot + 'msg/' + modulePath + '/msg' + queryLangStr + '.json' + '?' + version, null, 'GET', 'query');
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, jsRoot, version, modulePath, retryCount){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            Object.assign(msgObj, json);
                            fs.loadModuleController(version, moduleRoot, modulePath, 0);
                        } else if (404 === xhr.status) {
                            fs.loadModuleDefaultMsg(jsRoot, version, modulePath, 0);
                        } else {
                            let failResult = fairysupportInitFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadModuleBrowserMsg(jsRoot, version, modulePath, ++retryCount);
                            }
                        }
                    }
                }
            )(this, jsRoot, version, modulePath, retryCount);
            req.send();

        } else {
            this.loadModuleDefaultMsg(jsRoot, version, modulePath, 0);
        }

    };

    this.loadModuleDefaultMsg = function (jsRoot, version, modulePath, retryCount){

        let req = this.ajax(jsRoot + 'msg/' + modulePath + '/msg.json' + '?' + version, null, 'GET', 'query');
        req.timeout = fsTimeout;
        req.onloadend = (function(fs, jsRoot, version, modulePath, retryCount){
                return function (e, xhr) {
                    if (200 === xhr.status) {
                        let json = xhr.response;
                        Object.assign(msgObj, json);
                        fs.loadModuleController(version, moduleRoot, modulePath, 0);
                    } else if (404 === xhr.status) {
                        fs.loadModuleController(version, moduleRoot, modulePath, 0);
                    } else {
                        let failResult = fairysupportInitFail(retryCount, xhr);
                        if (failResult) {
                            fs.loadModuleDefaultMsg(jsRoot, version, modulePath, ++retryCount);
                        }
                    }
                }
            }
        )(this, jsRoot, version, modulePath, retryCount);
        req.send();

    };

    this.loadModuleController = function (version, moduleRoot, modulePath, retryCount){

        let moduleFullPath = moduleRoot + modulePath + '.js';
        let moduleControllerUrl = moduleFullPath + '?' + version;

        import(moduleControllerUrl)
        .then(this.getControllerLoader(this, modulePath))
        .catch((function(version, moduleRoot, modulePath, retryCount){
                return function (err) {
                    let failResult = fairysupportInitFail(retryCount, err);
                    if (failResult) {
                        fs.loadModuleController(version, moduleRoot, modulePath, ++retryCount);
                    }
                }
            }
        )(version, moduleRoot, modulePath, retryCount))
        ;

    };

    this.getControllerLoader = function (fs, modulePath){
        return function (Module){
            let classFullName = 'modules/' + modulePath;
            if (!fs.instanceMap[classFullName]) {

                fs.initEnvTxt(Module.__fairysupport__envTxt);
                fs.initEnvValueObj(Module.__fairysupport__envValueObj);

                let modulePathSplit = modulePath.split('/');
                let moduleClass = fs.getCamel(modulePathSplit[modulePathSplit.length - 1]);
                fs.clazz.obj = new Module[moduleClass]();
                fs.instanceMap[classFullName] = fs.clazz.obj;
                fs.controllerMethodList = fs.getMethodList(fs.clazz.obj);

                for (let met in fs.controllerMethodList) {
                    let metSplit = met.split('_');
                    if (metSplit.length > 1) {
                        let metPrefix = '';
                        for (let i = 0; i < (metSplit.length - 1); i++) {
                            metPrefix += metSplit[i] + '_';
                        }
                        metPrefix = metPrefix.substring(0, metPrefix.length - 1);
                        if (!(fs.controllerEventMethodList[metPrefix])) {
                            fs.controllerEventMethodList[metPrefix] = [];
                        }
                        fs.controllerEventMethodList[metPrefix].push(metSplit[metSplit.length - 1]);
                    }
                }

            }

            fs.binder(fs);
            let moduleControllerInitFunc = fs.getControllerMethod(fs, 'init', null);

            let moduleInitMark = ('init' in fs.controllerMethodList ? true : false);
            let initFuncRet = null;
            try {
                initFuncRet = moduleControllerInitFunc();
            } catch(exception) {
                if (moduleInitMark && fs.clazz.obj.errorHandle && typeof fs.clazz.obj.errorHandle === 'function') {
                    fs.clazz.obj.errorHandle(null, exception);
                } else {
                    throw exception;
                }
            } finally {
                if (moduleInitMark && fs.clazz.obj.finalHandle && typeof fs.clazz.obj.finalHandle === 'function') {
                    fs.clazz.obj.finalHandle(null, initFuncRet);
                }
            }
            
        };
    };

    this.binder = function (fs){
        let bodyObj = document.getElementsByTagName("BODY");
        let observer = new MutationObserver((records, obj) => {
            for (let record of records) {
                if (record.type === 'attributes') {

                    if (record.attributeName === 'data-obj') {
                        fs.removeControllerSingleObjOnlyValue(record.target, record.oldValue);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset !== undefined) {
                            let bindObj = dataset.obj;
                            fs.bindControllerSingleObj(record.target, bindObj);
                        }
                    }
                    if (record.attributeName === 'data-list') {
                        fs.removeControllerSingleListOnlyValue(record.target, record.oldValue);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset !== undefined) {
                            let bindList = dataset.list;
                            fs.bindControllerSingleList(record.target, bindList);
                        }
                    }
                    if (record.attributeName === 'data-name') {
                        fs.removeControllerSingleEvent(record.target, record.oldValue);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset !== undefined) {
                            let name = dataset.name;
                            fs.bindControllerSingleEvent(record.target, name);
                        }
                    }

                    for (let targetInfoKey in fs.componentPackageList) {

                        let targetInfoValue = fs.componentPackageList[targetInfoKey];

                        let componentPath = targetInfoValue['componentPath'];
                        let componentHyphen = targetInfoValue['componentHyphen'];
                        let componentCamel = targetInfoValue['componentCamel'];

                        if (record.attributeName === 'data-' + componentHyphen + '-obj') {
                            fs.removeComponentSingleObjOnlyValue(record.target, record.oldValue, componentPath);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset !== undefined) {
                                let compObj = dataset[componentCamel + 'Obj'];
                                fs.bindComponentSingleObj(record.target, compObj, componentPath);
                            }
                        }
                        if (record.attributeName === 'data-' + componentHyphen + '-list') {
                            fs.removeComponentSingleListOnlyValue(record.target, record.oldValue, componentPath);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset !== undefined) {
                                let compList = dataset[componentCamel + 'List'];
                                fs.bindComponentSingleList(record.target, compList, componentPath);
                            }
                        }
                        if (record.attributeName === 'data-' + componentHyphen + '-name') {
                            fs.removeComponentSingleEvent(record.target, record.oldValue, componentPath);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset !== undefined) {
                                let compName = dataset[componentCamel + 'Name'];
                                fs.bindComponentSingleEvent(record.target, compName, componentPath);
                            }
                        }

                    }

                } else if (record.type === 'childList') {
                    let initFunc = null;
                    let bindCb = null;
                    for (let i = 0; i < record.removedNodes.length; i++) {
                        fs.removeAllNest(record.removedNodes.item(i));
                    }
                    for (let i = 0; i < record.addedNodes.length; i++) {
                        fs.bindAllNest(record.addedNodes.item(i));

                        if (fs.componentDomInitFuncMap.has(record.addedNodes.item(i))) {
                            initFunc = fs.componentDomInitFuncMap.get(record.addedNodes.item(i));
                            fs.componentDomInitFuncMap.delete(record.addedNodes.item(i));
                            fs.componentDomInitCntMap.set(initFunc, fs.componentDomInitCntMap.get(initFunc) + 1);
                            if (fs.componentDomInitCntMap.get(initFunc) === fs.componentDomInitTotalMap.get(initFunc)) {
                                let componentInitMark = fs.componentDomComponentInitMarkMap.get(initFunc);
                                
                                fs.componentDomInitCntMap.delete(initFunc);
                                fs.componentDomInitTotalMap.delete(initFunc);
                                fs.componentDomComponentInitMarkMap.delete(initFunc);
                                let initFuncRet = null;
                                try {
                                    initFuncRet = initFunc();
                                } catch(exception) {
                                    if (componentInitMark && fs.clazz.obj.errorHandle && typeof fs.clazz.obj.errorHandle === 'function') {
                                        fs.clazz.obj.errorHandle(null, exception);
                                    } else {
                                        throw exception;
                                    }
                                } finally {
                                    if (componentInitMark && fs.clazz.obj.finalHandle && typeof fs.clazz.obj.finalHandle === 'function') {
                                        fs.clazz.obj.finalHandle(null, initFuncRet);
                                    }
                                }
                            }
                        }

                        if (fs.bindDomInitFuncMap.has(record.addedNodes.item(i))) {
                            bindCb = fs.bindDomInitFuncMap.get(record.addedNodes.item(i));
                            fs.bindDomInitFuncMap.delete(record.addedNodes.item(i));
                            fs.bindDomInitCntMap.set(bindCb, fs.bindDomInitCntMap.get(bindCb) + 1);
                            if (fs.bindDomInitCntMap.get(bindCb) === fs.bindDomInitTotalMap.get(bindCb)) {
                                let componentInitMark = fs.bindDomComponentInitMarkMap.get(bindCb);
                                
                                fs.bindDomInitCntMap.delete(bindCb);
                                fs.bindDomInitTotalMap.delete(bindCb);
                                fs.bindDomComponentInitMarkMap.delete(bindCb);
                                
                                let initFuncRet = null;
                                try {
                                    initFuncRet = bindCb();
                                } catch(exception) {
                                    if (componentInitMark && fs.clazz.obj.errorHandle && typeof fs.clazz.obj.errorHandle === 'function') {
                                        fs.clazz.obj.errorHandle(null, exception);
                                    } else {
                                        throw exception;
                                    }
                                } finally {
                                    if (componentInitMark && fs.clazz.obj.finalHandle && typeof fs.clazz.obj.finalHandle === 'function') {
                                        fs.clazz.obj.finalHandle(null, initFuncRet);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        let config = {attributes: true, childList: true, subtree: true , attributeOldValue: true};
        observer.observe(bodyObj[0], config);
        fs.bindBody();
    };

    this.addInitFuncForAfterObserver = function (viewDom, initFunc, componentInitMark){

        let childList = viewDom.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            this.bindDomComponentInitMarkMap.set(initFunc, componentInitMark);
            this.bindDomInitCntMap.set(initFunc, 0);
            this.bindDomInitTotalMap.set(initFunc, childList.length);
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindDomInitFuncMap.set(child, initFunc);
            }
        }

    };

    this.bindBody = function (){
        let body = document.getElementsByTagName("BODY") ? document.getElementsByTagName("BODY")[0] : null;
        if (body) {
            this.bindAllNest(body);
        }
    };

    this.bindAllNest = function (obj){
        if (obj === null || obj === undefined) {
            return;
        }
        this.bindAllSingle(obj, null);
        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindAllNest(child);
            }
        }
    };

    this.bindAllSingle = function (obj, func){
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset.obj;
            let bindList = dataset.list;
            let name = dataset.name;

            if (obj !== null && obj !== undefined) {
                if ((bindObj !== null && bindObj !== undefined) || (bindList !== null && bindList !== undefined) || (name !== null && name !== undefined)) {
                    this.addTargetDom(obj, null);
                }
            }

            if (this.targetDomMap.has(obj)) {
                this.bindControllerSingleObj(obj, bindObj);
                this.bindControllerSingleList(obj, bindList);
                this.bindControllerSingleEvent(obj, name);
            }

            for (let targetInfoKey in this.componentPackageList) {

                let targetInfoValue = this.componentPackageList[targetInfoKey];
                let componentPath = targetInfoValue['componentPath'];
                let componentCamel = targetInfoValue['componentCamel'];

                this.addTargetDomForComponent(obj, targetInfoValue);
                if (!this.targetDomMap.has(obj)) {
                    continue;
                }

                bindObj = dataset[componentCamel + 'Obj'];
                bindList = dataset[componentCamel + 'List'];
                name = dataset[componentCamel + 'Name'];

                if (bindObj !== null && bindObj !== undefined) {
                    this.bindComponentSingleObj(obj, bindObj, componentPath);
                }

                if (bindList !== null && bindList !== undefined) {
                    this.bindComponentSingleList(obj, bindList, componentPath);
                }

                if (name !== null && name !== undefined) {
                    this.bindComponentSingleEvent(obj, name, componentPath);
                }

            }

            if (func !== null && func !== undefined) {
                func(obj);
            }

        }
    };

    this.bindControllerSingleObj = function (dom, bindStr){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined) {
            this.execControllerMethod('beforeBindObj', {'name': bindStr, 'value': dom});
            let s = new Set();
            s.add(dom);
            let beforeMet = this.getControllerMethodInputArgs(this, 'beforeRemoveObj');
            let afterMet = this.getControllerMethodInputArgs(this, 'afterRemoveObj');
            let getFunc = (function(s){
                                            return function(){
                                                for (let value of s.values()) {
                                                    return value;
                                                }
                                                return null;
                                            };
                                        }
                           )(s);
            let setFunc = (function(s, bindStr, beforeMet, afterMet, fairysupportClear){
                                            return function(newElement){
                                                currentElement = null;
                                                for (let value of s.values()) {
                                                    currentElement = value;
                                                    break;
                                                }
                                                if (currentElement) {
                                                    beforeMet({'name': bindStr, 'value': currentElement});
                                                    s.clear();
                                                    if (currentElement.parentNode && !(newElement instanceof fairysupportClear)) {
                                                        if (newElement === null || newElement=== undefined) {
                                                            currentElement.parentNode.removeChild(currentElement);
                                                        } else {
                                                            currentElement.parentNode.replaceChild(newElement, currentElement);
                                                        }
                                                    }
                                                    afterMet({'name': bindStr, 'value': currentElement});
                                                }
                                            };
                                        }
                            )(s, bindStr, beforeMet, afterMet, fairysupportClear);
            Object.defineProperty(this.clazz.obj, bindStr, {
                enumerable: true,
                configurable: true,
                get: getFunc,
                set : setFunc
            });
            this.execControllerMethod('afterBindObj', {'name': bindStr, 'value': dom});
        }
    }

    this.bindControllerSingleList = function (dom, bindList){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.clazz.obj[bindList] === null || this.clazz.obj[bindList] === undefined) {
                let beforeMet = this.getControllerMethodInputArgs(this, 'beforeRemoveList');
                let afterMet = this.getControllerMethodInputArgs(this, 'afterRemoveList');
                let addBeforeFn = this.getControllerMethodInputArgs(this, 'beforeBindList');
                let addAfterFn = this.getControllerMethodInputArgs(this, 'afterBindList');
                this.clazz.obj[bindList] = new this.elementList(bindList, beforeMet, afterMet, addBeforeFn, addAfterFn, fairysupportClear);
            }
            this.clazz.obj[bindList].add(dom);
        }
    }

    this.bindControllerSingleEvent = function (dom, name){
        if (dom !== null && dom !== undefined && name !== null && name !== undefined) {
            this.setEventFunction(name, this.clazz.obj, this.controllerMethodList, dom, this.controllerEventMethodList, this.clazz.obj);
        }
    }

    this.execMethod = function (obj, methodList, methodName, argList){
        if (methodList[methodName]) {
            if (argList === null || argList === undefined) {
                let ret = null;
                try {
                    ret = obj[methodName]();
                } catch(exception) {
                    if (this.clazz.obj.errorHandle && typeof this.clazz.obj.errorHandle === 'function') {
                        this.clazz.obj.errorHandle(null, exception);
                    } else {
                        throw exception;
                    }
                } finally {
                    if (this.clazz.obj.finalHandle && typeof this.clazz.obj.finalHandle === 'function') {
                        this.clazz.obj.finalHandle(null, ret);
                    }
                }
                return ret;
            } else {
                let ret = null;
                try {
                    ret = obj[methodName](argList);
                } catch(exception) {
                    if (this.clazz.obj.errorHandle && typeof this.clazz.obj.errorHandle === 'function') {
                        this.clazz.obj.errorHandle(null, exception);
                    } else {
                        throw exception;
                    }
                } finally {
                    if (this.clazz.obj.finalHandle && typeof this.clazz.obj.finalHandle === 'function') {
                        this.clazz.obj.finalHandle(null, ret);
                    }
                }
                return ret;
            }
        }
        return null;
    };

    this.execControllerMethod = function (methodName, argList){
        return this.execMethod(this.clazz.obj, this.controllerMethodList, methodName, argList);
    };

    this.getExecMethod = function (fs, obj, methodList, methodName, argList){
        return function (){
            return fs.execMethod(obj, methodList, methodName, argList);
        }
    };

    this.getControllerMethod = function (fs, methodName, argList){
        return function(){
            return fs.execControllerMethod(methodName, argList);
        }
    };

    this.getControllerMethodInputArgs = function (fs, methodName){
        return function(argList){
            return fs.execControllerMethod(methodName, argList);
        }
    };

    this.getMethodList = function (obj){
        let methodNameList = {};
        // let protoObj = Object.getPrototypeOf(obj);
        let protoObj = obj;
        let parentProtoObj = null;
        while (protoObj !== null && protoObj !== undefined) {
            parentProtoObj = Object.getPrototypeOf(protoObj);
            if (parentProtoObj === null || parentProtoObj === undefined) {
                break;
            }
            let protoNameList = Object.getOwnPropertyNames(protoObj)
            if (protoNameList) {
                for (let protoName of protoNameList) {
                    if (typeof obj[protoName] === 'function') {
                        methodNameList[protoName] = obj[protoName].bind(obj);
                    }
                }
            }
            protoObj = parentProtoObj;
        }
        return methodNameList;
    };

    this.removeAllNest = function (obj){
        if (obj === null || obj === undefined) {
            return;
        }
        this.removeAllSingle(obj);
        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.removeAllNest(child);
            }
        }
    };

    this.removeAllSingle = function (obj){
        this.deleteMeta(obj);
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset.obj;
            let bindList = dataset.list;
            let name = dataset.name;

            if (!this.targetDomMap.has(obj)) {
                return;
            }

            if (bindObj !== null && bindObj !== undefined) {
                this.removeControllerSingleObj(obj, bindObj);
            }
            if (bindList !== null && bindList !== undefined) {
                this.removeControllerSingleList(obj, bindList);
            }
            if (name !== null && name !== undefined) {
                this.removeControllerSingleEvent(obj, name);
            }

            let targetInfo = this.targetDomMap.get(obj);
            for (let targetInfoKey in targetInfo) {

                let targetInfoValue = targetInfo[targetInfoKey];
                let componentPath = targetInfoValue['componentPath'];
                let componentCamel = targetInfoValue['componentCamel'];

                bindObj = dataset[componentCamel + 'Obj'];
                bindList = dataset[componentCamel + 'List'];
                name = dataset[componentCamel + 'Name'];

                if (bindObj !== null && bindObj !== undefined) {
                    this.removeComponentSingleObj(obj, bindObj, componentPath);
                }

                if (bindList !== null && bindList !== undefined) {
                    this.removeComponentSingleList(obj, bindList, componentPath);
                }

                if (name !== null && name !== undefined) {
                    this.removeComponentSingleEvent(obj, name, componentPath);
                }

            }

        }
    };

    this.removeControllerSingleObjOnlyValue = function (dom, bindStr){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined && this.clazz.obj[bindStr] === dom) {
            this.clazz.obj[bindStr] = new fairysupportClear();
        }
    };

    this.removeControllerSingleObj = function (dom, bindStr){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined && this.clazz.obj[bindStr] === dom) {
            this.clazz.obj[bindStr] = null;
        }
    };

    this.removeControllerSingleListOnlyValue = function (dom, bindList){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.clazz.obj[bindList] !== undefined && this.clazz.obj[bindList].has && this.clazz.obj[bindList].has(dom)) {
                this.clazz.obj[bindList].replace(dom, new fairysupportClear());
            }
        }
    };

    this.removeControllerSingleList = function (dom, bindList){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.clazz.obj[bindList] !== undefined && this.clazz.obj[bindList].has && this.clazz.obj[bindList].has(dom)) {
                this.clazz.obj[bindList].remove(dom);
            }
        }
    };

    this.removeControllerSingleEvent = function (dom, name){
        if (dom !== null && dom !== undefined && name !== null && name !== undefined) {
            this.removeEventFunction(name, this.clazz.obj, this.controllerMethodList, dom);
        }
    };

    this.loadComponentReqMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount){

        if (reqLang !== null && reqLang !== undefined && reqLang !== '') {

            let queryLangStr = '.' + reqLang;
            let req = this.ajax(componentRoot + componentValueMap['componentPath'] + '/msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            if (!(componentValueMap['componentPackeage'] in componentMsgObj)) {
                                componentMsgObj[componentValueMap['componentPackeage']] = Object.create(null);
                            }
                            Object.assign(componentMsgObj[componentValueMap['componentPackeage']], json);
                            nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj);
                        } else if (404 === xhr.status) {
                            fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0);
                        } else {
                            let failResult = fairysupportComponentFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount);
                            }
                        }
                    }
                }
            )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj);
            req.send();

        } else {
            fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0);
        }

    };

    this.loadComponentBrowserMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount){

        if (confLang !== null && confLang !== undefined && confLang !== '') {

            let queryLangStr = '.' + confLang;
            let req = this.ajax(componentRoot + componentValueMap['componentPath'] + '/msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            if (!(componentValueMap['componentPackeage'] in componentMsgObj)) {
                                componentMsgObj[componentValueMap['componentPackeage']] = Object.create(null);
                            }
                            Object.assign(componentMsgObj[componentValueMap['componentPackeage']], json);
                            nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj);
                        } else if (404 === xhr.status) {
                            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0);
                        } else {
                            let failResult = fairysupportComponentFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount);
                            }
                        }
                    }
                }
            )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj);
            req.send();

        } else {
            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0);
        }

    };

    this.loadComponentDefaultMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount){

        let req = this.ajax(componentRoot + componentValueMap['componentPath'] + '/msg.json' + '?' + fs.version, null, 'GET', 'query');
        req.timeout = fsTimeout;
        req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj){
                return function (e, xhr) {
                    if (200 === xhr.status) {
                        let json = xhr.response;
                        if (!(componentValueMap['componentPackeage'] in componentMsgObj)) {
                            componentMsgObj[componentValueMap['componentPackeage']] = Object.create(null);
                        }
                        Object.assign(componentMsgObj[componentValueMap['componentPackeage']], json);
                        nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj);
                    } else if (404 === xhr.status) {
                        nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj);
                    } else {
                        let failResult = fairysupportComponentFail(retryCount, xhr);
                        if (failResult) {
                            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj);
        req.send();

    };

    this.singleComponentInsertFunc = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr){

        this.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, this.singleComponentInsertFuncExec.bind(fs), 0);

    };

    this.singleComponentInsertFuncExec = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        let func = function () {};
        if (cb !== null && cb !== undefined && typeof cb === 'function') {
            func = cb;
        }

        import(componentControllerPath + '?' + fs.version)
        .then(fs.loadSingleComponentControllerMethodList(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj))
        .catch((function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount){
                return function (err) {
                    let failResult = fairysupportComponentFail(retryCount, err);
                    if (failResult) {
                        fs.singleComponentInsertFuncExec(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, ++retryCount);
                    } else {
                        if (errCb !== null && errCb !== undefined) {
                            errCb(err);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount))
        ;

    };

    this.loadSingleComponentControllerMethodList = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj){
        return function (Module){

            if (!(componentValueMap['componentPackeage'] in componentEnvValueObj)) {
                componentEnvValueObj[componentValueMap['componentPackeage']] = Object.create(null);
            }
            Object.assign(componentEnvValueObj[componentValueMap['componentPackeage']], Module.__fairysupport__envValueObj);

            if (viewStr === undefined || viewStr === null) {
                viewStr = Module.__fairysupport__viewStr;
            }

            let componentPath = componentValueMap['componentPath'];
            let classFullName = 'components/' + componentPath.substring(0, componentPath.length - 1);
            if (!fs.instanceMap[classFullName]) {

                let componentPathSplit = componentPath.split('/');
                let componentClass = fs.getCamel(componentPathSplit[componentPathSplit.length - 2]);
                fs.componentControllerList[componentPath] = new Module[componentClass]();
                fs.instanceMap[classFullName] = fs.componentControllerList[componentPath];
                fs.componentControllerMethodList[componentPath] = fs.getMethodList(fs.componentControllerList[componentPath]);

                if (!(fs.componentControllerEventMethodList[componentPath])) {
                    fs.componentControllerEventMethodList[componentPath] = {};
                }
                for (let met in fs.componentControllerMethodList[componentPath]) {
                    let metSplit = met.split('_');
                    if (metSplit.length > 1) {
                        let metPrefix = '';
                        for (let i = 0; i < (metSplit.length - 1); i++) {
                            metPrefix += metSplit[i] + '_';
                        }
                        metPrefix = metPrefix.substring(0, metPrefix.length - 1);
                        if (!(fs.componentControllerEventMethodList[componentPath][metPrefix])) {
                            fs.componentControllerEventMethodList[componentPath][metPrefix] = [];
                        }
                        fs.componentControllerEventMethodList[componentPath][metPrefix].push(metSplit[metSplit.length - 1]);
                    }
                }
            }

            let insertComponentFunc = fs.getInsertComponent(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb);
            insertComponentFunc();

        };
    };

    this.getInsertComponent = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb){
        return function (){

            let cb = (function (fs, dom, componentValueMap, argObj, func, position) {
                return function(viewDom) {

                    let initFunc = fs.getComponentMethod(fs, componentValueMap['componentPath'], 'init', argObj, func);

                    let childList = viewDom.childNodes;
                    let child = null;
                    if (childList !== null && childList !== undefined) {
                        fs.componentDomInitCntMap.set(initFunc, 0);
                        fs.componentDomInitTotalMap.set(initFunc, childList.length);
                        if ('init' in fs.componentControllerMethodList[componentValueMap['componentPath']]) {
                            fs.componentDomComponentInitMarkMap.set(initFunc, true);
                        } else {
                            fs.componentDomComponentInitMarkMap.set(initFunc, false);
                        }
                        
                        for (let i = 0; i < childList.length; i++) {
                            child = childList.item(i);
                            fs.addComponentTargetDomNest(child, componentValueMap);
                            fs.componentDomInitFuncMap.set(child, initFunc);
                        }
                    }

                    if ('before' === position && dom.parentNode) {
                        dom.parentNode.insertBefore(viewDom, dom);
                    } else if ('after' === position && dom.parentNode) {
                        if (dom.nextSibling === null || dom.nextSibling === undefined) {
                            dom.parentNode.appendChild(viewDom);
                        } else {
                            dom.parentNode.insertBefore(viewDom, dom.nextSibling);
                        }
                    } else if ('append' === position) {
                        dom.appendChild(viewDom);
                    } else {
                        dom.innerHTML = "";
                        dom.appendChild(viewDom);
                    }

                };
            })(fs, dom, componentValueMap, argObj, func, position);

            fs.getTplDom(viewStr, argObj, errCb, cb);

        };
    };

    this.addTargetDomForComponent = function (obj, componentValueMap){
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset[componentValueMap['componentCamel'] + 'Obj'];
            let bindList = dataset[componentValueMap['componentCamel'] + 'List'];
            let name = dataset[componentValueMap['componentCamel'] + 'Name'];
            if ((bindObj !== null && bindObj !== undefined) || (bindList !== null && bindList !== undefined) || (name !== null && name !== undefined)) {
                this.addTargetDom(obj, componentValueMap);
            }
        }
    };

    this.addComponentTargetDomNest = function (obj, componentValueMap){
        if (obj === null || obj === undefined) {
            return;
        }

        this.addTargetDomForComponent(obj, componentValueMap);

        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.addComponentTargetDomNest(child, componentValueMap);
            }
        }
    };

    this.bindComponentSingleObj = function (dom, bindStr, componentPath){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined) {
            this.execComponentMethod(componentPath, 'beforeBindObj', {'name': bindStr, 'value': dom});
            let s = new Set();
            s.add(dom);
            let beforeMet = this.getComponentMethodInputArgs(this, componentPath, 'beforeRemoveObj');
            let afterMet = this.getComponentMethodInputArgs(this, componentPath, 'afterRemoveObj');
            let getFunc = (function(s){
                                            return function(){
                                                for (let value of s.values()) {
                                                    return value;
                                                }
                                                return null;
                                            };
                                        }
                           )(s);
            let setFunc = (function(s, bindStr, beforeMet, afterMet, fairysupportClear){
                                            return function(newElement){
                                                currentElement = null;
                                                for (let value of s.values()) {
                                                    currentElement = value;
                                                    break;
                                                }
                                                if (currentElement) {
                                                    beforeMet({'name': bindStr, 'value': currentElement});
                                                    s.clear();
                                                    if (currentElement.parentNode && !(newElement instanceof fairysupportClear)) {
                                                        if (newElement === null || newElement=== undefined) {
                                                            currentElement.parentNode.removeChild(currentElement);
                                                        } else if (newElement instanceof Node) {
                                                            currentElement.parentNode.replaceChild(newElement, currentElement);
                                                        }
                                                    }
                                                    afterMet({'name': bindStr, 'value': currentElement});
                                                }
                                            };
                                        }
                            )(s, bindStr, beforeMet, afterMet, fairysupportClear);
            Object.defineProperty(this.componentControllerList[componentPath], bindStr, {
                enumerable: true,
                configurable: true,
                get: getFunc,
                set : setFunc
            });
            this.execComponentMethod(componentPath, 'afterBindObj', {'name': bindStr, 'value': dom});
        }
    }

    this.bindComponentSingleList = function (dom, bindList, componentPath){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.componentControllerList[componentPath][bindList] === null || this.componentControllerList[componentPath][bindList] === undefined) {
                let beforeMet = this.getComponentMethodInputArgs(this, componentPath, 'beforeRemoveList');
                let afterMet = this.getComponentMethodInputArgs(this, componentPath, 'afterRemoveList');
                let addBeforeFn = this.getComponentMethodInputArgs(this, componentPath, 'beforeBindList');
                let addAfterFn = this.getComponentMethodInputArgs(this, componentPath, 'afterBindList');
                this.componentControllerList[componentPath][bindList] = new this.elementList(bindList, beforeMet, afterMet ,addBeforeFn ,addAfterFn, fairysupportClear);
            }
            this.componentControllerList[componentPath][bindList].add(dom);
        }
    }

    this.bindComponentSingleEvent = function (dom, name, componentPath){
        if (dom !== null && dom !== undefined && name !== null && name !== undefined) {
            this.setEventFunction(name, this.componentControllerList[componentPath], this.componentControllerMethodList[componentPath], dom, this.componentControllerEventMethodList[componentPath], this.clazz.obj);
        }
    }

    this.execComponentMethod = function (componentPath, methodName, argList){
        return this.execMethod(this.componentControllerList[componentPath], this.componentControllerMethodList[componentPath], methodName, argList);
    };

    this.getComponentMethod = function (fs, componentPath, methodName, argList, func){
        return function(){
            let ret = fs.execComponentMethod(componentPath, methodName, argList);
            func();
            return ret;
        };
    };

    this.getComponentMethodInputArgs = function (fs, componentPath, methodName){
        return function(argList){
            return fs.execComponentMethod(componentPath, methodName, argList);
        };
    };

    this.removeComponentSingleObjOnlyValue = function (dom, bindStr, componentPath){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined && this.componentControllerList[componentPath] !== undefined && this.componentControllerList[componentPath][bindStr] === dom) {
            this.componentControllerList[componentPath][bindStr] = new fairysupportClear();
        }
    };

    this.removeComponentSingleObj = function (dom, bindStr, componentPath){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined && this.componentControllerList[componentPath] !== undefined && this.componentControllerList[componentPath][bindStr] === dom) {
            this.componentControllerList[componentPath][bindStr] = null;
        }
    };

    this.removeComponentSingleListOnlyValue = function (dom, bindList, componentPath){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.componentControllerList[componentPath] !== undefined && this.componentControllerList[componentPath][bindList] !== undefined && this.componentControllerList[componentPath][bindList].has && this.componentControllerList[componentPath][bindList].has(dom)) {
                this.componentControllerList[componentPath][bindList].replace(dom, new fairysupportClear());
            }
        }
    };

    this.removeComponentSingleList = function (dom, bindList, componentPath){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (this.componentControllerList[componentPath] !== undefined && this.componentControllerList[componentPath][bindList] !== undefined && this.componentControllerList[componentPath][bindList].has && this.componentControllerList[componentPath][bindList].has(dom)) {
                this.componentControllerList[componentPath][bindList].remove(dom);
            }
        }
    };

    this.removeComponentSingleEvent = function (dom, name, componentPath){
        if (dom !== null && dom !== undefined && name !== null && name !== undefined) {
            this.removeEventFunction(name, this.componentControllerList[componentPath], this.componentControllerMethodList[componentPath], dom);
        }
    };

    this.getComponentValue = function (componentPackeage){

        componentPackeage = componentPackeage.trim();
        let componentPath = '';
        let componentCamel = '';
        let componentHyphen = '';
        let componentNameList = componentPackeage.split('.');
        for (let componentName of componentNameList) {
            if (componentName.trim() === '') {
                continue;
            }
            componentPath += (componentName + '/');
            componentCamel += (componentName.substring(0, 1).toUpperCase() + componentName.substring(1));
            componentHyphen += (componentName + '-');
        }
        componentCamel = componentCamel.substring(0, 1).toLowerCase() + componentCamel.substring(1);
        componentHyphen = componentHyphen.substring(0, componentHyphen.length - 1);
        return {'componentPath':componentPath, 'componentPackeage':componentPackeage, 'componentCamel':componentCamel, 'componentHyphen':componentHyphen};

    };

    this.addTargetDom = function (dom, componentValueMap) {
        if (!this.targetDomMap.has(dom)) {
            this.targetDomMap.set(dom, {});
        }
        if (componentValueMap !== null && componentValueMap !== undefined) {
            let targetInfo = this.targetDomMap.get(dom)
            targetInfo[componentValueMap['componentPackeage']] = componentValueMap;
            this.componentPackageList[componentValueMap['componentPackeage']] = componentValueMap;
        }
    };

    this.elementList = class FairysupportObjList {
        constructor(bindList, beforeFn, afterFn, addBeforeFn, addAfterFn, fairysupportClear) {
            this.objMap = new Map();
            this.bindListStr = bindList;
            this.beforeMet = beforeFn;
            this.afterMet = afterFn;
            this.addBeforeMet = addBeforeFn;
            this.addAfterMet = addAfterFn;
            this.fairysupportClear = fairysupportClear;
        }
        size() {
            return this.objMap.size;
        }
        has(element) {
            return this.objMap.has(element);
        }
        add(element) {
            this.addBeforeMet({'name': this.bindListStr, 'value': element});
            this.objMap.set(element, element);
            this.addAfterMet({'name': this.bindListStr, 'value': element});
            return this;
        }
        replace(oldElement, newElement) {
            this.beforeMet({'name': this.bindListStr, 'value': oldElement});
            this.objMap.delete(oldElement);
            if (oldElement) {
                if (oldElement.parentNode && !(newElement instanceof fairysupportClear)) {
                    if (newElement === null || newElement=== undefined) {
                        oldElement.parentNode.removeChild(oldElement);
                    } else if (newElement instanceof Node) {
                        oldElement.parentNode.replaceChild(newElement, oldElement);
                    }
                }
            }
            this.afterMet({'name': this.bindListStr, 'value': oldElement});
            return this;
        }
        remove(element) {
            this.beforeMet({'name': this.bindListStr, 'value': element});
            this.objMap.delete(element);
            if (element && element.parentNode && !(element instanceof fairysupportClear)) {
                element.parentNode.removeChild(element);
            }
            this.afterMet({'name': this.bindListStr, 'value': element});
            return this;
        }
        values() {
            return this.objMap.values();
        }
        forEach(fn, arg = null){
            if (arg === null) {
                for (let value of this.objMap.values()) {
                    fn(value);
                }
            } else {
                for (let value of this.objMap.values()) {
                    fn(value, arg);
                }
            }
        }
    };

    this.setEventFunction = function(dataFullName, classObj, methodList, dom, eventMethodList, moduleClassObj){
        let trimDataFullName = '';
        let trimDataNameList = [];
        let dataFullNameSplit = dataFullName.split(',');
        for (let i = 0; i < dataFullNameSplit.length; i++) {
            let trimDataName = dataFullNameSplit[i].trim();
            trimDataNameList.push(trimDataName);
            trimDataFullName += trimDataName + ',';
        }
        if (this.eventMap.has(classObj) && this.eventMap.get(classObj).has(trimDataFullName)) {

            let keyFullDataNameValueDataNameListMap = this.eventNameDataNameMap.get(classObj);
            if (keyFullDataNameValueDataNameListMap.has(trimDataFullName)) {
                let eventNameDataNameListOfClass = keyFullDataNameValueDataNameListMap.get(trimDataFullName);
                for (let eventName of eventNameDataNameListOfClass.keys()) {
                    let dataNameList = eventNameDataNameListOfClass.get(eventName);
                    for (let dataName of dataNameList) {
                        this.execMethod(classObj, methodList, 'beforeName', {'name': dataName, 'event': eventName, 'value': dom});
                    }
                    let eventFn = this.eventMap.get(classObj).get(trimDataFullName).get(eventName);
                    dom.addEventListener(eventName, eventFn);
                    for (let dataName of dataNameList) {
                        this.execMethod(classObj, methodList, 'afterName', {'name': dataName, 'event': eventName, 'value': dom});
                    }
                }
            }

        } else {

            for (let trimDataName of trimDataNameList) {
                if (eventMethodList[trimDataName]) {
                    for (let eventName of eventMethodList[trimDataName]) {
                        if (!this.eventNameDataNameMap.has(classObj)) {
                            this.eventNameDataNameMap.set(classObj, new Map());
                        }
                        let keyFullDataNameValueDataNameListMap = this.eventNameDataNameMap.get(classObj);
                        if (!keyFullDataNameValueDataNameListMap.has(trimDataFullName)) {
                            keyFullDataNameValueDataNameListMap.set(trimDataFullName, new Map());
                        }
                        let eventNameDataNameListOfClass = keyFullDataNameValueDataNameListMap.get(trimDataFullName);
                        if (!eventNameDataNameListOfClass.has(eventName)) {
                            eventNameDataNameListOfClass.set(eventName, []);
                        }
                        let dataNameList = eventNameDataNameListOfClass.get(eventName);
                        dataNameList.push(trimDataName);
                    }
                }
            }

            if (this.eventNameDataNameMap.has(classObj)) {
                let keyFullDataNameValueDataNameListMap = this.eventNameDataNameMap.get(classObj);
                if (keyFullDataNameValueDataNameListMap.has(trimDataFullName)) {
                    let eventNameDataNameListOfClass = keyFullDataNameValueDataNameListMap.get(trimDataFullName);
                    for (let eventName of eventNameDataNameListOfClass.keys()) {
                        let dataNameList = eventNameDataNameListOfClass.get(eventName);
                        let fnList = [];
                        for (let dataName of dataNameList) {
                            this.execMethod(classObj, methodList, 'beforeName', {'name': dataName, 'event': eventName, 'value': dom});
                            fnList.push(methodList[dataName + '_' + eventName]);
                        }

                        if (!this.eventMap.has(classObj)) {
                            this.eventMap.set(classObj, new Map());
                        }
                        let keyFullDataNameValueFuncMap = this.eventMap.get(classObj);
                        if (!keyFullDataNameValueFuncMap.has(trimDataFullName)) {
                            keyFullDataNameValueFuncMap.set(trimDataFullName, new Map());
                        }
                        let eventMapOfClass = keyFullDataNameValueFuncMap.get(trimDataFullName);
                        if (!eventMapOfClass.has(eventName)) {
                            let eventFn = (function(fnList, classObj, moduleClassObj){
                                return function(e){
                                    for (let func of fnList) {
                                        let ret = null;
                                        try {
                                            if (classObj.beforeEvent && typeof classObj.beforeEvent === 'function') {
                                                classObj.beforeEvent(e);
                                            }
                                            ret = func(e);
                                            if (classObj.afterEvent && typeof classObj.afterEvent === 'function') {
                                                classObj.afterEvent(e, ret);
                                            }
                                            if (ret === false) {
                                                return;
                                            }
                                        } catch(exception) {
                                            ret = false;
                                            if (moduleClassObj.errorHandle && typeof moduleClassObj.errorHandle === 'function') {
                                                moduleClassObj.errorHandle(e, exception);
                                            } else {
                                                throw exception;
                                            }
                                        } finally {
                                            if (moduleClassObj.finalHandle && typeof moduleClassObj.finalHandle === 'function') {
                                                moduleClassObj.finalHandle(e, ret);
                                            }
                                        }
                                        if (ret === false) {
                                            return;
                                        }
                                    }
                                };
                            })(fnList, classObj, moduleClassObj);
                            eventMapOfClass.set(eventName, eventFn);
                        }

                        dom.addEventListener(eventName, eventMapOfClass.get(eventName));

                        for (let dataName of dataNameList) {
                            this.execMethod(classObj, methodList, 'afterName', {'name': dataName, 'event': eventName, 'value': dom});
                        }
                    }
                }
            }

        }
    };

    this.setEventFunctionForUniqueComponent = function(dataFullName, classObj, methodList, dom, eventMethodList, moduleClassObj){
        let keyEventValueNameList = {}
        let dataFullNameSplit = dataFullName.split(',');
        for (let i = 0; i < dataFullNameSplit.length; i++) {
            let trimDataName = dataFullNameSplit[i].trim();
            if (trimDataName in eventMethodList) {
                for (let eventName of eventMethodList[trimDataName].values()) {
                    if (!((trimDataName + '_' + eventName) in methodList)) {
                        continue;
                    }
                    if (!(eventName in keyEventValueNameList)) {
                        keyEventValueNameList[eventName] = {};
                    }
                    this.execMethod(classObj, methodList, 'beforeName', {'name': trimDataName, 'event': eventName, 'value': dom});
                    keyEventValueNameList[eventName][trimDataName] = methodList[trimDataName + '_' + eventName];
                }
            }
        }

        for (let eventName in keyEventValueNameList) {
            let fnList = keyEventValueNameList[eventName];
            let eventFn = (function(fnList, classObj, moduleClassObj){
                return function(e){
                    for (let func of Object.values(fnList)) {
                        let ret = null;
                        try {
                            if (classObj.beforeEvent && typeof classObj.beforeEvent === 'function') {
                                classObj.beforeEvent(e);
                            }
                            ret = func(e);
                            if (classObj.afterEvent && typeof classObj.afterEvent === 'function') {
                                classObj.afterEvent(e, ret);
                            }
                            if (ret === false) {
                                return;
                            }
                        } catch(exception) {
                            ret = false;
                            if (moduleClassObj.errorHandle && typeof moduleClassObj.errorHandle === 'function') {
                                moduleClassObj.errorHandle(e, exception);
                            } else {
                                throw exception;
                            }
                        } finally {
                            if (moduleClassObj.finalHandle && typeof moduleClassObj.finalHandle === 'function') {
                                moduleClassObj.finalHandle(e, ret);
                            }
                        }
                        if (ret === false) {
                            return;
                        }
                    }
                };
            })(fnList, classObj, moduleClassObj);

            dom.addEventListener(eventName, eventFn);

            for (let dataName in fnList) {
                this.execMethod(classObj, methodList, 'afterName', {'name': dataName, 'event': eventName, 'value': dom});
            }

        }
    };

    this.removeEventFunction = function(dataFullName, classObj, methodList, dom){
        let trimDataFullName = '';
        let dataFullNameSplit = dataFullName.split(',');
        for (let i = 0; i < dataFullNameSplit.length; i++) {
            let trimDataName = dataFullNameSplit[i].trim();
            trimDataFullName += trimDataName + ',';
        }
        if (this.eventMap.has(classObj) && this.eventMap.get(classObj).has(trimDataFullName)) {

            let keyFullDataNameValueDataNameListMap = this.eventNameDataNameMap.get(classObj);
            if (keyFullDataNameValueDataNameListMap.has(trimDataFullName)) {
                let eventNameDataNameListOfClass = keyFullDataNameValueDataNameListMap.get(trimDataFullName);
                for (let eventName of eventNameDataNameListOfClass.keys()) {
                    let dataNameList = eventNameDataNameListOfClass.get(eventName);
                    for (let dataName of dataNameList) {
                        this.execMethod(classObj, methodList, 'beforeRemoveName', {'name': dataName, 'event': eventName, 'value': dom});
                    }
                    let eventFn = this.eventMap.get(classObj).get(trimDataFullName).get(eventName);
                    dom.removeEventListener(eventName, eventFn);
                    for (let dataName of dataNameList) {
                        this.execMethod(classObj, methodList, 'afterRemoveName', {'name': dataName, 'event': eventName, 'value': dom});
                    }
                }
            }

        }

    };

    this.esc = function(strings, ...keys) {
        return (function(fs, argObj) {
            let ret = '';
            if (keys !== null && keys !== undefined) {
                for (let i = 0; i < keys.length; i++) {
                    let value = $___fairysupport_param(argObj, null, keys[i]);
                    value = String(value);
                    ret += strings[i] + value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
                }
            }
            if (keys === null || keys === undefined || keys.length === null || keys.length === undefined) {
                ret += strings[0];
            } else if (keys.length < strings.length) {
                ret += strings[keys.length];
            }
            return ret;
        });
    };

    this.getTplDom = function(viewStr, paramObj, errCb, cb){

        let template = document.createElement('template');
        template.innerHTML = viewStr;
        let viewDom = template.content;

        if (paramObj === null || paramObj === undefined) {
            paramObj = Object.create(null);
        }

        let retObj = Object.create(null);
        let localValue = Object.create(null);
        this.developTpl(viewDom, paramObj, localValue, retObj, errCb, cb);

    };

    this.getTplChildNodeList = function* (childNodesContainer){
        for (childNodesContainer['i'] = 0; childNodesContainer['i'] < childNodesContainer['childNodes'].length; childNodesContainer['i']++) {
            yield childNodesContainer.childNodes.item(childNodesContainer['i']);
        }

        if (childNodesContainer['cb'] !== undefined && childNodesContainer['cb'] !== null) {
            childNodesContainer['cb'](childNodesContainer['dom']);
        }

    };

    this.developTpl = async function(dom, paramObj, localValue, retObj, errCb, cb){

        try {

            if (dom === null || dom === undefined) {
                if (cb !== undefined && cb !== null) {
                    cb(dom);
                }
                return;
            }

            let skipObjMap = new WeakMap();

            let ifExecutingFlg = null;

            let childList = dom.childNodes;
            let child = null;
            let childNodesContainer = {'childNodes' : childList, 'i': 0, 'cb': cb, 'dom': dom};
            if (childList !== null && childList !== undefined) {
                for await (child of this.getTplChildNodeList(childNodesContainer)) {

                    if ('continueVal' in retObj && retObj.continueVal > 0) {
                        this.selfAndNextDelete(child);
                        if (cb !== undefined && cb !== null) {
                            cb(dom);
                        }
                        return;
                    }
                    if ('breakVal' in retObj && retObj.breakVal > 0) {
                        this.selfAndNextDelete(child);
                        if (cb !== undefined && cb !== null) {
                            cb(dom);
                        }
                        return;
                    }

                    if (child instanceof CharacterData) {
                        continue;
                    }

                    let dataset = child.dataset;
                    let tag = dataset.tag;

                    let dataValue = dataset.js;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.js;
                        $___fairysupport_param(paramObj, localValue, dataValue);
                    }

                    dataValue = dataset.attr;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.attr;
                        let value = $___fairysupport_param(paramObj, localValue, '(' + dataValue + ')');
                        for (const [k, v] of Object.entries(value)) {
                            child.setAttribute(k, v);
                        }
                    }

                    dataValue = dataset.prop;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.prop;
                        let value = $___fairysupport_param(paramObj, localValue, '(' + dataValue + ')');
                        this.setTplProp(child, value);
                    }

                    dataValue = dataset.template;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.template;

                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (templateError) {
                            value = dataValue;
                        }

                        let tpl = "";
                        try {
                            tpl = await this.getTemplate(value);
                        } catch(error) {
                            throw error;
                        }
                        child.innerHTML = tpl;
                    }

                    dataValue = dataset.text;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.text;
                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (textError) {
                            value = dataValue;
                        }

                        child.innerHTML = '';
                        child.appendChild(document.createTextNode(value));
                    }

                    dataValue = dataset.html;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.html;
                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (htmlError) {
                            value = dataValue;
                        }
                        child.innerHTML = value;
                    }

                    dataValue = dataset.else;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.else;
                        if (ifExecutingFlg === false) {
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                        } else if (ifExecutingFlg === true) {
                            ifExecutingFlg = false;
                        } else {
                            ifExecutingFlg = false;
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                        }
                    }

                    dataValue = dataset.elseif;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.elseif;
                        if (ifExecutingFlg === false) {
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                        } else if (ifExecutingFlg === true) {
                            let value = $___fairysupport_param(paramObj, localValue, dataValue);
                            if (value) {
                                ifExecutingFlg = false;
                            } else {
                                child.innerHTML = '';
                                child.parentNode.removeChild(child);
                                child = null;
                            }
                        } else {
                            ifExecutingFlg = false;
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                        }
                    }

                    dataValue = dataset.if;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.if;
                        let value = $___fairysupport_param(paramObj, localValue, dataValue);
                        if (value) {
                            ifExecutingFlg = false;
                        } else {
                            ifExecutingFlg = true;
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                        }
                    }

                    dataValue = dataset.continue;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.continue;
                        retObj.continueVal = dataValue;
                        if (dataValue > 0) {
                            this.nextDelete(child);
                            this.deleteTag(child, tag);
                            if (cb !== undefined && cb !== null) {
                                cb(dom);
                            }
                            return;
                        }
                    }

                    dataValue = dataset.break;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.break;
                        retObj.breakVal = dataValue;
                        if (dataValue > 0) {
                            this.nextDelete(child);
                            this.deleteTag(child, tag);
                            if (cb !== undefined && cb !== null) {
                                cb(dom);
                            }
                            return;
                        }
                    }

                    let forStart = dataset.forStart;
                    let forEnd = dataset.forEnd;
                    let forStep = dataset.forStep;
                    if (child !== null && child !== undefined && forStart !== null && forStart !== undefined && forEnd !== null && forEnd !== undefined && forStep !== null && forStep !== undefined) {
                        delete child.dataset.forStart;
                        delete child.dataset.forEnd;
                        delete child.dataset.forStep;
                        let firstFlg = true;
                        let firstElement = null;
                        for ($___fairysupport_param(paramObj, localValue, forStart); $___fairysupport_param(paramObj, localValue, forEnd); $___fairysupport_param(paramObj, localValue, forStep)) {
                            let newChild = child.cloneNode(true)
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb);
                            skipObjMap.set(newChild, newChild);
                            child.parentNode.insertBefore(newChild, child);
                            if (firstFlg) {
                                firstFlg = false;
                                firstElement = newChild;
                            }
                            if ('continueVal' in retObj && retObj.continueVal > 0) {
                                if (retObj.continueVal > 1) {
                                    retObj.continueVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.continueVal--;
                                    delete retObj.continueVal;
                                    continue;
                                }
                            }
                            if ('breakVal' in retObj && retObj.breakVal > 0) {
                                if (retObj.breakVal > 1) {
                                    retObj.breakVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.breakVal--;
                                    delete retObj.breakVal;
                                    break;
                                }
                            }
                        }
                        child.innerHTML = '';
                        child.parentNode.removeChild(child);
                        child = firstElement;

                    }

                    let foreachArray = dataset.foreach;
                    let foreachKey = dataset.foreachKey;
                    let foreachValue = dataset.foreachValue;
                    if (child !== null && child !== undefined && foreachArray !== null && foreachArray !== undefined && foreachKey !== null && foreachKey !== undefined && foreachValue !== null && foreachValue !== undefined) {
                        delete child.dataset.foreach;
                        delete child.dataset.foreachKey;
                        delete child.dataset.foreachValue;
                        let firstFlg = true;
                        let firstElement = null;
                        for (const [localForeachKey, localForeachValue] of Object.entries($___fairysupport_param(paramObj, localValue, foreachArray))) {
                            localValue[foreachKey] = localForeachKey;
                            localValue[foreachValue] = localForeachValue;
                            let newChild = child.cloneNode(true)
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb);
                            skipObjMap.set(newChild, newChild);
                            child.parentNode.insertBefore(newChild, child);
                            if (firstFlg) {
                                firstFlg = false;
                                firstElement = newChild;
                            }
                            if ('continueVal' in retObj && retObj.continueVal > 0) {
                                if (retObj.continueVal > 1) {
                                    retObj.continueVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.continueVal--;
                                    delete retObj.continueVal;
                                    continue;
                                }
                            }
                            if ('breakVal' in retObj && retObj.breakVal > 0) {
                                if (retObj.breakVal > 1) {
                                    retObj.breakVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.breakVal--;
                                    delete retObj.breakVal;
                                    break;
                                }
                            }
                        }
                        child.innerHTML = '';
                        child.parentNode.removeChild(child);
                        child = firstElement;

                    }

                    let whileValue = dataset.while;
                    if (child !== null && child !== undefined && whileValue !== null && whileValue !== undefined) {
                        delete child.dataset.while;
                        let firstFlg = true;
                        let firstElement = null;
                        while ($___fairysupport_param(paramObj, localValue, whileValue)) {
                            let newChild = child.cloneNode(true)
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb);
                            skipObjMap.set(newChild, newChild);
                            child.parentNode.insertBefore(newChild, child);
                            if (firstFlg) {
                                firstFlg = false;
                                firstElement = newChild;
                            }
                            if ('continueVal' in retObj && retObj.continueVal > 0) {
                                if (retObj.continueVal > 1) {
                                    retObj.continueVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.continueVal--;
                                    delete retObj.continueVal;
                                    continue;
                                }
                            }
                            if ('breakVal' in retObj && retObj.breakVal > 0) {
                                if (retObj.breakVal > 1) {
                                    retObj.breakVal--;
                                    this.nextDelete(newChild);
                                    this.deleteTag(firstElement, tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return;
                                } else {
                                    retObj.breakVal--;
                                    delete retObj.breakVal;
                                    break;
                                }
                            }
                        }
                        child.innerHTML = '';
                        child.parentNode.removeChild(child);
                        child = firstElement;

                    }

                    let deleteTagResult = this.deleteTag(child, tag);
                    if (deleteTagResult) {
                        childNodesContainer['i']--;
                    }

                    if (child !== null && child !== undefined && !skipObjMap.has(child)) {
                        await this.developTpl(child, paramObj, localValue, retObj, errCb);
                    }

                }
            }

        } catch(error) {
            errCb(error);
            throw error;
        }

    };

    this.deleteTag = function(child, tag){
        let result = false;
        if (child !== null && child !== undefined && tag !== null && tag !== undefined) {
            delete child.dataset.tag;
            if ('hidden' === tag || 'hidden' === $___fairysupport_param(paramObj, localValue, tag)) {
                let grandChildList = child.childNodes;
                let grandChild = null;
                if (grandChildList !== null && grandChildList !== undefined) {
                    for (let grandChildIdx = 0; grandChildIdx < grandChildList.length; grandChildIdx++) {
                        grandChild = grandChildList.item(grandChildIdx);
                        child.removeChild(grandChild);
                        child.parentNode.insertBefore(grandChild, child);
                    }
                }
                child.parentNode.removeChild(child);
                result = true;
            }
        }
        return result;
    };

    this.selfAndNextDelete = function(dom){
        this.nextDelete(dom);
        dom.parentNode.removeChild(dom);
    };

    this.nextDelete = function(dom){
        let nextDom = null;
        while ((nextDom = dom.nextSibling) !== null) {
            nextDom.parentNode.removeChild(nextDom);
        }
    };

    this.setTplProp = function(obj, props){
        if (obj === null && obj === undefined) {
            return;
        }
        for (const [k, v] of Object.entries(props)) {
            if (v.constructor === Object) {
                this.setTplProp(obj[k], v);
            } else {
                obj[k] = v;
            }
        }
    };

    this.getTemplate = function (templatePackeage, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        templatePackeage = templatePackeage.trim();
        let templatePath = '';
        let templateNameList = templatePackeage.split('.');
        for (let templateName of templateNameList) {
            if (templateName.trim() === '') {
                continue;
            }
            templatePath += (templateName + '/');
        }
        templatePath = templatePath.substring(0, templatePath.length - 1);
        let templateViewPath = templateRoot + templatePath + '.html';

        return new Promise((function(fs, templatePackeage, retryCount, templateViewPath){
            return function (resolve, reject) {
                let req = fs.emptyAjax(templateViewPath + '?' + fs.version, null, 'GET', 'query');
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                req.responseType = 'text';
                req.onloadend = (function(fs, templatePackeage, retryCount, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;
                                resolve(viewStr);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.getTemplate(templatePackeage, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template : ' + templateViewPath + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, templatePackeage, retryCount, resolve, reject);
                req.send();

            };
        })(this, templatePackeage, retryCount, templateViewPath));

    };

    this.appendLoadStringTemplate = function (dom, viewStr, argObj){
        return this.loadStringTemplate(dom, viewStr, argObj, 'append');
    };
    this.beforeLoadStringTemplate = function (dom, viewStr, argObj){
        return this.loadStringTemplate(dom, viewStr, argObj, 'before');
    };
    this.afterLoadStringTemplate = function (dom, viewStr, argObj){
        return this.loadStringTemplate(dom, viewStr, argObj, 'after');
    };
    this.loadStringTemplate = function (dom, viewStr, argObj, position, timing){

        return new Promise((function(fs, dom, viewStr, argObj, position, timing){
                return function (resolve, reject) {

                    let cb = (function(fs, dom, position, resolve){
                        return function(viewDom){

                            fs.addInitFuncForAfterObserver(viewDom, resolve, false);

                            if ('before' === position && dom.parentNode) {
                                dom.parentNode.insertBefore(viewDom, dom);
                            } else if ('after' === position && dom.parentNode) {
                                if (dom.nextSibling === null || dom.nextSibling === undefined) {
                                    dom.parentNode.appendChild(viewDom);
                                } else {
                                    dom.parentNode.insertBefore(viewDom, dom.nextSibling);
                                }
                            } else if ('append' === position) {
                                dom.appendChild(viewDom);
                            } else {
                                dom.innerHTML = "";
                                dom.appendChild(viewDom);
                            }
                        }
                    })(fs, dom, position, resolve);

                    fs.getTplDom(viewStr, argObj, reject, cb);

                };
            })(this, dom, viewStr, argObj, position, timing)
        );
    };

    this.appendLoadTemplate = function (dom, templatePackeage, argObj){
        return this.loadTemplate(dom, templatePackeage, argObj, 'append');
    };

    this.beforeLoadTemplate = function (dom, templatePackeage, argObj){
        return this.loadTemplate(dom, templatePackeage, argObj, 'before');
    };

    this.afterLoadTemplate = function (dom, templatePackeage, argObj){
        return this.loadTemplate(dom, templatePackeage, argObj, 'after');
    };

    this.loadTemplate = function (dom, templatePackeage, argObj, position, retryCount, timing){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        templatePackeage = templatePackeage.trim();
        let templatePath = '';
        let templateNameList = templatePackeage.split('.');
        for (let templateName of templateNameList) {
            if (templateName.trim() === '') {
                continue;
            }
            templatePath += (templateName + '/');
        }
        templatePath = templatePath.substring(0, templatePath.length - 1);
        let templateViewPath = templateRoot + templatePath + '.html';

        return new Promise((function(fs, dom, templatePackeage, argObj, position, retryCount, timing, templateViewPath){
            return function (resolve, reject) {
                let req = fs.emptyAjax(templateViewPath + '?' + fs.version, null, 'GET', 'query');
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                req.responseType = 'text';
                req.onloadend = (function(fs, dom, templatePackeage, argObj, position, retryCount, timing, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;
                                fs.loadStringTemplate(dom, viewStr, argObj, position, timing).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.loadTemplate(dom, templatePackeage, argObj, position, ++retryCount, timing).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template : ' + templateViewPath + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, templatePackeage, argObj, position, retryCount, timing, resolve, reject);
                req.send();

            };
        })(this, dom, templatePackeage, argObj, position, retryCount, timing, templateViewPath));

    };

    this.appendResJsonTemplate = function (dom, templatePackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonTemplate(dom, templatePackeage, reqUrl, paramObj, withCredentials, 'append');
    };
    this.beforeResJsonTemplate = function (dom, templatePackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonTemplate(dom, templatePackeage, reqUrl, paramObj, withCredentials, 'before');
    };
    this.afterResJsonTemplate = function (dom, templatePackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonTemplate(dom, templatePackeage, reqUrl, paramObj, withCredentials, 'after');
    };

    this.resJsonTemplate = function (dom, templatePackeage, reqUrl, paramObj, withCredentials, position, retryCount, timing){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, templatePackeage, reqUrl, paramObj, withCredentials, position, retryCount, timing){
            return function (resolve, reject) {
                let req = fs.ajax(reqUrl, paramObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, templatePackeage, reqUrl, paramObj, withCredentials, position, retryCount, timing, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadTemplate(dom, templatePackeage, json, position, 0, timing).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonTemplate(dom, templatePackeage, reqUrl, paramObj, withCredentials, position, ++retryCount, timing).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for template : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, templatePackeage, reqUrl, paramObj, withCredentials, position, retryCount, timing, resolve, reject);
                req.send();

            };
        })(this, dom, templatePackeage, reqUrl, paramObj, withCredentials, position, retryCount, timing));

    };

    this.appendResJsonTemplateByForm = function (dom, templatePackeage, reqUrl, formObj, withCredentials){
        return this.resJsonTemplateByForm(dom, templatePackeage, reqUrl, formObj, withCredentials, 'append');
    };
    this.beforeResJsonTemplateByForm = function (dom, templatePackeage, reqUrl, formObj, withCredentials){
        return this.resJsonTemplateByForm(dom, templatePackeage, reqUrl, formObj, withCredentials, 'before');
    };
    this.afterResJsonTemplateByForm = function (dom, templatePackeage, reqUrl, formObj, withCredentials){
        return this.resJsonTemplateByForm(dom, templatePackeage, reqUrl, formObj, withCredentials, 'after');
    };

    this.resJsonTemplateByForm = function (dom, templatePackeage, reqUrl, formObj, withCredentials, position, retryCount, timing){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, templatePackeage, reqUrl, formObj, withCredentials, position, retryCount, timing){
            return function (resolve, reject) {
                let req = fs.ajaxByForm(reqUrl, formObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, templatePackeage, reqUrl, formObj, withCredentials, position, retryCount, timing, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadTemplate(dom, templatePackeage, json, position, 0, timing).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonTemplateByForm(dom, templatePackeage, reqUrl, formObj, withCredentials, position, ++retryCount, timing).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for template : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }

                        }
                    }
                )(fs, dom, templatePackeage, reqUrl, formObj, withCredentials, position, retryCount, timing, resolve, reject);
                req.send();

            };
        })(this, dom, templatePackeage, reqUrl, formObj, withCredentials, position, retryCount, timing));

    };

    this.appendResHtmlTemplate = function (dom, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlTemplate(dom, viewUrl, paramObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlTemplate = function (dom, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlTemplate(dom, viewUrl, paramObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlTemplate = function (dom, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlTemplate(dom, viewUrl, paramObj, argObj, withCredentials, 'after');
    };

    this.resHtmlTemplate = function (dom, viewUrl, paramObj, argObj, withCredentials, position, retryCount, timing){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, viewUrl, paramObj, argObj, withCredentials, position, retryCount, timing){
            return function (resolve, reject) {
                let req = fs.emptyAjax(viewUrl, paramObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/json');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, viewUrl, paramObj, argObj, withCredentials, position, retryCount, timing, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;
                                fs.loadStringTemplate(dom, viewStr, argObj, position, timing).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlTemplate(dom, viewUrl, paramObj, argObj, withCredentials, position, ++retryCount, timing).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, viewUrl, paramObj, argObj, withCredentials, position, retryCount, timing, resolve, reject);
                req.send();

            };
        })(this, dom, viewUrl, paramObj, argObj, withCredentials, position, retryCount, timing));

    };

    this.appendResHtmlTemplateByForm = function (dom, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlTemplateByForm(dom, viewUrl, formObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlTemplateByForm = function (dom, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlTemplateByForm(dom, viewUrl, formObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlTemplateByForm = function (dom, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlTemplateByForm(dom, viewUrl, formObj, argObj, withCredentials, 'after');
    };

    this.resHtmlTemplateByForm = function (dom, viewUrl, formObj, argObj, withCredentials, position, retryCount, timing){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, viewUrl, formObj, argObj, withCredentials, position, retryCount, timing){
            return function (resolve, reject) {
                let req = fs.emptyAjaxByForm(viewUrl, formObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, viewUrl, formObj, argObj, withCredentials, position, retryCount, timing){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;
                                fs.loadStringTemplate(dom, viewStr, argObj, position, timing).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlTemplateByForm(dom, viewUrl, formObj, argObj, withCredentials, position, ++retryCount, timing).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, viewUrl, formObj, argObj, withCredentials, position, retryCount, timing);
                req.send();

            };
        })(this, dom, viewUrl, formObj, argObj, withCredentials, position, retryCount, timing));

    };

    this.useDomAsTemplate = function (dom, argObj){
        return this.loadStringTemplate(dom, dom.innerHTML, argObj);
    };

    this.execUniqueComponentMethod = function (controllerObj, methodList, methodName, argList){
        return this.execMethod(controllerObj, methodList, methodName, argList);
    };

    this.getUniqueComponentMethod = function (fs, controllerObj, methodList, methodName, argList, func){
        return function(){
            let ret = fs.execUniqueComponentMethod(controllerObj, methodList, methodName, argList);
            func();
            return ret;
        };
    };

    this.getUniqueComponentMethodInputArgs = function (fs, controllerObj, methodList, methodName){
        return function(argList){
            return fs.execUniqueComponentMethod(controllerObj, methodList, methodName, argList);
        };
    };

    this.appendLoadUniqueComponent = function (dom, componentPackeage, argObj){
        return this.loadUniqueComponent(dom, componentPackeage, argObj, 'append');
    };

    this.beforeLoadUniqueComponent = function (dom, componentPackeage, argObj){
        return this.loadUniqueComponent(dom, componentPackeage, argObj, 'before');
    };

    this.afterLoadUniqueComponent = function (dom, componentPackeage, argObj){
        return this.loadUniqueComponent(dom, componentPackeage, argObj, 'after');
    };

    this.loadUniqueComponent = function (dom, componentPackeage, argObj, position){

        let componentValueMap = this.getComponentValue(componentPackeage);
        let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

        return new Promise((function(fs, dom, argObj, position, componentValueMap, componentControllerPath){
            return function (resolve, reject) {
                 fs.uniqueComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position);

            };
        })(this, dom, argObj, position, componentValueMap, componentControllerPath));

    };

    this.appendResJsonUniqueComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonUniqueComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'append');
    };
    this.beforeResJsonUniqueComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonUniqueComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'before');
    };
    this.afterResJsonUniqueComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonUniqueComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'after');
    };

    this.resJsonUniqueComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){
            return function (resolve, reject) {
                let req = fs.ajax(reqUrl, paramObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadUniqueComponent(dom, componentPackeage, json, position).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonUniqueComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for uniqueComponent : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount);
                req.send();

            };
        })(this, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount));

    };

    this.appendResJsonUniqueComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonUniqueComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'append');
    };
    this.beforeResJsonUniqueComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonUniqueComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'before');
    };
    this.afterResJsonUniqueComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonUniqueComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'after');
    };

    this.resJsonUniqueComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount){
            return function (resolve, reject) {
                let req = fs.ajaxByForm(reqUrl, formObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadUniqueComponent(dom, componentPackeage, json, position).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonUniqueComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for uniqueComponent : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }

                        }
                    }
                )(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount, resolve, reject);
                req.send();

            };
        })(this, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount));

    };

    this.appendResHtmlUniqueComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlUniqueComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlUniqueComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlUniqueComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlUniqueComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlUniqueComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'after');
    };

    this.resHtmlUniqueComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot){
            return function (resolve, reject) {
                let req = fs.emptyAjax(viewUrl, paramObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/json');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;

                                let componentValueMap = fs.getComponentValue(componentPackeage);
                                let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

                                fs.uniqueComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, viewStr);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlUniqueComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template for uniqueComponent : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot);
                req.send();

            };
        })(this, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot));

    };

    this.appendResHtmlUniqueComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlUniqueComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlUniqueComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlUniqueComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlUniqueComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlUniqueComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'after');
    };

    this.resHtmlUniqueComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot){
            return function (resolve, reject) {
                let req = fs.emptyAjaxByForm(viewUrl, formObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot, resolve, reject){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;

                                let componentValueMap = fs.getComponentValue(componentPackeage);
                                let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

                                fs.uniqueComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, viewStr);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlUniqueComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template for uniqueComponent : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot, resolve, reject);
                req.send();

            };
        })(this, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot));

    };

    this.uniqueComponentInsertFunc = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr){

        this.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, this.uniqueComponentInsertFuncExec.bind(fs), 0);

    };

    this.uniqueComponentInsertFuncExec = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        let func = function () {};
        if (cb !== null && cb !== undefined) {
            func = cb;
        }

        import(componentControllerPath + '?' + fs.version)
        .then(fs.loadUniqueComponentControllerMethodList(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj))
        .catch((function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount){
                return function (err) {
                    let failResult = fairysupportComponentFail(retryCount, err);
                    if (failResult) {
                        fs.uniqueComponentInsertFuncExec(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, ++retryCount);
                    } else {
                        if (errCb !== null && errCb !== undefined) {
                            errCb(err);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount))
        ;

    };

    this.loadUniqueComponentControllerMethodList = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj){
        return function (Module){

            if (!(componentValueMap['componentPackeage'] in componentEnvValueObj)) {
                componentEnvValueObj[componentValueMap['componentPackeage']] = Object.create(null);
            }
            Object.assign(componentEnvValueObj[componentValueMap['componentPackeage']], Module.__fairysupport__envValueObj);

            if (viewStr === undefined || viewStr === null) {
                viewStr = Module.__fairysupport__viewStr;
            }

            let componentPathSplit = componentValueMap['componentPath'].split('/');
            let componentClass = fs.getCamel(componentPathSplit[componentPathSplit.length - 2]);
            let uniqueComponentControllerObj = new Module[componentClass]();
            let uniqueComponentControllerMethodList = fs.getMethodList(uniqueComponentControllerObj);
            let uniqueDataNameEventMap = {};

            for (let met in uniqueComponentControllerMethodList) {
                let metSplit = met.split('_');
                if (metSplit.length > 1) {
                    let metPrefix = '';
                    for (let i = 0; i < (metSplit.length - 1); i++) {
                        metPrefix += metSplit[i] + '_';
                    }
                    metPrefix = metPrefix.substring(0, metPrefix.length - 1);
                    if (!(uniqueDataNameEventMap[metPrefix])) {
                        uniqueDataNameEventMap[metPrefix] = [];
                    }
                    uniqueDataNameEventMap[metPrefix].push(metSplit[metSplit.length - 1]);
                }
            }

            let insertComponentFunc = fs.getInsertUniqueComponent(fs, dom, componentValueMap, viewStr, argObj, func, position, uniqueComponentControllerObj, uniqueComponentControllerMethodList, uniqueDataNameEventMap, errCb);
            insertComponentFunc();

        };
    };

    this.getInsertUniqueComponent = function (fs, dom, componentValueMap, viewStr, argObj, func, position, controllerObj, methodList, dataNameEventMap, errCb){
        return function (){

            let cb = (function(fs, dom, componentValueMap, argObj, func, position, controllerObj, methodList, dataNameEventMap){
                return function(viewDom){

                    let initFunc = fs.getUniqueComponentMethod(fs, controllerObj, methodList, 'init', argObj, func);
                    fs.addInitFuncForAfterObserver(viewDom, initFunc, ('init' in methodList ? true : false));

                    let childList = viewDom.childNodes;
                    let child = null;
                    if (childList !== null && childList !== undefined) {
                        for (let i = 0; i < childList.length; i++) {
                            child = childList.item(i);
                            fs.bindUniqueComponentAll(child, componentValueMap, controllerObj, methodList, dataNameEventMap);
                        }
                    }

                    if ('before' === position && dom.parentNode) {
                        dom.parentNode.insertBefore(viewDom, dom);
                    } else if ('after' === position && dom.parentNode) {
                        if (dom.nextSibling === null || dom.nextSibling === undefined) {
                            dom.parentNode.appendChild(viewDom);
                        } else {
                            dom.parentNode.insertBefore(viewDom, dom.nextSibling);
                        }
                    } else if ('append' === position) {
                        dom.appendChild(viewDom);
                    } else {
                        dom.innerHTML = "";
                        dom.appendChild(viewDom);
                    }

                };
            })(fs, dom, componentValueMap, argObj, func, position, controllerObj, methodList, dataNameEventMap);

            fs.getTplDom(viewStr, argObj, errCb, cb);

        };
    };

    this.bindUniqueComponentAll = function (obj, componentValueMap, controllerObj, methodList, eventMethodList){
        if (obj === null || obj === undefined) {
            return;
        }
        this.bindAllSingle(obj, this.bindUniqueComponentProp(this, obj, componentValueMap, controllerObj, methodList, eventMethodList));
        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindUniqueComponentAll(child, componentValueMap, controllerObj, methodList, eventMethodList);
            }
        }

    };

    this.bindUniqueComponentProp = function (fs, obj, componentValueMap, controllerObj, methodList, eventMethodList){
        return function(){
            let dataset = obj.dataset;
            if (dataset !== null && dataset !== undefined) {

                let bindObj = dataset[componentValueMap['componentCamel'] + 'Obj'];
                let bindList = dataset[componentValueMap['componentCamel'] + 'List'];
                let name = dataset[componentValueMap['componentCamel'] + 'Name'];

                if (bindObj !== null && bindObj !== undefined) {
                    fs.bindUniqueComponentSingleObj(obj, bindObj, controllerObj, methodList);
                }

                if (bindList !== null && bindList !== undefined) {
                    fs.bindUniqueComponentSingleList(obj, bindList, controllerObj, methodList);
                }

                if (name !== null && name !== undefined) {
                    fs.bindUniqueComponentSingleEvent(obj, name, controllerObj, methodList, eventMethodList);
                }

            }
        };
    };

    this.bindUniqueComponentSingleObj = function (dom, bindStr, controllerObj, methodList){
        if (dom !== null && dom !== undefined && bindStr !== null && bindStr !== undefined) {
            this.execUniqueComponentMethod(controllerObj, methodList, 'beforeBindObj', {'name': bindStr, 'value': dom});
            let s = new Set();
            s.add(dom);
            let beforeMet = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'beforeRemoveObj');
            let afterMet = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'afterRemoveObj');
            let getFunc = (function(s){
                                            return function(){
                                                for (let value of s.values()) {
                                                    return value;
                                                }
                                                return null;
                                            };
                                        }
                           )(s);
            let setFunc = (function(s, bindStr, beforeMet, afterMet, fairysupportClear){
                                            return function(newElement){
                                                currentElement = null;
                                                for (let value of s.values()) {
                                                    currentElement = value;
                                                    break;
                                                }
                                                if (currentElement) {
                                                    beforeMet({'name': bindStr, 'value': currentElement});
                                                    s.clear();
                                                    if (currentElement.parentNode && !(newElement instanceof fairysupportClear)) {
                                                        if (newElement === null || newElement=== undefined) {
                                                            currentElement.parentNode.removeChild(currentElement);
                                                        } else if (newElement instanceof Node) {
                                                            currentElement.parentNode.replaceChild(newElement, currentElement);
                                                        }
                                                    }
                                                    afterMet({'name': bindStr, 'value': currentElement});
                                                }
                                            };
                                        }
                            )(s, bindStr, beforeMet, afterMet, fairysupportClear);
            Object.defineProperty(controllerObj, bindStr, {
                enumerable: true,
                configurable: true,
                get: getFunc,
                set : setFunc
            });
            this.execUniqueComponentMethod(controllerObj, methodList, 'afterBindObj', {'name': bindStr, 'value': dom});
        }
    }

    this.bindUniqueComponentSingleList = function (dom, bindList, controllerObj, methodList){
        if (dom !== null && dom !== undefined && bindList !== null && bindList !== undefined) {
            if (controllerObj[bindList] === null || controllerObj[bindList] === undefined) {
                let beforeMet = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'beforeRemoveList');
                let afterMet = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'afterRemoveList');
                let addBeforeFn = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'beforeBindList');
                let addAfterFn = this.getUniqueComponentMethodInputArgs(this, controllerObj, methodList, 'afterBindList');
                controllerObj[bindList] = new this.elementList(bindList, beforeMet, afterMet ,addBeforeFn ,addAfterFn, fairysupportClear);
            }
            controllerObj[bindList].add(dom);
        }
    }

    this.bindUniqueComponentSingleEvent = function (dom, name, controllerObj, methodList, eventMethodList){
        if (dom !== null && dom !== undefined && name !== null && name !== undefined) {
            this.setEventFunctionForUniqueComponent(name, controllerObj, methodList, dom, eventMethodList, this.clazz.obj);
        }
    }

    this.appendLoadSingleComponent = function (dom, componentPackeage, argObj){
        return this.loadSingleComponent(dom, componentPackeage, argObj, 'append');
    };

    this.beforeLoadSingleComponent = function (dom, componentPackeage, argObj){
        return this.loadSingleComponent(dom, componentPackeage, argObj, 'before');
    };

    this.afterLoadSingleComponent = function (dom, componentPackeage, argObj){
        return this.loadSingleComponent(dom, componentPackeage, argObj, 'after');
    };

    this.loadSingleComponent = function (dom, componentPackeage, argObj, position){

        let componentValueMap = this.getComponentValue(componentPackeage);
        let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

        return new Promise((function(fs, dom, componentValueMap, componentControllerPath, argObj, position){
            return function (resolve, reject) {
                fs.singleComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position);
            };

        })(this, dom, componentValueMap, componentControllerPath, argObj, position));

    };

    this.appendResJsonSingleComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonSingleComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'append');
    };
    this.beforeResJsonSingleComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonSingleComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'before');
    };
    this.afterResJsonSingleComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials){
        return this.resJsonSingleComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, 'after');
    };

    this.resJsonSingleComponent = function (dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){
            return function (resolve, reject) {
                let req = fs.ajax(reqUrl, paramObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadSingleComponent(dom, componentPackeage, json, position).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonSingleComponent(dom, componentPackeage, reqUrl, paramObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for singleComponent : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount);
                req.send();

            };
        })(this, dom, componentPackeage, reqUrl, paramObj, withCredentials, position, retryCount));

    };

    this.appendResJsonSingleComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonSingleComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'append');
    };
    this.beforeResJsonSingleComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonSingleComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'before');
    };
    this.afterResJsonSingleComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials){
        return this.resJsonSingleComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, 'after');
    };

    this.resJsonSingleComponentByForm = function (dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount){
            return function (resolve, reject) {
                let req = fs.ajaxByForm(reqUrl, formObj);
                req.timeout = fsTimeout;
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let json = xhr.response;
                                fs.loadSingleComponent(dom, componentPackeage, json, position).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resJsonSingleComponentByForm(dom, componentPackeage, reqUrl, formObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load json for singleComponent : ' + reqUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }

                        }
                    }
                )(fs, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount);
                req.send();

            };
        })(this, dom, componentPackeage, reqUrl, formObj, withCredentials, position, retryCount));

    };

    this.appendResHtmlSingleComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlSingleComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlSingleComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlSingleComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlSingleComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials){
        return this.resHtmlSingleComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, 'after');
    };

    this.resHtmlSingleComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot){
            return function (resolve, reject) {
                let req = fs.emptyAjax(viewUrl, paramObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/json');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;

                                let componentValueMap = fs.getComponentValue(componentPackeage);
                                let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

                                fs.singleComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, viewStr);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlSingleComponent(dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template for singleComponent : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot);
                req.send();

            };
        })(this, dom, componentPackeage, viewUrl, paramObj, argObj, withCredentials, position, retryCount, componentRoot));

    };

    this.appendResHtmlSingleComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlSingleComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'append');
    };
    this.beforeResHtmlSingleComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlSingleComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'before');
    };
    this.afterResHtmlSingleComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials){
        return this.resHtmlSingleComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, 'after');
    };

    this.resHtmlSingleComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        return new Promise((function(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot){
            return function (resolve, reject) {

                let req = fs.emptyAjaxByForm(viewUrl, formObj);
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.responseType = 'text';
                if (withCredentials) {
                    req.withCredentials = true;
                }
                req.onloadend = (function(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;

                                let componentValueMap = fs.getComponentValue(componentPackeage);
                                let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

                                fs.singleComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, viewStr);
                            } else {
                                let failResult = fairysupportComponentFail(retryCount, xhr);
                                if (failResult) {
                                    fs.resHtmlSingleComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, ++retryCount).then(resolve).catch(reject);
                                } else {
                                    try {
                                        throw new Error('error : load template for singleComponent : ' + viewUrl + " : " + ('statusText' in xhr ? xhr.statusText : "") + " : " + ('responseText' in xhr ? xhr.responseText : ""));
                                    } catch (err) {
                                        reject(err);
                                    }
                                }
                            }
                        }
                    }
                )(fs, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot);
                req.send();

            };
        })(this, dom, componentPackeage, viewUrl, formObj, argObj, withCredentials, position, retryCount, componentRoot));

    };

    this.paramFmt = function (fmt, paramObj, prefixName) {
        let result = '';
        if (paramObj === null || paramObj === undefined) {
            result = '';
        } else if (fmt === 'json') {
            result = JSON.stringify(paramObj)
        } else if (fmt === 'query') {
            for (const [key, value] of Object.entries(paramObj)) {
                if (value.constructor === Object) {
                    if (prefixName === '') {
                        result = result + this.paramFmt(fmt, value, key);
                    } else {
                        result = result + this.paramFmt(fmt, value, prefixName + '[' + key + ']');
                    }
                } else {
                    if (prefixName === '') {
                        result = result + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                    } else {
                        result = result + encodeURIComponent(prefixName + '[' + key + ']') + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
        } else {
            result = paramObj;
        }
        if (result === '') {
            result = null;
        }
        return result;
    };

    this.emptyAjax = function (reqUrl, paramObj, met = 'POST', fmt = 'json',  user = null, password = null){

        if (met.toLowerCase() === 'get') {
            fmt = 'query'
        }

        let paramStr = this.paramFmt(fmt, paramObj, '');
        if (met.toLowerCase() === 'get' && paramStr !== null && paramStr !== '') {
            if (paramStr.substring(paramStr.length - 1, paramStr.length) === '&') {
                paramStr = paramStr.substring(0, paramStr.length - 1)
            }
            if (reqUrl.indexOf('?') >= 0) {
                reqUrl += '&' + paramStr;
            } else {
                reqUrl += '?' + paramStr;
            }
            paramStr = null;
        }

        let req = new this.fairysupportAjaxObj(null, null, reqUrl, paramStr, null, null, null, 'ajax', null);
        req.open(met, reqUrl, true, user, password);
        return req;

    };

    this.ajax = function (reqUrl, paramObj, met = 'POST', fmt = 'json', user = null, password = null){

        let req = this.emptyAjax(reqUrl, paramObj, met, fmt,  user, password);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.responseType = 'json';

        if (fmt.toLowerCase() === 'json') {
            req.setRequestHeader('Content-Type', 'application/json');
        } else {
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        return req;

    };

    this.ajaxText = function (reqUrl, paramObj, met = 'POST', fmt = 'json', user = null, password = null){

        let req = this.emptyAjax(reqUrl, paramObj, met, fmt,  user, password);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.responseType = 'text';

        if (fmt.toLowerCase() === 'json') {
            req.setRequestHeader('Content-Type', 'application/json');
        } else {
            req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        return req;

    };

    this.emptyAjaxByForm = function (reqUrl, formObj, user = null, password = null){

        let req = new this.fairysupportAjaxObj(null, null, reqUrl, new FormData(formObj), null, null, null, 'ajaxByForm', null);
        req.open('POST', reqUrl, true, user, password);

        return req;

    };

    this.ajaxByForm = function (reqUrl, formObj, user = null, password = null){

        let req = this.emptyAjaxByForm(reqUrl, formObj, user, password);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.responseType = 'json';

        return req;

    };

    this.ajaxTextByForm = function (reqUrl, formObj, user = null, password = null){

        let req = this.emptyAjaxByForm(reqUrl, formObj, user, password);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.responseType = 'text';

        return req;

    };

    this.fairysupportAjaxObj = class FairysupportAjaxObj {
        constructor(dom, componentPackeage, viewUrl, paramObj, argObj, cb, position, metName, componentRoot) {

            this.dom = dom;
            this.componentPackeage = componentPackeage;
            this.viewUrl = viewUrl;
            this.paramObj = paramObj;
            this.argObj = argObj;
            this.cb = cb;
            this.position = position;
            this.metName = metName;
            this.componentRoot = componentRoot;

            this.xhr = new XMLHttpRequest();
            let getFunc = (function(s){return function(){return s.xhr.onreadystatechange;};})(this);
            let setFunc = (function(s){return function(newFunc){s.xhr.onreadystatechange = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onreadystatechange', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.readyState;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.readyState = newValue;};})(this);
            Object.defineProperty(this, 'readyState', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.response;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.response = newValue;};})(this);
            Object.defineProperty(this, 'response', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.responseText;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.responseText = newValue;};})(this);
            Object.defineProperty(this, 'responseText', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.responseType;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.responseType = newValue;};})(this);
            Object.defineProperty(this, 'responseType', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.responseURL;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.responseURL = newValue;};})(this);
            Object.defineProperty(this, 'responseURL', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.responseXML;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.responseXML = newValue;};})(this);
            Object.defineProperty(this, 'responseXML', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.status;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.status = newValue;};})(this);
            Object.defineProperty(this, 'status', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.statusText;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.statusText = newValue;};})(this);
            Object.defineProperty(this, 'statusText', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.timeout;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.timeout = newValue;};})(this);
            Object.defineProperty(this, 'timeout', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.upload;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.upload = newValue;};})(this);
            Object.defineProperty(this, 'upload', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.withCredentials;};})(this);
            setFunc = (function(s){return function(newValue){s.xhr.withCredentials = newValue;};})(this);
            Object.defineProperty(this, 'withCredentials', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onabort;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onabort = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onabort', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onerror;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onerror = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onerror', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onload;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onload = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onload', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onloadend;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onloadend = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onloadend', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onloadstart;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onloadstart = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onloadstart', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.onprogress;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.onprogress = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'onprogress', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(s){return function(){return s.xhr.ontimeout;};})(this);
            setFunc = (function(s){return function(newFunc){s.xhr.ontimeout = (function(s, newFunc){return function(e){newFunc(e, s.xhr);};})(s, newFunc);};})(this);
            Object.defineProperty(this, 'ontimeout', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(funcMap){return function(){return funcMap;};})(Object.create(null));
            setFunc = function(){};
            Object.defineProperty(this, '__resFunc', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
        }
        setResponseType(val) {
            this.responseType = val;
            return this;
        }
        abort() {
            this.xhr.abort();
            return this;
        }
        getAllResponseHeaders() {
            return this.xhr.getAllResponseHeaders();
        }
        getResponseHeader(headerName) {
            return this.xhr.getResponseHeader(headerName);
        }
        open(method, url, async = true, user = null, password = null) {
            this.xhr.open(method, url, async, user, password);
            return this;
        }
        overrideMimeType(mimeType) {
            this.xhr.overrideMimeType(mimeType);
            return this;
        }
        send(body) {
            if (this.paramObj !== null && this.paramObj !== undefined) {
                this.xhr.send(this.paramObj);
            } else {
                this.xhr.send(body);
            }
            return this;
        }
        sendPromise(body) {
            return new Promise((function(req, body){
                return function (resolve, reject) {
                    req.onloadend = (function(resolve, reject){
                            return function (e, xhr) {
                                if (200 === xhr.status) {
                                    resolve(xhr);
                                } else {
                                    reject(xhr);
                                }
                            };
                    })(resolve, reject);
                    req.send(body);
                };
            })(this, body));
        }
        setRequestHeader(header, value) {
            return this.xhr.setRequestHeader(header, value);
        }
        setOnreadystatechange(fn) {
            this.onreadystatechange = fn;
            return this;
        }
        setWithCredentials(val) {
            this.withCredentials = val;
            return this;
        }
        setOnabort(fn) {
            this.onabort = fn;
            return this;
        }
        setOnerror(fn) {
            this.onerror = fn;
            return this;
        }
        setOnload(fn) {
            this.onload = fn;
            return this;
        }
        setOnloadend(fn) {
            this.onloadend = fn;
            return this;
        }
        setOnloadstart(fn) {
            this.onloadstart = fn;
            return this;
        }
        setOnprogress(fn) {
            this.onprogress = fn;
            return this;
        }
        setOntimeout(fn) {
            this.ontimeout = fn;
            return this;
        }
        setReadystatechange(state, status, fn) {
            if (!('readystatechange' in this.__resFunc)) {
                this.__resFunc['readystatechange'] = Object.create(null);
            }
            if (state === null && status === null) {
                this.__resFunc['readystatechange']['default'] = fn;
            } else if (state !== null && status === null) {
                if (!('statusDefault' in this.__resFunc['readystatechange'])) {
                    this.__resFunc['readystatechange']['statusDefault'] = Object.create(null);
                }
                this.__resFunc['readystatechange']['statusDefault'][String(state)] = fn;
            } else if (state === null && status !== null) {
                if (!('stateDefault' in this.__resFunc['readystatechange'])) {
                    this.__resFunc['readystatechange']['stateDefault'] = Object.create(null);
                }
                this.__resFunc['readystatechange']['stateDefault'][String(status)] = fn;
            } else {
                if (!('fn' in this.__resFunc['readystatechange'])) {
                    this.__resFunc['readystatechange']['fn'] = Object.create(null);
                }
                if (!(state in this.__resFunc['readystatechange']['fn'])) {
                    this.__resFunc['readystatechange']['fn'][String(state)] = Object.create(null);
                }
                this.__resFunc['readystatechange']['fn'][String(state)][String(status)] = fn;
            }
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    let status = String(xhr.status);
                                    let readyState = String(xhr.readyState);

                                    if ('fn' in resFunc && readyState in resFunc['fn'] && status in resFunc['fn'][readyState]) {
                                        resFunc['fn'][readyState][status](e, xhr);
                                    } else {
                                        let execSomething = false;
                                        if ('statusDefault' in resFunc && readyState in resFunc['statusDefault']) {
                                            resFunc['statusDefault'][readyState](e, xhr);
                                            execSomething = true;
                                        }
                                        if ('stateDefault' in resFunc && status in resFunc['stateDefault']) {
                                            resFunc['stateDefault'][status](e, xhr);
                                            execSomething = true;
                                        }
                                        if (execSomething === false && 'default' in resFunc) {
                                            resFunc['default'](e, xhr);
                                        }
                                    }
                                };
                           })(this.__resFunc['readystatechange']);
            this.onreadystatechange = useFunc;
            return this;
        }
        setAbort(fn) {
            if (!('abort' in this.__resFunc)) {
                this.__resFunc['abort'] = Object.create(null);
            }
            this.__resFunc['abort']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['abort']);
            this.onabort = useFunc;
            return this;
        }
        setError(fn) {
            if (!('error' in this.__resFunc)) {
                this.__resFunc['error'] = Object.create(null);
            }
            this.__resFunc['error']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['error']);
            this.onerror = useFunc;
            return this;
        }
        setLoad(status, fn) {
            if (!('load' in this.__resFunc)) {
                this.__resFunc['load'] = Object.create(null);
            }
            if (status === null) {
                this.__resFunc['load']['default'] = fn;
            } else {
                if (!('fn' in this.__resFunc['load'])) {
                    this.__resFunc['load']['fn'] = Object.create(null);
                }
                this.__resFunc['load']['fn'][String(status)] = fn;
            }
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    let status = String(xhr.status);
                                    if ('fn' in resFunc && status in resFunc['fn']) {
                                        resFunc['fn'][status](e, xhr);
                                    } else if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['load']);
            this.onload = useFunc;
            return this;
        }
        setLoadend(status, fn) {
            if (!('loadend' in this.__resFunc)) {
                this.__resFunc['loadend'] = Object.create(null);
            }
            if (status === null) {
                this.__resFunc['loadend']['default'] = fn;
            } else {
                if (!('fn' in this.__resFunc['loadend'])) {
                    this.__resFunc['loadend']['fn'] = Object.create(null);
                }
                this.__resFunc['loadend']['fn'][String(status)] = fn;
            }
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    let status = String(xhr.status);
                                    if ('fn' in resFunc && status in resFunc['fn']) {
                                        resFunc['fn'][status](e, xhr);
                                    } else if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['loadend']);
            this.onloadend = useFunc;
            return this;
        }
        setLoadstart(fn) {
            if (!('loadstart' in this.__resFunc)) {
                this.__resFunc['loadstart'] = Object.create(null);
            }
            this.__resFunc['loadstart']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['loadstart']);
            this.onloadstart = useFunc;
            return this;
        }
        setProgress(status, fn) {
            if (!('progress' in this.__resFunc)) {
                this.__resFunc['progress'] = Object.create(null);
            }
            if (status === null) {
                this.__resFunc['progress']['default'] = fn;
            } else {
                if (!('fn' in this.__resFunc['progress'])) {
                    this.__resFunc['progress']['fn'] = Object.create(null);
                }
                this.__resFunc['progress']['fn'][String(status)] = fn;
            }
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    let status = String(xhr.status);
                                    if ('fn' in resFunc && status in resFunc['fn']) {
                                        resFunc['fn'][status](e, xhr);
                                    } else if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.__resFunc['progress']);
            this.onprogress = useFunc;
            return this;
        }
        setTimeout(fn) {
            if (typeof fn === 'function') {
                if (!('timeout' in this.__resFunc)) {
                    this.__resFunc['timeout'] = Object.create(null);
                }
                this.__resFunc['timeout']['default'] = fn;
                let useFunc = (function (resFunc) {
                                    return function (e, xhr) {
                                        if ('default' in resFunc) {
                                            resFunc['default'](e, xhr);
                                        }
                                    };
                               })(this.__resFunc['timeout']);
                this.ontimeout = useFunc;
                return this;
            } else {
                this.timeout = fn;
                return this;
            }
        }
    };

    this.getComponentController = function (componentPackeage){

        componentPackeage = componentPackeage.trim();
        let componentPath = '';
        let componentNameList = componentPackeage.split('.');
        for (let componentName of componentNameList) {
            if (componentName.trim() === '') {
                continue;
            }
            componentPath += (componentName + '/');
        }

        if (this.componentControllerList[componentPath]) {
            return this.componentControllerList[componentPath];
        }

        return null;

    };

    this.getModuleController = function (){
        return this.clazz.obj;
    };

    this.setTimeLineProp = function(obj, props){
        if (obj === null && obj === undefined) {
            return;
        }
        for (const [k, v] of Object.entries(props)) {
            if (v.constructor === Object) {
                this.setTimeLineProp(obj[k], v);
            } else {
                if (typeof v === 'function') {
                    obj[k] = v();
                } else {
                    obj[k] = v;
                }
            }
        }
    };

    this.timeLineClass =  class FairysupportTimeLineClass {
        constructor(fs, timelinePropList, preClazz, props, ms) {
            this.fs = fs;
            this.timelinePropList = timelinePropList;
            this.preClazz = preClazz;
            this.props = props;
            this.ms = ms;
        }
        execTimer() {
            if (this.preClazz !== null && this.preClazz !== undefined && this.preClazz.timerId !== null && this.preClazz.timerId !== undefined) {
                this.preClazz.clerTimer();
            }
            if (this.timerId !== null && this.timerId !== undefined) {
                let propsValues = this.props.values();
                for (let propsVal of propsValues) {
                    this.fs.setTimeLineProp(propsVal.obj, propsVal.value);
                }
            }
            let timelineProp = this.timelinePropList.shift();
            if (timelineProp !== null && timelineProp !== undefined) {
                let timeLineClazz = new this.fs.timeLineClass(this.fs, this.timelinePropList, this, timelineProp.prop, timelineProp.ms);
                timeLineClazz.timerId = window.setTimeout(timeLineClazz.execTimer.bind(timeLineClazz), timelineProp.ms - this.ms);
            } else {
                this.clerTimer();
            }
        }
        clerTimer() {
            window.clearTimeout(this.timerId);
        }
    };

    this.timeline = function (argTimelinePropList){

        let timelinePropList = [].concat(argTimelinePropList);
        timelinePropList.sort(function(a, b){
            if(a.ms < b.ms) {
                return -1;
            } else if(a.ms === b.ms) {
                return 0;
            } else {
                return 1;
            }
        });

        let timeLineClazz = new this.timeLineClass(this, timelinePropList, null, null, 0);
        timeLineClazz.execTimer();
    };

    this.envValue = function (name){
        return envValueObj[name];
    };

    this.msg = function (name, replaceObj){
        let str = '';
        if (name in msgObj) {
            str = msgObj[name];
        }
        
        if (replaceObj === null || replaceObj === undefined) {
            return str;
        }

        for (const [key, value] of Object.entries(replaceObj)) {
            let re = new RegExp("(?<!\\\\)\\$\\{" + key + "\\}", "g");
            str = str.replace(re, value);
            let reEscape = new RegExp("\\\\\\$\\{" + key + "\\}", "g");
            str = str.replace(reEscape, "${" + key + "}");
        }
        return str;

    };

    this.componentEnvValue = function (componentPackeage, name){
        if (!(componentPackeage in componentEnvValueObj)) {
            return null;
        }
        return componentEnvValueObj[componentPackeage][name];
    };

    this.componentMsg = function (componentPackeage, name, replaceObj){
        if (!(componentPackeage in componentMsgObj)) {
            return null;
        }
        let str = '';
        if (name in componentMsgObj[componentPackeage]) {
            str = componentMsgObj[componentPackeage][name];
        }

        if (replaceObj === null || replaceObj === undefined) {
            return str;
        }

        for (const [key, value] of Object.entries(replaceObj)) {
            let re = new RegExp("(?<!\\\\)\\$\\{" + key + "\\}", "g");
            str = str.replace(re, value);
            let reEscape = new RegExp("\\\\\\$\\{" + key + "\\}", "g");
            str = str.replace(reEscape, "${" + key + "}");
        }
        return str;

    };

    this.addMeta = function (element, mata){
        metaMap.set(element, mata);
    };

    this.getMeta = function (element){
        return metaMap.get(element);
    };

    this.deleteMeta = function (element){
        metaMap.delete(element);
    };

    this.validate = function (obj, prop, eventList, funcList, funcArg){
        let preValueHolder = {
                preVal: Object.create(null)
        };
        this.wrapObjAccessor(obj, prop, funcList, preValueHolder, eventList, funcArg);
    }

    this.wrapObjAccessor = function (obj, prop, funcList, preValueHolder, eventList, funcArg){

        let protoPropertyDescriptor = this.getPrototypePropertyDescriptor(obj, prop);

        let getFunc = (function(protoPropertyDescriptor, obj){
            return function(){
                return protoPropertyDescriptor.get.call(obj);
            }
        })(protoPropertyDescriptor, obj);
        let setFunc = (function(protoPropertyDescriptor, obj, funcList, funcArg, prop){
            return function(arg){
                let valid = true;
                for (const func of funcList) {
                    let funcResult = func(obj, prop, arg, protoPropertyDescriptor.get.call(obj), funcArg);
                    if (!funcResult) {
                        valid = funcResult;
                    }
                }
                if (valid) {
                    protoPropertyDescriptor.set.call(obj, arg);
                }
            }
        })(protoPropertyDescriptor, obj, funcList, funcArg, prop);

        Object.defineProperty(obj, prop, {
            enumerable: true,
            configurable: true,
            get: getFunc,
            set : setFunc
        });

        if (eventList !== null && eventList !== undefined && 'addEventListener' in obj) {
            preValueHolder.preVal[prop] = obj[prop];
            obj.addEventListener("focus",
                                 (function(preValueHolder, obj, prop){
                                    return function(){
                                        preValueHolder.preVal[prop] = obj[prop];
                                    };
                                 })(preValueHolder, obj, prop));
            let eventFunc = (function (funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop){
                return function (event) {
                    let valid = true;
                    for (const func of funcList) {
                        let funcResult = func(obj, prop, obj[prop], preValueHolder.preVal[prop], funcArg);
                        if (!funcResult) {
                            valid = funcResult;
                        }
                    }
                    if (!valid) {
                        protoPropertyDescriptor.set.call(obj, preValueHolder.preVal[prop]);
                    }
                    preValueHolder.preVal[prop] = obj[prop];
                };
            })(funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop);
            for (const eventName of eventList) {
                obj.addEventListener(eventName, eventFunc);
            }
        }

        let initValid = true;
        for (const func of funcList) {
            let funcResult = func(obj, prop, protoPropertyDescriptor.get.call(obj), protoPropertyDescriptor.get.call(obj), funcArg);
            if (!funcResult) {
                initValid = funcResult;
            }
        }
        if (!initValid) {
            protoPropertyDescriptor.set.call(obj, null);
        }

    }

    this.getPrototypePropertyDescriptor = function (obj, propName){
        let protoObj = Object.getPrototypeOf(obj);
        let protoPropertyDescriptor = null;
        if (protoObj === null || protoObj == undefined) {
            protoPropertyDescriptor = Object.create(null);
        } else {
            protoPropertyDescriptor = Object.getOwnPropertyDescriptor(protoObj, propName);
            if (protoPropertyDescriptor === null || protoPropertyDescriptor === undefined) {
                protoPropertyDescriptor = Object.create(null);
            }
            if ('configurable' in protoPropertyDescriptor && !protoPropertyDescriptor.configurable) {
                return;
            }
        }
        if (!('get' in protoPropertyDescriptor) || !('set' in protoPropertyDescriptor)) {

            let newProtoPropertyDescriptor = Object.create(null);
            let accessor = {
                    val: obj[propName]
            };
            accessor.get = (function(obj){return function(){return obj.val;}})(accessor);
            accessor.set = (function(obj){return function(arg){return obj.val = arg;}})(accessor);
            if ('get' in protoPropertyDescriptor) {
                newProtoPropertyDescriptor.get = (function (accessor, obj, protoPropertyDescriptor) {
                    return function () {
                        protoPropertyDescriptor.get.call(obj);
                        return accessor.get();
                    }
                })(accessor, obj, protoPropertyDescriptor);
            } else {
                newProtoPropertyDescriptor.get = (function (accessor) {
                    return function () {
                        return accessor.get();
                    }
                })(accessor);
            }
            if ('set' in protoPropertyDescriptor) {
                newProtoPropertyDescriptor.set = (function (accessor, obj, protoPropertyDescriptor) {
                    return function (arg) {
                        accessor.set(arg);
                        protoPropertyDescriptor.set.call(obj, arg);
                    }
                })(accessor, obj, protoPropertyDescriptor);
            } else {
                newProtoPropertyDescriptor.set = (function (accessor) {
                    return function (arg) {
                        accessor.set(arg);
                    }
                })(accessor);
            }
            newProtoPropertyDescriptor.configurable = true;
            newProtoPropertyDescriptor.enumerable = true;
            Object.defineProperty(obj, propName, newProtoPropertyDescriptor);
            protoPropertyDescriptor = newProtoPropertyDescriptor
        }
        return protoPropertyDescriptor;
    }

    this.linkEvent = function (fromObj, toObj, eventList){
        for (const eventName of eventList) {
            fromObj.addEventListener(eventName, toObj[eventName].bind(toObj));
        }
    }

    this.getReqLang = function () {
        return reqLang;
    }

    this.getConfLang = function () {
        return confLang;
    }

    this.storeClass = class FairysupportStore {
        constructor() {
            this.data = new Map();
            this.listener = new Map();
        }
        set(k, v) {
            let setFlg = true;
            if (this.listener.has(k)) {
                for (let l of this.listener.get(k).values()) {
                    setFlg = l(k, v);
                    if (setFlg === false) {
                        return;
                    }
                }
            }
            this.data.set(k, v);
        }
        get(k) {
            return this.data.get(k);
        }
        delete(k) {
            return this.data.delete(k);
        }
        addListener(k, l){
            if (!this.listener.has(k)) {
                this.listener.set(k, new Map());
            }
            this.listener.get(k).set(l, l);
        }
        removeListener(k, l){
            if (!this.listener.has(k)) {
                this.listener.set(k, new Map());
            }
            this.listener.get(k).delete(l);
        }
    };

    let storeInstance = new this.storeClass();

    this.store = function () {
        return storeInstance;
    };

    this.getCamelCb = function () {
        return function (match) {
            return match.substring(match.length - 1, match.length).toUpperCase();
        };
    };
    this.getCamel = function (str){
        let re = new RegExp("[_\\-].", "g");
        str = str.replace(re, this.getCamelCb());
        str = str.substring(0, 1).toUpperCase() + str.substring(1, str.length);
        return str;

    };

    this.init();

}
const $___fairysupport_param = function(v, l, tpl) {
    let returnVal = null;
    try {
        returnVal = eval(tpl);
    } catch (e) {
        throw new Error(tpl + "\n" + e.toString());
    }
    if (returnVal === undefined) {
        throw new Error("Error :" + tpl + " is undefined");
    }
    return returnVal;
}
const $f = new ___fairysupport();
