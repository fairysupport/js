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

    let metaMap = new WeakMap();

    let fsTimeout = ('dataset' in scriptObj && 'timeout' in scriptObj.dataset) ? scriptObj.dataset.timeout : 0;
    fsTimeout = fsTimeout - 0;

    let pageRoot = scriptObj.dataset.pageRoot;

    let envTxt = "";

    this.instanceMap = {};

    const msgObj = Object.create(null);
    const envValueObj = Object.create(null);

    const componentMsgObj = new WeakMap();
    const componentEnvValueObj = new WeakMap();
    
    const uniqueComponentDomControllerMap = new WeakMap();

    const validatorGroupObj = Object.create(null);
    const validatorReverseMap = new WeakMap();
    const validatorLatestResultObj = Object.create(null);
    
    if (!('fairysupportInitFail' in window)) {
        window.fairysupportInitFail = function (retryCount, error) {
            console.error(error);
            alert('network error');
            return false;
        }
    }
    if (!('fairysupportTemplateFail' in window)) {
        window.fairysupportTemplateFail = function (retryCount, error) {
            console.error(error);
            alert('network error');
            return false;
        }
    }
    if (!('fairysupportComponentFail' in window)) {
        window.fairysupportComponentFail = function (retryCount, error) {
            console.error(error);
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
        .catch((function(version, moduleRoot, modulePath, retryCount, fs){
                return function (err) {
                    let failResult = fairysupportInitFail(retryCount, err);
                    if (failResult) {
                        fs.loadModuleController(version, moduleRoot, modulePath, ++retryCount);
                    }
                }
            }
        )(version, moduleRoot, modulePath, retryCount, this))
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
            const removeSet = new WeakSet();
            const addSet = new WeakSet();
            for (let record of records) {
                if (record.type === 'childList') {
                    for (let i = 0; i < record.removedNodes.length; i++) {
                        removeSet.add(record.removedNodes.item(i));
                    }
                    for (let i = 0; i < record.addedNodes.length; i++) {
                        addSet.add(record.addedNodes.item(i));
                    }
                }
            }
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
                    for (let i = 0; i < record.removedNodes.length; i++) {
                        if (removeSet.has(record.removedNodes.item(i)) && addSet.has(record.removedNodes.item(i))) {
                            continue;
                        }
                        fs.removeAllNest(record.removedNodes.item(i));
                    }
                    for (let i = 0; i < record.addedNodes.length; i++) {
                        if (removeSet.has(record.addedNodes.item(i)) && addSet.has(record.addedNodes.item(i))) {
                            continue;
                        }
                        fs.bindAllNest(record.addedNodes.item(i));
                    }
                }
            }
        });
        let config = {attributes: true, childList: true, subtree: true , attributeOldValue: true};
        observer.observe(bodyObj[0], config);
        fs.bindBody();
    };
    
    this.initExecForController = function (fs, addNode) {
        
        if (fs.componentDomInitFuncMap.has(addNode)) {
            let initFunc = fs.componentDomInitFuncMap.get(addNode);
            fs.componentDomInitFuncMap.delete(addNode);
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

        if (fs.bindDomInitFuncMap.has(addNode)) {
            let bindCb = fs.bindDomInitFuncMap.get(addNode);
            fs.bindDomInitFuncMap.delete(addNode);
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
        
        this.initExecForController(this, obj);
        
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
        
        if (validatorReverseMap.has(obj)) {
            let validatorGroupList = validatorReverseMap.get(obj);
            for (let validatorGroup of validatorGroupList) {
                if (validatorGroup in validatorGroupObj) {
                    validatorGroupObj[validatorGroup].delete(obj);
                    if (validatorGroupObj[validatorGroup].size <= 0) {
                        delete validatorGroupObj[validatorGroup];
                    }
                }
                if (validatorGroup in validatorLatestResultObj) {
                    validatorLatestResultObj[validatorGroup].delete(obj);
                    if (validatorLatestResultObj[validatorGroup].size <= 0) {
                        delete validatorLatestResultObj[validatorGroup];
                    }
                }
            }
            validatorReverseMap.delete(obj);
        }
        
        this.deleteMeta(obj);
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset.obj;
            let bindList = dataset.list;
            let name = dataset.name;
            
            if (uniqueComponentDomControllerMap.has(obj)) {
                let uniqueComponentDomControllerMapValue = uniqueComponentDomControllerMap.get(obj);
                let uniqueComponentControllerObj = uniqueComponentDomControllerMapValue['controller'];
                let uniqueComponentControllerMethodList = this.getMethodList(uniqueComponentControllerObj);
                if ('obj' in uniqueComponentDomControllerMapValue && uniqueComponentDomControllerMapValue['obj'] !== undefined) {
                    uniqueComponentControllerObj[uniqueComponentDomControllerMapValue['obj']] = null;
                }
                if ('list' in uniqueComponentDomControllerMapValue && uniqueComponentDomControllerMapValue['list'] !== undefined) {
                    uniqueComponentControllerObj[uniqueComponentDomControllerMapValue['list']].remove(obj);
                }
                if ('nameInfo' in uniqueComponentDomControllerMapValue && uniqueComponentDomControllerMapValue['nameInfo'] !== undefined) {
                    for (let nameInfo of uniqueComponentDomControllerMapValue['nameInfo']) {
                        for (let uniqueComponentDataName of nameInfo['dataNameList']) {
                            this.execMethod(uniqueComponentControllerObj, uniqueComponentControllerMethodList, 'beforeRemoveName', {'name': uniqueComponentDataName, 'event': nameInfo['eventName'], 'value': obj});
                        }
                    }
                    obj.removeEventListener(uniqueComponentDomControllerMapValue['nameInfo']['eventName'], uniqueComponentDomControllerMapValue['nameInfo']['fn']);
                    for (let nameInfo of uniqueComponentDomControllerMapValue['nameInfo']) {
                        for (let uniqueComponentDataName of nameInfo['dataNameList']) {
                            this.execMethod(uniqueComponentControllerObj, uniqueComponentControllerMethodList, 'afterRemoveName', {'name': uniqueComponentDataName, 'event': nameInfo['eventName'], 'value': obj});
                        }
                    }
                }
            }

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
            if (targetInfo) {
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

    this.loadComponentReqMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentDirUrl, immediatelyResolve){

        if (reqLang !== null && reqLang !== undefined && reqLang !== '') {

            let queryLangStr = '.' + reqLang;
            let req = null;
            if (componentDirUrl !== null && componentDirUrl !== undefined) {
                req = this.ajax(componentDirUrl + '/' + componentValueMap['componentPath'] + 'msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            } else {
                req = this.ajax(componentRoot + componentValueMap['componentPath'] + 'msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            }
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, null, componentDirUrl, json, immediatelyResolve);
                        } else if (404 === xhr.status) {
                            fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0, componentDirUrl, immediatelyResolve);
                        } else {
                            let failResult = fairysupportComponentFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount, componentDirUrl, immediatelyResolve);
                            }
                        }
                    }
                }
            )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve);
            req.send();

        } else {
            fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0, componentDirUrl, immediatelyResolve);
        }

    };

    this.loadComponentBrowserMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentDirUrl, immediatelyResolve){

        if (confLang !== null && confLang !== undefined && confLang !== '') {

            let queryLangStr = '.' + confLang;
            let req = null;
            if (componentDirUrl !== null && componentDirUrl !== undefined) {
                req = this.ajax(componentDirUrl + '/' + componentValueMap['componentPath'] + 'msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            } else {
                req = this.ajax(componentRoot + componentValueMap['componentPath'] + 'msg' + queryLangStr + '.json' + '?' + fs.version, null, 'GET', 'query');
            }
            req.timeout = fsTimeout;
            req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve){
                    return function (e, xhr) {
                        if (200 === xhr.status) {
                            let json = xhr.response;
                            nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, null, componentDirUrl, json, immediatelyResolve);
                        } else if (404 === xhr.status) {
                            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0, componentDirUrl, immediatelyResolve);
                        } else {
                            let failResult = fairysupportComponentFail(retryCount, xhr);
                            if (failResult) {
                                fs.loadComponentBrowserMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount, componentDirUrl, immediatelyResolve);
                            }
                        }
                    }
                }
            )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve);
            req.send();

        } else {
            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, 0, componentDirUrl, immediatelyResolve);
        }

    };

    this.loadComponentDefaultMsg = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentDirUrl, immediatelyResolve){

        let req = null;
        if (componentDirUrl !== null && componentDirUrl !== undefined) {
            req = this.ajax(componentDirUrl + '/' + componentValueMap['componentPath'] + 'msg.json' + '?' + fs.version, null, 'GET', 'query');
        } else {
            req = this.ajax(componentRoot + componentValueMap['componentPath'] + 'msg.json' + '?' + fs.version, null, 'GET', 'query');
        }
        req.timeout = fsTimeout;
        req.onloadend = (function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve){
                return function (e, xhr) {
                    if (200 === xhr.status) {
                        let json = xhr.response;
                        nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, null, componentDirUrl, json, immediatelyResolve);
                    } else if (404 === xhr.status) {
                        nextFunc(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, null, componentDirUrl, {}, immediatelyResolve);
                    } else {
                        let failResult = fairysupportComponentFail(retryCount, xhr);
                        if (failResult) {
                            fs.loadComponentDefaultMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, ++retryCount, componentDirUrl, immediatelyResolve);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, nextFunc, retryCount, componentEnvValueObj, componentDirUrl, immediatelyResolve);
        req.send();

    };

    this.singleComponentInsertFunc = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, immediatelyResolve){

        this.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, this.singleComponentInsertFuncExec.bind(fs), 0, null, immediatelyResolve);

    };

    this.singleComponentInsertFuncExec = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        let func = function () {};
        if (cb !== null && cb !== undefined && typeof cb === 'function') {
            func = cb;
        }

        import(componentControllerPath + '?' + fs.version)
        .then(fs.loadSingleComponentControllerMethodList(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj, msgObj, immediatelyResolve))
        .catch((function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve){
                return function (err) {
                    let failResult = fairysupportComponentFail(retryCount, err);
                    if (failResult) {
                        fs.singleComponentInsertFuncExec(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, ++retryCount, componentDirUrl, msgObj, immediatelyResolve);
                    } else {
                        if (errCb !== null && errCb !== undefined) {
                            errCb(err);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve))
        ;

    };

    this.loadSingleComponentControllerMethodList = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj, msgObj, immediatelyResolve){
        return function (Module){

            if (viewStr === undefined || viewStr === null) {
                viewStr = Module.__fairysupport__viewStr;
            }

            let componentPath = componentValueMap['componentPath'];
            let classFullName = 'components/' + componentPath.substring(0, componentPath.length - 1);
            if (!fs.instanceMap[classFullName]) {

                let componentPathSplit = componentPath.split('/');
                let componentClass = fs.getCamel(componentPathSplit[componentPathSplit.length - 2]);
                fs.componentControllerList[componentPath] = new Module[componentClass]();
                
                componentMsgObj.set(fs.componentControllerList[componentPath], msgObj);
                componentEnvValueObj.set(fs.componentControllerList[componentPath], Module.__fairysupport__envValueObj);
                
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

            let insertComponentFunc = fs.getInsertComponent(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, fs.componentControllerList[componentPath], immediatelyResolve);
            insertComponentFunc();

        };
    };

    this.getInsertComponent = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, controllerObj, immediatelyResolve){
        return function (){

            let cb = (function (fs, dom, componentValueMap, argObj, func, position, immediatelyResolve) {
                return function(viewDom) {
                    
                    if (!(componentValueMap['componentPackeage'] in fs.componentPackageList)) {
                        fs.componentPackageList[componentValueMap['componentPackeage']] = componentValueMap;
                    }

                    let addNodeList = [];
                    for (let i = 0; i < viewDom.childNodes.length; i++) {
                        addNodeList.push(viewDom.childNodes.item(i));
                    }
                    
                    let initFunc = fs.getComponentMethod(fs, componentValueMap['componentPath'], 'init', argObj, (function(func, addNodeList){return function(){func(addNodeList);};})(func, addNodeList));

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

                    if (dom) {
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
                    
                    if (true === immediatelyResolve) {
                        func(addNodeList);
                    }

                };
            })(fs, dom, componentValueMap, argObj, func, position, immediatelyResolve);

            if (argObj === null || argObj === undefined) {
                argObj = Object.create(null);
            }
            argObj['_controller'] = controllerObj;

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
        #objMap;
        #bindListStr;
        #beforeMet;
        #afterMet;
        #addBeforeMet;
        #addAfterMet;
        #fairysupportClear;
        constructor(bindList, beforeFn, afterFn, addBeforeFn, addAfterFn, fairysupportClear) {
            this.#objMap = new Map();
            this.#bindListStr = bindList;
            this.#beforeMet = beforeFn;
            this.#afterMet = afterFn;
            this.#addBeforeMet = addBeforeFn;
            this.#addAfterMet = addAfterFn;
            this.#fairysupportClear = fairysupportClear;
        }
        size() {
            return this.#objMap.size;
        }
        has(element) {
            return this.#objMap.has(element);
        }
        add(element) {
            this.#addBeforeMet({'name': this.#bindListStr, 'value': element});
            this.#objMap.set(element, element);
            this.#addAfterMet({'name': this.#bindListStr, 'value': element});
            return this;
        }
        replace(oldElement, newElement) {
            this.#beforeMet({'name': this.#bindListStr, 'value': oldElement});
            this.#objMap.delete(oldElement);
            if (oldElement) {
                if (oldElement.parentNode && !(newElement instanceof fairysupportClear)) {
                    if (newElement === null || newElement=== undefined) {
                        oldElement.parentNode.removeChild(oldElement);
                    } else if (newElement instanceof Node) {
                        oldElement.parentNode.replaceChild(newElement, oldElement);
                    }
                }
            }
            this.#afterMet({'name': this.#bindListStr, 'value': oldElement});
            return this;
        }
        remove(element) {
            this.#beforeMet({'name': this.#bindListStr, 'value': element});
            this.#objMap.delete(element);
            if (element && element.parentNode && !(element instanceof fairysupportClear)) {
                element.parentNode.removeChild(element);
            }
            this.#afterMet({'name': this.#bindListStr, 'value': element});
            return this;
        }
        values() {
            return this.#objMap.values();
        }
        forEach(fn, arg = null){
            if (arg === null) {
                for (let value of this.#objMap.values()) {
                    fn(value);
                }
            } else {
                for (let value of this.#objMap.values()) {
                    fn(value, arg);
                }
            }
        }
        toArray(){
            let ret = [];
            for (let value of this.#objMap.values()) {
                ret.push(value);
            }
            return ret;
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
                                    let ret = true;
                                    for (let func of fnList) {
                                        ret = true;
                                        try {
                                            if (classObj.beforeEvent && typeof classObj.beforeEvent === 'function') {
                                                classObj.beforeEvent(e);
                                            }
                                            ret = func(e);
                                            if (classObj.afterEvent && typeof classObj.afterEvent === 'function') {
                                                classObj.afterEvent(e, ret);
                                            }
                                            if (ret === false) {
                                                return ret;
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
                                            return ret;
                                        }
                                    }
                                    return ret;
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
        let result = [];
        let keyEventValueNameList = Object.create(null);
        let dataFullNameSplit = dataFullName.split(',');
        for (let i = 0; i < dataFullNameSplit.length; i++) {
            let trimDataName = dataFullNameSplit[i].trim();
            if (trimDataName in eventMethodList) {
                for (let eventName of eventMethodList[trimDataName].values()) {
                    if (!((trimDataName + '_' + eventName) in methodList)) {
                        continue;
                    }
                    if (!(eventName in keyEventValueNameList)) {
                        keyEventValueNameList[eventName] = Object.create(null);
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
                    let ret = true;
                    for (let func of Object.values(fnList)) {
                        ret = true;
                        try {
                            if (classObj.beforeEvent && typeof classObj.beforeEvent === 'function') {
                                classObj.beforeEvent(e);
                            }
                            ret = func(e);
                            if (classObj.afterEvent && typeof classObj.afterEvent === 'function') {
                                classObj.afterEvent(e, ret);
                            }
                            if (ret === false) {
                                return ret;
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
                            return ret;
                        }
                    }
                    return ret
                };
            })(fnList, classObj, moduleClassObj);

            dom.addEventListener(eventName, eventFn);
            
            result.push({'dom': dom, 'eventName' : eventName, 'fn': eventFn, 'dataNameList': Object.keys(fnList)});

            for (let dataName in fnList) {
                this.execMethod(classObj, methodList, 'afterName', {'name': dataName, 'event': eventName, 'value': dom});
            }

        }
        
        return result;
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
        template.innerHTML = "\n".concat(viewStr);
        let viewDom = template.content;

        if (paramObj === null || paramObj === undefined) {
            paramObj = Object.create(null);
        }

        let retObj = Object.create(null);
        let localValue = Object.create(null);
        this.developTpl(viewDom, paramObj, localValue, retObj, errCb, cb, true);

    };

    this.getTplChildNodeList = function* (childNodesContainer){
        if (childNodesContainer['selfExe'] && childNodesContainer['dom'] !== undefined && childNodesContainer['dom'] !== null) {
            yield childNodesContainer['dom'];
        }

        for (childNodesContainer['i'] = 0; childNodesContainer['i'] < childNodesContainer['childNodes'].length; childNodesContainer['i']++) {
            yield childNodesContainer.childNodes.item(childNodesContainer['i']);
        }

        if (childNodesContainer['cb'] !== undefined && childNodesContainer['cb'] !== null) {
            childNodesContainer['cb'](childNodesContainer['dom']);
        }

    };

    this.developTpl = async function(dom, paramObj, localValue, retObj, errCb, cb, selfExe){

        try {

            if (dom === null || dom === undefined) {
                if (cb !== undefined && cb !== null) {
                    cb(dom);
                }
                return 'success';
            }

            let skipObjMap = new WeakMap();

            let ifExecutingFlg = null;

            let childList = dom.childNodes;
            let child = null;
            let childNodesContainer = {'childNodes' : childList, 'i': 0, 'cb': cb, 'dom': dom, 'selfExe': selfExe};
            skipObjMap.set(dom, dom);
            if (childList !== null && childList !== undefined) {
                for await (child of this.getTplChildNodeList(childNodesContainer)) {

                    if ('continueVal' in retObj && retObj.continueVal > 0) {
                        this.selfAndNextDelete(child);
                        if (cb !== undefined && cb !== null) {
                            cb(dom);
                        }
                        return 'success';
                    }
                    if ('breakVal' in retObj && retObj.breakVal > 0) {
                        this.selfAndNextDelete(child);
                        if (cb !== undefined && cb !== null) {
                            cb(dom);
                        }
                        return 'success';
                    }

                    if (child instanceof CharacterData) {
                        continue;
                    }

                    let dataset = child.dataset;
                    if (dataset === null || dataset === undefined) {
                        continue;
                    }
                    
                    let dataValue = null;

                    dataValue = dataset.else;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.else;
                        if (ifExecutingFlg === false) {
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                            dataset = Object.create(null);
                            if (childNodesContainer['i'] > 0) {
                                childNodesContainer['i']--;
                            }
                        } else if (ifExecutingFlg === true) {
                            ifExecutingFlg = false;
                        } else {
                            ifExecutingFlg = false;
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                            dataset = Object.create(null);
                            if (childNodesContainer['i'] > 0) {
                                childNodesContainer['i']--;
                            }
                        }
                    }

                    dataValue = dataset.elseif;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.elseif;
                        if (ifExecutingFlg === false) {
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                            dataset = Object.create(null);
                            if (childNodesContainer['i'] > 0) {
                                childNodesContainer['i']--;
                            }
                        } else if (ifExecutingFlg === true) {
                            let value = $___fairysupport_param(paramObj, localValue, dataValue);
                            if (value) {
                                ifExecutingFlg = false;
                            } else {
                                child.innerHTML = '';
                                child.parentNode.removeChild(child);
                                child = null;
                                dataset = Object.create(null);
                                if (childNodesContainer['i'] > 0) {
                                    childNodesContainer['i']--;
                                }
                            }
                        } else {
                            ifExecutingFlg = false;
                            child.innerHTML = '';
                            child.parentNode.removeChild(child);
                            child = null;
                            dataset = Object.create(null);
                            if (childNodesContainer['i'] > 0) {
                                childNodesContainer['i']--;
                            }
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
                            dataset = Object.create(null);
                            if (childNodesContainer['i'] > 0) {
                                childNodesContainer['i']--;
                            }
                        }
                    }

                    dataValue = dataset.continue;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.continue;
                        retObj.continueVal = dataValue;
                        if (dataValue > 0) {
                            this.nextDelete(child);
                            this.deleteTag(child, dataset.tag);
                            if (cb !== undefined && cb !== null) {
                                cb(dom);
                            }
                            return 'success';
                        }
                    }

                    dataValue = dataset.break;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.break;
                        retObj.breakVal = dataValue;
                        if (dataValue > 0) {
                            this.nextDelete(child);
                            this.deleteTag(child, dataset.tag);
                            if (cb !== undefined && cb !== null) {
                                cb(dom);
                            }
                            return 'success';
                        }
                    }

                    let forStart = dataset.forStart;
                    let forEnd = dataset.forEnd;
                    let forStep = dataset.forStep;
                    let forSkip = dataset.forSkip;
                    if (child !== null && child !== undefined && forStart !== null && forStart !== undefined && forEnd !== null && forEnd !== undefined && forStep !== null && forStep !== undefined) {
                        delete child.dataset.forStart;
                        delete child.dataset.forEnd;
                        delete child.dataset.forStep;
                        delete child.dataset.forSkip;
                        let firstFlg = true;
                        let firstElement = null;
                        for ($___fairysupport_param(paramObj, localValue, forStart); $___fairysupport_param(paramObj, localValue, forEnd); $___fairysupport_param(paramObj, localValue, forStep)) {
                            
                            let forSkipValue = $___fairysupport_param(paramObj, localValue, forSkip);
                            if (forSkipValue) {
                                continue;
                            }
                            
                            let newChild = child.cloneNode(true);
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb, null, true).catch((error) => {throw error;});
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                        if (child !== null && child !== undefined && child.dataset !== null && child.dataset !== undefined) {
                            dataset = child.dataset;
                        } else {
                            dataset = Object.create(null);
                        }

                    }

                    let foreachArray = dataset.foreach;
                    let foreachKey = dataset.foreachKey;
                    let foreachValue = dataset.foreachValue;
                    let foreachSkip = dataset.foreachSkip;
                    let foreachEnd = dataset.foreachEnd;
                    if (child !== null && child !== undefined && foreachArray !== null && foreachArray !== undefined && foreachKey !== null && foreachKey !== undefined && foreachValue !== null && foreachValue !== undefined) {
                        delete child.dataset.foreach;
                        delete child.dataset.foreachKey;
                        delete child.dataset.foreachValue;
                        delete child.dataset.foreachSkip;
                        delete child.dataset.foreachEnd;
                        let firstFlg = true;
                        let firstElement = null;
                        for (const [localForeachKey, localForeachValue] of Object.entries($___fairysupport_param(paramObj, localValue, foreachArray))) {
                            
                            localValue[foreachKey] = localForeachKey;
                            localValue[foreachValue] = localForeachValue;
                            
                            let foreachSkipValue = $___fairysupport_param(paramObj, localValue, foreachSkip);
                            if (foreachSkipValue) {
                                continue;
                            }
                            
                            let foreachEndValue = $___fairysupport_param(paramObj, localValue, foreachEnd);
                            if (foreachEndValue) {
                                break;
                            }
                            
                            let newChild = child.cloneNode(true);
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb, null, true).catch((error) => {throw error;});
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                        if (child !== null && child !== undefined && child.dataset !== null && child.dataset !== undefined) {
                            dataset = child.dataset;
                        } else {
                            dataset = Object.create(null);
                        }

                    }

                    let whileValue = dataset.while;
                    let whileSkip = dataset.whileSkip;
                    let whileStep = dataset.whileStep;
                    if (child !== null && child !== undefined && whileValue !== null && whileValue !== undefined) {
                        delete child.dataset.while;
                        delete child.dataset.whileSkip;
                        delete child.dataset.whileStep;
                        let firstFlg = true;
                        let firstElement = null;
                        let stepFirstFlg = true;
                        while ($___fairysupport_param(paramObj, localValue, whileValue)) {
                            
                            if (!stepFirstFlg) {
                                $___fairysupport_param(paramObj, localValue, whileStep);
                            }
                            stepFirstFlg = false;
                            
                            let whileSkipValue = $___fairysupport_param(paramObj, localValue, whileSkip);
                            if (whileSkipValue) {
                                continue;
                            }
                            
                            let newChild = child.cloneNode(true);
                            await this.developTpl(newChild, paramObj, localValue, retObj, errCb, null, true).catch((error) => {throw error;});
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                                    this.deleteTag(firstElement, dataset.tag);
                                    if (cb !== undefined && cb !== null) {
                                        cb(dom);
                                    }
                                    return 'success';
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
                        if (child !== null && child !== undefined && child.dataset !== null && child.dataset !== undefined) {
                            dataset = child.dataset;
                        } else {
                            dataset = Object.create(null);
                        }

                    }

                    dataValue = dataset.loadOnly;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined && dataValue === 'true' && child.tagName.toUpperCase() === 'SCRIPT') {
                        delete child.dataset.loadOnly;
                        $___fairysupport_param(paramObj, localValue, child.textContent);
                        child.innerHTML = '';
                        child.parentNode.removeChild(child);
                        child = null;
                        dataset = Object.create(null);
                        if (childNodesContainer['i'] > 0) {
                            childNodesContainer['i']--;
                        }
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

                        
                        let templateVariable = dataset.templateVariable;
                        delete child.dataset.templateVariable;
                        
                        let templateVariableObj = Object.create(null);
                        try {
                            templateVariableObj = $___fairysupport_param(paramObj, localValue, templateVariable);
                        } catch (templateError) {
                            templateVariableObj = templateVariable;
                        }
                        

                        try {
                            await this.loadTemplate(child, value, templateVariableObj, null, 0, null, true).catch((error) => {throw error;});
                        } catch(error) {
                            throw error;
                        }
                        
                    }

                    dataValue = dataset.singleComponent;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.singleComponent;

                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (templateError) {
                            value = dataValue;
                        }
                        
                        
                        let singleComponentVariable = dataset.singleComponentVariable;
                        delete child.dataset.singleComponentVariable;
                        
                        let singleComponentVariableObj = Object.create(null);
                        try {
                            singleComponentVariableObj = $___fairysupport_param(paramObj, localValue, singleComponentVariable);
                        } catch (componentError) {
                            singleComponentVariableObj = singleComponentVariable;
                        }
                        

                        try {
                            await this.innerLoadSingleComponent(child, value, singleComponentVariableObj).catch((error) => {throw error;});
                        } catch(error) {
                            throw error;
                        }
                        
                    }

                    dataValue = dataset.uniqueComponent;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.uniqueComponent;

                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (templateError) {
                            value = dataValue;
                        }
                        
                        
                        let uniqueComponentVariable = dataset.uniqueComponentVariable;
                        delete child.dataset.uniqueComponentVariable;
                        
                        let uniqueComponentVariableObj = Object.create(null);
                        try {
                            uniqueComponentVariableObj = $___fairysupport_param(paramObj, localValue, uniqueComponentVariable);
                        } catch (componentError) {
                            uniqueComponentVariableObj = uniqueComponentVariable;
                        }
                        

                        try {
                            await this.innerLoadUniqueComponent(child, value, uniqueComponentVariableObj).catch((error) => {throw error;});
                        } catch(error) {
                            throw error;
                        }
                        
                    }

                    dataValue = dataset.webComponent;
                    if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                        delete child.dataset.webComponent;

                        let value = "";
                        try {
                            value = $___fairysupport_param(paramObj, localValue, dataValue);
                        } catch (templateError) {
                            value = dataValue;
                        }
                        
                        
                        let webComponentVariable = dataset.webComponentVariable;
                        delete child.dataset.webComponentVariable;
                        
                        let webComponentVariableObj = Object.create(null);
                        try {
                            webComponentVariableObj = $___fairysupport_param(paramObj, localValue, webComponentVariable);
                        } catch (componentError) {
                            webComponentVariableObj = webComponentVariable;
                        }
                        
                        
                        let webComponentUrl = dataset.webComponentUrl;
                        delete child.dataset.webComponentUrl;
                        
                        try {
                            webComponentUrl = $___fairysupport_param(paramObj, localValue, webComponentUrl);
                        } catch (componentError) {
                            webComponentUrl = webComponentUrl;
                        }
                        

                        try {
                            await this.innerLoadWebComponent(child, webComponentUrl, value, webComponentVariableObj).catch((error) => {throw error;});
                        } catch(error) {
                            throw error;
                        }
                        
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

                    let deleteTagResult = this.deleteTag(child, dataset.tag);
                    if (deleteTagResult) {
                        if (childNodesContainer['i'] > 0) {
                            childNodesContainer['i']--;
                        }
                    }

                    if (child !== null && child !== undefined && !skipObjMap.has(child)) {
                        await this.developTpl(child, paramObj, localValue, retObj, errCb, null, false).catch((error) => {throw error;});
                    }

                }
            }

        } catch(error) {
            errCb(error);
            throw error;
        }
        
        return 'success';

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
                        grandChildIdx--;
                        if (child.parentNode) {
                            child.parentNode.insertBefore(grandChild, child);
                        }
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
            if (v && v.constructor === Object) {
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
    this.loadStringTemplate = function (dom, viewStr, argObj, position, timing, immediatelyResolve){

        return new Promise((function(fs, dom, viewStr, argObj, position, timing, immediatelyResolve){
                return function (resolve, reject) {

                    let cb = (function(fs, dom, position, resolve, immediatelyResolve){
                        return function(viewDom){
                            
                            let addNodeList = [];
                            for (let i = 0; i < viewDom.childNodes.length; i++) {
                                addNodeList.push(viewDom.childNodes.item(i));
                            }
                            
                            if (!immediatelyResolve) {
                                fs.addInitFuncForAfterObserver(viewDom, (function(resolve, addNodeList){return function(){resolve(addNodeList);};})(resolve, addNodeList), false);
                            }

                            if (dom) {
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
                            
                            if (true === immediatelyResolve) {
                                resolve(addNodeList);
                            }
                            
                        }
                    })(fs, dom, position, resolve, immediatelyResolve);

                    fs.getTplDom(viewStr, argObj, reject, cb);

                };
            })(this, dom, viewStr, argObj, position, timing, immediatelyResolve)
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

    this.loadTemplate = function (dom, templatePackeage, argObj, position, retryCount, timing, immediatelyResolve){

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

        return new Promise((function(fs, dom, templatePackeage, argObj, position, retryCount, timing, templateViewPath, immediatelyResolve){
            return function (resolve, reject) {
                let req = fs.emptyAjax(templateViewPath + '?' + fs.version, null, 'GET', 'query');
                req.timeout = fsTimeout;
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Accept', 'text/*');
                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                req.responseType = 'text';
                req.onloadend = (function(fs, dom, templatePackeage, argObj, position, retryCount, timing, resolve, reject, immediatelyResolve){
                        return function (e, xhr) {
                            if (200 === xhr.status) {
                                let viewStr = xhr.response;
                                fs.loadStringTemplate(dom, viewStr, argObj, position, timing, immediatelyResolve).then(resolve).catch(reject);
                            } else {
                                let failResult = fairysupportTemplateFail(retryCount, xhr);
                                if (failResult) {
                                    fs.loadTemplate(dom, templatePackeage, argObj, position, ++retryCount, timing, immediatelyResolve).then(resolve).catch(reject);
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
                )(fs, dom, templatePackeage, argObj, position, retryCount, timing, resolve, reject, immediatelyResolve);
                req.send();

            };
        })(this, dom, templatePackeage, argObj, position, retryCount, timing, templateViewPath, immediatelyResolve));

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
    
    this.appendLoadWebComponent = function (dom, componentDirUrl, componentPackeage, argObj){
        return this.loadWebComponent(dom, componentDirUrl, componentPackeage, argObj, 'append');
    };

    this.beforeLoadWebComponent = function (dom, componentDirUrl, componentPackeage, argObj){
        return this.loadWebComponent(dom, componentDirUrl, componentPackeage, argObj, 'before');
    };

    this.afterLoadWebComponent = function (dom, componentDirUrl, componentPackeage, argObj){
        return this.loadWebComponent(dom, componentDirUrl, componentPackeage, argObj, 'after');
    };

    this.innerLoadWebComponent = function (dom, componentDirUrl, componentPackeage, argObj){
        return this.loadWebComponent(dom, componentDirUrl, componentPackeage, argObj, null, true);
    };

    this.loadWebComponent = function (dom, componentDirUrl, componentPackeage, argObj, position, immediatelyResolve){

        let componentValueMap = this.getComponentValue(componentPackeage);
        let componentControllerPath = componentDirUrl + '/' + componentValueMap['componentPath'] + 'controller.js';

        return new Promise((function(fs, dom, argObj, position, componentValueMap, componentControllerPath, componentDirUrl, immediatelyResolve){
            return function (resolve, reject) {
                 fs.uniqueComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, null, componentDirUrl, immediatelyResolve);

            };
        })(this, dom, argObj, position, componentValueMap, componentControllerPath, componentDirUrl, immediatelyResolve));

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

    this.innerLoadUniqueComponent = function (dom, componentPackeage, argObj){
        return this.loadUniqueComponent(dom, componentPackeage, argObj, null, true);
    };

    this.loadUniqueComponent = function (dom, componentPackeage, argObj, position, immediatelyResolve){

        let componentValueMap = this.getComponentValue(componentPackeage);
        let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

        return new Promise((function(fs, dom, argObj, position, componentValueMap, componentControllerPath, immediatelyResolve){
            return function (resolve, reject) {
                 fs.uniqueComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, null, null, immediatelyResolve);

            };
        })(this, dom, argObj, position, componentValueMap, componentControllerPath, immediatelyResolve));

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

    this.uniqueComponentInsertFunc = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentDirUrl, immediatelyResolve){

        this.loadComponentReqMsg(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, this.uniqueComponentInsertFuncExec.bind(fs), 0, componentDirUrl, immediatelyResolve);

    };

    this.uniqueComponentInsertFuncExec = function (fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve){

        if (retryCount === undefined || retryCount === null) {
            retryCount = 0;
        }

        let func = function () {};
        if (cb !== null && cb !== undefined) {
            func = cb;
        }

        import(componentControllerPath + '?' + fs.version)
        .then(fs.loadUniqueComponentControllerMethodList(fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj, componentDirUrl, msgObj, immediatelyResolve))
        .catch((function(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve){
                return function (err) {
                    let failResult = fairysupportComponentFail(retryCount, err);
                    if (failResult) {
                        fs.uniqueComponentInsertFuncExec(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, ++retryCount, componentDirUrl, msgObj, immediatelyResolve);
                    } else {
                        if (errCb !== null && errCb !== undefined) {
                            errCb(err);
                        }
                    }
                }
            }
        )(fs, dom, componentValueMap, componentControllerPath, argObj, cb, errCb, position, viewStr, componentEnvValueObj, retryCount, componentDirUrl, msgObj, immediatelyResolve))
        ;

    };

    this.loadUniqueComponentControllerMethodList = function (fs, dom, componentValueMap, viewStr, argObj, func, position, errCb, componentEnvValueObj, componentDirUrl, msgObj, immediatelyResolve){
        return function (Module){

            if (viewStr === undefined || viewStr === null) {
                viewStr = Module.__fairysupport__viewStr;
            }

            let componentPathSplit = componentValueMap['componentPath'].split('/');
            let componentClass = fs.getCamel(componentPathSplit[componentPathSplit.length - 2]);
            let uniqueComponentControllerObj = new Module[componentClass]();
            
            componentMsgObj.set(uniqueComponentControllerObj, msgObj);
            componentEnvValueObj.set(uniqueComponentControllerObj, Module.__fairysupport__envValueObj);
            
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

            let insertComponentFunc = fs.getInsertUniqueComponent(fs, dom, componentValueMap, viewStr, argObj, func, position, uniqueComponentControllerObj, uniqueComponentControllerMethodList, uniqueDataNameEventMap, errCb, componentDirUrl, immediatelyResolve);
            insertComponentFunc();

        };
    };

    this.getInsertUniqueComponent = function (fs, dom, componentValueMap, viewStr, argObj, func, position, controllerObj, methodList, dataNameEventMap, errCb, componentDirUrl, immediatelyResolve){
        return function (){

            let cb = (function(fs, dom, componentValueMap, argObj, func, position, controllerObj, methodList, dataNameEventMap, componentDirUrl, immediatelyResolve){
                return function(viewDom){

                    let addNodeList = [];
                    for (let i = 0; i < viewDom.childNodes.length; i++) {
                        addNodeList.push(viewDom.childNodes.item(i));
                    }
                    
                    let initFunc = fs.getUniqueComponentMethod(fs, controllerObj, methodList, 'init', argObj, (function(func, addNodeList){return function(){func(addNodeList);};})(func, addNodeList));
                    fs.addInitFuncForAfterObserver(viewDom, initFunc, ('init' in methodList ? true : false));

                    let childList = viewDom.childNodes;
                    let child = null;
                    if (childList !== null && childList !== undefined) {
                        for (let i = 0; i < childList.length; i++) {
                            child = childList.item(i);
                            fs.bindUniqueComponentAll(child, componentValueMap, controllerObj, methodList, dataNameEventMap, componentDirUrl);
                        }
                    }

                    if (dom) {
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
                    
                    if (true === immediatelyResolve) {
                        func(addNodeList);
                    }

                };
            })(fs, dom, componentValueMap, argObj, func, position, controllerObj, methodList, dataNameEventMap, componentDirUrl, immediatelyResolve);

            if (argObj === null || argObj === undefined) {
                argObj = Object.create(null);
            }
            argObj['_controller'] = controllerObj;

            fs.getTplDom(viewStr, argObj, errCb, cb);

        };
    };

    this.bindUniqueComponentAll = function (obj, componentValueMap, controllerObj, methodList, eventMethodList, componentDirUrl){
        if (obj === null || obj === undefined) {
            return;
        }
        this.bindAllSingle(obj, this.bindUniqueComponentProp(this, obj, componentValueMap, controllerObj, methodList, eventMethodList, componentDirUrl, uniqueComponentDomControllerMap));
        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindUniqueComponentAll(child, componentValueMap, controllerObj, methodList, eventMethodList, componentDirUrl);
            }
        }

    };

    this.bindUniqueComponentProp = function (fs, obj, componentValueMap, controllerObj, methodList, eventMethodList, componentDirUrl, domControllerMap){
        return function(){
            let dataset = obj.dataset;
            if (dataset !== null && dataset !== undefined) {

                let bindObj = null;
                let bindList = null;
                let name = null;
                
                if (componentDirUrl !== null && componentDirUrl !== undefined) {
                    bindObj = dataset['objWeb'];
                    bindList = dataset['listWeb'];
                    name = dataset['nameWeb'];
                } else {
                    bindObj = dataset[componentValueMap['componentCamel'] + 'Obj'];
                    bindList = dataset[componentValueMap['componentCamel'] + 'List'];
                    name = dataset[componentValueMap['componentCamel'] + 'Name'];
                }
                

                if (bindObj !== null && bindObj !== undefined) {
                    fs.bindUniqueComponentSingleObj(obj, bindObj, controllerObj, methodList);
                    if (!domControllerMap.has(obj)) {
                        domControllerMap.set(obj, Object.create(null));
                    }
                    let domControllerMapValue = domControllerMap.get(obj);
                    domControllerMapValue['controller'] = controllerObj;
                    domControllerMapValue['obj'] = bindObj;
                }

                if (bindList !== null && bindList !== undefined) {
                    fs.bindUniqueComponentSingleList(obj, bindList, controllerObj, methodList);
                    if (!domControllerMap.has(obj)) {
                        domControllerMap.set(obj, Object.create(null));
                    }
                    let domControllerMapValue = domControllerMap.get(obj);
                    domControllerMapValue['controller'] = controllerObj;
                    domControllerMapValue['list'] = bindList;
                }

                if (name !== null && name !== undefined) {
                    let eventDataList = fs.bindUniqueComponentSingleEvent(obj, name, controllerObj, methodList, eventMethodList);
                    if (!domControllerMap.has(obj)) {
                        domControllerMap.set(obj, Object.create(null));
                    }
                    let domControllerMapValue = domControllerMap.get(obj);
                    domControllerMapValue['controller'] = controllerObj;
                    domControllerMapValue['nameInfo'] = eventDataList;
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
            return this.setEventFunctionForUniqueComponent(name, controllerObj, methodList, dom, eventMethodList, this.clazz.obj);
        }
        return [];
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

    this.innerLoadSingleComponent = function (dom, componentPackeage, argObj){
        return this.loadSingleComponent(dom, componentPackeage, argObj, null, true);
    };

    this.loadSingleComponent = function (dom, componentPackeage, argObj, position, immediatelyResolve){

        let componentValueMap = this.getComponentValue(componentPackeage);
        let componentControllerPath = componentRoot + componentValueMap['componentPath'] + 'controller.js';

        return new Promise((function(fs, dom, componentValueMap, componentControllerPath, argObj, position, immediatelyResolve){
            return function (resolve, reject) {
                fs.singleComponentInsertFunc(fs, dom, componentValueMap, componentControllerPath, argObj, resolve, reject, position, null, immediatelyResolve);
            };

        })(this, dom, componentValueMap, componentControllerPath, argObj, position, immediatelyResolve));

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
                if (value && value.constructor === Object) {
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
        
        #dom;
        #componentPackeage;
        #viewUrl;
        #paramObj;
        #argObj;
        #cb;
        #position;
        #metName;
        #componentRoot;

        #xhr;
        
        #__resFunc;
        
        constructor(dom, componentPackeage, viewUrl, paramObj, argObj, cb, position, metName, componentRoot) {

            this.#dom = dom;
            this.#componentPackeage = componentPackeage;
            this.#viewUrl = viewUrl;
            this.#paramObj = paramObj;
            this.#argObj = argObj;
            this.#cb = cb;
            this.#position = position;
            this.#metName = metName;
            this.#componentRoot = componentRoot;
            this.#__resFunc = Object.create(null);

            this.#xhr = new XMLHttpRequest();
            let getFunc = (function(xhr){return function(){return xhr.onreadystatechange;};})(this.#xhr);
            let setFunc = (function(xhr){return function(newFunc){xhr.onreadystatechange = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onreadystatechange', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.readyState;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.readyState = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'readyState', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.response;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.response = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'response', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.responseText;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.responseText = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'responseText', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.responseType;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.responseType = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'responseType', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.responseURL;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.responseURL = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'responseURL', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.responseXML;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.responseXML = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'responseXML', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.status;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.status = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'status', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.statusText;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.statusText = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'statusText', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.timeout;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.timeout = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'timeout', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.upload;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.upload = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'upload', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.withCredentials;};})(this.#xhr);
            setFunc = (function(xhr){return function(newValue){xhr.withCredentials = newValue;};})(this.#xhr);
            Object.defineProperty(this, 'withCredentials', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onabort;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onabort = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onabort', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onerror;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onerror = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onerror', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onload;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onload = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onload', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onloadend;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onloadend = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onloadend', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onloadstart;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onloadstart = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onloadstart', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.onprogress;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.onprogress = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'onprogress', {
                enumerable: true,
                configurable: false,
                get: getFunc,
                set : setFunc
            });
            getFunc = (function(xhr){return function(){return xhr.ontimeout;};})(this.#xhr);
            setFunc = (function(xhr){return function(newFunc){xhr.ontimeout = (function(xhr, newFunc){return function(e){newFunc(e, xhr);};})(xhr, newFunc);};})(this.#xhr);
            Object.defineProperty(this, 'ontimeout', {
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
            this.#xhr.abort();
            return this;
        }
        getAllResponseHeaders() {
            return this.#xhr.getAllResponseHeaders();
        }
        getResponseHeader(headerName) {
            return this.#xhr.getResponseHeader(headerName);
        }
        open(method, url, async = true, user = null, password = null) {
            this.#xhr.open(method, url, async, user, password);
            return this;
        }
        overrideMimeType(mimeType) {
            this.#xhr.overrideMimeType(mimeType);
            return this;
        }
        send(body) {
            if (this.#paramObj !== null && this.#paramObj !== undefined) {
                this.#xhr.send(this.#paramObj);
            } else {
                this.#xhr.send(body);
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
            return this.#xhr.setRequestHeader(header, value);
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
            if (!('readystatechange' in this.#__resFunc)) {
                this.#__resFunc['readystatechange'] = Object.create(null);
            }
            if (state === null && status === null) {
                this.#__resFunc['readystatechange']['default'] = fn;
            } else if (state !== null && status === null) {
                if (!('statusDefault' in this.#__resFunc['readystatechange'])) {
                    this.#__resFunc['readystatechange']['statusDefault'] = Object.create(null);
                }
                this.#__resFunc['readystatechange']['statusDefault'][String(state)] = fn;
            } else if (state === null && status !== null) {
                if (!('stateDefault' in this.#__resFunc['readystatechange'])) {
                    this.#__resFunc['readystatechange']['stateDefault'] = Object.create(null);
                }
                this.#__resFunc['readystatechange']['stateDefault'][String(status)] = fn;
            } else {
                if (!('fn' in this.#__resFunc['readystatechange'])) {
                    this.#__resFunc['readystatechange']['fn'] = Object.create(null);
                }
                if (!(state in this.#__resFunc['readystatechange']['fn'])) {
                    this.#__resFunc['readystatechange']['fn'][String(state)] = Object.create(null);
                }
                this.#__resFunc['readystatechange']['fn'][String(state)][String(status)] = fn;
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
                           })(this.#__resFunc['readystatechange']);
            this.onreadystatechange = useFunc;
            return this;
        }
        setAbort(fn) {
            if (!('abort' in this.#__resFunc)) {
                this.#__resFunc['abort'] = Object.create(null);
            }
            this.#__resFunc['abort']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.#__resFunc['abort']);
            this.onabort = useFunc;
            return this;
        }
        setError(fn) {
            if (!('error' in this.#__resFunc)) {
                this.#__resFunc['error'] = Object.create(null);
            }
            this.#__resFunc['error']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.#__resFunc['error']);
            this.onerror = useFunc;
            return this;
        }
        setLoad(status, fn) {
            if (!('load' in this.#__resFunc)) {
                this.#__resFunc['load'] = Object.create(null);
            }
            if (status === null) {
                this.#__resFunc['load']['default'] = fn;
            } else {
                if (!('fn' in this.#__resFunc['load'])) {
                    this.#__resFunc['load']['fn'] = Object.create(null);
                }
                this.#__resFunc['load']['fn'][String(status)] = fn;
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
                           })(this.#__resFunc['load']);
            this.onload = useFunc;
            return this;
        }
        setLoadend(status, fn) {
            if (!('loadend' in this.#__resFunc)) {
                this.#__resFunc['loadend'] = Object.create(null);
            }
            if (status === null) {
                this.#__resFunc['loadend']['default'] = fn;
            } else {
                if (!('fn' in this.#__resFunc['loadend'])) {
                    this.#__resFunc['loadend']['fn'] = Object.create(null);
                }
                this.#__resFunc['loadend']['fn'][String(status)] = fn;
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
                           })(this.#__resFunc['loadend']);
            this.onloadend = useFunc;
            return this;
        }
        setLoadstart(fn) {
            if (!('loadstart' in this.#__resFunc)) {
                this.#__resFunc['loadstart'] = Object.create(null);
            }
            this.#__resFunc['loadstart']['default'] = fn;
            let useFunc = (function (resFunc) {
                                return function (e, xhr) {
                                    if ('default' in resFunc) {
                                        resFunc['default'](e, xhr);
                                    }
                                };
                           })(this.#__resFunc['loadstart']);
            this.onloadstart = useFunc;
            return this;
        }
        setProgress(status, fn) {
            if (!('progress' in this.#__resFunc)) {
                this.#__resFunc['progress'] = Object.create(null);
            }
            if (status === null) {
                this.#__resFunc['progress']['default'] = fn;
            } else {
                if (!('fn' in this.#__resFunc['progress'])) {
                    this.#__resFunc['progress']['fn'] = Object.create(null);
                }
                this.#__resFunc['progress']['fn'][String(status)] = fn;
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
                           })(this.#__resFunc['progress']);
            this.onprogress = useFunc;
            return this;
        }
        setTimeout(fn) {
            if (typeof fn === 'function') {
                if (!('timeout' in this.#__resFunc)) {
                    this.#__resFunc['timeout'] = Object.create(null);
                }
                this.#__resFunc['timeout']['default'] = fn;
                let useFunc = (function (resFunc) {
                                    return function (e, xhr) {
                                        if ('default' in resFunc) {
                                            resFunc['default'](e, xhr);
                                        }
                                    };
                               })(this.#__resFunc['timeout']);
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
            if (v && v.constructor === Object) {
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
        
        #fs;
        #timelinePropList;
        #preClazz;
        #props;
        #ms;
        
        constructor(fs, timelinePropList, preClazz, props, ms) {
            this.#fs = fs;
            this.#timelinePropList = timelinePropList;
            this.#preClazz = preClazz;
            this.#props = props;
            this.#ms = ms;
        }
        execTimer() {
            if (this.#preClazz !== null && this.#preClazz !== undefined && this.#preClazz.timerId !== null && this.#preClazz.timerId !== undefined) {
                this.#preClazz.clerTimer();
            }
            if (this.timerId !== null && this.timerId !== undefined) {
                let propsValues = this.#props.values();
                for (let propsVal of propsValues) {
                    this.#fs.setTimeLineProp(propsVal.obj, propsVal.value);
                }
            }
            let timelineProp = this.#timelinePropList.shift();
            if (timelineProp !== null && timelineProp !== undefined) {
                let timeLineClazz = new this.#fs.timeLineClass(this.#fs, this.#timelinePropList, this, timelineProp.prop, timelineProp.ms);
                timeLineClazz.timerId = window.setTimeout(timeLineClazz.execTimer.bind(timeLineClazz), timelineProp.ms - this.#ms);
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
            let replaceFunc = function (match) {
                return match.substr(1);
            }
            let re = new RegExp("\\\\\\$\\{[^\\}]+\\}", "g");
            str = str.replace(re, replaceFunc);
            
            return str;
        }
        
        for (const [key, value] of Object.entries(replaceObj)) {
            let re = new RegExp("(?<!\\\\)\\$\\{" + key + "\\}", "g");
            str = str.replace(re, value);
        }
        
        let replaceFunc = function (match) {
            return match.substr(1);
        }
        let re = new RegExp("\\\\\\$\\{[^\\}]+\\}", "g");
        str = str.replace(re, replaceFunc);
        
        return str;

    };

    this.componentEnvValue = function (controllerObj, name){
        if (!componentEnvValueObj.has(controllerObj)) {
            return null;
        }
        return componentEnvValueObj.get(controllerObj)[name];
    };

    this.componentMsg = function (controllerObj, name, replaceObj){
        if (!componentMsgObj.has(controllerObj)) {
            return null;
        }
        let str = '';
        if (name in componentMsgObj.get(controllerObj)) {
            str = componentMsgObj.get(controllerObj)[name];
        }

        if (replaceObj === null || replaceObj === undefined) {
            let replaceFunc = function (match) {
                return match.substr(1);
            }
            let re = new RegExp("\\\\\\$\\{[^\\}]+\\}", "g");
            str = str.replace(re, replaceFunc);
            return str;
        }

        for (const [key, value] of Object.entries(replaceObj)) {
            let re = new RegExp("(?<!\\\\)\\$\\{" + key + "\\}", "g");
            str = str.replace(re, value);
        }
        
        let replaceFunc = function (match) {
            return match.substr(1);
        }
        let re = new RegExp("\\\\\\$\\{[^\\}]+\\}", "g");
        str = str.replace(re, replaceFunc);
        
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

    this.validate = function (group, obj, prop, eventList, funcList, funcArg, finishFunc){
        let preValueHolder = {
                preVal: Object.create(null)
        };
        if (!Array.isArray(eventList)) {
            eventList = [eventList];
        }
        this.wrapObjAccessor(group, obj, prop, funcList, preValueHolder, eventList, funcArg, finishFunc);
    };

    this.wrapObjAccessor = function (group, obj, prop, funcList, preValueHolder, eventList, funcArg, finishFunc){

        let protoPropertyDescriptor = this.getPrototypePropertyDescriptor(obj, prop);

        if (eventList !== null && eventList !== undefined) {
            
            if (!(group in validatorLatestResultObj)) {
                validatorLatestResultObj[group] = new Map();
            }
            if (!(validatorLatestResultObj[group].has(obj))) {
                validatorLatestResultObj[group].set(obj, Object.create(null));
            }
            if (!(prop in validatorLatestResultObj[group].get(obj))) {
                validatorLatestResultObj[group].get(obj)[prop] = Object.create(null);
            }
            for (const eventName of eventList) {
                if (!(eventName in validatorLatestResultObj[group].get(obj)[prop])) {
                    validatorLatestResultObj[group].get(obj)[prop][eventName] = true;
                }
            }
            
            let equalFlg = false;
            this.preValueInit(preValueHolder, eventList, obj[prop]);
            let eventFunc = null;
            for (const eventName of eventList) {
                if (eventName === null) {
                    equalFlg = true;
                    let getFunc = (function(protoPropertyDescriptor, obj){
                        return function(){
                            return protoPropertyDescriptor.get.call(obj);
                        }
                    })(protoPropertyDescriptor, obj);
                    let setFunc = (function(protoPropertyDescriptor, obj, funcList, funcArg, prop, fs, preValueHolder, eventList, finishFunc, validatorLatestResultObj, group){
                        return function(arg){
                            let valid = true;
                            let newReplaceFlg = false;
                            let errorObj = Object.create(null);
                            for (const func of funcList) {
                                let funcResult = func(obj, prop, arg, preValueHolder.preVal[null], funcArg, null);
                                if (!funcResult) {
                                    valid = funcResult;
                                }
                                if (!(funcResult in errorObj)) {
                                    errorObj[funcResult] = [];
                                }
                                errorObj[funcResult].push(func.name);
                            }
                            
                            validatorLatestResultObj[group].get(obj)[prop][null] = valid;
                            
                            if (finishFunc) {
                                let finishResult = finishFunc(obj, prop, arg, preValueHolder.preVal[null], funcArg, null, valid, errorObj);
                                if (finishResult) {
                                    if ('newValue' in finishResult) {
                                        arg = finishResult['newValue'];
                                    }
                                    if ('forceNewValue' in finishResult) {
                                        newReplaceFlg = true;
                                        arg = finishResult['forceNewValue'];
                                    }
                                    if ('oldValue' in finishResult) {
                                        fs.preValueEventInit(preValueHolder, null, finishResult['oldValue']);
                                    }
                                    if ('oldValueAllEvent' in finishResult) {
                                        fs.preValueInit(preValueHolder, eventList, finishResult['oldValueAllEvent']);
                                    }
                                    if ('oldValueSpecificEvent' in finishResult) {
                                        for (const [replaceEventName, replaceOldValue] of Object.entries(finishResult['oldValueSpecificEvent'])) {
                                            if (replaceEventName in preValueHolder.preVal) {
                                                fs.preValueEventInit(preValueHolder, replaceEventName, replaceOldValue);
                                            }
                                        }
                                    }
                                }
                            }
                            if (newReplaceFlg) {
                                protoPropertyDescriptor.set.call(obj, arg);
                                fs.preValueInit(preValueHolder, eventList, obj[prop]);
                            } else if (valid) {
                                protoPropertyDescriptor.set.call(obj, arg);
                                fs.preValueInit(preValueHolder, eventList, obj[prop]);
                            } else {
                                protoPropertyDescriptor.set.call(obj, preValueHolder.preVal[null]);
                                fs.preValueEventInit(preValueHolder, null, preValueHolder.preVal[null]);
                            }
                            
                        }
                    })(protoPropertyDescriptor, obj, funcList, funcArg, prop, this, preValueHolder, eventList, finishFunc, validatorLatestResultObj, group);
            
                    Object.defineProperty(obj, prop, {
                        enumerable: true,
                        configurable: true,
                        get: getFunc,
                        set : setFunc
                    });
                    
                    
                    let initValid = true;
                    let newReplaceFlg = false;
                    let errorObj = Object.create(null);
                    let newVal = obj[prop];
                    for (const func of funcList) {
                        let funcResult = func(obj, prop, newVal, preValueHolder.preVal[null], funcArg, null);
                        if (!funcResult) {
                            initValid = funcResult;
                        }
                        if (!(funcResult in errorObj)) {
                            errorObj[funcResult] = [];
                        }
                        errorObj[funcResult].push(func.name);
                    }
                    
                    validatorLatestResultObj[group].get(obj)[prop][eventName] = initValid;
                    
                    let finishResult = null;
                    if (finishFunc) {
                        finishResult = finishFunc(obj, prop, newVal, preValueHolder.preVal[null], funcArg, null, initValid, errorObj);
                        if (finishResult) {
                            if ('newValue' in finishResult) {
                                newVal = finishResult['newValue'];
                            }
                            if ('forceNewValue' in finishResult) {
                                newReplaceFlg = true;
                                newVal = finishResult['forceNewValue'];
                            }
                            if ('oldValue' in finishResult) {
                                this.preValueEventInit(preValueHolder, null, finishResult['oldValue']);
                            }
                            if ('oldValueAllEvent' in finishResult) {
                                this.preValueInit(preValueHolder, eventList, finishResult['oldValueAllEvent']);
                            }
                            if ('oldValueSpecificEvent' in finishResult) {
                                for (const [replaceEventName, replaceOldValue] of Object.entries(finishResult['oldValueSpecificEvent'])) {
                                    if (replaceEventName in preValueHolder.preVal) {
                                        this.preValueEventInit(preValueHolder, replaceEventName, replaceOldValue);
                                    }
                                }
                            }
                        }
                    }
                    if (newReplaceFlg) {
                        protoPropertyDescriptor.set.call(obj, newVal);
                    } else if (initValid) {
                        protoPropertyDescriptor.set.call(obj, newVal);
                    } else {
                        if (finishResult) {
                            if ('oldValueSpecificEvent' in finishResult && null in finishResult['oldValueSpecificEvent']) {
                                protoPropertyDescriptor.set.call(obj, finishResult['oldValueSpecificEvent'][null]);
                            } else if ('oldValueAllEvent' in finishResult) {
                                protoPropertyDescriptor.set.call(obj, finishResult['oldValueAllEvent']);
                            } else if ('oldValue' in finishResult) {
                                protoPropertyDescriptor.set.call(obj, finishResult['oldValue']);
                            } else {
                                protoPropertyDescriptor.set.call(obj, null);
                            }
                        } else {
                            protoPropertyDescriptor.set.call(obj, null);
                        }
                    }
                    this.preValueInit(preValueHolder, eventList, obj[prop]);
                    
                } else if ('addEventListener' in obj) {
                    if (eventFunc === null) {
                        obj.addEventListener("focus",
                                             (function(preValueHolder, obj, prop, eventList, fs){
                                                return function(){
                                                    fs.preValueInit(preValueHolder, eventList, obj[prop]);
                                                };
                                             })(preValueHolder, obj, prop, eventList, this), true);
                        obj.addEventListener('blur', 
                                             (function (preValueHolder, obj, prop, eventList, fs){
                                                return function (event) {
                                                    fs.preValueInit(preValueHolder, eventList, obj[prop]);
                                                };
                                             })(preValueHolder, obj, prop, eventList, this), false);
                        eventFunc = (function (funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop, finishFunc, eventList, fs, validatorLatestResultObj, group){
                            return function (event) {
                                if (!(event.type in preValueHolder.preVal)) {
                                    fs.preValueEventInit(preValueHolder, event.type, obj[prop]);
                                }
                                let newReplaceFlg = false;
                                let valid = true;
                                let newVal = obj[prop];
                                let errorObj = Object.create(null);
                                for (const func of funcList) {
                                    let funcResult = func(obj, prop, newVal, preValueHolder.preVal[event.type], funcArg, event);
                                    if (!funcResult) {
                                        valid = funcResult;
                                    }
                                    if (!(funcResult in errorObj)) {
                                        errorObj[funcResult] = [];
                                    }
                                    errorObj[funcResult].push(func.name);
                                }
                                
                                validatorLatestResultObj[group].get(obj)[prop][event.type] = valid;
                                
                                if (finishFunc) {
                                    let finishResult = finishFunc(obj, prop, newVal, preValueHolder.preVal[event.type], funcArg, event, valid, errorObj);
                                    if (finishResult) {
                                        if ('newValue' in finishResult) {
                                            newVal = finishResult['newValue'];
                                        }
                                        if ('forceNewValue' in finishResult) {
                                            newReplaceFlg = true;
                                            newVal = finishResult['forceNewValue'];
                                        }
                                        if ('oldValue' in finishResult) {
                                            fs.preValueEventInit(preValueHolder, event.type, finishResult['oldValue']);
                                        }
                                        if ('oldValueAllEvent' in finishResult) {
                                            fs.preValueInit(preValueHolder, eventList, finishResult['oldValueAllEvent']);
                                        }
                                        if ('oldValueSpecificEvent' in finishResult) {
                                            for (const [replaceEventName, replaceOldValue] of Object.entries(finishResult['oldValueSpecificEvent'])) {
                                                if (replaceEventName in preValueHolder.preVal) {
                                                    fs.preValueEventInit(preValueHolder, replaceEventName, replaceOldValue);
                                                }
                                            }
                                        }
                                    }
                                }
                                if (newReplaceFlg) {
                                    protoPropertyDescriptor.set.call(obj, newVal);
                                    fs.preValueEventInit(preValueHolder, event.type, newVal);
                                } else if (valid) {
                                    protoPropertyDescriptor.set.call(obj, newVal);
                                    fs.preValueEventInit(preValueHolder, event.type, newVal);
                                } else {
                                    protoPropertyDescriptor.set.call(obj, preValueHolder.preVal[event.type]);
                                    fs.preValueEventInit(preValueHolder, event.type, preValueHolder.preVal[event.type]);
                                }
                                
                            };
                        })(funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop, finishFunc, eventList, this, validatorLatestResultObj, group);
                    }
                    obj.addEventListener(eventName, eventFunc, true);
                }
            }
            if (!equalFlg) {
                
                let getFunc = (function(protoPropertyDescriptor, obj){
                    return function(){
                        return protoPropertyDescriptor.get.call(obj);
                    }
                })(protoPropertyDescriptor, obj);
                let setFunc = (function(protoPropertyDescriptor, obj, prop, fs, eventList, preValueHolder){
                    return function(arg){
                        protoPropertyDescriptor.set.call(obj, arg);
                        fs.preValueInit(preValueHolder, eventList, obj[prop]);
                    }
                })(protoPropertyDescriptor, obj, prop, this, eventList, preValueHolder);
        
                Object.defineProperty(obj, prop, {
                    enumerable: true,
                    configurable: true,
                    get: getFunc,
                    set : setFunc
                });
                
            }
            
            if (!(group in validatorGroupObj)) {
                validatorGroupObj[group] = new Map();
            }
            if (!(validatorGroupObj[group].has(obj))) {
                validatorGroupObj[group].set(obj, []);
            }
            let validatorContent = Object.create(null);
            validatorContent['prop'] = prop;
            validatorContent['validator'] = (function (funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop, finishFunc, eventList, fs, validatorLatestResultObj, group){
                return function (newValFlg) {
                    let valid = true;
                    let newReplaceFlg = false;
                    let newVal = obj[prop];
                    let errorObj = Object.create(null);
                    for (const func of funcList) {
                        let funcResult = func(obj, prop, newVal, obj[prop], funcArg, undefined);
                        if (!funcResult) {
                            valid = funcResult;
                        }
                        if (!(funcResult in errorObj)) {
                            errorObj[funcResult] = [];
                        }
                        errorObj[funcResult].push(func.name);
                    }
                    
                    validatorLatestResultObj[group].get(obj)[prop][undefined] = valid;
                    
                    if (finishFunc) {
                        let finishResult = finishFunc(obj, prop, newVal, obj[prop], funcArg, undefined, valid, errorObj);
                        if (finishResult) {
                            if ('newValue' in finishResult) {
                                newVal = finishResult['newValue'];
                            }
                            if ('forceNewValue' in finishResult) {
                                newReplaceFlg = true;
                                newVal = finishResult['forceNewValue'];
                            }
                            if ('oldValueAllEvent' in finishResult) {
                                fs.preValueInit(preValueHolder, eventList, finishResult['oldValueAllEvent']);
                            }
                            if ('oldValueSpecificEvent' in finishResult) {
                                for (const [replaceEventName, replaceOldValue] of Object.entries(finishResult['oldValueSpecificEvent'])) {
                                    if (replaceEventName in preValueHolder.preVal) {
                                        fs.preValueEventInit(preValueHolder, replaceEventName, replaceOldValue);
                                    }
                                }
                            }
                        }
                    }
                    
                    if (newValFlg) {
                        
                        if (newReplaceFlg) {
                            protoPropertyDescriptor.set.call(obj, newVal);
                            fs.preValueInit(preValueHolder, eventList, obj[prop]);
                        } else if (valid) {
                            protoPropertyDescriptor.set.call(obj, newVal);
                            fs.preValueInit(preValueHolder, eventList, obj[prop]);
                        }
                        
                    }
                    
                    return valid;
                    
                };
            })(funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor, prop, finishFunc, eventList, this, validatorLatestResultObj, group);
            
            validatorGroupObj[group].get(obj).push(validatorContent);
            
            if (!(validatorReverseMap.has(obj))) {
                validatorReverseMap.set(obj, []);
            }
            validatorReverseMap.get(obj).push(group);
            
        }

    };
    
    this.preValueInit = function (preValueHolder, eventList, value){
        for (const eventName of eventList) {
            this.preValueEventInit(preValueHolder, eventName, value);
        }
    };

    this.preValueEventInit = function (preValueHolder, eventName, value){
        preValueHolder.preVal[eventName] = value;
    };
    
    this.execValidator = function (group, obj, newValFlg){
        let result = true;
        let validatorList = validatorGroupObj[group].get(obj);
        for (let objValidator of validatorList) {
            let valid = objValidator['validator'](newValFlg);
            if (!valid) {
                result = false;
            }
        }
        return result;
    };

    this.execGroupValidator = function (group, newValFlg){
        let result = true;
        let validatorMap = validatorGroupObj[group];
        for (let obj of validatorMap.keys()) {
            let valid = this.execValidator(group, obj, newValFlg);
            if (!valid) {
                result = false;
            }
        }
        return result;
    };

    this.getValidateLatestResult = function (group, obj, prop, eventName){
        return validatorLatestResultObj[group].get(obj)[prop][eventName];
    };
    
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
    };

    this.linkEvent = function (fromObj, toObj, eventList){
        let result = Object.create(null);
        for (const eventName of eventList) {
            result[eventName] = toObj[eventName].bind(toObj);
            fromObj.addEventListener(eventName, result[eventName]);
        }
        return result;
    };

    this.getReqLang = function () {
        return reqLang;
    };

    this.getConfLang = function () {
        return confLang;
    };

    this.storeClass = class FairysupportStore {
        #data;
        #listener;
        constructor() {
            this.#data = new Map();
            this.#listener = new Map();
        }
        set(k, v) {
            let setFlg = true;
            if (this.#listener.has(k)) {
                for (let l of this.#listener.get(k).values()) {
                    setFlg = l(k, v);
                    if (setFlg === false) {
                        return;
                    }
                }
            }
            this.#data.set(k, v);
        }
        get(k) {
            return this.#data.get(k);
        }
        delete(k) {
            return this.#data.delete(k);
        }
        addListener(k, l){
            if (!this.#listener.has(k)) {
                this.#listener.set(k, new Map());
            }
            this.#listener.get(k).set(l, l);
        }
        removeListener(k, l){
            if (!this.#listener.has(k)) {
                this.#listener.set(k, new Map());
            }
            this.#listener.get(k).delete(l);
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
    return returnVal;
}
const $f = new ___fairysupport();
