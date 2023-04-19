import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import path from "path";
import readline from "readline";
import fs from "fs";
import {createSpinner} from "nanospinner";
import * as cheerio from "cheerio";
import {data, renderJavaFile} from "./slingModelGenerator.js";
import {FileGenerator} from "../scripts/builders/FileGenerator.js";
import process from "process";
import {renderXmlFile} from "./xmlDialogGenerator.js";
import {imageGenerator} from "../scripts/file_helper.js";
import directory from "inquirer-directory";
import translate from "translate";
let playerName;
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

/**
 * @type {{player_name:string}} data
 * @returns {Promise<string>}
 */
async function askName() {
    const answers = await inquirer.prompt({
        name: 'player_name',
        type: 'input',
        message: 'What is your name?',
        default() {
            return 'Player';
        },
    });
    playerName = answers.player_name;
}

async function question1() {
    const answers = await inquirer.prompt({
        name: 'question_1',
        type: 'list',
        message: 'Test of the list',
        choices: [
            'Option uno',
            'Option dos',
            "Option tres",
        ],
    });
    return handleAnswer(answers.question_1 === 'Option tres');
}

async function handleAnswer(isCorrect) {
    const spinner = createSpinner('Checking answer...').start();
    await sleep();

    if (isCorrect) {
        spinner.success({text: `Nice work ${playerName}. That's a legit answer`});
    } else {
        spinner.error({text: `Game over, you lose ${playerName} !`});
        process.exit(1);
    }
}

async function selectTheGenerationMethod() {
    const answer = await inquirer.prompt({
        type: "list",
        name: "generator_method",
        message: "Select how would you like to generate Sightly file",
        choices: [
            {name: "Create Sightly file from scratch", value: "Create file"},
            {name: "Translate the HTML markup file", value: "Translate HTML"},
        ],
    }).then(r => console.log(r.generator_method));
}

async function useTemplate() {
    return await inquirer.prompt({
        type: "list",
        name: "select_method",
        message: "Do you want to use predifined template, or create Sightly file from scratch?",
        choices: [
            {name: 'Use template', value: true},
            {name: 'Create Sightly from scratch', value: false},
        ]
    }).then(answer => {
        if (answer.select_method) {
            console.log("use template");
            return true;
        } else {
            console.log("Do not use template");
            return false;
        }
    });
}

async function inqFileDraft() {
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)
    inquirer.prompt({
        type: 'file-tree-selection',
        name: 'file',
        message: 'choose a file',
        onlyShowDir: false,
        transformer: (input) => {
            const name = input.split(path.sep).pop();
            if (name[0] === ".") {
                return name
            }
            return name;
        }
    }).then(function (answers) {
        if (!isItDirectory(answers.file)) {
            const file = readline.createInterface({
                input: fs.createReadStream(`${answers.file}`),
                output: process.stdout,
                terminal: false
            });
            file.on('line', (line) => {
                console.log(line);
            });
            return answers.file;
        } else {
            console.log("You must select the file NOT directory")
        }
    })
}

/**
 * The outdated list finder - 13.04.2023
 */
export async function listFinderMarch($) {
    try {
        await $('ul').each(async (i, ul) => {
            let liArray = [];
            //Find the attribute that starts with data-list-
            //And remove the data-list- part
            let ulAttrName = Object.keys($(ul).attr())
                .find(attrName => attrName.startsWith('data-list-'))
                ?.slice('data-list-'.length);

            //If there is no attribute that starts with data-list- then add the default attribute
            if (!ulAttrName) {
                ulAttrName = 'default';
            }
            //Add the original content as a comment
            let originalContent = $(ul).prop('outerHTML');
            let commentContent = `\n <!-- List original content:-->\n` + `<!-- ${originalContent} -->\n`;
            $(ul).after(`${commentContent}`);

            // let methodName = ulAttrName.charAt(0).toUpperCase() + ulAttrName.slice(1);
            //Change the attribute name and value to the new name
            $(ul).attr(`data-sly-list.${ulAttrName}Model`, "${" + `model.` + `${ulAttrName}` + "Model}");

            //Remove the original attribute
            $(ul).removeAttr(`data-list-${ulAttrName}`);

            //Maybe remove await here. Make sure it will still work the same
            await $(ul).find('li').each((j, li) => {
                const textValues = $(li).text().split('\n')
                    .map(text => text.trim())
                    .filter(text => text.length > 0);
                liArray.push(textValues);
                $(li).attr('data-sly-test', "${" + `${ulAttrName}` + "Model}");
                //Remove all the li tags from the ul
                $(li).remove();
            });
            //Add the new li tag with the data-sly-test attribute
            let testMethodName = "${" + `${ulAttrName}` + "Model.label}";
            $(ul).append(`<li data-sly-test="${testMethodName}">Item: ${testMethodName}</li>`);

            data.lists.push({
                ulName: ulAttrName + "Model",
                liItems: liArray
            });

        });
        return $.html();
    } catch (e) {
        console.error(e);
    }
}



