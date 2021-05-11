#!/usr/bin/env node

console.log((new Date()).toLocaleString());


const fs = require('fs');
const path = require('path');

function createDir(parentDir, dir) {
    const newDir = path.join(parentDir, dir);
    if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir);
    } else {
        const newDirStat = fs.statSync(newDir);
        if (newDirStat.isFile()) {
            fs.unlinkSync(newDir);
            fs.mkdirSync(newDir);
        }
    }
    return newDir;
}

function rmAll(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    const fileList = fs.readdirSync(dir);
    fileList.forEach((fileName) => {
        const fullFileNamePath = path.join(dir, fileName);
        const fileStas = fs.statSync(fullFileNamePath);
        if (fileStas.isFile()) {
            fs.unlinkSync(fullFileNamePath);
        } else if (fileStas.isDirectory()) {
            rmAll(fullFileNamePath);
        }
    });
    try {
        fs.rmdirSync(dir);
    } catch (e) {
        
    }
    
}

const curDir = process.cwd();

let envTxt = "";
if (process.argv.length >= 3) {
    envTxt = process.argv[2].toString().trim();
}


const src = path.join(curDir, "src");
rmAll(path.join(curDir, "distWork"));
const distWork = createDir(curDir, "distWork");

function allCopy(src, distWork) {
    const fileList = fs.readdirSync(src);
    fileList.forEach((fileName) => {
        const fullFileNamePath = path.join(src, fileName);
        const fileStas = fs.statSync(fullFileNamePath);
        if (fileStas.isFile()) {
            const distWorkFilePath = path.join(distWork, fileName);
            fs.copyFileSync(fullFileNamePath, distWorkFilePath);
        } else if (fileStas.isDirectory()) {
            const distWorkSubDir = path.join(distWork, fileName);
            if (fs.existsSync(distWorkSubDir)) {
                const distWorkSubDirStat = fs.statSync(distWorkSubDir);
                if (distWorkSubDirStat.isFile()) {
                    fs.unlinkSync(distWorkSubDir);
                    fs.mkdirSync(distWorkSubDir);
                }
            } else {
                fs.mkdirSync(distWorkSubDir);
            }
            allCopy(fullFileNamePath, distWorkSubDir);
        }
    });
}

allCopy(src, distWork);

function bundleEnvJson(envTxt, envValueDestObj, distWorkModules, distWorkEnv) {
    let first = true;
    const fileList = fs.readdirSync(distWorkModules);
    for (const fileName of fileList) {
        if (first) {
            const objDefaultPath = path.join(distWorkEnv, "envValue.json");
            const objEnvValuePath = path.join(distWorkEnv, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objDefaultPath) && fs.statSync(objDefaultPath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objDefaultPath)));
            }
            if (fs.existsSync(objEnvValuePath) && fs.statSync(objEnvValuePath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objEnvValuePath)));
            }
        }
        first = false;
        
        const moduleFilePath = path.join(distWorkModules, fileName);
        const moduleFileStat = fs.statSync(moduleFilePath);
        if (moduleFileStat.isDirectory()) {
            const envFilePath = createDir(distWorkEnv, fileName);
            bundleEnvJson(envTxt, JSON.parse(JSON.stringify(envValueDestObj)), moduleFilePath, envFilePath);
        } else if (moduleFileStat.isFile() && moduleFilePath.endsWith('.js')) {
            
            let envValueParentObj = JSON.parse(JSON.stringify(envValueDestObj));
            
            const fileNameOnly = fileName.substring(0, fileName.length - 3);
            const objEndDefaultPath = path.join(distWorkEnv, fileNameOnly, "envValue.json");
            const objEndEnvValuePath = path.join(distWorkEnv, fileNameOnly, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objEndDefaultPath) && fs.statSync(objEndDefaultPath).isFile()) {
                Object.assign(envValueParentObj, JSON.parse(fs.readFileSync(objEndDefaultPath)));
            }
            if (fs.existsSync(objEndEnvValuePath) && fs.statSync(objEndEnvValuePath).isFile()) {
                Object.assign(envValueParentObj, JSON.parse(fs.readFileSync(objEndEnvValuePath)));
            }
            
            fs.appendFileSync(moduleFilePath, " \n\n export const __fairysupport__envTxt = '" + envTxt + "';" + " \n\n export const __fairysupport__envValueObj = " + JSON.stringify(envValueParentObj) + ";\n");
            
        }
        
    };
}


