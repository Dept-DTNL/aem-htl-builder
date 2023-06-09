import * as fs from "fs";
import inquirer from "inquirer";
import inquirerFileTreeSelection from "inquirer-file-tree-selection-prompt";
import * as path from "path";
import {ElementFactory} from "./factory-pattern/ElementFactory.js";

let className = 'DefaultModelName';
let componentGroup = 'Example - Component Group';
let rootPackage = 'root.package.example';

export let data = {
    className: className,
    componentGroup: componentGroup,
    rootPackage: rootPackage,
    fields: [],
    types: [],
    images: [],
    videos: [],
    links: [],
    lists: [],
    selects: [],
    richTexts: [],
    tabs: [],
};

export async function nameModel() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "fileName",
            message: "What is the name of the model? ",
            default: 'pizzeria'
        }
    ]).then(async function (r) {
        //Make the model name start with a capital letter
        data.className = r.fileName.charAt(0).toUpperCase() + r.fileName.slice(1) + "Model";
        return r.fileName;
    });
}

/**
 * Check if the file path is a directory. If it is return true
 * @param filePath
 * @returns {boolean}
 */
function isItDirectory(filePath) {
    return fs.lstatSync(filePath).isDirectory();
}

export async function inqFile(htmlDirPath) {
    process.chdir(htmlDirPath);
    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
    const answer = await inquirer.prompt({
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
        },
        validate: (answer) => {
            if (isItDirectory(answer)) {
                // console.log("You must select the file NOT directory")
                return "You must select the file NOT directory";
            }
            return true;
        }
    });
    return answer.file;
}

/**
 * Replace the div tag with a sly tag and add the data-sly-use attribute
 * @param $ - cheerio object
 * @param modelName
 */
export async function replaceWithSlyTag($, modelName) {
    const firstElement = $('*').first();

    const slyTag = $('<sly>')
        .attr(`data-sly-use.model`, `${data.rootPackage}.models.${data.className}`)
        .append(firstElement.contents());
    firstElement.replaceWith(slyTag);
}

async function hasContent($, modelName) {
    return await inquirer.prompt({
        type: "list",
        name: "select_method",
        message: "Do you want to include hasContent attribute for <sly> tag?",
        choices: [
            {name: 'yes', value: true},
            {name: 'no', value: false},
        ]
    }).then(async answer => {
        if (answer.select_method) {
            await inquirer.prompt([
                {
                    type: 'checkbox',
                    name: 'selectedVariables',
                    message: 'Which of those fields should be included in the hasContent attribute?',
                    choices: data.fields,
                },
            ]).then((promptAnswer => {
                // Add the prefix to each selected color and concatenate them into a string
                const selectedVariables = promptAnswer.selectedVariables.map(variable => `\${${modelName}.${variable}}`).join(' || ');
                $('sly').first().attr(`data-sly-${modelName}.hasContent`, selectedVariables);

                // Select the root element and append the new <sly> tag to it
                $('body').append('<sly data-sly-call="${templates.placeholder @ isEmpty=!hasContent}"></sly>');
            }));
            return true;
        } else {
            return false;
        }
    });
}

