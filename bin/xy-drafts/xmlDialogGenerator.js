import * as ejs from 'ejs';
import * as fs from "fs";
import {data} from "./slingModelGenerator.js";


export let dialogData = {
    dialogTitle: 'Translator Component',
    title: 'Translator test component',
    message: 'This is a simple "Hello World" component dialog.',
    lists: [
        { itemLabel: 'Label 1', itemStyle: 'Black' },
    ],
};

export function renderXmlFile(ejsPath,xmlPath,modelName) {
    if(ejsPath==null){
        ejsPath='../xml-files/.content.xml.ejs';
    }
    if(xmlPath==null){
        xmlPath='../xml-files/.content.xml';
    }
    ejs.renderFile(ejsPath, data, (err, str) => {
        if (err) {
            console.error(err);
        } else {
            if(!fs.existsSync(`../bin/components/${modelName}/_cq_dialog`)){
                fs.mkdirSync(`../bin/components/${modelName}/_cq_dialog`);
            }
            fs.writeFileSync(xmlPath, str, err => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('XML file generated successfully!');
                }
            });
        }
    });
}
// renderXmlFile();