console.log('start bundle module');

const distWorkJs = createDir(distWork, "js");
const distWorkEnv = createDir(distWorkJs, "env");
const distWorkModules = createDir(distWorkJs, "modules");

let envValueDestObj = Object.create(null);
bundleEnvJson(envTxt, envValueDestObj, distWorkModules, distWorkEnv);
rmAll(distWorkEnv)

console.log('end bundle module');


function bundleMsgJson(msgDestObjList, distWorkModules, distWorkMsg) {
    const fileList = fs.readdirSync(distWorkMsg);
    for (const fileName of fileList) {
        const msgFilePath = path.join(distWorkMsg, fileName);
        const msgFileStat = fs.statSync(msgFilePath);
        if (fileName.toString() === 'msg.json' && msgFileStat.isFile()) {
            if (!('' in msgDestObjList)) {
                msgDestObjList[''] = Object.create(null);
            }
            Object.assign(msgDestObjList[''], JSON.parse(fs.readFileSync(msgFilePath)));
        } else if (fileName.startsWith('msg.') && fileName.endsWith('.json') && msgFileStat.isFile()) {
            const langStr = fileName.substring(4, fileName.length - 5);
            if (!(langStr in msgDestObjList)) {
                msgDestObjList[langStr] = Object.create(null);
            }
            Object.assign(msgDestObjList[langStr], JSON.parse(fs.readFileSync(msgFilePath)));
        }
    };
    for (const langStr in msgDestObjList) {
        if ('' === langStr) {
            fs.writeFileSync(path.join(distWorkMsg, 'msg.json'), JSON.stringify(msgDestObjList['']));
        } else {
            fs.writeFileSync(path.join(distWorkMsg, 'msg.' + langStr + '.json'), JSON.stringify(msgDestObjList[langStr]));
        }
    }
    const moduleFileList = fs.readdirSync(distWorkModules);
    for (const moduleFileName of moduleFileList) {
        const moduleFilePath = path.join(distWorkModules, moduleFileName);
        const moduleFileStat = fs.statSync(moduleFilePath);
        if (moduleFileStat.isDirectory()) {
            const msgFilePath = createDir(distWorkMsg, moduleFileName);
            bundleMsgJson(JSON.parse(JSON.stringify(msgDestObjList)), moduleFilePath, msgFilePath);
        } else if (moduleFileStat.isFile() && moduleFileName.endsWith('.js')) {
            
            let msgDestObjParentList = JSON.parse(JSON.stringify(msgDestObjList));
            const fileNameOnly = moduleFileName.substring(0, moduleFileName.length - 3);
            const msgEndDirPath = createDir(distWorkMsg, fileNameOnly);
            const msgEndDirfileList = fs.readdirSync(msgEndDirPath);
            for (const msgEndDirFile of msgEndDirfileList) {
                const msgEndDirFilePath = path.join(msgEndDirPath, msgEndDirFile);
                const msgEndDirFileStat = fs.statSync(msgEndDirFilePath);
                if (msgEndDirFile.toString() === 'msg.json' && msgEndDirFileStat.isFile()) {
                    if (!('' in msgDestObjParentList)) {
                        msgDestObjParentList[''] = Object.create(null);
                    }
                    Object.assign(msgDestObjParentList[''], JSON.parse(fs.readFileSync(msgEndDirFilePath)));
                } else if (msgEndDirFile.startsWith('msg.') && msgEndDirFile.endsWith('.json') && msgEndDirFileStat.isFile()) {
                    const langStr = msgEndDirFile.substring(4, msgEndDirFile.length - 5);
                    if (!(langStr in msgDestObjParentList)) {
                        msgDestObjParentList[langStr] = Object.create(null);
                    }
                    Object.assign(msgDestObjParentList[langStr], JSON.parse(fs.readFileSync(msgEndDirFilePath)));
                }
            };
            for (const langStr in msgDestObjParentList) {
                if ('' === langStr) {
                    fs.writeFileSync(path.join(msgEndDirPath, 'msg.json'), JSON.stringify(msgDestObjParentList['']));
                } else {
                    fs.writeFileSync(path.join(msgEndDirPath, 'msg.' + langStr + '.json'), JSON.stringify(msgDestObjParentList[langStr]));
                }
            }
            
        }
        
    };
}

console.log('start bundle msg');

const distWorkMsg = createDir(distWorkJs, "msg");
let msgDestObjList = Object.create(null);
bundleMsgJson(msgDestObjList, distWorkModules, distWorkMsg);

