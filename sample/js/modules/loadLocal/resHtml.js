import Base from '../../parent.js';

export default class extends Base {

    constructor() {
        super();
        this.div1 = null;
        this.div2 = null;
        this.div3 = null;
    }

    beforeResHtmlComponent_click(event) {
        $f.beforeResHtmlComponent(this.div1, 'resHtml', 'http://localhost/sample/html.php', {"req1": "0val1", "req2" : "val2", 'req3' : ["val3", "val4"], "req4" : {"a" : "val5"}}, {"local1Key": "local1Val", "local2Key": "local2Val"}, () => {console.log('beforeResHtmlComponent_click')})
        .send();
    }

    afterResHtmlComponent_click(event) {
        $f.afterResHtmlComponent(this.div2, 'resHtml', 'http://localhost/sample/html.php', {"req1": "1val1", "req2" : "val2", 'req3' : ["val3", "val4"], "req4" : {"a" : "val5"}}, {"local1Key": "local1Val", "local2Key": "local2Val"}, () => {console.log('afterResHtmlComponent_click')})
        .send();
    }

    resHtmlComponent_click(event) {
        let ajax = $f.resHtmlComponent(this.div3, 'resHtml', 'http://localhost/sample/html.php', {"req1": "2val1", "req2" : "val2", 'req3' : ["val3", "val4"], "req4" : {"a" : "val5"}}, {"local1Key": "local1Val", "local2Key": "local2Val"}, () => {console.log('resHtmlComponent_click')});
        let fn = (function(ajax) {return function(e, xhr) {
            console.log('--event--');
            console.log(e);
            console.log('--onreadystatechange--');
            console.log(ajax.onreadystatechange);
            console.log('--readyState--');
            console.log(ajax.readyState);
            console.log('--response--');
            console.log(ajax.response);
            console.log('--responseText--');
            console.log(ajax.responseText);
            console.log('--responseType--');
            console.log(ajax.responseType);
            console.log('--responseURL--');
            console.log(ajax.responseURL);
            //console.log('--responseXML--');
            //console.log(ajax.responseXML);
            console.log('--status--');
            console.log(ajax.status);
            console.log('--statusText--');
            console.log(ajax.statusText);
            console.log('--timeout--');
            console.log(ajax.timeout);
            console.log('--upload--');
            console.log(ajax.upload);
            console.log('--withCredentials--');
            console.log(ajax.withCredentials);
            console.log('--abort--');
            console.log(ajax.abort);
            console.log('--getAllResponseHeaders--');
            console.log(ajax.getAllResponseHeaders);
            console.log('--getResponseHeader--');
            console.log(ajax.getResponseHeader);
            console.log('--open--');
            console.log(ajax.open);
            console.log('--overrideMimeType--');
            console.log(ajax.overrideMimeType);
            console.log('--send--');
            console.log(ajax.send);
            console.log('--setRequestHeader--');
            console.log(ajax.setRequestHeader);
            console.log('--onabort--');
            console.log(ajax.onabort);
            console.log('--onerror--');
            console.log(ajax.onerror);
            console.log('--onload--');
            console.log(ajax.onload);
            console.log('--onloadend--');
            console.log(ajax.onloadend);
            console.log('--onloadstart--');
            console.log(ajax.onloadstart);
            console.log('--onprogress--');
            console.log(ajax.onprogress);
            console.log('--ontimeout--');
            console.log(ajax.ontimeout);

        }})(ajax);
        ajax.setOnreadystatechange((e, xhr) => {console.log('--setOnreadystatechange--');});
        ajax.setOnabort((e, xhr) => {console.log('--setOnabort--');});
        ajax.setOnerror((e, xhr) => {console.log('--setOnerror--');});
        ajax.setOnloadend(fn);
        ajax.setOnloadstart((e, xhr) => {console.log('--setOnloadstart--');});
        ajax.setOnprogress((e, xhr) => {console.log('--setOnprogress--');});
        ajax.setOntimeout((e, xhr) => {console.log('--setOntimeout--');});
        ajax.send();
    }

}