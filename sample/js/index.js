function ___fairysupport(){

    let moduleRoot = '/js/modules/';
    let componentRoot = '/js/components/';
    let scriptObj = document.getElementById("fs-js");

    let modulePath = 'index';
    let reqUrl = new URL(window.location.href);
    let jsRoot = reqUrl.origin + '/';
    let httpRoot = reqUrl.origin + '/';
    let reqPath = reqUrl.origin + reqUrl.pathname.trim();
    if (reqUrl.port !== null && reqUrl.port !== undefined && reqUrl.port !== '') {
        jsRoot = reqUrl.origin + ':' + reqUrl.port + '/';
        httpRoot = reqUrl.origin + ':' + reqUrl.port + '/';
        reqPath = reqUrl.origin + ':' + reqUrl.port + reqUrl.pathname.trim();
    }

    this.version = Date.now();

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

    this.instanceMap = {};

    let fairysupportClear = class FairysupportClear {
        constructor() {
        }
    }

    this.init = function () {
        if (scriptObj) {
            let argJsRoot = scriptObj.dataset.jsRoot;
            if (argJsRoot !== null && argJsRoot !== undefined) {
                argJsRoot = argJsRoot.trim();
                if (argJsRoot !== '') {
                    jsRoot = argJsRoot;
                    moduleRoot = jsRoot + '/modules/';
                    componentRoot = jsRoot + '/components/';
                }
            }
            let argPageRoot = scriptObj.dataset.pageRoot;
            if (argPageRoot !== null && argPageRoot !== undefined) {
                argPageRoot = argPageRoot.trim();
                if (argPageRoot !== '') {
                    httpRoot = argPageRoot;
                }
            }
            let argVersion = scriptObj.dataset.version;
            if (argVersion !== null && argVersion !== undefined) {
                argVersion = argVersion.trim();
                if (argVersion !== '') {
                    this.version = argVersion;
                }
            }
        }

        if (reqPath !== null && reqPath !== undefined) {
            reqPath = reqPath.trim();
            if (reqPath !== '') {
                if (httpRoot.length > reqPath.length) {
                    return;
                }
                let reqPathHead = reqPath.substring(0, httpRoot.length);
                if (httpRoot !== reqPathHead) {
                    return;
                }
                modulePath = '';
                let reqPathTail = reqPath.substring(httpRoot.length);
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
            }
        }
        let moduleFullPath = moduleRoot + modulePath + '.js';

        import(moduleFullPath + '?' + this.version)
        .then(this.getControllerLoader(this, modulePath))
        .then(this.binder(this))
        .then(this.getControllerMethod(this, 'init', null));

        return this;

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
                                    initFunc();
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
            this.setEventFunction(name, this.clazz.obj, this.controllerMethodList, dom, this.controllerEventMethodList);
        }
    }

    this.execMethod = function (obj, methodList, methodName, argList){
        if (methodList[methodName]) {
            if (argList === null || argList === undefined) {
                return obj[methodName]();
            } else {
                return obj[methodName](argList);
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
            componentPath += (componentName + '/');
        }
        let componentControllerPath = componentRoot + componentPath + 'controller.js';
        let componentViewPath = componentRoot + componentPath + 'view.js';

        import(componentViewPath + '?' + this.version)
        .then(this.getComponentInsertFunc(this, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb, position));

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
        .then(fs.getComponentController(fs, componentPath))
        .then(fs.getInsertComponent(fs, dom, componentPath, componentPackeage, viewStr, argObj, func, position));

    };

    this.getComponentController = function (fs, componentPath){
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
            this.setEventFunction(name, this.componentControllerList[componentPath], this.componentControllerMethodList[componentPath], dom, this.componentControllerEventMethodList[componentPath]);
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

    this.setEventFunction = function(dataFullName, classObj, methodList, dom, eventMethodList){
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
                            let eventFn = (function(fnList){
                                return function(e){
                                    for (let func of fnList) {
                                        let ret = func(e);
                                        if (ret === false) {
                                            return;
                                        }
                                    }
                                };
                            })(fnList);
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
        req.responseType = 'json';
        req.onload = (function(fs, dom, componentPackeage, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {

                        let json = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
                            componentPath += (componentName + '/');
                        }
                        let componentControllerPath = componentRoot + componentPath + 'controller.js';
                        let componentViewPath = componentRoot + componentPath + 'view.js';

                        import(componentViewPath + '?' + fs.version)
                        .then(fs.getComponentInsertFunc(fs, dom, componentPath, componentControllerPath, json, componentPackeage, cb, position));

                    }

                }
            }
        )(this, dom, componentPackeage, cb, position, componentRoot);

        return req;

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
        req.responseType = 'json';
        req.onload = (function(fs, dom, componentPackeage, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {

                        let json = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
                            componentPath += (componentName + '/');
                        }
                        let componentControllerPath = componentRoot + componentPath + 'controller.js';
                        let componentViewPath = componentRoot + componentPath + 'view.js';

                        import(componentViewPath + '?' + fs.version)
                        .then(fs.getComponentInsertFunc(fs, dom, componentPath, componentControllerPath, json, componentPackeage, cb, position));

                    }

                }
            }
        )(this, dom, componentPackeage, cb, position, componentRoot);

        return req;

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
        req.responseType = 'text';
        req.onload = (function(fs, dom, componentPackeage, argObj, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let viewStr = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
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

    this.beforeResHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb, cb){
        return this.resHtmlComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, cb, 'before');
    };
    this.afterResHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb, cb){
        return this.resHtmlComponentByForm(dom, componentPackeage, viewUrl, formObj, argObj, cb, 'after');
    };

    this.resHtmlComponentByForm = function (dom, componentPackeage, viewUrl, formObj, argObj, cb, position){

        let req = new this.fairysupportAjaxObj(dom, componentPackeage, viewUrl, new FormData(formObj), argObj, cb, position, 'resHtmlComponentByForm', componentRoot);
        req.open('POST', viewUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'text/*');
        req.responseType = 'text';
        req.onload = (function(fs, dom, componentPackeage, argObj, cb, position, componentRoot){
                return function (e, xhr) {
                    if (xhr.status === 200) {
                        let viewStr = xhr.response;

                        componentPackeage = componentPackeage.trim();
                        let componentPath = '';
                        let componentNameList = componentPackeage.split('.');
                        for (let componentName of componentNameList) {
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

    this.ajax = function (reqUrl, paramObj){

        let req = new this.fairysupportAjaxObj(null, null, reqUrl, JSON.stringify(paramObj), null, null, null, 'ajax', null);
        req.open('POST', reqUrl);
        req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/json');
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
        abort() {
            return this.xhr.abort();
        }
        getAllResponseHeaders() {
            return this.xhr.getAllResponseHeaders();
        }
        getResponseHeader(headerName) {
            return this.xhr.getResponseHeader(headerName);
        }
        open(method, url, async = true, user = null, password = null) {
            return this.xhr.open(method, url, async, user, password);
        }
        overrideMimeType(mimeType) {
            return this.xhr.overrideMimeType(mimeType);
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

}
const $___fairysupport_param = function(v, l, tpl) {
    return eval(tpl);
}
const $f = new ___fairysupport();
$f.init();

