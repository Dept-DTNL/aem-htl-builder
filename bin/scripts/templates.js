import {ConfigurationHelper} from "./configuration-helper.js";
import inquirer from "inquirer";
import {XmlFileGenerator} from "./builders/XmlFileGenerator.js";
import fs from "fs-extra";
import path from "path";

export async function templateGenerator(configFile) {
    if(configFile){
        let configHelper = new ConfigurationHelper(configFile);
        let templatesDirectory = configHelper.getTemplatesDirectory();
        if(templatesDirectory){
            let templateName = await promptTemplateName();
            let newTemplateFolder = path.join(templatesDirectory,templateName);

            const content = new XmlFileGenerator('templates/.content.xml.ejs', ".content", path.join(newTemplateFolder));
            const initial = new XmlFileGenerator('templates/.content.xml.ejs', ".content", path.join(newTemplateFolder + '\\' + 'initial'));
            const policies = new XmlFileGenerator('templates/.content.xml.ejs', ".content", path.join(newTemplateFolder + '\\' + 'policies'));
            const structure = new XmlFileGenerator('templates/.content.xml.ejs', ".content",path.join(newTemplateFolder + '\\' + 'structure'));

            await content.generateFile();
            await initial.generateFile();
            await policies.generateFile();
            await structure.generateFile();
            thumbnailGenerator(newTemplateFolder);
        }
    }else{
        console.log("No configuration file found");
    }
}
function thumbnailGenerator(templateDirectory){
    //TODO: Check if directory exists
    const image = 'bin/assets/thumbnail.png';
    const data = fs.readFileSync(image);
    const destination = path.join(templateDirectory + '\\' + 'thumbnail.png');
    fs.writeFileSync(destination, data, 'base64');
}

async function promptTemplateName(){
    return await inquirer.prompt({
        type: 'input',
        name: 'templateName',
        message: 'Enter the name of the template',
    }).then((answer) => {
        return answer.templateName;
    });
}

// const configuration = await fs.readJson('D:\\projects\\Graduation-project\\terminal-node-js\\configHtlBuilder.json');
// await templateGenerator(configuration);
// thumbnailGenerator();