/**
 * Generate sightly file and allow user to select if he want to generate list or list with map
 * @returns {Promise<any>}
 */
export async function generateSightlyDraft() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "fileName",
            message: "What is the name of the file? ",
            default: 'htl'
        },
        {
            type: "list",
            name: "select_method",
            message: "Do you want to generate list?",
            choices: [
                {name: 'yes', value: true},
                {name: 'no', value: false},
            ]
        },
    ]).then(async function (r) {
        const path = `../bin/sightly-files/${r.fileName}.html`;
        let content = `<div data-sly-use.${r.fileName}="com.aem.projectExample.core.models.${r.fileName}"></div>`;
        let ct= `public interface ${r.fileName}{
            List<String> getListName();
        }`;
        // fs.writeFileSync("../bin/java-files/"+r.fileName+".java", ct, err =>{
        //     if (err) {
        //         console.log(err);
        //     }
        // });
        fs.writeFileSync(path, content, err => {
            if (err) {
                console.log(err);
            }
        });
        if (r.select_method) {
            await inquirer.prompt({
                type: "list",
                name: "select_method",
                message: "Do you want to generate list?",
                choices: [
                    {name: 'Generate list', value: 1},
                    {name: 'Generate list with map', value: 2},
                ]
            }).then(async function (list) {
                if (list.select_method === 1) {
                    await generateList(path, r.fileName);
                } else if (list.select_method === 2) {
                    await generateListWithMap(path, r.fileName);
                }
            });
        }
    });
}

export async function readFile(modelName, htmlPath) {
    const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    // Load the HTML into Cheerio
    const $ = cheerio.load(htmlFile);
    const dynamicElements = $('body').find('.dynamic');
    // const dataOrigin = $('body').find('[data-dynamic]');
    // // Log the contents of each dynamic element
    for (const el of dynamicElements) {
        let variableName = await nameVariable($(el).text());
        console.log(variableName);
        let content = "${" + modelName + "." + variableName + "}";
        $(el).text(content);
    }
    // await dynamicElements.each(async (i, el) => {
    //     // await nameVariable(dynamicElements, $(el).text());
    //     console.log($(el).text());
    //     let variableName = "firstName";
    //     let content = "${" + modelName + "." + variableName + "}";
    //     $(el).text(content);
    // });
    // await dataOrigin.each(async (i, el) => {
    //     // await nameVariable(dynamicElements, $(el).text());
    //     let variableName="lastName";
    //     let content = "${"+modelName+"."+variableName+"}";
    //     $(el).text(content);
    // });
    // await translateDynamicElements($,"id",modelName,"id1");
    // await translateDynamicElements($,null,modelName,"lastName");
    return $.html();
}
async function translateDynamicElements($, attributeType, modelName, methodName) {
    let attributeName = `[data-dynamic]`;
    if (attributeType != null) {
        attributeName = `[data-dynamic-${attributeType}]`;
    }
    const attributeOccurances = $('body').find('[data-dynamic-id]');
    await attributeOccurances.each(async (i, el) => {
        let content = "${" + modelName + "." + methodName + "}";
        // $(el).text(content);
        $(el).attr(attributeName, content);
    });
}
async function i18nTranslationDraft1($){
    // let htmlPath= `../bin/front-end/test.html`;
    // const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    // const $ = cheerio.load(htmlFile);
    // let attributeName = `[data-i18n-]`;
    // let attributeNameRegex = /data-i18n-(.*?)/;
    // let matches = [];
    // let match;
    // while ((match = attributeNameRegex.exec(htmlFile)) !== null) {
    //     matches.push(match);
    // }
    const attributeOccurances = $('body').find('[data-i18n-destination]');
    // let str = attrs[i].name.substring(attrs[i].name.lastIndexOf('-')+1);

    for (const el of attributeOccurances) {
        // attributeName = attributeName.slice(1,-1);
        const attributeName = $(el).attr(`data-i18n-destination`);
        const variableName = attributeName.substring(attributeName.lastIndexOf('-') + 1);
        let content = "${'"+attributeName+"' @ i18n}";
        await addToJson(variableName,$(el).text());
        $(el).text(content);
    }
    return $.html();
}

