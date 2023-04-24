# AEM - Htl - Builder
The goal of this project is to automize the process of translating the html file into sightly
and generating AEM components. This project is being developed as a part of the IT Graduation project.

Currently the project is non-functional and is under development, therefore more than likely the module won't work upon installation. It has been published for internal testing purposes.


The estimated delivery date of the project is 30th of June 2023.

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
Run the following command
```bash
  npm aem-htl-builder configure
``` 
You should be presented with prompt in your terminal where you will be asked to configure the module.

Here is an example of valid configuration file:

```json
{
  "project": {
    "projectPath": "C:\\projects\\aem-pizzeria",
    "rootPackage": "pizzeria.project.core",
    "componentParentPath": "pizzeria\\components",
    "componentGroup": "Pizzeria - Content",
    "i18nPath" : "pizzeria\\i18n"
  },
  "html": {
    "useAbsolutePath": true,
    "htmlPath": "D:\\html-files\\test.html"
  },
  "templatesPath" : "ui.content\\src\\main\\content\\jcr_root\\conf\\pizzeria\\settings\\wcm\\templates"
}
```

And below is the  detailed description of what each field does:
1. To configure the project object:
- **projectPath**: Specify the absolute path to your local AEM project.
- **rootPackage**: Specify the directory holding AEM Sling models. Sling models are Java classes that map JCR nodes and properties to Java objects. These objects can then be used in the development of AEM components, services, and other applications.
- **componentParentPath**: Specify the directory holding the AEM component dialogs. The component dialogs are a type of AEM component that allows authors to enter content using a form-based interface.
- **componentGroup**: Specify the component group to which the components will be added. Adding components to a group helps organize them in the AEM authoring interface.
- **i18nPath** *(optional)*: Specify the directory holding the AEM i18n files which are later used for translating content. Internationalization (i18n) files provide translations for user-facing text and labels in AEM applications.
2. To configure the html object:
- **useAbsolutePath**: If set to true, the module will read and use the HTML file from the htmlPath field. If set to false, the module will prompt the user to select an HTML file via the terminal.
- **htmlPath** : Specify the path to an existing HTML file.

### Note
You can also set-up configuration by simply running the script with already specified parameters (example below):
```bash
aem-htl-builder configure \
--projectPath="C:\projects\aem-pizzeria" \
--rootPackage="pizzeria.project.core" \
--componentParentPath="pizzeria\\components" \
--componentGroup="Pizzeria - Content" \
--i18nPath="pizzeria\\i18n" \
--useAbsolutePath=true \
--htmlPath="D:\\html-files\\test.html" 
```
## Convert HTML to Sightly
After successfully setting up configuration, 
Run the following command to convert html file into Sightly
```bash
  npm aem-htl-builder convert
```

## Syntax
In the list below I present the required attribute HTML syntax for each of the attributes
and the corresponding **Sightly**, **Sling Model** and **XML Dialog** output.

Here is a list of all the attributes that are currently supported by the module:
- textfield-textFieldName
- textarea-textAreaName
- checkbox-checkName
- link-linkName
- img-imgReference
- ~~select-selectName~~
- description
- list-listName
- i18n-varName

### 1. textfield-Title
- HTML:
```html
<p textfield-title> John </p>
```

- Sightly:
```html
<p>${model.title}</p>
```

- Sling Model:
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected String title;
```

- XML Dialog:
```xml
<title
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
    fieldLabel="title"
    name="./title"
    value="title"/>
```

### 2. textarea-message
- HTML:
```html
<p textarea-message>Lorem Ipsum is simply dummy text of the printing and
    typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
    when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
```

- Sightly:
```html
<p>${model.message}</p>
```

- Sling Model:
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected String message;
```

- XML Dialog:
```xml
<message
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
    fieldLabel="message"
    name="./message"
    value="message"/>
```
### 3. checkbox-check
- HTML:
```html
<div checkbox-check>
    <p>Species: Human</p>
</div>
```

