import fs from "fs";

async function printFields() {
    let jsonData = await readJsonFile('D:\\projects\\Graduation-project\\terminal-node-js\\bin\\json-files\\components.json');
    const components = jsonData.components;

    for (const componentName in components) {
        const component = components[componentName];
        const fields = component.fields;

        console.log(`Fields for component: ${componentName}`);
        if(fields !== undefined) {
            fields.forEach((field, index) => {
                console.log(`Field ${index + 1}:`);
                console.log(`Name: ${field.name}`);
                console.log(`Type: ${field.type}`);
                console.log(`Max Length: ${field.maxLength}`);
                console.log(`Place Holder: ${field.placeHolder}`);
                console.log(`Field Description: ${field.fieldDescription}`);
                console.log(`Required: ${field.required}`);
                console.log('---');
            });
        }else{
            console.log(`No fields are defined for component: ${componentName}`);
        }
    }
}
function readJsonFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

await printFields();