async function i18nTranslationDraft2() {
    let htmlPath = `../bin/front-end/test.html`;
    const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(htmlFile);
    let allAttributes = [];
    //We loop through all the elements in the body
    $('body').find('*').each(async function () {
        let attrs = this.attributes;
        //Then we loop through all the attributes of the element
        // for(const el of attrs){
        //     if (el.name.startsWith('data-i18n-')) {
        //         const attrName = '[' + el.name + ']';
        //         let variableName = el.name.substring(el.name.lastIndexOf('-') + 1);
        //         let content = "${'" + variableName + "' @ i18n}";
        //         if(!allAttributes.includes(el.name)){
        //             await addToJson(variableName, $(attrName).text());
        //             $(attrName).text(content);
        //         }
        //         allAttributes.push(attrs.name);
        //     }
        // }
        for (let i = 0; i < attrs.length; i++) {
            if (attrs[i].name.startsWith('data-i18n-')) {
                const attrName = '[' + attrs[i].name + ']';
                let variableName = attrs[i].name.substring(attrs[i].name.lastIndexOf('-') + 1);
                let content = "${'" + variableName + "' @ i18n}";
                if(!allAttributes.includes(attrs[i].name)){
                    await addToJson(variableName, $(attrName).text());
                    $(attrName).text(content);
                }
                allAttributes.push(attrs.name);
            }
        }
    });
    console.log(allAttributes);
    return $.html();
}

/**
 * Replace the div tag with a sly tag and add the data-sly-use attribute
 * @param $
 * @param modelName
 */
function replaceWithSlyTag($, modelName) {
    // const slyTag = $('<sly>').attr(`data-sly-use.${modelName}`,'fileLocation');
    // $('div:first-child').replaceWith(slyTag);


    //Solution 1 - Find the first div tag and replace it with a new <sly> tag
    // Select the first <div> tag and create a new <sly> tag with the same content
    const divTag = $('div').first();
    const slyTag = $('<sly>')
        .attr(`data-sly-use.${modelName}`, 'fileLocation')
        .attr(`data-sly-hasContent`, '${banner.title}')
        .append(divTag.contents());
    // Replace the first <div> tag with the new <sly> tag
    divTag.replaceWith(slyTag);
    // //Solution 2 - Find the first div tag and then  creates a new <div> tag using $('<div>') and
    // // appends the contents of the original <div> tag to it using append().
    // // This ensures that the new <div> tag has the same attributes and properties as the original one.
    //
    // // Create a new <sly> tag and set its 'data-custom' attribute
    // const slyTag = $('<sly>').attr(`data-sly-use.${modelName}`, 'fileLocation');
    //
    // // Select the first <div> tag and append its contents to the new <sly> tag
    // const divTag = $('<div>').append($('div').first().contents());
    // slyTag.append(divTag);
    //
    // // Replace the first <div> tag with the new <sly> tag
    // $('div').first().replaceWith(slyTag);
    // console.log($.html());
}