export async function translateDynamicElements($) {
    const listsData = {};
    let listDescription;

    $('ul, ol').filter((_, el) => {
        return Object.keys($(el).attr()).some(attrName => attrName.startsWith('list-'));
    }).each(function (index) {
        const listId = `list-${index}`;
        $(this).attr('data-list-id', listId);

        let originalUlAttrName = Object.keys($(this).attr())
            .find(attrName => attrName.startsWith('list-'))
            ?.slice('list-'.length);

        if(this.attribs.description!=null){
            listDescription=this.attribs.description;
            $(this).removeAttr('description');
        }

        let ulAttrName = originalUlAttrName + 'Model';

        // If there is no attribute that starts with data-list-, then add the default attribute
        if (!ulAttrName) {
            ulAttrName = 'default';
        }
        $(this).attr(`data-sly-list.${ulAttrName}`, "${" + `model.` + `${ulAttrName}` + "}");
        $(this).removeAttr(`list-${originalUlAttrName}`);

        listsData[listId] = {
            ulName: ulAttrName,
            liItems: [],
            description:listDescription
        };
        const originalListHTML = $(this).clone().wrap('<div>').parent().html();
        const commentContent = `\n <!-- List original content:-->\n` + `<!-- ${originalListHTML} -->\n`;
        $(this).after(`${commentContent}`);

    });

    const allPromises = [];

    $('*').each(function () {
        //This loop needs to modify the content in html
        const currentElement = $(this);
        const listAncestors = currentElement.parents('[data-list-id]');

        let elementFactory = new ElementFactory($, this, this.attributes);

        if (listAncestors.length > 0) {
            const listId = listAncestors.attr('data-list-id');

            let listName = listsData[listId].ulName;
            // Create new list using cheerio
            // Add all the elements into that list
            const itemPromise = elementFactory.convertList(listName).then((item) => {
                //Check if item is null and if item name is not already in the array
                if (item != null && !listsData[listId].liItems.some(el => el.name === item.name)) {
                    listsData[listId].liItems.push(item);
                }
            });

            allPromises.push(itemPromise);
        } else {
            const attrPromise = elementFactory.convertAttributes();
            allPromises.push(attrPromise);
        }
    });

    // Wait for all the promises to complete before logging the liArray
    return Promise.all(allPromises).then(() => {
        for (const listId in listsData) {
            data.lists.push(listsData[listId]);
        }
        $('ul[data-list-id], ol[data-list-id]').each(function() {
            for (const listId in listsData) {
                // data.lists.push(listsData[listId]);
                if(this.attribs["data-list-id"] === listId){
                    let liCount = 0;
                    const newUl = $('<ul></ul>');
                    const newLi = $('<li></li>');
                    for (let child of this.children){
                        if(child.name==="li" && liCount === 0){
                            newLi.attr(child.attribs);
                            liCount++;
                        }
                    }

                    for(const item of listsData[listId].liItems) {
                        if(item.element != null){
                            newLi.append(item.element);
                            newLi.append('\n');
                        }
                    }
                    newUl.append(newLi);
                    newUl.append('\n');
                    newUl.attr(this.attribs);
                    $(this).replaceWith(newUl);
                }
            }
        });
        // Remove the flag from all the list elements
        $('ul, ol').removeAttr('data-list-id');
        return $.html();
    });
}


export async function selectFinder($) {
    try {
        await $('select').each(async (i, sel) => {
            let optArray = [];
            //Find the attribute that starts with data-list-
            //And remove the data-list- part
            let selAttrName = Object.keys($(sel).attr())
                .find(attrName => attrName.startsWith('data-select-'))
                ?.slice('data-select-'.length);

            //If there is no attribute that starts with data-list- then add the default attribute
            if (!selAttrName) {
                selAttrName = 'default';
            }
            //Add the original content as a comment
            let originalContent = $(sel).prop('outerHTML');
            let commentContent = `\n <!-- Original content:-->\n` + `<!-- ${originalContent} -->\n`;
            $(sel).after(`${commentContent}`);

            //Change the attribute name and value to the new name
            const pTag = $('<p>'); // create a new <p> tag
            pTag.text("${" + `model.` + `${selAttrName}` + "}");
            $(sel).replaceWith(pTag);

            await $(sel).find('option').each((j, opt) => {
                const textValues = $(opt).text().split('\n')
                    .map(text => text.trim())
                    .filter(text => text.length > 0);
                optArray.push(textValues);
                //Remove all the option tags from the ul
                $(opt).remove();
            });

            data.selects.push({
                name: selAttrName,
                options: optArray
            });
        });
        return $.html();
    } catch (e) {
        console.error(e);
    }
}

/**
 * This function will ask the user if he wants to have multiple tabs
 * If the user wants to have multiple tabs, it will ask how many tabs he wants to have
 * It will then ask the user to enter the name of the tabs
 * @returns {Promise<*>}
 */
export async function addTabs() {
    return await inquirer.prompt({
        type: "list",
        name: "include_tabs",
        message: "Do you want to have multiple tabs",
        choices: [
            {name: 'no', value: false},
            {name: 'yes', value: true},
        ]
    }).then(async answer => {
        if (answer.include_tabs) {
            await inquirer.prompt([
                {
                    type: 'input',
                    name: 'tab_count',
                    message: 'How many of the tabs you want to include? Please enter a number (0-3):',
                    default: `1`,
                    validate: function (input) {
                        if (input < 0 || input > 3 || isNaN(input)) {
                            return 'Please enter a number between 0 and 3.';
                        }
                        return true;
                    }
                },
            ]).then(async promptAnswer => {
                for (let i = 0; i < promptAnswer.tab_count; i++) {
                    await inquirer.prompt([
                        {
                            type: 'input',
                            name: 'tab_name',
                            message: `What is the name of the tab:${i + 1}? (Max 25 characters)`,
                            default: `Tab${i + 1}`,
                            validate: function (input) {
                                if (input.length < 0 || input.length > 25) {
                                    return 'Please enter a number between 0 and 3.';
                                }
                                return true;
                            }
                        },
                    ]).then(async tab => {
                        data.tabs.push({
                            name: tab.tab_name,
                        });
                    });
                }
            });
            return true;
        } else {
            return false;
        }
    });
}
