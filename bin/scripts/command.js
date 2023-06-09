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
    .option("--aemProjectPath <path>", "Enter the AEM project path")
    .option("--rootPackage <name>", "Enter the root package of core SlingModels")
    .option("--componentGroup <name>", "Enter the group name of the components")
    .option("--appName <path>", "Enter the directory name containing your components,templates and other resources:")
    .option("--useSingleFile <boolean>", "Do you want to use HTML file from single path?")
    .option("--singleFilePath <path>", "Enter the file path of single HTML file:")
    .option("--directoryPath <path>", "Enter the path of directory containing multiple HTML files:")
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
        "aemProjectPath",
        "rootPackage",
        "componentGroup",
        "appName",
        "useSingleFile",
        "singleFilePath",
        "directoryPath",
    ];
    for (const option of requiredOptions) {
        if (!options[option]) {
            missingOptions.push(option);
        }
    }
    let configuration;

    if(Object.keys(options).length===0){
        configuration = {
            project: {
                aemProjectPath: '',
                rootPackage: '',
                componentGroup: '',
                appName: '',
            },
            html: {
                useSingleFile: true,
                singleFilePath: '',
                directoryPath: '',
            },
        };
    }else{
        let answers = await inquirer.prompt(buildPrompts(missingOptions));
        const formattedOptions = {
            project: {
                aemProjectPath: options.aemProjectPath,
                rootPackage: options.rootPackage,
                componentGroup: options.componentGroup,
                appName: options.appName,
            },
            html: {
                useSingleFile: options.useSingleFile === 'true',
                singleFilePath: options.singleFilePath,
                directoryPath: options.directoryPath,
            },
        };
        configuration = mergeObjects(formattedOptions, answers);
        // Validate and save the configuration
        const configSchema = Joi.object({
            project: Joi.object({
                aemProjectPath: Joi.string().required().trim().exist(),
                rootPackage: Joi.string().required().trim(),
                componentGroup: Joi.string().required().trim(),
                appName: Joi.string().required().trim(),
            }),
            html: Joi.object({
                useSingleFile: Joi.boolean().required(),
                singleFilePath: Joi.string().trim(),
                directoryPath: Joi.string().trim(),
            }),
        });

        const {error} = configSchema.validate(configuration);

        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
    }

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
            name: 'project.aemProjectPath',
            message: 'Enter the AEM project path:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("aemProjectPath")
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
            name: 'project.appName',
            message: 'Enter the directory name containing your components,templates and other resources:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("appName")
        },
        // ... Add other project fields here
        {
            type: 'list',
            name: 'html.useSingleFile',
            message: 'Do you want to use HTML file from single path?',
            choices: [
                {name: 'Yes', value: true},
                {name: 'No', value: false}
            ],
            default: 0,
            when: () => missingOptions.includes("useSingleFile")
        },
        {
            name: 'html.singleFilePath',
            message: 'Enter the file path of single HTML file:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("singleFilePath")
        },
        {
            name: 'html.directoryPath',
            message: 'Enter the path of directory containing multiple HTML files:',
            validate: input => input.trim() !== '',
            when: () => missingOptions.includes("directoryPath")
        },
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
    const configFileName = 'configHtlBuilder.json';
    const projectRoot = appRootPath.toString();
    return path.join(projectRoot, configFileName);
}

async function convertHtml() {
    const configPath = getConfigPath();

    try {
        const configuration = await fs.readJson(configPath);
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