console.log('end bundle msg');


function bundleComponentEnvJson(envTxt, envValueDestObj, distWorkComponents) {
    let first = true;
    const fileList = fs.readdirSync(distWorkComponents);
    for (const fileName of fileList) {
        if (first) {
            const objDefaultPath = path.join(distWorkComponents, "envValue.json");
            const objEnvValuePath = path.join(distWorkComponents, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objDefaultPath) && fs.statSync(objDefaultPath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objDefaultPath)));
            }
            if (fs.existsSync(objEnvValuePath) && fs.statSync(objEnvValuePath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objEnvValuePath)));
            }
        }
        first = false;
        
        const componentFilePath = path.join(distWorkComponents, fileName);
        if (fs.existsSync(componentFilePath)) {
            const componentFileStat = fs.statSync(componentFilePath);
            if (componentFileStat.isDirectory()) {
                bundleComponentEnvJson(envTxt, JSON.parse(JSON.stringify(envValueDestObj)), componentFilePath);
            } else if (componentFileStat.isFile() && fileName.startsWith('envValue.') && fileName.endsWith('.json')) {
                fs.unlinkSync(componentFilePath);
            } else if (componentFileStat.isFile() && fileName.toString() === 'controller.js') {
                
                let viewContent = '';
                const viewPath = path.join(distWorkComponents, "view.html");
                if (fs.existsSync(viewPath) && fs.statSync(viewPath).isFile()) {
                    viewContent = fs.readFileSync(viewPath);
                    let re = new RegExp('`', "g");
                    viewContent = viewContent.toString().replace(re, '\\`');
                    fs.unlinkSync(viewPath);
                }
                
                let envValueBundleObj = JSON.parse(JSON.stringify(envValueDestObj));
                fs.appendFileSync(componentFilePath, " \n\n export const __fairysupport__envValueObj = " + JSON.stringify(envValueBundleObj) + ";" + " \n\n export const __fairysupport__viewStr = `" + viewContent + "`;\n");
                
            }
        }
        
    };
}

console.log('start bundle component');

const distWorkComponents = createDir(distWorkJs, "components");
let envComponentValueDestObj = Object.create(null);
bundleComponentEnvJson(envTxt, envComponentValueDestObj, distWorkComponents);

console.log('end bundle component');


function bundleComponentMsgJson(msgDestObjList, distWorkComponents) {
    const fileList = fs.readdirSync(distWorkComponents);
    for (const fileName of fileList) {
        const msgFilePath = path.join(distWorkComponents, fileName);
        const msgFileStat = fs.statSync(msgFilePath);
        if (fileName.toString() === 'msg.json' && msgFileStat.isFile()) {
            if (!('' in msgDestObjList)) {
                msgDestObjList[''] = Object.create(null);
            }
            Object.assign(msgDestObjList[''], JSON.parse(fs.readFileSync(msgFilePath)));
        } else if (fileName.startsWith('msg.') && fileName.endsWith('.json') && msgFileStat.isFile()) {
            const langStr = fileName.substring(4, fileName.length - 5);
            if (!(langStr in msgDestObjList)) {
                msgDestObjList[langStr] = Object.create(null);
            }
            Object.assign(msgDestObjList[langStr], JSON.parse(fs.readFileSync(msgFilePath)));
        }
    };
    for (const langStr in msgDestObjList) {
        if ('' === langStr) {
            fs.writeFileSync(path.join(distWorkComponents, 'msg.json'), JSON.stringify(msgDestObjList['']));
        } else {
            fs.writeFileSync(path.join(distWorkComponents, 'msg.' + langStr + '.json'), JSON.stringify(msgDestObjList[langStr]));
        }
    }
    const componentFileList = fs.readdirSync(distWorkComponents);
    for (const componentFileName of componentFileList) {
        const componentFilePath = path.join(distWorkComponents, componentFileName);
        const componentFileStat = fs.statSync(componentFilePath);
        if (componentFileStat.isDirectory()) {
            bundleComponentMsgJson(JSON.parse(JSON.stringify(msgDestObjList)), componentFilePath);
        }
    };
}

console.log('start bundle component msg');

let msgComponentDestObjList = Object.create(null);
bundleComponentMsgJson(msgComponentDestObjList, distWorkComponents);

console.log('end bundle component msg');


