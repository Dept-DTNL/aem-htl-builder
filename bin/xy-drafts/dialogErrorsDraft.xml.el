<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0"
          xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0"
          xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="<%= className %>"
          sling:resourceType="cq/gui/components/authoring/dialog">
    <content
            jcr:primaryType="nt:unstructured"
            sling:resourceType="granite/ui/components/coral/foundation/fixedcolumns">
        <items jcr:primaryType="cq:unstructured">
            <column
                    jcr:primaryType="nt:unstructured"
                    sling:resourceType="granite/ui/components/coral/foundation/container">
                <items jcr:primaryType="cq:WidgetCollection">
                    <% fields.forEach((field) =>{ %>
                    <<%= field.name %>
                        jcr:primaryType="cq:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/<%
                        if(field.resourceType === 'textfield'){ %><%= field.resourceType %>"
                        fieldLabel="<%= field.name %>"
                        name="./<%= field.name %>"
                        value="<%= field.name %>"/>
                        <%
                        } else if(field.resourceType === 'checkbox'){ %><%= field.resourceType %>"
                        text="<%= field.name %>"
                        name="./<%= field.name %>"
                        uncheckedValue="false"
                        value="true"/>
                        <%
                        } else if(field.resourceType === 'textarea'){ %><%= field.resourceType %>"
                        fieldLabel="<%= field.name %>"
                        name="./<%= field.name %>"
                        value="<%= field.name %>"/>
                        <%
                        } else{ %>"/><%
                        }%>
                    <% }) %>
                    <% images.forEach(function(img) { %>
                    <<%= img.name %>
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="cq/gui/components/authoring/dialog/fileupload"
                        autoStart="{Boolean}false"
                        class="cq-droptarget"
                        fieldLabel="Image"
                        fileNameParameter="./<%= img.fileName %>"
                        fileReferenceParameter="./<%= img.fileReference %>"
                        mimeTypes="[image/gif,image/jpeg,image/png,image/tiff,image/svg+xml]"
                        multiple="{Boolean}false"
                        name="./<%= img.name %>"
                        title="Image"
                        uploadUrl="${suffix.path}"
                        useHTML5="{Boolean}true"/>
                    <% }); %>
                    <% links.forEach(function(link) { %>
                    <<%= link.checkBox %>
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/foundation/form/checkbox"
                        text="Open link in another tab."
                        name="./<%= link.checkBox %>"
                        value="true"/>
                    <<%= link.name %>
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/pathfield"
                        fieldLabel="<%= link.name %>"
                        name="./<%= link.name %>"
                        required="{Boolean}false"
                        rootPath="/content"/>
                    <% }); %>
                    <% selects.forEach(function(sel) { %>
                    <<%= sel.name %>
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/select"
                        fieldLabel="<%= sel.name %>"
                        name="./<%= sel.name %>">
                        <items jcr:primaryType="nt:unstructured">
                            <% sel.options.forEach((opt) => { %>
                                <<%= opt %>
                                 jcr:primaryType="cq:Widget"
                                 text="<%= opt %>"
                                 value="<%= opt %>"/>
                            <% }) %>
                        </items>
                    </<%= sel.name %>>
                    <% }); %>
                    <% lists.forEach(function(list) { %>
                    <list
                        jcr:primaryType="nt:unstructured"
                        sling:resourceType="granite/ui/components/coral/foundation/form/multifield"
                        fieldLabel="<%= list.ulName %>"
                        composite="{Boolean}true">
                        <field jcr:primaryType="nt:unstructured"
                               sling:resourceType="granite/ui/components/coral/foundation/container"
                               name="./<%= list.ulName + "List" %>">
                            <items jcr:primaryType="nt:unstructured">
                                <% list.liValues.forEach((li) => { %>
                                    <itemLabel
                                            jcr:primaryType="cq:Widget"
                                            fieldLabel="Item label"
                                            name="./label"
                                            sling:resourceType="granite/ui/components/coral/foundation/form/textfield"
                                            value="<%= li %>"/>
                                <% }) %>
                            </items>
                        </field>
                    </list>
                    <% }); %>
                </items>
            </column>
        </items>
    </content>
</jcr:root>