function listFinder() {
    //1. Find all the ul tags
    //2. Find all the li tags inside that list and print out it's values
    //3. Find all the children of the li tag and print out it's values
    //4. Assign the methodName to the java method
    let htmlPath = `../bin/front-end/test.html`;
    const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(htmlFile);
    // $('[data-sly-list-item]').each(function (i, elem) {
    //     // console.log($(elem).text());
    //     $(elem).find('*').each(function (j, childElem) {
    //         console.log($(childElem).text());
    //     });
    // });
    // $('ul').find('li').each((i, elem) => {
    //     // console.log($(elem).text());
    //     const $children = $(elem).children();
    //     const $validChildren = $children.filter('span, p, a');
    //     const textValues = $validChildren.map((j, child) => $(child).text().trim()).get();
    //     console.log(textValues);
    // });
    let ulArray= [];
    // $('ul').find('li').each((i, elem) => {
    //     const textValues = $(elem).text().split('\n')
    //         .map(text => text.trim())
    //         .filter(text => text.length > 0);
    //     console.log(textValues);
    // });
    $('ul').each((i, ul) => {
        let liArray = [];
        $(ul).find('li').each((j, li) => {
            const textValues = $(li).text().split('\n')
                .map(text => text.trim())
                .filter(text => text.length > 0);
            liArray.push(textValues);
        });
        // const ulAttrNames = Object.keys($(ul).attr())
        //     .filter(attrName => attrName.startsWith('data-list-') || attrName==='');
        //
        // if(ulAttrNames.length === 0) {
        //     $(ul).attr('data-list-default','');
        //     ulAttrNames.push('data-list-default');
        // }
        // console.log(ulAttrNames);

        //Find the attribute that starts with data-list-
        //And remove the data-list- part
        let ulAttrNames = Object.keys($(ul).attr())
            .find(attrName => attrName.startsWith('data-list-'))
            ?.slice('data-list-'.length);

        //If there is no attribute that starts with data-list- then add the default attribute
        if (!ulAttrNames) {
            ulAttrNames = 'default';
        }

        data.lists.push({
            ulName: ulAttrNames,
            liValues: liArray
        });
        ulArray.push({
            ulName: ulAttrNames,
            liValues: liArray
        });
    });
    // console.log(data.lists);
    // for (const el of data.lists) {
    //     console.log(el.liValues);
    //     for(const liItem of el.liValues){
    //         // console.log(liItem);
    //         if(liItem.length>1){
    //             for (const text of liItem) {
    //                 // console.log(text);
    //             }
    //         }
    //     }
    // }
    return $.html();
}

async function nameVariable(modelName, value) {
    const answer = await inquirer.prompt({
        type: "input",
        name: "variableName",
        message: `Name the variable for value:${value} =>`,
        default: "variableName",
    });
    let content = "${" + modelName + "." + answer.variableName + "}";
    data.fields.push(answer.variableName);
    data.types.push('String');
    console.log(content);
    return content;
}