function bundleCss(cssContent, distWorkCss) {
    let curCssContent = '';
    const appCssFilePath = path.join(distWorkCss, "app.css");
    if (fs.existsSync(appCssFilePath) && fs.statSync(appCssFilePath).isFile()) {
        curCssContent = fs.readFileSync(appCssFilePath);
    }
    let writeCssContent = null;
    if (curCssContent === '') {
        writeCssContent = cssContent;
    } else {
        if (cssContent === '') {
            writeCssContent = curCssContent;
        } else {
            writeCssContent = cssContent + "\n\n" + curCssContent;
        }
    }
    fs.writeFileSync(appCssFilePath, writeCssContent);
    
    const fileList = fs.readdirSync(distWorkCss);
    for (const fileName of fileList) {
        const cssFilePath = path.join(distWorkCss, fileName);
        const cssFileStat = fs.statSync(cssFilePath);
        if (cssFileStat.isDirectory()) {
            bundleCss(writeCssContent, cssFilePath)
        }
    };
}
function bundleModulesCss(distWorkCss, distWorkModules) {
    
    const curAppCssFilePath = path.join(distWorkCss, "app.css");
    if (!fs.existsSync(curAppCssFilePath)) {
        let parentDir = path.dirname(distWorkCss);
        const parentCppCssFilePath = path.join(parentDir, "app.css");
        let curCssContent = '';
        if (fs.existsSync(parentCppCssFilePath)) {
            curCssContent = fs.readFileSync(parentCppCssFilePath);
        }
        fs.writeFileSync(curAppCssFilePath, curCssContent);
    }
    
    if (!fs.existsSync(distWorkModules) || fs.statSync(distWorkModules).isFile()) {
        return;
    }
    
    const fileList = fs.readdirSync(distWorkModules);
    for (const fileName of fileList) {
        const modulesFilePath = path.join(distWorkModules, fileName);
        const modulesFileStat = fs.statSync(modulesFilePath);
        if (modulesFileStat.isFile() && fileName.endsWith('.js')) {
            const fileNameOnly = fileName.substring(0, fileName.length - 3);
            const cssDirPath = createDir(distWorkCss, fileNameOnly);
            bundleModulesCss(cssDirPath, modulesFilePath);
        } else if (modulesFileStat.isDirectory()) {
            const cssFilePath = createDir(distWorkCss, fileName);
            bundleModulesCss(cssFilePath, modulesFilePath);
        }
    };
}
function bundlePageCss(distWorkCss, distWorkPage) {
    
    const curAppCssFilePath = path.join(distWorkCss, "app.css");
    if (!fs.existsSync(curAppCssFilePath)) {
        let parentDir = path.dirname(distWorkCss);
        const parentCppCssFilePath = path.join(parentDir, "app.css");
        let curCssContent = '';
        if (fs.existsSync(parentCppCssFilePath)) {
            curCssContent = fs.readFileSync(parentCppCssFilePath);
        }
        fs.writeFileSync(curAppCssFilePath, curCssContent);
    }
    
    if (!fs.existsSync(distWorkPage) || fs.statSync(distWorkPage).isFile()) {
        return;
    }
    
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isFile()) {
            const fileNameOnly = fileName.split('.')[0];
            const cssDirPath = createDir(distWorkCss, fileNameOnly);
            bundlePageCss(cssDirPath, pageFilePath);
        } else if (pageFileStat.isDirectory()) {
            const cssFilePath = createDir(distWorkCss, fileName);
            bundlePageCss(cssFilePath, pageFilePath);
        }
    };
}

console.log('start bundle css');

const distWorkCss = createDir(distWork, "css");
const distWorkPage = createDir(distWork, "page");

bundleCss('', distWorkCss);
bundleModulesCss(distWorkCss, distWorkModules);
bundlePageCss(distWorkCss, distWorkPage);

console.log('end bundle css');



