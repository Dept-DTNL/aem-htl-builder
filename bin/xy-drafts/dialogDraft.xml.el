<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0" xmlns:cq="http://www.day.com/jcr/cq/1.0" xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:granite="http://www.adobe.com/jcr/granite/1.0"
          jcr:primaryType="nt:unstructured"
          jcr:title="<%= dialogTitle %>"
          sling:resourceType="cq/gui/components/authoring/dialog">
    <items jcr:primaryType="cq:TabPanel">
        <items jcr:primaryType="cq:WidgetCollection">
            <title
                    jcr:primaryType="cq:Widget"
                    fieldLabel="Title"
                    name="./title"
                    xtype="textfield"
                    value="<%= title %>"/>
            <message
                    jcr:primaryType="cq:Widget"
                    fieldLabel="Message"
                    name="./message"
                    xtype="textarea"
                    value="<%= message %>"/>
            <list
                    jcr:primaryType="cq:Widget"
                    fieldLabel="List"
                    name="./list"
                    xtype="multifield">
                <field jcr:primaryType="nt:unstructured"
                        emptyText="Items"
                        name="./itemsList">
                    <% lists.forEach(function(item) { %>
                        <items jcr:primaryType="nt:unstructured">
                            <itemLabel
                                    jcr:primaryType="cq:Widget"
                                    fieldLabel="Title"
                                    name="./itemLabel"
                                    xtype="textfield"
                                    value="<%= item.itemLabel%>"/>
                            <itemStyle
                                    jcr:primaryType="cq:Widget"
                                    fieldLabel="Style"
                                    name="./itemStyle"
                                    xtype="textfield"
                                    value="<%= item.itemStyle%>"/>
                        </items>
                    <% }); %>
                </field>
            </list>
        </items>
    </items>

</jcr:root>
