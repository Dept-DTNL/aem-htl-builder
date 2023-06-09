# AEM - Htl - Builder
The goal of this project is to automize the process of translating the html file into sightly
and generating AEM components. This project is being developed as a part of the IT Graduation project.

Please feel free to leave any feedback or remarks about the project on the github discussion page.

## License
This project is licensed under the MIT License - see the LICENSE.txt file for details.

## Installation
### First
Make sure to install as well node.js and npm

**Node.js** :
1. Project version: 18.12.1
2. Installation guide: https://nodejs.org/en/download

**Npm**:
1. Project version: 8.19.2
2. Installation guide: https://docs.npmjs.com/cli/v8/commands/npm-install

### Next
Install aem-htl-builder with npm

```bash
  npm i aem-htl-builder
```

### Important !
If you cloned this repository instead of installing it via npm, to run the scripts go to 
**package.json** file and run the scripts from there.


## Configuration
After installing the module, you need to set up a configuration file.
Run the following command to create an empty configuration file.
```bash
  npx aem-htl-builder configure
``` 
Now that the file has been created you need to configure it.
Here is an example of valid configuration file:

```json
{
  "project": {
    "aemProjectPath": "/Users/username/projects/mysite",
    "rootPackage": "com.mysite.core",
    "componentGroup": "MySite - Content",
    "appName" : "mysite"
  },
  "html": {
    "useSingleFile": true,
    "singleFilePath": "/Users/username/html-files/test.html",
    "directoryPath": "/Users/username/html-files"
  }
}
```

And below is the  detailed description of what each field does:
1. To configure the project object:
- **aemProjectPath**: Specify the absolute path to your local AEM project.
- **rootPackage**: Specify the directory holding AEM Sling models. You can find it at `aemProjectName/core/src/main/java/`
- **componentGroup**: Specify the component group to which the components will be added. 
- **appName**: The appName field represents the name of the root folder within the `aemProjectName/ui.apps/src/main/content/jcr_root/apps/` directory in your AEM project. This folder contains your project-specific components, templates, and other resources.
2. To configure the html object:
- **useSingleFile**: If set to true, the module will read and use the HTML file from the `singleFilePath` field. If set to false, the module will prompt the user to select an HTML file via the terminal from `directoryPath`.
- **singleFilePath** : Specify the path to an existing HTML file.
- **directoryPath** : Specify the path to an existing directory containing HTML files which you will use do build AEM component.

### Note
You can also set-up configuration by simply running the script with already specified parameters (example below):
```bash
aem-htl-builder configure \
--aemProjectPath="/Users/username/projects/mysite" \
--rootPackage="com.mysite.core" \
--componentGroup="MySite - Content" \
--appName="mysite" \
--useSingleFile=true \
--singleFilePath="/Users/username/html-files/test.html" \
--directoryPath="/Users/username/html-files"
```

## Syntax
This section provides a detailed guide on how to prepare your HTML for processing by this module. 
It covers the necessary attribute HTML syntax for each AEM component field type.

Here is a list of all the attributes that are currently supported by the module:
- textfield-[VarName]
- textarea-[VarName]
- checkbox-[VarName]
- link-[VarName]
- img-[VarName]
- select-[VarName]
- description
- i18n-[VarName]
- list-[VarName]

The [VarName] placeholder represents the variable name you choose for the field and should be replaced by the actual name in your HTML.
### 1. Add textField
To add a textfield to your component, you need to follow these steps:

Add the textfield-[VarName] attribute to your paragraph tag, replacing [VarName] with your chosen field name.
- HTML Original:
```html
<p> Component Title </p>
```
- What module expects:
```html
<p textfield-title> Component Title </p>
```

### 2. textarea-[VarName]
To add a textarea to your component, you need to follow these steps:

Add the textarea-[VarName] attribute to your paragraph tag, replacing [VarName] with your chosen field name.
- HTML Original:
```html
<p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
```

- What module expects:
```html
<p textarea-message> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
```

### 3. checkbox-[varName]
- HTML Original:
```html
<div>
    <p>Species: Human</p>
</div>
```
- What module expects:
```html
<div checkbox-check>
    <p>Species: Human</p>
</div>
```
### 4. link-[VarName]
To add a link to your component, you need to follow these steps:

Add the link-[VarName] attribute to your paragraph tag, replacing [VarName] with your chosen field name.
- HTML Original:
```html
<a href="#">
    Click Here
</a>
```

- What module expects:
```html
<a link-linkToWebsite href="#">
    Click Here
</a>
```
### 5. img-[VarName]
To add an image to your component, you need to follow these steps:

Add the img-[VarName] attribute to your html tag, replacing [VarName] with your chosen field name.

- HTML Original:
```html
<img src="/banners/img1.png" alt="Img Description"/>
```
- What module expects:
```html
<img img-bannerImg src="/banners/img1.png" alt="Img Description"/>
```
### 6. ~~data-select-cars~~ (As of right now non functional)
- ~~HTML:~~
```html
<select data-select-cars name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="mercedes">Mercedes</option>
    <option value="audi">Audi</option>
</select>
```

### 7. i18n-[VarName]
If you have an element in your html which will be used for i18n you will need to:

Add the i18n-[VarName] attribute to your html tag, replacing [VarName] with your chosen field name.
- HTML Original:
```html
<div>
    <span>Location</span>
    <span>Contact</span>
</div>
```

- What module expects:
```html
<div>
    <span i18n-location>Location</span>
    <span i18n-contact>Contact</span>
</div>
```

After running `aem-htl-builder convert` command following will be added to:
- en.json:
```json
{
    "Location": "Location",
    "Contact": "Contact"
}
```

#### Note
If there is already in en.json file the key with the same name e.g. 'Location' this example would override
its value with new one.

### 8. description
The `description` requires the presence of another attribute from the list.
- HTML Original:
```html
<p> Component Title </p>
```
- What module expects:
```html
<p textfield-title description="This field defines the component title"> Component Title </p>
```
`textfield-title` serves as an example and it can be as well e.g. `img-varName` , `link-varName` etc.
### 9. list-[VarName]
If you want to add a list to your component, you need to follow these steps:

Add the list-[VarName] attribute to `<ul>` tag, replacing [VarName] with your chosen list name.

- HTML Original:
```html
<ul>
    <li>
        <div>
            <h3>Margherita</h3>
        </div>
        <p>10.99 €</p>
    </li>
    <li>
        <div>
            <h3>Pepperoni</h3>
        </div>
        <a href="#">Click the link here!</a>
        <p>13.99 €</p>
    </li>
</ul>
```
- What module expects:
```html
<ul list-pizzas>
    <li>
        <div>
            <h3 textfield-title>Margherita</h3>
        </div>
        <p textfield-price>10.99 €</p>
    </li>
    <li>
        <div>
            <h3>Pepperoni</h3>
        </div>
        <a link-pizzaLink href="#">Click the link here!</a>
        <p>13.99 €</p>
    </li>
</ul>
```
Notice that since this is a list you need to add attributes only to elements which you want to include in the list (multifield) only once.

After running `aem-htl-builder convert` command following code will be added to component dialog:

```xml
<pizzasModelList
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/form/multifield"
        fieldLabel="pizzasModel"
        composite="{Boolean}true">
    <field jcr:primaryType="nt:unstructured"
           sling:resourceType="granite/ui/components/coral/foundation/container"
           name="./pizzasModel">
        <items jcr:primaryType="nt:unstructured">
            <title
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                    fieldLabel="title"
                    name="./title"/>
            <price
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                    fieldLabel="price"
                    name="./price"/>
            <pizzaLinkContainer
                    jcr:primaryType="nt:unstructured"
                    jcr:title="pizzaLink Container"
                    sling:resourceType="granite/ui/components/coral/foundation/form/fieldset">
                <items jcr:primaryType="nt:unstructured">
                    <pizzaLinkCheckbox
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/foundation/form/checkbox"
                            text="Open link in another tab."
                            name="./pizzaLinkCheckbox"
                            value="true"/>
                    <pizzaLink
                            jcr:primaryType="nt:unstructured"
                            sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
                            fieldLabel="pizzaLink"
                            name="./pizzaLink"
                            required="{Boolean}false"
                            rootPath="/content"/>
                </items>
            </pizzaLinkContainer>
        </items>
    </field>
</pizzasModelList>
```
*The module will as well add the original HTML list as a comment under the newly converted list.*

## Convert HTML to Sightly
After successfully setting up configuration, and adding custom attributes to original HTML file
run the following command to create AEM component
```bash
  npx aem-htl-builder convert
```