async function translateDynamicElementsSecondVersion($, attributeName, modelName) {
    if (attributeName == null) {
        attributeName = `[data-dynamic]`;
        const attributeOccurances = $('body').find(`${attributeName}`);
        for (const el of attributeOccurances) {
            let content = await nameVariable(modelName, $(el).text());
            $(el).text(content);
        }

    } else {
        const attributeOccurrences = $('*').each(async function () {
            for (const attr of this.attributes) {
                let x=0;
                const attrName = attr.name;
                if (attrName.startsWith('data-text-')) {
                    await translateElement($,this,modelName,'String',attrName,attrName.slice(10));

                }
                if (attrName.startsWith('data-boolean-')) {
                    await translateElement($,this,modelName,'Boolean',attrName,attrName.slice(13));
                }
            }
        });
    }
}
function writeSightlyFileDraft(modelName, fileContent) {
    let sightlyPath = `../bin/components/${modelName}/${modelName}.html`;
    let javaBuilder = new FileGenerator(`../bin/components/${modelName}/model/${data.className}.java`,"f","f");
    // let xmlBuilder = new FileGenerator("ui.apps/src/main/content/jcr_root/apps/edelweiss/components/","f","f");
    // let sightlyBuilder = new FileGenerator(sightlyPath,"f","f");


    const javaCorePath = path.resolve(process.cwd(),'..','..','..', 'core/src/main/java/nl/dept/aem/edelweiss/core/models/');
    const xmlCompPath = path.resolve(process.cwd(),'..','..','..', 'ui.apps/src/main/content/jcr_root/apps/edelweiss/components/');

    //Java files
    const ejsPathBanner = `../bin/java-files/SlingModel.java.ejs`;
    const ejsPathList = `../bin/java-files/ListModel.java.ejs`;

    const javaPathBanner = `../bin/components/${modelName}/model/${data.className}.java`;
    // const javaPathBanner = javaCorePath+"\\"+`${data.className}.java`;
    const javaPathList = `../bin/components/${modelName}/model/Aws.java`;
    //Xml files
    const ejsDialogXml = `../bin/xml-files/_cq_dialog/.content.xml.ejs`;
    const ejsComponentXml = `../bin/xml-files/.content.xml.ejs`;

    const xmlDialogPath = `../bin/components/${modelName}/_cq_dialog/.content.xml`;
    const xmlComponentPath = `../bin/components/${modelName}/.content.xml`;
    // const xmlDialogPath = xmlCompPath+`${modelName}/_cq_dialog/.content.xml`;
    // const xmlComponentPath = xmlCompPath+`${modelName}/.content.xml`;

    try {
        if (!fs.existsSync(`${sightlyPath}`)) {
            fs.mkdirSync(`../bin/components/${modelName}`);
        }
        fs.writeFileSync(sightlyPath, fileContent, 'utf8');
        renderJavaFile(ejsPathBanner, javaPathBanner, modelName);
        renderJavaFile(ejsPathList, javaPathList, modelName);

        renderXmlFile(ejsDialogXml, xmlDialogPath, modelName);
        renderXmlFile(ejsComponentXml, xmlComponentPath, modelName);
    } catch (e) {
        console.log(e);
    }
}

async function readFileDraft(modelName, htmlPath) {
    const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    // Load the HTML into Cheerio
    // set xmlMode to true to disable automatic tag creation
    // set decodeEntities too false to prevent encoding of special characters

    // Replace the closing tag with a self-closing tag
    //It seems that Cheerio always adds a closing tag to void elements like <img> even when the decodeEntities option is set to false
    const fixedHtmlNew = htmlFile.replace(/(<img[^>]+)>(<\/img>)?/gi, '$1/>');
    const $ = cheerio.load(fixedHtmlNew, { xmlMode: true, decodeEntities: false });

    replaceWithSlyTag($, modelName);
    await translateDynamicElements($, modelName);
    await listFinder($);
    await imageGenerator($);

    // await hasContent($, modelName);

    //Remove the empty lines using regex expression
    return $.html().replace(/^\s*\n/gm, '');
}
//1. Get all the value of all the elements with the attribute data-dynamic.
// The attribute data-dynamic could be a boolean E.G.
// <div data-dynamic></div> OR <div data-dynamic="true"></div>
//2. Replace the value of the element with the sling model name and the method/variable name
//E.G. The name of the sling model is "person" and the variable name is "lastName"
//     We also should remove the attribute data-origin when creating sightlyFile
//The htmlFile:
//     <p>Last Name :</p>
//     <p data-origin>Smith</p>
//Will generate the sightlyFile with the following content:
//     <p>Last Name :</p>
//     <p>${person.lastName}</p>

async function promptUser() {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'selected_file',
            message: 'Select the file you want to use:',
            choices: getFilesInDirectory(`${process.cwd()}`)
        }
    ]).then((r) => {
        // if(isItDirectory(r.selected_file)){
        openDirectory(r.selected_file);
        // }
        return r;
    });
    console.log(`You selected the file: ${answers.selected_file}`);
}

function getFilesInDirectory(fileDirectory) {
    // const testFolder = `${process.cwd()}`;
    return fs.readdirSync(fileDirectory);
}

function openDirectory(fileDirectory) {
    let openedDir = fileDirectory;
    if (isItDirectory(fileDirectory)) {
        //Open directory
        openedDir = fs.readdirSync(fileDirectory);
        // openedDir=fs.opendirSync(fileDirectory);
    }

    //Get Files in the directory
    let fileNames = fs.readdirSync(openedDir.path);
    fileNames.forEach((file) => {
        console.log(file);
    })
}