function bundleToolReplace(content, replaceStr, funcName, argVal) {
    let re = new RegExp("(?<!\\\\)\\$" + funcName + "\\(" + argVal + "\\)", "g");
    content = content.replace(re, replaceStr);
    content = content.replace("\\$" + funcName + "(" + argVal + ")", "$" + funcName + "(" + argVal + ")");
    return content;
}
function getBundleToolReplaceFunc(useFrameObj) {
    return function (match) {
        let matchSplitHead = match.split('(');
        let matchSplitTail = matchSplitHead[1].split(')');
        useFrameObj['frameName'] = matchSplitTail[0];
        return '';
    };
}
function bundleToolReplaceForFrame(pageContent, frameDirPath, pageFilePath) {
    
    let useFrameObj = Object.create(null);
    let replaceFunc = getBundleToolReplaceFunc(useFrameObj);
    
    let re = new RegExp("(?<!\\\\)\\$frame\\([^\\)]+\\)", "g");
    pageContent = pageContent.replace(re, replaceFunc);
    if ('frameName' in useFrameObj) {
        pageContent = pageContent.replace("\\$frame(" + useFrameObj['frameName'] + ")", "$frame(" + useFrameObj['frameName'] + ")");
        let framePathSplit = useFrameObj['frameName'].split('.');
        framePathSplit[framePathSplit.length - 1] = framePathSplit[framePathSplit.length - 1] + '.html';
        const framePath = path.join(frameDirPath, ...framePathSplit);
        if (fs.existsSync(framePath) && fs.statSync(framePath).isFile()) {
            let frameContent = fs.readFileSync(framePath);
            let replacedContent = bundleToolReplace(frameContent.toString(), pageContent, 'page', '');
            return replacedContent;
        } else {
            console.error('Error');
            console.error('Not Found ' + framePath);
            console.error('$frame(' + useFrameObj['frameName'] +  ') in ' + pageFilePath);
            let errorMessage = 'Error : Not Found ' + framePath + ' $frame(' + useFrameObj['frameName'] + ') in ' + pageFilePath;
            throw new Error(errorMessage);
        }
    }
    return pageContent;
}

function bundlePageFrame(distWorkPage, distWorkFrame) {
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isFile()) {
            let pageContent = fs.readFileSync(pageFilePath);
            let framePageContent = bundleToolReplaceForFrame(pageContent.toString(), distWorkFrame, pageFilePath);
            fs.writeFileSync(pageFilePath, framePageContent);
        } else if (pageFileStat.isDirectory()) {
            bundlePageFrame(pageFilePath, distWorkFrame);
        }
    };
}

console.log('start page insert into frame');

const distWorkFrame = createDir(distWork, "frame");
bundlePageFrame(distWorkPage, distWorkFrame);
rmAll(distWorkFrame)

console.log('end page insert into frame');


function getBundleToolReplaceFuncForEmbed(useEmbedObj) {
    return function (match) {
        let matchSplitHead = match.split('(');
        let matchSplitTail = matchSplitHead[1].split(')');
        useEmbedObj['embedName'] = matchSplitTail[0];
        let embedPathSplit = matchSplitTail[0].split('.');
        embedPathSplit[embedPathSplit.length - 1] = embedPathSplit[embedPathSplit.length - 1] + '.html';
        const embedPath = path.join(useEmbedObj['embedDirPath'], ...embedPathSplit);
        if (fs.existsSync(embedPath) && fs.statSync(embedPath).isFile()) {
            let embedContent = fs.readFileSync(embedPath);
            return embedContent;
        } else {
            console.error('Error');
            console.error('Not Found ' + embedPath);
            console.error('$embed(' + useEmbedObj['embedName'] +  ') in ' + useEmbedObj['pageFilePath']);
            let errorMessage = 'Error : Not Found ' + embedPath + ' $embed(' + useEmbedObj['embedName'] + ') in ' + useEmbedObj['pageFilePath'];
            throw new Error(errorMessage);
        }
    };
}
function bundleToolReplaceForEmbed(pageContent, embedDirPath, pageFilePath) {
    
    let useEmbedObj = Object.create(null);
    useEmbedObj['pageFilePath'] = pageFilePath;
    useEmbedObj['embedDirPath'] = embedDirPath;
    let replaceFunc = getBundleToolReplaceFuncForEmbed(useEmbedObj);
    
    let re = new RegExp("(?<!\\\\)\\$embed\\([^\\)]+\\)", "g");
    let replacedContent = pageContent.replace(re, replaceFunc);
    replacedContent = replacedContent.replace("\\$embed(" + useEmbedObj['embedName'] + ")", "$embed(" + useEmbedObj['embedName'] + ")");
    
    return replacedContent;
}
function bundlePageEmbed(distWorkPage, distWorkEmbed) {
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isFile()) {
            let pageContent = fs.readFileSync(pageFilePath);
            let embedPageContent = bundleToolReplaceForEmbed(pageContent.toString(), distWorkEmbed, pageFilePath);
            fs.writeFileSync(pageFilePath, embedPageContent);
        } else if (pageFileStat.isDirectory()) {
            bundlePageEmbed(pageFilePath, distWorkEmbed);
        }
    };
}

