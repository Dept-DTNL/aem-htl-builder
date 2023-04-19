import {addTabs, data, inqFile, nameModel} from "./file_helper.js";
import {SightlyFileGenerator} from "./builders/SightlyFileGenerator.js";
import {JavaFileGenerator} from "./builders/JavaFileGenerator.js";
import {XmlFileGenerator} from "./builders/XmlFileGenerator.js";
import {
    ConfigurationHelper, getHtmlPath,
    getUseHtmlAbsoluteFile
} from "./configuration-helper.js";
import {JsonGenerator} from "./builders/JsonGenerator.js";

export async function main(configFile) {
    if (configFile) {
        let useHtmlAbsolutePath = getUseHtmlAbsoluteFile(configFile);
        //TODO: Make this scalable by generating builder for json files
        // export let i18nFile = await readI18nJsonFile();
        let htmlFilePath;
        let javaDirectory;
        let xmlDialogDirectory;
        let xmlBasicDirectory;
        let i18nDirectory;
        let componentGroup;
        let rootPackage;

        if (!useHtmlAbsolutePath) {
            htmlFilePath = await inqFile();
        }
        let modelName = await nameModel();

        let configHelper = new ConfigurationHelper(configFile);
        if (useHtmlAbsolutePath) {
            htmlFilePath = getHtmlPath(configFile);
        }
        javaDirectory = configHelper.getJavaDestination();
        xmlBasicDirectory = configHelper.getDialogDestination() + '\\' + modelName;
        xmlDialogDirectory = configHelper.getDialogDestination() + '\\' + modelName + '\\_cq_dialog';
        i18nDirectory = configHelper.getI18nDestination();
        componentGroup = configHelper.getProjectField("componentGroup");
        rootPackage = configHelper.getProjectField("rootPackage");

        data.componentGroup = componentGroup;
        data.rootPackage = rootPackage;
        await addTabs();

        const sightlyFile = new SightlyFileGenerator(htmlFilePath, modelName, xmlBasicDirectory);
        const javaFile = new JavaFileGenerator('SlingModel.java.ejs', modelName + "Model", javaDirectory);
        // TODO We can have multiple lists, so we need to iterate over them and make
        //  sure that we create a model for every list
        const xmlBasic = new XmlFileGenerator('.content.xml.ejs', ".content", xmlBasicDirectory);
        const xmlDialog = new XmlFileGenerator('_cq_dialog/.content.xml.ejs', ".content", xmlDialogDirectory);

        await sightlyFile.generateFile();
        await javaFile.generateFile();
        await xmlDialog.generateFile();
        await xmlBasic.generateFile();
        if(data.lists.length > 0){
            for (const list of data.lists) {
                data.listName = list.ulName;
                const listModel = new JavaFileGenerator('ListModel.java.ejs', list.ulName, javaDirectory);
                await listModel.generateFile();
            }
            // const listModel = new JavaFileGenerator('ListModel.java.ejs', data.lists["0"].ulName, javaDirectory);
            // await listModel.generateFile();
        }

        if (i18nDirectory) {
            const i18nEnJson = new JsonGenerator('', "en", i18nDirectory);
            await i18nEnJson.generateFile();
        }
    } else {
        console.error("No config file found");
    }

    // javaDirectory = path.resolve(process.cwd(), '../../../core/src/main/java/nl/dept/aem/edelweiss/core/models');
    // xmlBasicDirectory = path.resolve(process.cwd(), `../../../ui.apps/src/main/content/jcr_root/apps/edelweiss/components/${modelName}`);
    // xmlDialogDirectory = path.resolve(process.cwd(), `../../../ui.apps/src/main/content/jcr_root/apps/edelweiss/components/${modelName}/_cq_dialog`);
    // i18nDirectory = path.resolve(process.cwd(), `../../../ui.apps/src/main/content/jcr_root/apps/edelweiss/i18n`);

}

// module.exports = __dirName;