async function inqDir() {
    inquirer.registerPrompt('directory', directory);
    const answer = inquirer.prompt([{
        type: 'directory',
        name: 'from',
        message: 'Where you like to put this component?',
        basePath: `${process.cwd()}`,
        // choices:fs.readdirSync(`${process.cwd}}`),
    }]).then(function (answers) {
        // (answers.from is the path chosen)
        //Get Files in the directory
        let fileNames = fs.readdirSync(answers.from);
        fileNames.forEach((file) => {
            console.log(file);
        })
    });
}

export function writeSightlyFile(modelName, fileContent) {

    const javaCorePath = path.resolve(process.cwd(),'..','..','..', 'core/src/main/java/nl/dept/aem/edelweiss/core/models/');
    const xmlCompPath = path.resolve(process.cwd(),'..','..','..', 'ui.apps/src/main/content/jcr_root/apps/edelweiss/components/');

    //Java files
    const ejsPathBanner = `../bin/java-files/SlingModel.java.ejs`;
    const ejsPathList = `../bin/java-files/ListModel.java.ejs`;

    const javaPathBanner = `../bin/components/${modelName}/model/${data.className}.java`;
    // const javaPathBanner = javaCorePath+"\\"+`${data.className}.java`;
    const javaPathList = `../bin/components/${modelName}/model/Aws.java`;
}

/**
 * Translate to spanish language
 * @param ctx
 * @returns {Promise<*>}
 */
const translateToSpanish = async ctx => {
    let spn = await translate(ctx, {to: "es"});
    console.log(spn);
    return spn;
};
export async function translateDynamicElements($, modelName) {
    let checkBoxNames =[];
    $('*').each(async function () {
        let attributes=[];
        for (const attr of this.attributes) {
            const attrName = attr.name;
            /**
             * There is alternative naming convention for the dynamic elements which I prefer more
             * Instead of the second paramiter being used to define the type of the field,
             * We should define the xml sling:resourceType, for example:
             * data-textField-title
             * data-textArea-message
             * data-checkbox-check
             * data-multifield-aws
             */
            let fieldDescription;
            if(attrName.startsWith('data-description')){
                fieldDescription = attr.value;
                // data.fields.push({
                //     fieldDescription: attr.value
                // })
            }
            if (attrName.startsWith('data-textfield-')) {
                await translateElement($, this, modelName, 'String', attrName, attrName.slice(15),"textfield",fieldDescription);
                attributes.push("textField");
            }
            if (attrName.startsWith('data-textarea-')) {
                await translateElement($, this, modelName, 'String', attrName, attrName.slice(14),"textarea",fieldDescription);
                attributes.push("textArea");

            }
            if (attrName.startsWith('data-checkbox-')) {
                const checkboxValue = attrName.slice(14);
                if (!checkBoxNames.includes(checkboxValue)) {
                    checkBoxNames.push(checkboxValue);
                    await checkBoxGenerator($, this, attrName, checkboxValue, false);
                    attributes.push("checkBox");

                }else{
                    await checkBoxGenerator($, this, attrName, checkboxValue, true);
                }
            }
            if (attrName.startsWith('data-select-')) {
                await selectFinder($,modelName);
                attributes.push("select");

            }
            if (attrName.startsWith('data-link-')) {
                await linkGenerator($, this,attrName, attrName.slice(10));
                attributes.push("link");
            }
        }
        if(attributes.length>0 && attributes.length<=3){
            if (attributes.includes("textField") || attributes.includes("textArea")) {
                if (attributes.includes("description")) {
                    data.fields.push({
                        name: "variableName",
                        javaType: "String",
                        resourceType: "text",
                        description: "variableDescription"
                    })
                } else {
                    data.fields.push({
                        name: "variableName",
                        javaType: "String",
                        resourceType: "text",
                        // description:null,
                    })
                }
            }
            if (attributes.includes("link")) {
                if (attributes.includes("description")) {
                    data.links.push({
                        name: attrNameSlice,
                        checkBox: checkBoxName,
                        description: "variableDescription"

                    })
                } else {
                    data.links.push({
                        name: attrNameSlice,
                        checkBox: checkBoxName,
                    })
                }
            }
            if (attributes.includes("checkBox")) {
                if (!checkBoxNames.includes(attributes.name)) {
                    data.fields.push({
                        name: "variableName",
                        javaType: "boolean",
                        resourceType: "checkbox",
                    })
                }
            }
        }
    });
}