console.log('start embed insert into page');

const distWorkEmbed = createDir(distWork, "embed");
bundlePageEmbed(distWorkPage, distWorkEmbed);
rmAll(distWorkEmbed)

console.log('end embed insert into page');

function insertCssPageHead(distWorkCss, distWorkPage) {
    
    if (fs.statSync(distWorkPage).isFile()) {
        const curAppCssFilePath = path.join(distWorkCss, "app.css");
        if (fs.existsSync(curAppCssFilePath) && fs.statSync(curAppCssFilePath).isFile()) {
            let curPageContent = fs.readFileSync(distWorkPage).toString();
            let curCssContent = fs.readFileSync(curAppCssFilePath);
            curPageContent = curPageContent.replace('</head>', '<style type="text/css">' + "\n" + curCssContent + "\n" + '</style>' + "\n" + '</head>');
            fs.writeFileSync(distWorkPage, curPageContent);
        }
        return;
    }
    
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isFile()) {
            const fileNameOnly = fileName.split('.')[0];
            const cssDirPath = createDir(distWorkCss, fileNameOnly);
            insertCssPageHead(cssDirPath, pageFilePath);
        } else if (pageFileStat.isDirectory()) {
            const cssFilePath = createDir(distWorkCss, fileName);
            insertCssPageHead(cssFilePath, pageFilePath);
        }
    };
}

console.log('start css insert into page');

insertCssPageHead(distWorkCss, distWorkPage);

console.log('end css insert into page');



function getBundleToolReplaceFuncForEnvValue(useEnvValueObj, envValueDestObj) {
    return function (match) {
        let matchSplitHead = match.split('(');
        let matchSplitTail = matchSplitHead[1].split(')');
        useEnvValueObj['envValueName'] = matchSplitTail[0];
        if (useEnvValueObj['envValueName'] in envValueDestObj) {
            return envValueDestObj[useEnvValueObj['envValueName']];
        } else {
            console.error('Error');
            console.error('Not Found ' + useEnvValueObj['envValueName']);
            console.error('$envValue(' + useEnvValueObj['envValueName'] +  ') in ' + useEnvValueObj['filePath']);
            let errorMessage = 'Error : Not Found ' + useEnvValueObj['envValueName'] + ' $envValue(' + useEnvValueObj['envValueName'] + ') in ' + useEnvValueObj['filePath'];
            throw new Error(errorMessage);
        }
    };
}
function bundleToolReplaceForEnvValue(content, envValueDestObj, filePath) {
    
    let useEnvValueObj = Object.create(null);
    useEnvValueObj['filePath'] = filePath;
    let replaceFunc = getBundleToolReplaceFuncForEnvValue(useEnvValueObj, envValueDestObj);
    
    let re = new RegExp("(?<!\\\\)\\$envValue\\([^\\)]+\\)", "g");
    let replacedContent = content.replace(re, replaceFunc);
    replacedContent = replacedContent.replace("\\$envValue(" + useEnvValueObj['envValueName'] + ")", "$envValue(" + useEnvValueObj['envValueName'] + ")");
    
    return replacedContent;
}
function bundlePageEnvJson(envTxt, envValueDestObj, distWorkPage, distWorkPageEnv) {
    let first = true;
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        if (first) {
            const objDefaultPath = path.join(distWorkPageEnv, "envValue.json");
            const objEnvValuePath = path.join(distWorkPageEnv, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objDefaultPath) && fs.statSync(objDefaultPath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objDefaultPath)));
            }
            if (fs.existsSync(objEnvValuePath) && fs.statSync(objEnvValuePath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objEnvValuePath)));
            }
        }
        first = false;
        
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isDirectory()) {
            const envFilePath = createDir(distWorkPageEnv, fileName);
            bundlePageEnvJson(envTxt, JSON.parse(JSON.stringify(envValueDestObj)), pageFilePath, envFilePath);
        } else if (pageFileStat.isFile()) {
            
            let envValueParentObj = JSON.parse(JSON.stringify(envValueDestObj));
            
            const fileNameOnly = fileName.split('.')[0];
            const objEndDefaultPath = path.join(distWorkPageEnv, fileNameOnly, "envValue.json");
            const objEndEnvValuePath = path.join(distWorkPageEnv, fileNameOnly, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objEndDefaultPath) && fs.statSync(objEndDefaultPath).isFile()) {
                Object.assign(envValueParentObj, JSON.parse(fs.readFileSync(objEndDefaultPath)));
            }
            if (fs.existsSync(objEndEnvValuePath) && fs.statSync(objEndEnvValuePath).isFile()) {
                Object.assign(envValueParentObj, JSON.parse(fs.readFileSync(objEndEnvValuePath)));
            }
            
            let content = fs.readFileSync(pageFilePath).toString();
            content = bundleToolReplaceForEnvValue(content, envValueParentObj, pageFilePath);
            fs.writeFileSync(pageFilePath, content);
            
        }
        
    };
}
function bundleCssEnvJson(envTxt, envValueDestObj, distWorkCss, distWorkPageEnv) {
    let first = true;
    const fileList = fs.readdirSync(distWorkCss);
    for (const fileName of fileList) {
        if (first) {
            const objDefaultPath = path.join(distWorkPageEnv, "envValue.json");
            const objEnvValuePath = path.join(distWorkPageEnv, "envValue." + envTxt + ".json");
            
            if (fs.existsSync(objDefaultPath) && fs.statSync(objDefaultPath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objDefaultPath)));
            }
            if (fs.existsSync(objEnvValuePath) && fs.statSync(objEnvValuePath).isFile()) {
                Object.assign(envValueDestObj, JSON.parse(fs.readFileSync(objEnvValuePath)));
            }
        }
        first = false;
        
        const pageFilePath = path.join(distWorkCss, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isDirectory()) {
            const envFilePath = createDir(distWorkPageEnv, fileName);
            bundleCssEnvJson(envTxt, JSON.parse(JSON.stringify(envValueDestObj)), pageFilePath, envFilePath);
        } else if (pageFileStat.isFile() && 'app.css' === fileName.toString()) {
            
            let content = fs.readFileSync(pageFilePath).toString();
            content = bundleToolReplaceForEnvValue(content, envValueDestObj, pageFilePath);
            fs.writeFileSync(pageFilePath, content);
            
        }
        
    };
}