- Sightly:
```html
<div data-sly-test="${model.check}">
    <p>Species: Human</p>
</div>
```

- Sling Model:
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected boolean check;
```

- XML Dialog:
```xml
<check
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/checkbox"
    text="check"
    name="./check"
    uncheckedValue="false"
    value="true"/>
```
### 4. link-linkName
- HTML:
```html
<a link-link1 class="Banner" href="www.webTest.com">
    <strong textfield-preTitle1 class="Banner--tag">Banner PreTitle</strong>
</a>
```

- Sightly:
```html
<a class="Banner" href="${model.link1}" target="${model.linkCheckbox ? '_blank' : '_self'}">
    <strong class="Banner--tag">${model.preTitle1}</strong>
</a>
```

- Sling Model:
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected String link1;

@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected Boolean link1Checkbox;
```

- XML Dialog:
```xml
<link1Checkbox
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/foundation/form/checkbox"
    text="Open link in another tab."
    name="./link1Checkbox"
    value="true"/>
<link1
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
    fieldLabel="link1"
    name="./link1"
    required="{Boolean}false"
    rootPath="/content"/>
```
### 5. img-imgName
- HTML:
```html
<img img-img1 class="Banner--img" src="/dummy//svg/1.svg" alt=""/>
```

- Sightly:
```html
<img class="Banner--img" src="${model.img1Reference @ context='uri'}" alt="" data-sly-test="${model.img1Reference}"/>
```

- Sling Model:
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected String img1Reference;
```

- XML Dialog:
```xml
<img1
    jcr:primaryType="nt:unstructured"
    sling:resourceType="cq/gui/components/authoring/dialog/fileupload"
    autoStart="{Boolean}false"
    class="cq-droptarget"
    fieldLabel="Image"
    fileNameParameter="./img1Name"
    fileReferenceParameter="./img1Reference"
    mimeTypes="[image/gif,image/jpeg,image/png,image/tiff,image/svg+xml]"
    multiple="{Boolean}false"
    name="./img1"
    title="Image"
    uploadUrl="${suffix.path}"
    useHTML5="{Boolean}true"/>
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

- ~~Sightly:~~
```html
<p>${model.cars}</p>
```

- ~~Sling Model:~~
```java
@ValueMapValue(injectionStrategy=InjectionStrategy.OPTIONAL)
protected String cars;
```

- ~~XML Dialog:~~
```xml
<cars
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/select"
    fieldLabel="cars"
    name="./cars">
    <items jcr:primaryType="nt:unstructured">
        
            <Volvo
             jcr:primaryType="nt:unstructured"
             text="Volvo"
             value="Volvo"/>
        
            <Saab
             jcr:primaryType="nt:unstructured"
             text="Saab"
             value="Saab"/>
        
            <Mercedes
             jcr:primaryType="nt:unstructured"
             text="Mercedes"
             value="Mercedes"/>
        
            <Audi
             jcr:primaryType="nt:unstructured"
             text="Audi"
             value="Audi"/>
        
    </items>
</cars>
```
### 7. i18n-keyName
- HTML:
```html
<div>
    <span i18n-destination>Destination</span>
    <span i18n-person>Person</span>
</div>
```

- Sightly:
```html
<div>
    <span>${'Destination' @ i18n}</span>
    <span>${'Person' @ i18n}</span>
</div>
```

- en.json:
```json
{
    ...Previous elements,
    "Destination": "Destination",
    "Person": "Person"
}
```

#### Note
If there is already in en.json file the key with the same name e.g. 'Person' this example would override
its value with new one.

### 8. description
The data-description requires the presence of another 'data-' attribute. 
To describe the field, the field must exist in the first place.
- HTML:
```html
<p textfield-title description="This field defines the firstName">John</p>
```

- Sightly:
```html
<p>${model.title}</p>
```

