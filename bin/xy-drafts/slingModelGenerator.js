import * as ejs from 'ejs';
import * as fs from "fs";
// import {__dirName} from "../scripts/index.js";

// Define the data for the template
let className = 'DefaultModelName';
/**
 * Instead of creating a seperate fields and types,
 * Just have list of objects in "data" called "fields"
 * It will contain: VariableName, JavaType, SlingResourceType
 *
 */
export let data = {
    className: className,
    fields: [],
    types: [],
    images: [],
    links: [],
    lists: [],
    selects: [],
};

// Render the template with the data
export function renderJavaFile(ejsPath, javaPath, modelName) {
    if (ejsPath == null) {
        ejsPath = '../java-files/SlingModel.java.ejs';
    }
    if (javaPath == null) {
        javaPath = '../java-files/BannerModel.java';
    }
    ejs.renderFile(ejsPath, data, (err, str) => {
        if (err) {
            console.log(err);
        } else {
            if (!fs.existsSync(`../bin/components/${modelName}/model`)) {
                fs.mkdirSync(`../bin/components/${modelName}/model`);
            }
            // Write the generated Java code to a file
            fs.writeFileSync(javaPath, str, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Java file generated successfully!');
                }
            });
        }
    });
}

// console.log(data.className);