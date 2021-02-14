function ___fairysupport(){

    let scriptObj = document.getElementById("fs-js");

    let pageUrl = new URL(window.location.href);
    let reqLang = pageUrl.searchParams.get("lang")
    let confLang = window.navigator.language;
    let jsFwUrl = new URL(scriptObj.src);
    this.version = 'version' in scriptObj ? scriptObj.version : Date.now();
    let jsFwPath = jsFwUrl.origin + jsFwUrl.pathname.trim();
    let jsFwPathSplit = jsFwPath.split('/');
    let jsRoot = jsFwPath.substring(0, jsFwPath.length - jsFwPathSplit[jsFwPathSplit.length - 1].length);
    let moduleRoot = jsRoot + 'modules/';
    let componentRoot = jsRoot + 'components/';

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
    this.componentPackageList = {};
    this.eventMap = new Map();
    this.eventNameDataNameMap = new Map();

    let metaMap = new Map();

    this.instanceMap = {};

    const msgObj = Object.create(null);
    const envValueObj = Object.create(null);

    let fairysupportClear = class FairysupportClear {
        constructor() {
        }
    }

    this.init = function () {
        this.getLoadEnv(jsRoot, this.version, msgObj, envValueObj, reqLang, confLang, pageUrl, moduleRoot);
        return this;
    };

    this.getLoadEnv = function (jsRoot, version, msgObj, envValueObj, reqLang, confLang, pageUrl, moduleRoot){

        let req = new this.fairysupportAjaxObj(null, null, jsRoot + 'env/env.txt' + '?' + version, null, null, null, null, 'getLoadEnv', null);
        req.open('GET', jsRoot + 'env/env.txt' + '?' + version);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.withCredentials = true;
        req.responseType = 'text';
        req.onloadend = (function(fs, msgObj, jsRoot, version, msgObj, envValueObj, reqLang, confLang, pageUrl, moduleRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let envStr = xhr.response;
                        envStr = envStr.trim();
                        fs.getEnvValue(jsRoot, envStr, version, envValueObj, msgObj, reqLang, confLang, pageUrl, moduleRoot);

                    }
                }
            }
        )(this, msgObj, jsRoot, version, msgObj, envValueObj, reqLang, confLang, pageUrl, moduleRoot);
        req.send();

    };

    this.getEnvValue = function (jsRoot, envStr, version, envValueObj, msgObj, reqLang, confLang, pageUrl, moduleRoot){

        let req = new this.fairysupportAjaxObj(null, null, jsRoot + 'env/envValue.' + envStr + '.js' + '?' + version, null, null, null, null, 'getEnvValue', null);
        req.open('GET', jsRoot + 'env/envValue.' + envStr + '.js' + '?' + version);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json');
        req.withCredentials = true;
        req.responseType = 'json';
        req.onloadend = (function(fs, envValueObj, jsRoot, version, msgObj, reqLang, confLang, pageUrl, moduleRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let json = xhr.response;
                        Object.assign(envValueObj, json);
                        fs.getLoadMsg(jsRoot, version, envValueObj, msgObj, reqLang, confLang, pageUrl, moduleRoot);

                    }
                }
            }
        )(this, envValueObj, jsRoot, version, msgObj, reqLang, confLang, pageUrl, moduleRoot);
        req.send();

    };

    this.getLoadMsg = function (jsRoot, version, envValueObj, msgObj, reqLang, confLang, pageUrl, moduleRoot){

        if (reqLang !== null) {
            let reqLangAjax = new this.fairysupportAjaxObj(null, null, jsRoot + 'msg/msg.' + reqLang + '.js' + '?' + version, null, null, null, null, 'getLoadMsg', null);
            reqLangAjax.open('GET', jsRoot + 'msg/msg.' + reqLang + '.js' + '?' + version);
            reqLangAjax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            reqLangAjax.setRequestHeader('Accept', 'application/json');
            reqLangAjax.setRequestHeader('Content-Type', 'application/json');
            reqLangAjax.withCredentials = true;
            reqLangAjax.responseType = 'json';
            reqLangAjax.onloadend = (function(msgObj, reqLang){
                    return function (e, xhr) {
                        if (xhr.status === 200) {
                            let json = xhr.response;
                            msgObj[reqLang] =  Object.create({});
                            Object.assign(msgObj[reqLang], json);
                        }
                    }
                }
            )(msgObj, reqLang);
            reqLangAjax.send();
        }


        confLangAjax = new this.fairysupportAjaxObj(null, null, jsRoot + 'msg/msg.' + confLang + '.js' + '?' + version, null, null, null, null, 'getLoadMsg', null);
        confLangAjax.open('GET', jsRoot + 'msg/msg.' + confLang + '.js' + '?' + version);
        confLangAjax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        confLangAjax.setRequestHeader('Accept', 'application/json');
        confLangAjax.setRequestHeader('Content-Type', 'application/json');
        confLangAjax.withCredentials = true;
        confLangAjax.responseType = 'json';
        confLangAjax.onloadend = (function(msgObj, confLang){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let json = xhr.response;
                        msgObj[confLang] =  Object.create({});
                        Object.assign(msgObj[confLang], json);
                    }
                }
            }
        )(msgObj, confLang);
        confLangAjax.send();


        let req = new this.fairysupportAjaxObj(null, null, jsRoot + 'msg/msg.js' + '?' + version, null, null, null, null, 'getLoadMsg', null);
        req.open('GET', jsRoot + 'msg/msg.js' + '?' + version);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json');
        req.withCredentials = true;
        req.responseType = 'json';
        req.onloadend = (function(fs, version, envValueObj, msgObj, pageUrl, moduleRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let json = xhr.response;
                        msgObj['__fairysupport_default'] = Object.create({});
                        Object.assign(msgObj['__fairysupport_default'], json);

                        let pageRoot = envValueObj['pageRoot'];
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

                        let moduleFullPath = moduleRoot + modulePath + '.js';
                        let moduleControllerUrl = moduleFullPath + '?' + version;

                        import(moduleControllerUrl)
                        .then(fs.getControllerLoader(fs, modulePath))
                        .then(fs.binder(fs))
                        .then(fs.getControllerMethod(fs, 'init', null));
                    }
                }
            }
        )(this, version, envValueObj, msgObj, pageUrl, moduleRoot);
        req.send();

    };

    this.getControllerLoader = function (fs, modulePath){
        return function (Module){
            let classFullName = 'modules/' + modulePath;
            if (!fs.instanceMap[classFullName]) {

                fs.clazz.obj = new Module.default();
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
        };
    };

    this.binder = function (fs){
        return function (){
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
                            let componentPackeage = targetInfoValue['componentPackeage'];
                            let componentPackeageHyphen = componentPackeage.replace(/[A-Z]/g, function(match, offset){
                                                              return (offset > 0 ? '-' : '') + match.toLowerCase();
                                                          });

                            if (record.attributeName === 'data-' + componentPackeageHyphen + '-obj') {
                                fs.removeComponentSingleObjOnlyValue(record.target, record.oldValue, componentPath);
                                let dataset = record.target.dataset;
                                if (dataset !== null && dataset !== undefined) {
                                    let compObj = dataset[componentPackeage + 'Obj'];
                                    fs.bindComponentSingleObj(record.target, compObj, componentPath);
                                }
                            }
                            if (record.attributeName === 'data-' + componentPackeageHyphen + '-list') {
                                fs.removeComponentSingleListOnlyValue(record.target, record.oldValue, componentPath);
                                let dataset = record.target.dataset;
                                if (dataset !== null && dataset !== undefined) {
                                    let compList = dataset[componentPackeage + 'List'];
                                    fs.bindComponentSingleList(record.target, compList, componentPath);
                                }
                            }
                            if (record.attributeName === 'data-' + componentPackeageHyphen + '-name') {
                                fs.removeComponentSingleEvent(record.target, record.oldValue, componentPath);
                                let dataset = record.target.dataset;
                                if (dataset !== null && dataset !== undefined) {
                                    let compName = dataset[componentPackeage + 'Name'];
                                    fs.bindComponentSingleEvent(record.target, compName, componentPath);
                                }
                            }

                        }

                    } else if (record.type === 'childList') {
                        let initFunc = null;
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
                                    fs.componentDomInitCntMap.delete(initFunc);
                                    fs.componentDomInitTotalMap.delete(initFunc);
                                    try {
                                        initFunc();
                                    } catch(exception) {
                                        if (fs.clazz.obj.errorHandle && typeof fs.clazz.obj.errorHandle === 'function') {
                                            fs.clazz.obj.errorHandle(null, exception);
                                        } else {
                                            throw exception;
                                        }
                                    } finally {
                                        if (fs.clazz.obj.finalEvent && typeof fs.clazz.obj.finalEvent === 'function') {
                                            fs.clazz.obj.finalEvent(null, null);
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
        this.bindAllSingle(obj);
        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindAllNest(child);
            }
        }
    };

    this.bindAllSingle = function (obj){
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset.obj;
            let bindList = dataset.list;
            let name = dataset.name;

            if (obj !== null && obj !== undefined) {
                if ((bindObj !== null && bindObj !== undefined) || (bindList !== null && bindList !== undefined) || (name !== null && name !== undefined)) {
                    this.addTargetDom(obj, null, null);
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
                let componentPackeage = targetInfoValue['componentPackeage'];

                this.addTargetDomForComponent(obj, componentPath, componentPackeage);
                if (!this.targetDomMap.has(obj)) {
                    continue;
                }

                bindObj = dataset[componentPackeage + 'Obj'];
                bindList = dataset[componentPackeage + 'List'];
                name = dataset[componentPackeage + 'Name'];

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
                    if (this.clazz.obj.finalEvent && typeof this.clazz.obj.finalEvent === 'function') {
                        this.clazz.obj.finalEvent(null, ret);
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
                    if (this.clazz.obj.finalEvent && typeof this.clazz.obj.finalEvent === 'function') {
                        this.clazz.obj.finalEvent(null, ret);
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
        let protoObj = Object.getPrototypeOf(obj);
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
                let componentPackeage = targetInfoValue['componentPackeage'];

                bindObj = dataset[componentPackeage + 'Obj'];
                bindList = dataset[componentPackeage + 'List'];
                name = dataset[componentPackeage + 'Name'];

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

    this.appendLoadComponent = function (dom, componentPackeage, argObj, cb){
        this.loadComponent(dom, componentPackeage, argObj, cb, 'append');
    };

    this.beforeLoadComponent = function (dom, componentPackeage, argObj, cb){
        this.loadComponent(dom, componentPackeage, argObj, cb, 'before');
    };

    this.afterLoadComponent = function (dom, componentPackeage, argObj, cb){
        this.loadComponent(dom, componentPackeage, argObj, cb, 'after');
    };

    this.loadComponent = function (dom, componentPackeage, argObj, cb, position){

        componentPackeage = componentPackeage.trim();
        let componentPath = '';
        let componentNameList = componentPackeage.split('.');
        for (let componentName of componentNameList) {
            if (componentName.trim() === '') {
                continue;
            }
            componentPath += (componentName + '/');
        }
        let componentControllerPath = componentRoot + componentPath + 'controller.js';
        let componentViewPath = componentRoot + componentPath + 'view.html';

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, componentViewPath + '?' + this.version, null, argObj, cb, position, 'loadComponent', componentRoot);
        req.open('GET', componentViewPath + '?' + this.version);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.withCredentials = true;
        req.responseType = 'text';
        req.onloadend = (function(fs, dom, componentPackeage, argObj, cb, position, componentPath, componentControllerPath){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let viewStr = xhr.response;
                        fs.componentInsertFunc(fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position, viewStr);
                    }
                }
            }
        )(this, dom, componentPackeage, argObj, cb, position, componentPath, componentControllerPath);
        req.send();

    };

    this.getComponentInsertFunc = function (fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position){
        return function (Module){
            let viewStr = Module.default;
            fs.componentInsertFunc(fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position, viewStr);
        };
    };

    this.componentInsertFunc = function (fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position, viewStr){

        let func = function () {};
        if (cb !== null && cb !== undefined && typeof cb === 'function') {
            func = cb;
        }

        viewStr = fs.getTplStr(viewStr, argObj);

        import(componentControllerPath + '?' + fs.version)
        .then(fs.loadComponentControllerMethodList(fs, componentPath))
        .then(fs.getInsertComponent(fs, dom, componentPath, componentPackeage, viewStr, argObj, func, position));

    };

    this.loadComponentControllerMethodList = function (fs, componentPath){
        return function (Module){
            let classFullName = 'components/' + componentPath.substring(0, componentPath.length - 1);
            if (!fs.instanceMap[classFullName]) {
                fs.componentControllerList[componentPath] = new Module.default();
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
        };
    };

    this.getInsertComponent = function (fs, dom, componentPath, componentPackeage, viewStr, argObj, func, position){
        return function (){

            let viewDom = fs.getTplDom(viewStr, argObj);

            let initFunc = fs.getComponentMethod(fs, componentPath, 'init', argObj, func);

            let childList = viewDom.childNodes;
            let child = null;
            if (childList !== null && childList !== undefined) {
                fs.componentDomInitCntMap.set(initFunc, 0);
                fs.componentDomInitTotalMap.set(initFunc, childList.length);
                for (let i = 0; i < childList.length; i++) {
                    child = childList.item(i);
                    fs.addComponentTargetDomNest(child, componentPath, componentPackeage);
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
    };

    this.addTargetDomForComponent = function (obj, componentPath, componentPackeage){
        let dataset = obj.dataset;
        if (dataset !== null && dataset !== undefined) {
            let bindObj = dataset[componentPackeage + 'Obj'];
            let bindList = dataset[componentPackeage + 'List'];
            let name = dataset[componentPackeage + 'Name'];
            if ((bindObj !== null && bindObj !== undefined) || (bindList !== null && bindList !== undefined) || (name !== null && name !== undefined)) {
                this.addTargetDom(obj, componentPath, componentPackeage);
            }
        }
    };

    this.addComponentTargetDomNest = function (obj, componentPath, componentPackeage){
        if (obj === null || obj === undefined) {
            return;
        }

        this.addTargetDomForComponent(obj, componentPath, componentPackeage);

        let childList = obj.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.addComponentTargetDomNest(child, componentPath, componentPackeage);
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

    this.addTargetDom = function (dom, componentPath, componentPackeage) {
        if (!this.targetDomMap.has(dom)) {
            this.targetDomMap.set(dom, {});
        }
        if ((componentPath !== null && componentPath !== undefined) || (componentPackeage !== null && componentPackeage !== undefined)) {
            let targetInfo = this.targetDomMap.get(dom)
            targetInfo[componentPackeage] = {'componentPath':componentPath, 'componentPackeage':componentPackeage};
            this.componentPackageList[componentPackeage] = {'componentPath':componentPath, 'componentPackeage':componentPackeage};
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
                            let eventFn = (function(fnList, classObj){
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
                                            if (moduleClassObj.errorHandle && typeof moduleClassObj.errorHandle === 'function') {
                                                moduleClassObj.errorHandle(e, exception);
                                            } else {
                                                throw exception;
                                            }
                                        } finally {
                                            if (moduleClassObj.finalEvent && typeof moduleClassObj.finalEvent === 'function') {
                                                moduleClassObj.finalEvent(e, ret);
                                            }
                                        }
                                    }
                                };
                            })(fnList, classObj);
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

    this.getTplStr = function(tplFuc, paramObj) {
        if (typeof tplFuc === 'function') {
            return tplFuc(this, paramObj);
        } else {
            return tplFuc;
        }
    };

    this.getTplDom = function(viewStr, paramObj){

        let template = document.createElement('template');
        template.innerHTML = viewStr;
        let viewDom = template.content;

        if (paramObj === null || paramObj === undefined) {
            paramObj = Object.create(null);
        }

        let retObj = Object.create(null);
        let localValue = Object.create(null);
        this.developTpl(viewDom, paramObj, localValue, retObj);

        return viewDom;

    };

    this.developTpl = function(dom, paramObj, localValue, retObj){

        if (dom === null || dom === undefined) {
            return;
        }

        let skipObjMap = new WeakMap();

        let ifExecutingFlg = null;

        let childList = dom.childNodes;
        let child = null;
        if (childList !== null && childList !== undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);

                if ('continueVal' in retObj && retObj.continueVal > 0) {
                    this.selfAndNextDelete(child);
                    return;
                }
                if ('breakVal' in retObj && retObj.breakVal > 0) {
                    this.selfAndNextDelete(child);
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

                dataValue = dataset.text;
                if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                    delete child.dataset.text;
                    let value = $___fairysupport_param(paramObj, localValue, dataValue);
                    child.innerHTML = '';
                    child.appendChild(document.createTextNode(value));
                }

                dataValue = dataset.html;
                if (child !== null && child !== undefined && dataValue !== null && dataValue !== undefined) {
                    delete child.dataset.html;
                    let value = $___fairysupport_param(paramObj, localValue, dataValue);
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
                        this.developTpl(newChild, paramObj, localValue, retObj);
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
                                return;
                            } else {
                                retObj.continueVal--;
                                continue;
                            }
                        }
                        if ('breakVal' in retObj && retObj.breakVal > 0) {
                            if (retObj.breakVal > 1) {
                                retObj.breakVal--;
                                this.nextDelete(newChild);
                                this.deleteTag(firstElement, tag);
                                return;
                            } else {
                                retObj.breakVal--;
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
                        this.developTpl(newChild, paramObj, localValue, retObj);
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
                                return;
                            } else {
                                retObj.continueVal--;
                                continue;
                            }
                        }
                        if ('breakVal' in retObj && retObj.breakVal > 0) {
                            if (retObj.breakVal > 1) {
                                retObj.breakVal--;
                                this.nextDelete(newChild);
                                this.deleteTag(firstElement, tag);
                                return;
                            } else {
                                retObj.breakVal--;
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
                        this.developTpl(newChild, paramObj, localValue, retObj);
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
                                return;
                            } else {
                                retObj.continueVal--;
                                continue;
                            }
                        }
                        if ('breakVal' in retObj && retObj.breakVal > 0) {
                            if (retObj.breakVal > 1) {
                                retObj.breakVal--;
                                this.nextDelete(newChild);
                                this.deleteTag(firstElement, tag);
                                return;
                            } else {
                                retObj.breakVal--;
                                break;
                            }
                        }
                    }
                    child.innerHTML = '';
                    child.parentNode.removeChild(child);
                    child = firstElement;

                }

                this.deleteTag(child, tag);

                if (child !== null && child !== undefined && !skipObjMap.has(child)) {
                    this.developTpl(child, paramObj, localValue, retObj);
                }

            }
        }

    };

    this.deleteTag = function(child, tag){
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
            }
        }
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

    this.appendResJsonComponent = function (dom, componentPackeage, reqUrl, paramObj, cb){
        return this.resJsonComponent(dom, componentPackeage, reqUrl, paramObj, cb, 'append');
    };
    this.beforeResJsonComponent = function (dom, componentPackeage, reqUrl, paramObj, cb){
        return this.resJsonComponent(dom, componentPackeage, reqUrl, paramObj, cb, 'before');
    };
    this.afterResJsonComponent = function (dom, componentPackeage, reqUrl, paramObj, cb){
        return this.resJsonComponent(dom, componentPackeage, reqUrl, paramObj, cb, 'after');
    };

    this.resJsonComponent = function (dom, componentPackeage, reqUrl, paramObj, cb, position){

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, reqUrl, JSON.stringify(paramObj), null, cb, position, 'resJsonComponent', componentRoot);
        req.open('POST', reqUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json');
        req.withCredentials = true;
        req.responseType = 'json';
        req.onloadend = (function(fs, dom, componentPackeage, cb, position){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let json = xhr.response;
                        fs.loadComponent(dom, componentPackeage, json, cb, position);
                    }
                }
            }
        )(this, dom, componentPackeage, cb, position);

        return req;

    };

    this.appendResJsonComponentByForm = function (dom, componentPackeage, reqUrl, formObj, cb){
        return this.resJsonComponentByForm(dom, componentPackeage, reqUrl, formObj, cb, 'append');
    };
    this.beforeResJsonComponentByForm = function (dom, componentPackeage, reqUrl, formObj, cb){
        return this.resJsonComponentByForm(dom, componentPackeage, reqUrl, formObj, cb, 'before');
    };
    this.afterResJsonComponentByForm = function (dom, componentPackeage, reqUrl, formObj, cb){
        return this.resJsonComponentByForm(dom, componentPackeage, reqUrl, formObj, cb, 'after');
    };

    this.resJsonComponentByForm = function (dom, componentPackeage, reqUrl, formObj, cb, position){

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, reqUrl, new FormData(formObj), null, cb, position, 'resJsonComponentByForm', componentRoot);
        req.open('POST', reqUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.withCredentials = true;
        req.responseType = 'json';
        req.onloadend = (function(fs, dom, componentPackeage, cb, position){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let json = xhr.response;
                        fs.loadComponent(dom, componentPackeage, json, cb, position);
                    }

                }
            }
        )(this, dom, componentPackeage, cb, position);

        return req;

    };

    this.appendResHtmlComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, cb){
        return this.resHtmlComponent(dom, componentPackeage, viewUrl, paramObj, argObj, cb, 'append');
    };
    this.beforeResHtmlComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, cb){
        return this.resHtmlComponent(dom, componentPackeage, viewUrl, paramObj, argObj, cb, 'before');
    };
    this.afterResHtmlComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, cb){
        return this.resHtmlComponent(dom, componentPackeage, viewUrl, paramObj, argObj, cb, 'after');
    };

    this.resHtmlComponent = function (dom, componentPackeage, viewUrl, paramObj, argObj, cb, position){

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, viewUrl, JSON.stringify(paramObj), argObj, cb, position, 'resHtmlComponent', componentRoot);
        req.open('POST', viewUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.setRequestHeader('Content-Type', 'application/json');
        req.withCredentials = true;
        req.responseType = 'text';
        req.onloadend = (function(fs, dom, componentPackeage, argObj, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let viewStr = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
                            if (componentName.trim() === '') {
                                continue;
                            }
                            componentPath += (componentName + '/');
                        }
                        let componentControllerPath = componentRoot + componentPath + 'controller.js';

                        fs.componentInsertFunc(fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position, viewStr);
                    }
                }
            }
        )(this, dom, componentPackeage, argObj, cb, position, componentRoot);

        return req;

    };

    this.appendResHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb){
        return this.resHtmlComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, cb, 'append');
    };
    this.beforeResHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb){
        return this.resHtmlComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, cb, 'before');
    };
    this.afterResHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb){
        return this.resHtmlComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, cb, 'after');
    };

    this.resHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb, position){

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, viewUrl, new FormData(formObj), argObj, cb, position, 'resHtmlComponentByForm', componentRoot);
        req.open('POST', viewUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.withCredentials = true;
        req.responseType = 'text';
        req.onloadend = (function(fs, dom, componentPackeage, argObj, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let viewStr = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
                            if (componentName.trim() === '') {
                                continue;
                            }
                            componentPath += (componentName + '/');
                        }
                        let componentControllerPath = componentRoot + componentPath + 'controller.js';

                        fs.componentInsertFunc(fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position, viewStr);
                    }
                }
            }
        )(this, dom, componentPackeage, argObj, cb, position, componentRoot);

        return req;

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
        }
        if (result === '') {
            result = null;
        }
        return result;
    };

    this.emptyAjax = function (reqUrl, paramObj, met = 'POST', fmt = 'json',  user = null, password = null){

        if (met.toLowerCase() !== 'post') {
            fmt = 'query'
        }

        let paramStr = this.paramFmt(fmt, paramObj, '');
        if (met.toLowerCase() !== 'post' && paramStr !== null && paramStr !== '') {
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

    this.msg = function (name, replaceObj){

        let reqLang = this.getReqLang();
        let confLang = this.getConfLang();

        let str = msgObj['__fairysupport_default'][name];
        if (confLang !== null && (confLang in msgObj) && (name in msgObj[confLang])) {
            str = msgObj[confLang][name];
        }
        if (reqLang !== null && (reqLang in msgObj) && (name in msgObj[reqLang])) {
            str = msgObj[reqLang][name];
        }

        for (const [key, value] of Object.entries(replaceObj)) {
            let re = new RegExp("(?<!\\\\)\\$\\{" + key + "\\}", "g");
            str = str.replace(re, value);
            str = str.replace("\\${" + key + "}", "${" + key + "}");
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
                preVal: Object.create({})
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
        let setFunc = (function(protoPropertyDescriptor, obj, funcList, funcArg){
            return function(arg){
                let valid = true;
                for (const func of funcList) {
                    let funcResult = func(obj, arg, protoPropertyDescriptor.get.call(obj), funcArg);
                    if (!funcResult) {
                        valid = funcResult;
                    }
                }
                if (valid) {
                    protoPropertyDescriptor.set.call(obj, arg);
                }
            }
        })(protoPropertyDescriptor, obj, funcList, funcArg);

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
            let eventFunc = (function (funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor){
                return function (event) {
                    let valid = true;
                    for (const func of funcList) {
                        let funcResult = func(obj, obj[prop], preValueHolder.preVal[prop], funcArg);
                        if (!funcResult) {
                            valid = funcResult;
                        }
                    }
                    if (!valid) {
                        protoPropertyDescriptor.set.call(obj, preValueHolder.preVal[prop]);
                    }
                    preValueHolder.preVal[prop] = obj[prop];
                };
            })(funcList, obj, prop, preValueHolder, funcArg, protoPropertyDescriptor);
            for (const eventName of eventList) {
                obj.addEventListener(eventName, eventFunc);
            }
        }

        for (const func of funcList) {
            func(obj, protoPropertyDescriptor.get.call(obj), protoPropertyDescriptor.get.call(obj), funcArg);
        }

    }

    this.getPrototypePropertyDescriptor = function (obj, propName){
        let protoObj = Object.getPrototypeOf(obj);
        let protoPropertyDescriptor = null;
        if (protoObj === null || protoObj == undefined) {
            protoPropertyDescriptor = Object.create({});
        } else {
            protoPropertyDescriptor = Object.getOwnPropertyDescriptor(protoObj, propName);
            if (protoPropertyDescriptor === null || protoPropertyDescriptor === undefined) {
                protoPropertyDescriptor = Object.create({});
            }
            if ('configurable' in protoPropertyDescriptor && !protoPropertyDescriptor.configurable) {
                return;
            }
        }
        if (!('get' in protoPropertyDescriptor) || !('set' in protoPropertyDescriptor)) {

            let newProtoPropertyDescriptor = Object.create({});
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

    this.init();

}
const $___fairysupport_param = function(v, l, tpl) {
    return eval(tpl);
}
const $f = new ___fairysupport();