- XML Dialog:
```xml
<title
    jcr:primaryType="nt:unstructured"
    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
    fieldLabel="title"
    name="./title"
    value="title"
    fieldDescription="This field defined the firstName"/>
```
### 9. list-listName
The module automatically detects and parses all the `<ul>` list occurances. However, the user still needs to define the list name. If the data-list is missing in the `<ul>` the default list name will be assigned.

Furthermore, under newly created list in Sightly, there will be commented original list.
- HTML:
```html
<ul list-aws class="Pizza--list">
    <li class="Pizza">
        <div>
            <h3 textfield-title class="title">Margarita</h3>
            <p class="preTitle">Pizza</p>
        </div>
        <p textarea-text class="text">Tomato sauce and cheese.</p>
        <a link-pizzaLink href="" class="Post--link link">www.website.com/en/pizzeria/pizzas/</a>
    </li>
    <li>
        <img img-pizzaImg class="Pizza--img" src="/dummy//svg/2.svg" alt="">
    </li>
</ul>
```

- Sightly:
```html
    <ul class="Pizza--list" data-sly-list.awsModel="${model.awsModel}">
    <li class="Pizza" id="someId">
        <h3 class="title">${awsModel.title}</h3>
        <p class="text">${awsModel.text}</p>
        <a href="${awsModel.pizzaLink}" class="Post--link link"
           target="${awsModel.pizzaLinkCheckbox ? '_blank' : '_self'}">www.website.com/en/pizzeria/pizzas/</a>
        <img class="Pizza--img" src="${awsModel.pizzaImgReference @ context='uri'}" alt=""
             data-sly-test="${awsModel.pizzaImgReference}"/>
    </li>
</ul>
```

- Sling Model:
```java
@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AwsModel{
    
    @ValueMapValue(name="title")
    @Inject
    protected String title;
              
    @ValueMapValue(name="text")
    @Inject
    protected String text;
                 
    @ValueMapValue(name="pizzaLink")
    @Inject
    protected String pizzaLink;

    @ValueMapValue(name="pizzaLinkCheckbox")
    @Inject
    protected Boolean pizzaLinkCheckbox;
        
    @ValueMapValue(name="pizzaImgReference")
    @Inject
    protected String pizzaImgReference;
}
```

- New Sling Model for list:
```java
@Getter
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class AwsModel{
    
    @ValueMapValue(name="title")
    @Inject
    protected String title;
              
    @ValueMapValue(name="text")
    @Inject
    protected String text;
                 
    @ValueMapValue(name="pizzaLink")
    @Inject
    protected String pizzaLink;

    @ValueMapValue(name="pizzaLinkCheckbox")
    @Inject
    protected Boolean pizzaLinkCheckbox;
        
    @ValueMapValue(name="pizzaImgReference")
    @Inject
    protected String pizzaImgReference;
}
```

- XML Dialog:
```xml
<awsModelList
        jcr:primaryType="nt:unstructured"
        sling:resourceType="granite/ui/components/coral/foundation/form/multifield"
        fieldLabel="awsModel"
        composite="{Boolean}true">
    <field jcr:primaryType="nt:unstructured"
           sling:resourceType="granite/ui/components/coral/foundation/container"
           name="./awsModel">
        <items jcr:primaryType="nt:unstructured">
            <title
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                    fieldLabel="title"
                    name="./title"/>
            <text
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/form/textarea"
                    fieldLabel="text"
                    name="./text"/>
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
            <pizzaImg
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="cq/gui/components/authoring/dialog/fileupload"
                    autoStart="{Boolean}false"
                    class="cq-droptarget"
                    fieldLabel="Image"
                    fileNameParameter="./pizzaImgName"
                    fileReferenceParameter="./pizzaImgReference"
                    mimeTypes="[image/gif,image/jpeg,image/png,image/tiff,image/svg+xml]"
                    multiple="{Boolean}false"
                    name="./pizzaImg"
                    title="Image"
                    uploadUrl="${suffix.path}"
                    useHTML5="{Boolean}true"/>
        </items>
    </field>
</awsModelList>
```