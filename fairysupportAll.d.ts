export declare class FairysupportJs {
    constructor();
    getEnv(): string;
    initEnvTxt(val: string): void;
    initEnvValueObj(jsonObj: object): void;
    getModulePath(pageRoot: string, pageUrl: URL): string;
    init(pageRoot: string, pageUrl: URL): string;
    loadModuleReqMsg(jsRoot: string, version: string, modulePath: string, retryCount: number): void;
    loadModuleBrowserMsg(jsRoot: string, version: string, modulePath: string, retryCount: number): void;
    loadModuleDefaultMsg(jsRoot: string, version: string, modulePath: string, retryCount: number): void;
    loadModuleController(version: string, moduleRoot: string, modulePath: string, retryCount: number): void;
    getControllerLoader(fs: FairysupportJs, modulePath: string): void;
    binder(fs: FairysupportJs): void;
    initExecForController(fs: FairysupportJs, addNode: Node): void;
    addInitFuncForAfterObserver(viewDom: Node, initFunc: object, componentInitMark: boolean): void;
    bindBody(): void;
    bindAllNest(obj: Node | null | undefined): void;
    bindAllSingle(obj: Node | null | undefined, func: object): void;
    bindControllerSingleObj(dom: Node | null | undefined, bindStr: string | null | undefined): void;
    bindControllerSingleList(dom: Node | null | undefined, bindList: string | null | undefined): void;
    bindControllerSingleEvent(dom: Node | null | undefined, name: string | null | undefined): void;
    execMethod(obj: object, methodList: object, methodName: string, argList: any): any;
    execControllerMethod(methodName: string, argList: any): any;
    getExecMethod(fs: FairysupportJs, obj: object, methodList: object, methodName: string, argList: any): object;
    getControllerMethod(fs: FairysupportJs, methodName: string, argList: any): object;
    getControllerMethodInputArgs(fs: FairysupportJs, methodName: string): object;
    getMethodList(obj: object): object;
    removeAllNest(obj: Node | null | undefined): void;
    removeAllSingle(obj: Node | null | undefined): void;
    removeControllerSingleObjOnlyValue(dom: Node | null | undefined, bindStr: string | null | undefined): void;
    removeControllerSingleObj(dom: Node | null | undefined, bindStr: string | null | undefined): void;
    removeControllerSingleListOnlyValue(dom: Node | null | undefined, bindList: string | null | undefined): void;
    removeControllerSingleList(dom: Node | null | undefined, bindList: string | null | undefined): void;
    removeControllerSingleEvent(dom: Node | null | undefined, name: string | null | undefined): void;
    loadComponentReqMsg(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, componentControllerPath: string, argObj: object | null | undefined, cb: object | null | undefined, errCb: object | null | undefined, position: string | null | undefined, viewStr: string | null | undefined, nextFunc: object | null | undefined, retryCount: number | null | undefined, componentDirUrl: string | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    loadComponentBrowserMsg(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, componentControllerPath: string, argObj: object | null | undefined, cb: object | null | undefined, errCb: object | null | undefined, position: string | null | undefined, viewStr: string | null | undefined, nextFunc: object | null | undefined, retryCount: number | null | undefined, componentDirUrl: string | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    loadComponentDefaultMsg(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, componentControllerPath: string, argObj: object | null | undefined, cb: object | null | undefined, errCb: object | null | undefined, position: string | null | undefined, viewStr: string | null | undefined, nextFunc: object | null | undefined, retryCount: number | null | undefined, componentDirUrl: string | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    singleComponentInsertFunc(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, componentControllerPath: string, argObj: object | null | undefined, cb: object | null | undefined, errCb: object | null | undefined, position: string | null | undefined, viewStr: string | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    singleComponentInsertFuncExec(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, componentControllerPath: string, argObj: object | null | undefined, cb: object | null | undefined, errCb: object | null | undefined, position: string | null | undefined, viewStr: string | null | undefined, componentEnvValueObj: object | null | undefined, retryCount: number | null | undefined, componentDirUrl: string | null | undefined, msgObj: object | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    loadSingleComponentControllerMethodList(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, viewStr: string | null | undefined, argObj: object | null | undefined, func: object | null | undefined, position: string | null | undefined, errCb: object | null | undefined, componentEnvValueObj: object | null | undefined, msgObj: object | null | undefined, immediatelyResolve: boolean | null | undefined): object;
    getInsertComponent(fs: FairysupportJs, dom: Node | null | undefined, componentValueMap: object, viewStr: string | null | undefined, argObj: object | null | undefined, func: object | null | undefined, position: string | null | undefined, errCb: object | null | undefined, controllerObj: object | null | undefined, immediatelyResolve: boolean | null | undefined): object;
    addTargetDomForComponent(obj: Node | null | undefined, componentValueMap: object | null | undefined): void;
    addComponentTargetDomNest(obj: Node | null | undefined, componentValueMap: object | null | undefined): void;
    bindComponentSingleObj(obj: Node | null | undefined, bindStr: string, componentPath: string): void;
    bindComponentSingleList(obj: Node | null | undefined, bindList: string, componentPath: string): void;
    bindComponentSingleEvent(obj: Node | null | undefined, name: string, componentPath: string): void;
    execComponentMethod(componentPath: string, methodName: string, argList: any): any;
    getComponentMethod(fs: FairysupportJs, componentPath: string, methodName: string, argList: any, func: object): any;
    getComponentMethodInputArgs(fs: FairysupportJs, componentPath: string, methodName: string): any;
    removeComponentSingleObjOnlyValue(dom: Node | null | undefined, bindStr: string, componentPath: string): void;
    removeComponentSingleObj(dom: Node | null | undefined, bindStr: string, componentPath: string): void;
    removeComponentSingleListOnlyValue(dom: Node | null | undefined, bindList: string, componentPath: string): void;
    removeComponentSingleList(dom: Node | null | undefined, bindList: string, componentPath: string): void;
    removeComponentSingleEvent(dom: Node | null | undefined, name: string, componentPath: string): object;
    removeComponentSingleEvent(dom: Node | null | undefined, name: string, componentPath: string): object;
    addTargetDom(dom: Node | null | undefined, componentValueMap: object | null | undefined): void;
    setEventFunction(dataFullName: string, classObj: object, methodList: object, dom: Node, eventMethodList: object, moduleClassObj: object): void;
    setEventFunctionForUniqueComponent(dataFullName: string, classObj: object, methodList: object, dom: Node, eventMethodList: object, moduleClassObj: object): void;
    removeEventFunction(dataFullName: string, classObj: object, methodList: object, dom: Node): void;
    esc(strings: string[], ...keys: string[]): Function;
    getTplDom(viewStr: string, paramObj: object | null | undefined, errCb: Function, cb: Function): void;
    getTplChildNodeList(childNodesContainer: object | null | undefined): void;
    developTpl(dom: Node | null | undefined, paramObj: object | null | undefined, localValue: object | null | undefined, retObj: object, errCb: Function, cb: Function, selfExe: boolean): Promise<string>;
    deleteTag(child: Node | null | undefined, tag: string | null | undefined): void;
    selfAndNextDelete(dom: Node | null | undefined): void;
    nextDelete(dom: Node | null | undefined): void;
    setTplProp(obj: object | null | undefined, props: object | null | undefined): void;
    getTemplate(templatePackeage: string, retryCount: number): Promise<string>;

    appendLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    loadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined, position?: string | null | undefined, timing?: string | null | undefined, immediatelyResolve?: boolean | null | undefined): Promise<K[]>;

    appendLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    loadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined, timing?: string | null | undefined, immediatelyResolve?: boolean | null | undefined): Promise<K[]>;

    appendResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined, timing?: string | null | undefined): Promise<K[]>;

    appendResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined, timing?: string | null | undefined): Promise<K[]>;

    appendResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined , sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined, timing?: string | null | undefined): Promise<K[]>;

    appendResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined, timing?: string | null | undefined): Promise<K[]>;

    useDomAsTemplate<T extends Node, K extends Node>(dom: T, argObj: object | null | undefined): Promise<K[]>;

    execUniqueComponentMethod(controllerObj: object, methodList: object, methodName: string, argList: any): any;
    getUniqueComponentMethod(fs: FairysupportJs, controllerObj: object, methodList: object, methodName: string, argList: any, func: Function): Function;
    getUniqueComponentMethodInputArgs(fs: FairysupportJs, controllerObj: object, methodList: object, methodName: string): Function;

    appendLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined, position?: string | null | undefined, immediatelyResolve?: boolean | null | undefined): Promise<K[]>;

    appendLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined, position?: string | null | undefined, immediatelyResolve?: boolean | null | undefined): Promise<K[]>;

    appendResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    uniqueComponentInsertFunc<T extends Node>(fs: FairysupportJs, dom: T, componentValueMap: object | null | undefined, componentControllerPath: string, argObj: object | null | undefined, cb: Function, errCb: Function, position: string | null | undefined, viewStr: string | null | undefined, componentDirUrl: string | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    uniqueComponentInsertFuncExec<T extends Node>(fs: FairysupportJs, dom: T, componentValueMap: object | null | undefined, componentControllerPath: string, argObj: object | null | undefined, cb: Function, errCb: Function, position: string | null | undefined, viewStr: string | null | undefined, componentEnvValueObj: object | null | undefined, retryCount: number | null | undefined, componentDirUrl: string | null | undefined, msgObj: object | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    loadUniqueComponentControllerMethodList<T extends Node>(fs: FairysupportJs, dom: T, componentValueMap: object | null | undefined, viewStr: string, argObj: object | null | undefined, func: Function, position: string | null | undefined, errCb: Function, componentEnvValueObj: object | null | undefined, componentDirUrl: string | null | undefined, msgObj: object | null | undefined, immediatelyResolve: boolean | null | undefined): void;
    getInsertUniqueComponent<T extends Node>(fs: FairysupportJs, dom: T, viewStr: string, argObj: object | null | undefined, func: Function, position: string | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined, dataNameEventMap: object | null | undefined, errCb: Function, componentDirUrl: string | null | undefined, immediatelyResolve: boolean | null | undefined): Function;
    bindUniqueComponentAll<T extends Node>(obj: T, componentValueMap: object | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined, eventMethodList: object | null | undefined, componentDirUrl: string | null | undefined): void;
    bindUniqueComponentProp<T extends Node>(fs: FairysupportJs, obj: T, componentValueMap: object | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined, eventMethodList: object | null | undefined, componentDirUrl: string | null | undefined, domControllerMap: object | null | undefined): Function;
    bindUniqueComponentSingleObj<T extends Node>(obj: T, bindStr: string | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined): void;
    bindUniqueComponentSingleList<T extends Node>(dom: T, bindList: string | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined): void;
    bindUniqueComponentSingleEvent<T extends Node>(dom: T, name: string | null | undefined, controllerObj: object | null | undefined, methodList: object | null | undefined, eventMethodList: object | null | undefined): Array<object>;

    appendLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined, position?: string | null | undefined, immediatelyResolve?: boolean | null | undefined): Promise<K[]>;

    appendResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    beforeResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    afterResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined): Promise<K[]>;
    resHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, sendMethod?: string | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    appendResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined, position?: string | null | undefined, retryCount?: number | null | undefined): Promise<K[]>;

    paramFmt(fmt: string | null | undefined, paramObj: object | null | undefined, prefixName: string): void;

    emptyAjax(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajax(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxText(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    emptyAjaxByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxTextByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;

    getComponentController(componentName: string): object;
    getModuleController(): object;
    
    setTimeLineProp(obj: object | null | undefined, props: object | null | undefined): void;

    timeline(argTimelinePropList: Array<object>): void;
    envValue(name: string): any;
    msg(name: string, replaceObj?: object | null | undefined): string;
    componentEnvValue(controllerObj: object, name: string): any;
    componentMsg(controllerObj: object, name: string, replaceObj?: object | null | undefined): string;
    addMeta(element: Object, mata: any): void;
    getMeta(element: Object): any;
    deleteMeta(element: Object): void;
    validate(group: string | object, obj: Object, prop: string, eventList: string | null | (string | null)[], funcList: Function[], funcArg: any, finishFunc?: Function): void;

    wrapObjAccessor(group: string, obj: Object, prop: string, funcList: Function[], preValueHolder: object, eventList: string | null | (string | null)[], funcArg: any, finishFunc: Function): void;
    preValueInit(preValueHolder: object, eventList: (string | null)[], value: any): void;
    preValueEventInit(preValueHolder: object, eventName: string | null, value: any): void;
    
    execValidator(group: string | object, obj: Object, newValFlg?: boolean): boolean;
    execGroupValidator(group: string | object, newValFlg?: boolean): boolean;
    getValidateLatestResult(group: string | object, obj: Object, prop: string, eventName: string | null): boolean;

    getPrototypePropertyDescriptor(obj: Object, propName: string): Object;

    linkEvent(fromObj: EventTarget, toObj: Object, eventList: string[]): object;
    getReqLang(): string;
    getConfLang(): string;
    getLang(): string;
    store<K, V>(): FairysupportStore<K, V>;
    singleStore<F, V, K>(func: F, initValue: V): FairysupportSingleStore<F, V>;
    
    getCamelCb(): Function;
    getCamel(str: string): string;

}

export declare class FairysupportObjList<T extends HTMLElement> {
    constructor(bindList: string, beforeFn: object, afterFn: object, addBeforeFn: object, addAfterFn: object);
    size(): number;
    has(element: T | null | undefined): boolean;
    add(element: T): FairysupportObjList<T>;
    replace(oldElement: T, newElement: T): FairysupportObjList<T>;
    remove(element: T | null | undefined): FairysupportObjList<T>;
    values(): Iterator<T>;
    forEach(fn: Function, arg?: any): void;
    toArray(): T[];
    getStringList<R>(propertNameList: string | Array<string>, emptyAlternative?: R, conditionFunc?: Function): Array<string> | R;
    getNumberList<R>(propertNameList: string | Array<string>, emptyAlternative?: R, conditionFunc?: Function): Array<number> | R;
    getBooleanList<R>(propertNameList: string | Array<string>, emptyAlternative?: R, conditionFunc?: Function): Array<boolean> | R;
}

export declare class FairysupportAjaxObj {
    onreadystatechange: Function;
    readyState: number;
    response: any;
    responseText: string;
    responseType: string;
    responseURL: string;
    responseXML: Document | null;
    status: number;
    statusText: string;
    timeout: number;
    upload: XMLHttpRequestUpload;
    withCredentials: boolean;
    onabort: Function | null;
    onerror: Function | null;
    onload: Function | null;
    onloadend: Function | null;
    onloadstart: Function | null;
    onprogress: Function | null;
    ontimeout: Function | null;
    constructor(dom: Node, componentPackeage: string | null | undefined, viewUrl: string | null | undefined, paramObj: object | null | undefined, argObj: object | null | undefined, cb: Function | null | undefined, position: string | null | undefined, metName: string | null | undefined, componentRoot: string | null | undefined);
    setResponseType(val: string): FairysupportAjaxObj;
    abort(): FairysupportAjaxObj;
    getAllResponseHeaders(): string| null;
    getResponseHeader(headerName: string): string | null;
    open(method: string, url: string, asyncFlg?: boolean, user?: string | null, password?: string | null): FairysupportAjaxObj;
    overrideMimeType(mimeType: string): FairysupportAjaxObj;
    send(body?: string | Document | Blob | ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float16Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array | DataView | FormData | URLSearchParams | null): FairysupportAjaxObj;
    sendPromise(body?: string | Document | Blob | ArrayBuffer | Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float16Array | Float32Array | Float64Array | BigInt64Array | BigUint64Array | DataView | FormData | URLSearchParams | null): Promise<XMLHttpRequest>;
    setRequestHeader(header: string, value: string): FairysupportAjaxObj;
    setOnreadystatechange(fn: Function): FairysupportAjaxObj;
    setWithCredentials(withCredentials: boolean): FairysupportAjaxObj;
    setOnabort(fn: Function): FairysupportAjaxObj;
    setOnerror(fn: Function): FairysupportAjaxObj;
    setOnload(fn: Function): FairysupportAjaxObj;
    setOnloadend(fn: Function): FairysupportAjaxObj;
    setOnloadstart(fn: Function): FairysupportAjaxObj;
    setOnprogress(fn: Function): FairysupportAjaxObj;
    setOntimeout(fn: Function): FairysupportAjaxObj;
    setReadystatechange(state: number | null, status: number | null, fn: Function): FairysupportAjaxObj;
    setAbort(fn: Function): FairysupportAjaxObj;
    setError(fn: Function): FairysupportAjaxObj;
    setLoad(status: number | null, fn: Function): FairysupportAjaxObj;
    setLoadend(status: number | null, fn: Function): FairysupportAjaxObj;
    setLoadstart(fn: Function): FairysupportAjaxObj;
    setProgress(status: number | null, fn: Function): FairysupportAjaxObj;
    setTimeout(fn: Function): FairysupportAjaxObj;
}

export declare class FairysupportStore<K, V> {
    constructor();
    set(k: K, v: V): void;
    get(k: K): V;
    delete(k: K): boolean;
    addListener(k: K, l: Function): void;
    removeListener(k: K, l: Function): void;
}

export declare class FairysupportSingleStore<F, V> {
    constructor(d: V, l: F);
    store: F;
    get(): V;
}

declare class FairysupportTimeLineClass {
    constructor(fs: FairysupportJs, timelinePropList: Array<object>, preClazz: FairysupportTimeLineClass, props: Array<object>, ms: number);
    execTimer(): void;
    clearTimer(): void;
}

export const $f: FairysupportJs;