console.log('start replace envValue in page and css');

const distWorkPageEnv = createDir(distWork, "env");
let pageEnvValueDestObj = Object.create(null);
bundleCssEnvJson(envTxt, pageEnvValueDestObj, distWorkCss, distWorkPageEnv);
bundlePageEnvJson(envTxt, pageEnvValueDestObj, distWorkPage, distWorkPageEnv);
rmAll(distWorkPageEnv)

console.log('end replace envValue in page and css');


function rmImgEncodeInfo(distWorkImg) {
    
    const fileList = fs.readdirSync(distWorkImg);
    for (const fileName of fileList) {
        const filePath = path.join(distWorkImg, fileName);
        const fileStat = fs.statSync(filePath);
        if (fileStat.isFile()) {
            let fileSplit = fileName.split('.');
            if (fileSplit[0] === 'domain' && fileSplit[fileSplit.length - 1] === 'txt') {
                fs.unlinkSync(filePath);
            } else if (fileSplit[0] === 'maxSize' && fileSplit[fileSplit.length - 1] === 'txt') {
                fs.unlinkSync(filePath);
            }
        }
    };
    
}
function getImgEncodeInfo(envTxt, distWorkImg) {
    
    let domainPath = null;
    if ('' === envTxt) {
        domainPath = path.join(distWorkImg, "domain.txt");
    } else {
        domainPath = path.join(distWorkImg, "domain." + envTxt + ".txt");
        if (!fs.existsSync(domainPath)) {
            domainPath = path.join(distWorkImg, "domain.txt");
        }
    }
    let domainStr = null;
    if (fs.existsSync(domainPath) && fs.statSync(domainPath).isFile()) {
        domainStr = fs.readFileSync(domainPath).toString().trim();
    }
    
    let maxSizePath = null;
    if ('' === envTxt) {
        maxSizePath = path.join(distWorkImg, "maxSize.txt");
    } else {
        maxSizePath = path.join(distWorkImg, "maxSize." + envTxt + ".txt");
        if (!fs.existsSync(maxSizePath)) {
            maxSizePath = path.join(distWorkImg, "maxSize.txt");
        }
    }
    let maxSizeStr = null;
    if (fs.existsSync(maxSizePath) && fs.statSync(maxSizePath).isFile()) {
        maxSizeStr = fs.readFileSync(maxSizePath).toString().trim();
        maxSizeStr = maxSizeStr - 0;
    }
    
    let imgEncodeInfo = {"domain" : domainStr, "maxSize" : maxSizeStr};
    return imgEncodeInfo;
    
}
function getReplaceImgEncodeFunc(useValueObj) {
    return function (match) {
        let matchSplitHead = match.split('(');
        let matchSplitTail = matchSplitHead[1].split(')');
        useValueObj['imgName'] = matchSplitTail[0];
        
        const pageFilePath = path.join(useValueObj['distWorkImg'], useValueObj['imgName']);
        
        if (!fs.existsSync(pageFilePath)) {
            console.error('Error');
            console.error('Not Found ' + pageFilePath);
            console.error('$img(' + useValueObj['imgName'] +  ') in ' + useValueObj['contentFilePath']);
            let errorMessage = 'Error : Not Found ' + pageFilePath + ' $img(' + useValueObj['imgName'] + ') in ' + useValueObj['contentFilePath'];
            throw new Error(errorMessage);
        }
        
        const imgNameSplit = useValueObj['imgName'].split('.');
        let mineType = null;
        const ext = imgNameSplit[imgNameSplit.length - 1];
        if ('jpg' === ext || 'jpeg' === ext || 'jfif' === ext || 'pjpeg' === ext || 'pjp' === ext) {
            mineType = 'image/jpeg';
        } else if ('svg' === ext) {
            mineType = 'image/svg+xml';
        } else {
            mineType = 'image/' + ext;
        }
        
        const pageFileStat = fs.statSync(pageFilePath);
        if (useValueObj['imgEncodeInfo']["maxSize"] !== null && pageFileStat.size <= useValueObj['imgEncodeInfo']["maxSize"]) {
            
            let img = fs.readFileSync(pageFilePath);
            let imgBase64 = img.toString('base64');
            
            return 'data:' + mineType + ';base64,' + imgBase64;
            
        } else {
            
            return useValueObj['imgEncodeInfo']["domain"] + useValueObj['imgName'];
            
        }
        
    };
}
function replaceImgEncode(content, contentFilePath, imgEncodeInfo, distWorkImg) {
    
    let useValueObj = Object.create(null);
    useValueObj['contentFilePath'] = contentFilePath.toString();
    useValueObj['distWorkImg'] = distWorkImg.toString();
    useValueObj['imgEncodeInfo'] = imgEncodeInfo;
    let replaceFunc = getReplaceImgEncodeFunc(useValueObj);
    
    let re = new RegExp("(?<!\\\\)\\$img\\([^\\)]+\\)", "g");
    let replacedContent = content.replace(re, replaceFunc);
    replacedContent = replacedContent.replace("\\$img(" + useValueObj['imgName'] + ")", "$img(" + useValueObj['imgName'] + ")");
    
    return replacedContent;
}
function replaceImgEncodeDir(imgEncodeInfo, distWorkPage, distWorkImg) {
    
    const fileList = fs.readdirSync(distWorkPage);
    for (const fileName of fileList) {
        const pageFilePath = path.join(distWorkPage, fileName);
        const pageFileStat = fs.statSync(pageFilePath);
        if (pageFileStat.isFile()) {
            let replaceContent = replaceImgEncode(fs.readFileSync(pageFilePath).toString(), pageFilePath, imgEncodeInfo, distWorkImg);
            fs.writeFileSync(pageFilePath, replaceContent);
        } else if (pageFileStat.isDirectory()) {
            replaceImgEncodeDir(imgEncodeInfo, pageFilePath, distWorkImg);
        }
    };
    
}

console.log('start replace img in page and css and js');

const distWorkImg = createDir(distWork, "img");
let imgEncodeInfo = getImgEncodeInfo(envTxt, distWorkImg);
if (imgEncodeInfo["domain"] !== null && imgEncodeInfo["maxSize"] !== null) {
    replaceImgEncodeDir(imgEncodeInfo, distWorkPage, distWorkImg);
    replaceImgEncodeDir(imgEncodeInfo, distWorkJs, distWorkImg);
    replaceImgEncodeDir(imgEncodeInfo, distWorkCss, distWorkImg);
    rmImgEncodeInfo(distWorkImg);
}

console.log('end replace img in page and css and js');



console.log('start create fairysupport.js');


const fsFilePath = path.join(__dirname, 'fairysupport.min.js');
fs.copyFileSync(fsFilePath, path.join(distWorkJs, 'fairysupport.min.js'));

console.log('end create fairysupport.js');


console.log('complete');

console.log((new Date()).toLocaleString());