async function checkBoxGenerator($, el, attrName, attrNameSlice, nameRepetition) {
    $(el).attr('data-sly-test', "${" + `model.${attrNameSlice}` + "}");
    $(el).removeAttr(attrName);
    if (!nameRepetition) {
        data.fields.push({
            name: attrNameSlice,
            javaType: "boolean",
            resourceType: "checkbox",
        })
    }

}

async function linkGenerator($, a, attrName, attrNameSlice) {
    let checkBoxName = attrNameSlice + "Checkbox";

    $(a).attr('href', "${" + `model.${attrNameSlice}` + "}");
    $(a).attr('target', "${" + `model.${checkBoxName} ? '_blank' : '_self'` + "}");
    $(a).removeAttr(attrName);
    data.links.push({
        name: attrNameSlice,
        checkBox: checkBoxName,
    })
}

export async function translateElement($, el, modelName, fieldType, attrName, attrNameSliced, resourceType, fieldDescription) {
    // const tagName = this.tagName;
    const textValue = $(el).text();
    let variableName = await nameVariable(modelName, attrNameSliced, fieldType, resourceType, textValue, fieldDescription);
    $(el).text(variableName);
    $(el).removeAttr(attrName);
}

export async function nameVariable(modelName, attrName, fieldType, resourceType, textValue, fieldDescription) {
    //Solution 1. Name with the static modelName variable
    let content = "${model." + attrName + "}";
    //Solution 2. Name with the dynamic modelName variable
    // let content = "${" + modelName + "." + attrName + "}";
    data.fields.push({
        name: attrName,
        javaType: fieldType,
        resourceType: resourceType,
        fieldDescription: fieldDescription
    })
    return content;
}

/**
 * Find and all the elements with the data-i18n attribute
 * @returns {Promise<string>}
 */
export async function i18nFind($) {
    // let htmlPath = `../bin/front-end/test.html`;
    // const htmlFile = fs.readFileSync(htmlPath, 'utf8');
    // const $ = cheerio.load(htmlFile);
    let allAttributes = [];
    let promises = []; // Create an array to store promises

    //We loop through all the elements in the body
    $('*').each(async function () {
        let attrs = this.attributes;
        //Then we loop through all the attributes of the element
        for (const el of attrs) {
            if (el.name.startsWith('data-i18n-')) {
                const attrName = '[' + el.name + ']';
                let variableName = el.name.substring(el.name.lastIndexOf('-') + 1);
                let content = "${'" + variableName + "' @ i18n}";
                if (!allAttributes.includes(el.name)) {
                    //This returns me all the values for every occurrence of the attribute
                    // $(attrName).text();
                    promises.push(addToJson(variableName, $(attrName).text())); // Add the promise to the array
                }
                $(attrName).text(content);
                allAttributes.push(el.name);
            }
        }
        // //Get rid off repetition
        // if (!allAttributes.includes($('body').find('*').filter(r).name)) {
        //     //This returns me all the values for every occurrence of the attribute
        //     // $(attrName).text();
        //     promises.find($(attrName).text())); // Add the promise to the array
        // }
    });
    await Promise.all(promises); // Await all the promises
    // console.log(allAttributes);
    return $.html();
}

/**
 * Add the i18n key and value to the json file
 * @param key
 * @param value
 * @returns {Promise<void>}
 */
async function addToJson(key, value) {
    let data = fs.readFileSync('../bin/json-files/en.json');
    let json = JSON.parse(data);
//     let variableName = await nameVariable(modelName, attrNameSliced, fieldType, resourceType, textValue, fieldDescription);
    ////Translate to different language
    // await translateToSpanish(value).then((result) => {
    //     json[key] = result;
    // });
    json[key] = value;

    await fs.writeFileSync('../bin/json-files/en.json', JSON.stringify(json));
}