export declare class FairysupportJs {
    constructor();
    getEnv(): string;

    appendLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;
    loadStringTemplate<T extends Node, K extends Node>(dom: T, viewStr: string, argObj: object | null | undefined): Promise<K[]>;

    appendLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;
    loadTemplate<T extends Node, K extends Node>(dom: T, template: string, argObj: object | null | undefined): Promise<K[]>;

    appendResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonTemplate<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonTemplateByForm<T extends Node, K extends Node>(dom: T, template: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlTemplate<T extends Node, K extends Node>(dom: T, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlTemplateByForm<T extends Node, K extends Node>(dom: T, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    useDomAsTemplate<T extends Node, K extends Node>(dom: T, argObj: object | null | undefined): Promise<K[]>;

    appendLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadWebComponent<T extends Node, K extends Node>(dom: T, componentDirUrl: string, componentName: string, argObj: object | null | undefined): Promise<K[]>;

    appendLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;

    appendResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlUniqueComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlUniqueComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    beforeLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    afterLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    innerLoadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;
    loadSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, argObj: object | null | undefined): Promise<K[]>;

    appendResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, paramObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resJsonSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, reqUrl: string, formObj: HTMLFormElement, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlSingleComponent<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, paramObj: object | null | undefined, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    appendResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    beforeResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    afterResHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;
    resHtmlSingleComponentByForm<T extends Node, K extends Node>(dom: T, componentName: string, viewUrl: string, formObj: HTMLFormElement, argObj: object | null | undefined, withCredentials?: boolean | null | undefined): Promise<K[]>;

    emptyAjax(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajax(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxText(reqUrl: string | null | undefined, paramObj: object | null | undefined, met?: string | null | undefined, fmt?: string | null | undefined, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    emptyAjaxByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;
    ajaxTextByForm(reqUrl: string | null | undefined, formObj: HTMLFormElement, user?: string | null | undefined, password?: string | null | undefined): FairysupportAjaxObj;

    getComponentController(componentName: string): object;
    getModuleController(): object;
    
    timeline(argTimelinePropList: Array<object>): void;
    envValue(name: string): any;
    msg(name: string, replaceObj?: object | null | undefined): string;
    componentEnvValue(controllerObj: object, name: string): any;
    componentMsg(controllerObj: object, name: string, replaceObj?: object | null | undefined): string;
    addMeta(element: Object, mata: any): void;
    getMeta(element: Object): any;
    deleteMeta(element: Object): void;
    validate(group: string | object, obj: Object, prop: string, eventList: string | null | (string | null)[], funcList: Function[], funcArg: any, finishFunc?: Function): void;

    execValidator(group: string | object, obj: Object, newValFlg?: boolean): boolean;
    execGroupValidator(group: string | object, newValFlg?: boolean): boolean;
    getValidateLatestResult(group: string | object, obj: Object, prop: string, eventName: string | null): boolean;

    linkEvent(fromObj: EventTarget, toObj: Object, eventList: string[]): object;
    getReqLang(): string;
    getConfLang(): string;
    getLang(): string;
    store<K, V>(): FairysupportStore<K, V>;
    singleStore<F, V, K>(func: F, initValue: V): FairysupportSingleStore<F, V>;
    
}

export declare class FairysupportObjList<T extends HTMLElement> {
    constructor(bindList: string, beforeFn: object, afterFn: object, addBeforeFn: object, addAfterFn: object, fairysupportClear: object);
    size(): number;
    has(element: T | null | undefined): boolean;
    add(element: T): FairysupportObjList<T>;
    replace(oldElement: T, newElement: T): FairysupportObjList<T>;
    remove(element: T | null | undefined): FairysupportObjList<T>;
    values(): Iterator<T>;
    forEach(fn: Function, arg?: any): void;
    toArray(): T[];
    getStringList(propertNameList: string | Array<string>, conditionFunc?: Function): Array<string>;
    getNumberList(propertNameList: string | Array<string>, conditionFunc?: Function): Array<number>;
    getBooleanList(propertNameList: string | Array<string>, conditionFunc?: Function): Array<boolean>;
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
