import inquirer from "inquirer";
import * as fs from "fs";
import {data} from "./slingModelGenerator.js";

/**
 * Name the model
 * @returns {Promise<any>}
 */
export async function nameModel() {
    return await inquirer.prompt([
        {
            type: "input",
            name: "fileName",
            message: "What is the name of the model? ",
            default: 'translatorTest'
        }
    ]).then(async function (r) {
        //Make the model name start with a capital letter
        data.className = r.fileName.charAt(0).toUpperCase() + r.fileName.slice(1) + "Model";
        return r.fileName;
    });
}


/**
 * Generate the list
 * @param path path of the html file
 * @param modelName
 * @returns {Promise<any>}
 */
async function generateList(path, modelName) {
    return await inquirer.prompt([
        {
            type: "input",
            name: "listName",
            message: "What is the name of the list?",
            default: "listName",
        },
        {
            type: "input",
            name: "listCount",
            message: "How many fields list will contain? (Acceptable from 1 to 9)",
            default: '2',
            validate: (answer) => {
                if (isNaN(answer)) {
                    return "please enter a number";
                }
                return true;
            }
        }
    ]).then(async function (r) {
        let i = 0;
        const writeStream = fs.createWriteStream(path, {flags: 'a'});
        let itemName = "${" + `${modelName}.${r.listName}` + "}";
        writeStream.write(`\n<div data-sly-list.item="${itemName}">`);
        for (i; i < r.listCount; i++) {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "value",
                    message: "Value of the <p> tag",
                },
            ]).then(async function (listInput) {
                let item = "${item}"
                writeStream.write(`\n<p>${listInput.value} : <b>${item}</b></p>`);
            });
        }
        writeStream.write(`\n</div>`);
        writeStream.end(() => {
            console.log('Content added to the file successfully!');
        });
    });
}

async function generateListWithMap(path, modelName) {
    return await inquirer.prompt([
        {
            type: "input",
            name: "listName",
            message: "What is the name of the list?",
            default: "listName",
        },
        {
            type: "input",
            name: "listCount",
            message: "How many fields list should contain? (Acceptable from 1 to 9)",
            default: '2',
            validate: (answer) => {
                if (isNaN(answer)) {
                    return "please enter a number";
                }
                return true;
            }
        }
    ]).then(async function (r) {
        let i = 0;
        const writeStream = fs.createWriteStream(path, {flags: 'a'});
        let itemName = "${" + `${modelName}.${r.listName}` + "}";
        writeStream.write(`\n<div data-sly-list.item="${itemName}">`);
        for (i; i < r.listCount; i++) {
            await inquirer.prompt([
                {
                    type: "input",
                    name: "key",
                    message: "The key",
                },
                {
                    type: "input",
                    name: "value",
                    message: "The value",
                },
            ]).then(async function (listInput) {
                writeStream.write(`\n<p>Key is: ${listInput.key}</p>`);
                writeStream.write(`\n<p>Value is: ${listInput.value}</p>`);
            });
        }
        writeStream.write(`\n</div>`);
        writeStream.end(() => {
            console.log('Content added to the file successfully!');
        });
    });
}

// module.exports = {
//     generateSightly,
// }