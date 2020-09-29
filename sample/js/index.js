function ___fairysupport(){

    let moduleRoot = '/js/modules/';
    let componentRoot = '/js/components/';
    let scriptObj = document.getElementById("fs-js");

    let modulePath = 'index';
    let reqUrl = new URL(window.location.href);
    let root = reqUrl.origin + '/';
    let reqPath = reqUrl.origin + reqUrl.pathname.trim();
    if (reqUrl.port != null && reqUrl.port != undefined && reqUrl.port != '') {
        root = reqUrl.origin + ':' + reqUrl.port + '/';
        reqPath = reqUrl.origin + ':' + reqUrl.port + reqUrl.pathname.trim();
    }

    this.clazz = {};
    this.controllerMethodList = {};

    this.componentControllerList = {};
    this.componentControllerethodList = {};
    this.componentViewList = {};

    this.init = function () {
        if (scriptObj) {
            let argRoot = scriptObj.dataset.root;
            if (argRoot !== null && argRoot !== undefined) {
                argRoot = argRoot.trim();
                if (argRoot !== '') {
                    root = argRoot;
                    moduleRoot = root + '/js/modules/';
                    componentRoot = root + '/js/components/';
                }
            }
        }

        if (reqPath !== null && reqPath !== undefined) {
            reqPath = reqPath.trim();
            if (reqPath !== '') {
                if (root.length > reqPath.length) {
                    return;
                }
                let reqPathHead = reqPath.substring(0, root.length);
                if (root !== reqPathHead) {
                    return;
                }
                modulePath = '';
                let reqPathTail = reqPath.substring(root.length);
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
        modulePath = moduleRoot + modulePath + '.js';

        import(modulePath)
        .then(this.getControllerLoader(this))
        .then(this.binder(this))
        .then(this.getControllerMethod(this, 'init', null));

        return this;

    };

    this.getControllerLoader = function (fs){
        return function (Module){
            fs.clazz.obj = new Module.default();
            fs.controllerMethodList = fs.getMethodList(fs.clazz.obj);
        };
    };

    this.binder = function (fs){
        return function (){
            let bodyObj = document.getElementsByTagName("BODY");
            let observer = new MutationObserver((records, obj) => {
                for (let record of records) {
                    if (record.type === 'attributes') {
                        if (record.attributeName === 'data-obj') {
                            fs.removeControllerSingleObj(record.target, record.oldValue);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset != undefined) {
                                let bindObj = dataset.obj;
                                fs.bindControllerSingleObj(record.target, bindObj);
                            }
                        }
                        if (record.attributeName === 'data-list') {
                            fs.removeControllerSingleList(record.target, record.oldValue);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset != undefined) {
                                let bindList = dataset.list;
                                fs.bindControllerSingleList(record.target, bindList);
                            }
                        }
                        if (record.attributeName === 'data-name') {
                            fs.removeControllerSingleEvent(record.target, record.oldValue);
                            let dataset = record.target.dataset;
                            if (dataset !== null && dataset != undefined) {
                                let name = dataset.name;
                                fs.bindControllerSingleEvent(record.target, name);
                            }
                        }
                    } else if (record.type === 'childList') {
                        for (let i = 0; i < record.removedNodes.length; i++) {
                            fs.removeControllerNest(record.removedNodes.item(i));
                        }
                        for (let i = 0; i < record.addedNodes.length; i++) {
                            fs.bindControllerNest(record.addedNodes.item(i));
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
            this.bindControllerNest(body);
        }
    };

    this.bindControllerNest = function (obj){
        if (obj == null || obj == undefined) {
            return;
        }
        this.bindControllerSingle(obj);
        let childList = obj.childNodes;
        let child = null;
        if (childList != null && childList != undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindControllerNest(child);
            }
        }
    };

    this.bindControllerSingle = function (obj){
        let dataset = obj.dataset;
        if (dataset !== null && dataset != undefined) {
            let bindObj = dataset.obj;
            this.bindControllerSingleObj(obj, bindObj);

            let bindList = dataset.list;
            this.bindControllerSingleList(obj, bindList);

            let name = dataset.name;
            this.bindControllerSingleEvent(obj, name);
        }
    };

    this.bindControllerSingleObj = function (dom, bindStr){
        if (dom !== null && dom != undefined && bindStr !== null && bindStr != undefined) {
            this.execControllerMethod('beforeBindObj', {'name': bindStr, 'value': dom});
            this.clazz.obj[bindStr] = dom;
            this.execControllerMethod('afterBindObj', {'name': bindStr, 'value': dom});
        }
    }

    this.bindControllerSingleList = function (dom, bindList){
        if (dom !== null && dom != undefined && bindList !== null && bindList != undefined) {
            this.execControllerMethod('beforeBindList', {'name': bindList, 'value': dom});
            if (this.clazz.obj[bindList] instanceof Set) {
                this.clazz.obj[bindList].add(dom);
            } else {
                this.clazz.obj[bindList] = new Set();
                this.clazz.obj[bindList].add(dom);
            }
            this.execControllerMethod('afterBindList', {'name': bindList, 'value': dom});
        }
    }

    this.bindControllerSingleEvent = function (dom, name){
        if (dom !== null && dom != undefined && name !== null && name != undefined) {
            for (let controllerMethod in this.controllerMethodList) {
                if (controllerMethod.indexOf(name) === 0) {
                    let eventName = controllerMethod.substring(name.length);
                    eventName = eventName.substring(0, 1).toLowerCase() + eventName.substring(1);
                    this.execControllerMethod('beforeName', {'name': name, 'event': eventName, 'value': dom});
                    dom.addEventListener(eventName, this.controllerMethodList[controllerMethod]);
                    this.execControllerMethod('afterName', {'name': name, 'event': eventName, 'value': dom});
                }
            }
        }
    }

    this.execMethod = function (obj, methodList, methodName, argList){
        if (methodList[methodName]) {
            if (argList == null || argList == undefined) {
                obj[methodName]();
            } else {
                obj[methodName](argList);
            }
        }
    };

    this.execControllerMethod = function (methodName, argList){
        this.execMethod(this.clazz.obj, this.controllerMethodList, methodName, argList);
    };

    this.getExecMethod = function (fs, obj, methodList, methodName, argList){
        return function (){
            fs.execMethod(obj, methodList, methodName, argList);
        }
    };

    this.getControllerMethod = function (fs, methodName, argList){
        return function(){
            fs.execControllerMethod(methodName, argList);
        }
    };

    this.getMethodList = function (obj){
        let methodNameList = {};
        let protoObj = Object.getPrototypeOf(obj);
        let parentProtoObj = null;
        while (protoObj !== null && protoObj != undefined) {
            parentProtoObj = Object.getPrototypeOf(protoObj);
            if (parentProtoObj == null || parentProtoObj == undefined) {
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

    this.removeControllerSingleObj = function (dom, bindStr){
        if (dom !== null && dom != undefined && bindStr !== null && bindStr != undefined && this.clazz.obj[bindStr] != undefined) {
            this.execControllerMethod('beforeRemoveObj', {'name': bindStr, 'value': dom});
            delete this.clazz.obj[bindStr];
            this.execControllerMethod('afterRemoveObj', {'name': bindStr, 'value': dom});
        }
    };

    this.removeControllerSingleList = function (dom, bindList){
        if (dom !== null && dom != undefined && bindList !== null && bindList != undefined) {
            if (this.clazz.obj[bindList] != undefined && this.clazz.obj[bindList] instanceof Set && this.clazz.obj[bindList].has(dom)) {
                this.execControllerMethod('beforeRemoveList', {'name': bindList, 'value': dom});
                this.clazz.obj[bindList].delete(dom);
                this.execControllerMethod('afterRemoveList', {'name': bindList, 'value': dom});
            }
        }
    };

    this.removeControllerSingleEvent = function (dom, name){
        if (dom !== null && dom != undefined && name !== null && name != undefined) {
            for (let controllerMethod in this.controllerMethodList) {
                if (controllerMethod.indexOf(name) === 0) {
                    let eventName = controllerMethod.substring(name.length);
                    eventName = eventName.substring(0, 1).toLowerCase() + eventName.substring(1);
                    this.execControllerMethod('beforeRemoveName', {'name': name, 'event': eventName, 'value': dom});
                    dom.removeEventListener(eventName, this.controllerMethodList[controllerMethod]);
                    this.execControllerMethod('afterRemoveName', {'name': name, 'event': eventName, 'value': dom});
                }
            }
        }
    };

    this.removeControllerNest = function (obj){
        if (obj == null || obj == undefined) {
            return;
        }
        this.removeControllerSingle(obj);
        let childList = obj.childNodes;
        let child = null;
        if (childList != null && childList != undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.removeControllerNest(child);
            }
        }
    };

    this.removeControllerSingle = function (obj){
        let dataset = obj.dataset;
        if (dataset !== null && dataset != undefined) {
            let bindObj = dataset.obj;
            if (bindObj !== null && bindObj != undefined) {
                this.removeControllerSingleObj(obj, bindObj);
            }

            let bindList = dataset.list;
            if (bindList !== null && bindList != undefined) {
                this.removeControllerSingleList(obj, bindList);
            }

            let name = dataset.name;
            if (name !== null && name != undefined) {
                this.removeControllerSingleEvent(obj, name);
            }
        }
    };

    this.loadComponent = function (dom, componentPackeage, argObj, cb){

        componentPackeage = componentPackeage.trim();
        let componentPath = '';
        let componentNameList = componentPackeage.split('.');
        for (let componentName of componentNameList) {
            componentPath += (componentName + '/');
        }
        let componentControllerPath = componentRoot + componentPath + 'controller.js';
        let componentViewPath = componentRoot + componentPath + 'view.js';

        import(componentViewPath)
        .then(this.getComponentView(this, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb));

    };

    this.getComponentView = function (fs, dom, componentPath, componentControllerPath, argObj, componentPackeage, cb){
        return function (Module){

            let func = function () {
            };
            if (cb !== null && cb != undefined && typeof cb === 'function') {
                func = cb;
            }

            fs.componentViewList[componentPath] = Module.default;
            import(componentControllerPath)
            .then(fs.getComponentController(fs, componentPath))
            .then(fs.getInsertComponent(fs, dom, componentPath, componentPackeage))
            .then(fs.getComponentMethod(fs, componentPath, 'init', argObj))
            .then(func);
        };
    };

    this.getComponentController = function (fs, componentPath){
        return function (Module){
            fs.componentControllerList[componentPath] = new Module.default();
            fs.componentControllerethodList[componentPath] = fs.getMethodList(fs.componentControllerList[componentPath]);
        };
    };

    this.getInsertComponent = function (fs, dom, componentPath, componentPackeage){
        return function (){
            dom.innerHTML = fs.componentViewList[componentPath].trim();
            let childList = dom.childNodes;
            let child = null;
            if (childList != null && childList != undefined) {
                for (let i = 0; i < childList.length; i++) {
                    child = childList.item(i);
                    fs.componentBinder(child, componentPath, componentPackeage);
                    fs.bindComponentNest(child, componentPath, componentPackeage);
                }
            }
        };
    };

    this.bindComponentNest = function (obj, componentPath, componentPackeage){
        if (obj == null || obj == undefined) {
            return;
        }
        this.bindComponentSingle(obj, componentPath, componentPackeage);
        let childList = obj.childNodes;
        let child = null;
        if (childList != null && childList != undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.bindComponentNest(child, componentPath, componentPackeage);
            }
        }
    };

    this.bindComponentSingle = function (obj, componentPath, componentPackeage){
        let dataset = obj.dataset;
        if (dataset !== null && dataset != undefined) {
            let bindObj = dataset[componentPackeage + 'Obj'];
            this.bindComponentSingleObj(obj, bindObj, componentPath);

            let bindList = dataset[componentPackeage + 'List'];
            this.bindComponentSingleList(obj, bindList, componentPath);

            let name = dataset[componentPackeage + 'Name'];
            this.bindComponentSingleEvent(obj, name, componentPath);
        }
    };

    this.bindComponentSingleObj = function (dom, bindStr, componentPath){
        if (dom !== null && dom != undefined && bindStr !== null && bindStr != undefined) {
            this.execComponentMethod(componentPath, 'beforeBindObj', {'name': bindStr, 'value': dom});
            this.componentControllerList[componentPath][bindStr] = dom;
            this.execComponentMethod(componentPath, 'afterBindObj', {'name': bindStr, 'value': dom});
        }
    }

    this.bindComponentSingleList = function (dom, bindList, componentPath){
        if (dom !== null && dom != undefined && bindList !== null && bindList != undefined) {
            this.execComponentMethod(componentPath, 'beforeBindList', {'name': bindList, 'value': dom});
            if (this.componentControllerList[componentPath][bindList] instanceof Set) {
                this.componentControllerList[componentPath][bindList].add(dom);
            } else {
                this.componentControllerList[componentPath][bindList] = new Set();
                this.componentControllerList[componentPath][bindList].add(dom);
            }
            this.execComponentMethod(componentPath, 'afterBindList', {'name': bindList, 'value': dom});
        }
    }

    this.bindComponentSingleEvent = function (dom, name, componentPath){
        if (dom !== null && dom != undefined && name !== null && name != undefined) {
            for (let componentControllerMethod in this.componentControllerethodList[componentPath]) {
                if (componentControllerMethod.indexOf(name) === 0) {
                    let eventName = componentControllerMethod.substring(name.length);
                    eventName = eventName.substring(0, 1).toLowerCase() + eventName.substring(1);
                    this.execComponentMethod(componentPath, 'beforeName', {'name': name, 'event': eventName, 'value': dom});
                    dom.addEventListener(eventName, this.componentControllerethodList[componentPath][componentControllerMethod]);
                    this.execComponentMethod(componentPath, 'afterName', {'name': name, 'event': eventName, 'value': dom});
                }
            }
        }
    }

    this.execComponentMethod = function (componentPath, methodName, argList){
        this.execMethod(this.componentControllerList[componentPath], this.componentControllerethodList[componentPath], methodName, argList);
    };

    this.getComponentMethod = function (fs, componentPath, methodName, argList){
        return function(){
            fs.execComponentMethod(componentPath, methodName, argList);
        };
    };

    this.componentBinder = function (compDom, componentPath, componentPackeage){
        let observer = new MutationObserver((records, obj) => {
            for (let record of records) {
                if (record.type === 'attributes') {
                    if (record.attributeName === 'data-' + componentPackeage + '-obj') {
                        this.removeComponentSingleObj(record.target, record.oldValue, componentPath);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset != undefined) {
                            let compObj = dataset[componentPackeage + 'Obj'];
                            this.bindComponentSingleObj(record.target, compObj, componentPath);
                        }
                    }
                    if (record.attributeName === 'data-' + componentPackeage + '-list') {
                        this.removeComponentSingleList(record.target, record.oldValue, componentPath);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset != undefined) {
                            let compList = dataset[componentPackeage + 'List'];
                            this.bindComponentSingleList(record.target, compList, componentPath);
                        }
                    }
                    if (record.attributeName === 'data-' + componentPackeage + '-name') {
                        this.removeComponentSingleEvent(record.target, record.oldValue, componentPath);
                        let dataset = record.target.dataset;
                        if (dataset !== null && dataset != undefined) {
                            let compName = dataset[componentPackeage + 'Name'];
                            this.bindComponentSingleEvent(record.target, compName, componentPath);
                        }
                    }
                } else if (record.type === 'childList') {
                    for (let i = 0; i < record.removedNodes.length; i++) {
                        this.removeComponentNest(record.removedNodes.item(i), componentPath);
                    }
                    for (let i = 0; i < record.addedNodes.length; i++) {
                        this.bindComponentNest(record.addedNodes.item(i), componentPath, componentPackeage);
                    }
                }
            }
        });
        let config = {attributes: true, childList: true, subtree: true , attributeOldValue: true};
        observer.observe(compDom, config);
    };

    this.removeComponentSingleObj = function (dom, bindStr, componentPath){
        if (dom !== null && dom != undefined && bindStr !== null && bindStr != undefined && this.componentControllerList[componentPath] != undefined && this.componentControllerList[componentPath][bindStr] != undefined) {
            this.execComponentMethod(componentPath, 'beforeRemoveObj', {'name': bindStr, 'value': dom});
            delete this.componentControllerList[componentPath][bindStr];
            this.execComponentMethod(componentPath, 'afterRemoveObj', {'name': bindStr, 'value': dom});
        }
    };

    this.removeComponentSingleList = function (dom, bindList, componentPath){
        if (dom !== null && dom != undefined && bindList !== null && bindList != undefined) {
            if (this.componentControllerList[componentPath] != undefined && this.componentControllerList[componentPath][bindList] != undefined && this.componentControllerList[componentPath][bindList] instanceof Set && this.componentControllerList[componentPath][bindList].has(dom)) {
                this.execComponentMethod(componentPath, 'beforeRemoveList', {'name': bindList, 'value': dom});
                this.componentControllerList[componentPath][bindList].delete(dom);
                this.execComponentMethod(componentPath, 'afterRemoveList', {'name': bindList, 'value': dom});
            }
        }
    };

    this.removeComponentSingleEvent = function (dom, name, componentPath){
        if (dom !== null && dom != undefined && name !== null && name != undefined) {
            for (let componentControllerMethod in this.componentControllerethodList[componentPath]) {
                if (componentControllerMethod.indexOf(name) === 0) {
                    let eventName = componentControllerMethod.substring(name.length);
                    eventName = eventName.substring(0, 1).toLowerCase() + eventName.substring(1);
                    this.execComponentMethod(componentPath, 'beforeRemoveName', {'name': name, 'event': eventName, 'value': dom});
                    dom.removeEventListener(eventName, this.componentControllerethodList[componentPath][componentControllerMethod]);
                    this.execComponentMethod(componentPath, 'afterRemoveName', {'name': name, 'event': eventName, 'value': dom});
                }
            }
        }
    };

    this.removeComponentNest = function (obj, componentPath){
        if (obj == null || obj == undefined) {
            return;
        }
        this.removeComponentSingle(obj, componentPath);
        let childList = obj.childNodes;
        let child = null;
        if (childList != null && childList != undefined) {
            for (let i = 0; i < childList.length; i++) {
                child = childList.item(i);
                this.removeComponentNest(child, componentPath);
            }
        }
    };

    this.removeComponentSingle = function (obj, componentPath){
        let dataset = obj.dataset;
        if (dataset !== null && dataset != undefined) {
            let bindObj = dataset.obj;
            if (bindObj !== null && bindObj != undefined) {
                this.removeComponentSingleObj(obj, bindObj, componentPath);
            }

            let bindList = dataset.list;
            if (bindList !== null && bindList != undefined) {
                this.removeComponentSingleList(obj, bindList, componentPath);
            }

            let name = dataset.name;
            if (name !== null && name != undefined) {
                this.removeComponentSingleEvent(obj, name, componentPath);
            }
        }
    };

}
const $f = new ___fairysupport();
$f.init();

