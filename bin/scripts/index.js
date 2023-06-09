import {addTabs, data, inqFile, nameModel} from "./file_helper.js";
import * as path from "path";
import {SightlyFileGenerator} from "./builders/SightlyFileGenerator.js";
import {JavaFileGenerator} from "./builders/JavaFileGenerator.js";
import {XmlFileGenerator} from "./builders/XmlFileGenerator.js";
import {
    ConfigurationHelper, getHtmlDirectoryPath, getSingleFilePath,
    getUseHtmlAbsoluteFile
} from "./configuration-helper.js";
import {JsonGenerator} from "./builders/JsonGenerator.js";
import {HtmlFileGenerator} from "./builders/HtmlFileGenerator.js";

export async function main(configFile) {
    if (configFile) {
        let useHtmlAbsolutePath = getUseHtmlAbsoluteFile(configFile);
        let htmlFilePath;
        let javaDirectory;
        let xmlDialogDirectory;
        let xmlBasicDirectory;
        let i18nDirectory;
        let componentGroup;
        let rootPackage;

        if (!useHtmlAbsolutePath) {
            let htmlDirPath = getHtmlDirectoryPath(configFile);
            htmlFilePath = await inqFile(htmlDirPath);
        }
        let modelName = await nameModel();

        let configHelper = new ConfigurationHelper(configFile);
        if (useHtmlAbsolutePath) {
            htmlFilePath = getSingleFilePath(configFile);
        }
        javaDirectory = configHelper.getJavaDestination();
        xmlBasicDirectory = path.join(configHelper.getDialogDestination(), modelName);
        xmlDialogDirectory = path.join(configHelper.getDialogDestination(), modelName,'_cq_dialog');
        i18nDirectory = configHelper.getI18nDestination();
        componentGroup = configHelper.getProjectField("componentGroup");
        rootPackage = configHelper.getProjectField("rootPackage");

        data.componentGroup = componentGroup;
        data.rootPackage = rootPackage;
        await addTabs();

        const htmlFile = new HtmlFileGenerator(htmlFilePath, modelName+"Original", xmlBasicDirectory);
        const sightlyFile = new SightlyFileGenerator(htmlFilePath, modelName, xmlBasicDirectory);
        const javaFile = new JavaFileGenerator('SlingModel.java.ejs', modelName + "Model", javaDirectory);
        const xmlBasic = new XmlFileGenerator('.content.xml.ejs', ".content", xmlBasicDirectory);
        const xmlDialog = new XmlFileGenerator('_cq_dialog/.content.xml.ejs', ".content", xmlDialogDirectory);

        await sightlyFile.generateFile();
        await htmlFile.generateFile();
        await javaFile.generateFile();
        await xmlDialog.generateFile();
        await xmlBasic.generateFile();
        if(data.lists.length > 0){
            for (const list of data.lists) {
                data.listName = list.ulName;
                const listModel = new JavaFileGenerator('ListModel.java.ejs', list.ulName, javaDirectory);
                await listModel.generateFile();
            }
        }

        if (i18nDirectory) {
            const i18nEnJson = new JsonGenerator('', "en", i18nDirectory);
            await i18nEnJson.generateFile();
        }
    } else {
        console.error("No config file found");
    }
}

// module.exports = __dirName;

