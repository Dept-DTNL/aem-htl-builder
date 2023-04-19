#!/usr/bin/env node

import {Command} from 'commander';
import inquirer from "inquirer";
import Joi from "joi";
import path from "path";
import fs from "fs-extra";
import appRootPath from "app-root-path";
import {main} from "./index.js";
import {templateGenerator} from "./templates.js";

const program = new Command();
program
    .command('configure')
    .description('Configure the module with required parameters')
    .option("--projectPath <path>", "Enter the project path")
    .option("--rootPackage <name>", "Enter the root package of core SlingModels")
    .option("--componentParentPath <path>", "Enter the parent path containing component dialogs")
    .option("--componentGroup <name>", "Enter the group name of the components")
    .option("--i18nPath <path>", "Enter the parent path of i18n files")
    .option("--useAbsolutePath <boolean>", "Do you want to use absolute paths for HTML files?")
    .option("--htmlPath <path>", "Enter the HTML file path")
    .action((options) => configure(options));

program
    .command('convert')
    .description('Convert the html file to sightly')
    .action(convertHtml);

program
    .command('templates')
    .description('Generate a template')
    .action(generateTemplate);

program.parse(process.argv);


async function configure(options) {
    const missingOptions = [];
    const requiredOptions = [
        "projectPath",
        "rootPackage",
        "componentParentPath",
        "componentGroup",
        "i18nPath",
        "useAbsolutePath",
        "htmlPath"
    ];
    // options = {
    //     projectPath: "D:\\projects\\Graduation-project\\dtnl-edelweiss",
    //     rootPackage: "nl.dept.aem.edelweiss.core",
    //     componentParentPath: "edelweiss\\components",
    //     componentGroup: "Edelweiss - Content",
    //     i18nPath: "edelweiss\\i18n",
    //     useAbsolutePath: true,
    //     htmlPath: "D:\\projects\\Graduation-project\\terminal-node-js\\bin\\front-end\\test.html"
    //
    // }
    for (const option of requiredOptions) {
        if (!options[option]) {
            // console.log("Missing option : " + option);
            missingOptions.push(option);
        }
    }
    const answers = missingOptions.length > 0
        ? await inquirer.prompt(buildPrompts(missingOptions))
        : {};

    const formattedOptions = {
        project: {
            projectPath: options.projectPath,
            rootPackage: options.rootPackage,
            componentParentPath: options.componentParentPath,
            componentGroup: options.componentGroup,
            i18nPath: options.i18nPath,
        },
        html: {
            useAbsolutePath: options.useAbsolutePath === 'true',
            htmlPath: options.htmlPath,
        },
    };
    const configuration = mergeObjects(formattedOptions, answers);

    // Validate and save the configuration
    const configSchema = Joi.object({
        project: Joi.object({
            projectPath: Joi.string().required().trim().exist(),
            rootPackage: Joi.string().required().trim(),
            componentParentPath: Joi.string().required().trim(),
            componentGroup: Joi.string().required().trim(),
            i18nPath: Joi.string().trim(),
        }),
        html: Joi.object({
            useAbsolutePath: Joi.boolean().required(),
            htmlPath: Joi.string().trim(),
        }),
    });
    // console.log(configuration);

    const {error} = configSchema.validate(configuration);

    if (error) {
        console.error(`Error: ${error.message}`);
        return;
    }

// Call the saveConfiguration function with the validated configuration
    await saveConfiguration(configuration);
}

function mergeObjects(obj1, obj2) {
    const result = { ...obj1 };

    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (obj1.hasOwnProperty(key) && typeof obj1[key] === 'object') {
                result[key] = mergeObjects(obj1[key], obj2[key]);
            } else {
                result[key] = obj2[key];
            }
        }
    }

    return result;
}


function buildPrompts(missingOptions) {
    return [
        {
            name: 'project.projectPath',
            message: 'Enter the project path:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("projectPath")
        },
        {
            name: 'project.rootPackage',
            message: 'Enter the root package of core SlingModels:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("rootPackage")
        },
        {
            name: 'project.componentParentPath',
            message: 'Enter the parent path containing component dialogs:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("componentParentPath")
        },
        {
            name: 'project.componentGroup',
            message: 'Enter the group name of the components:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("componentGroup")
        },
        {
            name: 'project.i18nPath',
            message: 'Enter the parent path of i18n files:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("i18nPath")
        },
        // ... Add other project fields here
        {
            type: 'list',
            name: 'html.useAbsolutePath',
            message: 'Do you want to use absolute paths for HTML files?',
            choices: [
                {name: 'Yes', value: true},
                {name: 'No', value: false}
            ],
            default: 0,
            when: () => missingOptions.includes("useAbsolutePath")
        },
        {
            name: 'html.htmlPath',
            message: 'Enter the HTML file path:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("htmlPath")
        },
        // ... Add other html fields here
    ];
}



async function saveConfiguration(configuration) {
    try {
        await fs.writeJsonSync(getConfigPath(), configuration, {spaces: 2});
        console.log('Configuration saved successfully.');
    } catch (err) {
        console.error('Error saving configuration:', err.message);
    }
}

// -------------- READING CONFIGURATION --------------
function getConfigPath() {
    const configFileName = 'configTest.json';
    const projectRoot = appRootPath.toString();
    return path.join(projectRoot, configFileName);
}

async function convertHtml() {
    const configPath = getConfigPath();

    try {
        const configuration = await fs.readJson(configPath);
        // console.log(configuration);
        await main(configuration);
    } catch (err) {
        console.error('Error reading configuration:', err);
    }
}

// -------------- Template Command --------------

async function generateTemplate() {
    const configPath = getConfigPath();

    try {
        const configuration = await fs.readJson(configPath);
        await templateGenerator(configuration);
    } catch (err) {
        console.error('Error reading configuration:', err.message);
    }
}