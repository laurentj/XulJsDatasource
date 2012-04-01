

# jsDatasource 1.0

jsDatasource is an XPCOM component for any XUL applications. It can be useful
for extensions for Firefox or any other Mozilla-based applications, or XulRunner
based application.

XUL templates allow to generate XUL elements from a list of data. With it, you
can fill a listbox for example.

See [the template guide on MDC](https://developer.mozilla.org/en/XUL/Template_Guide)
to know more about it.


Natively, the XUL template engine can retrieve data coming from a RDF content,
an XML file, or a SQLite database. It can also retrieve from other kind of
datasources, if you provide a component implementing this datasource (called a
Query Processor).

jsDatasource is a Query Processor. It allows you to use javascript objects as
datasource for your XUL Templates.


For example, you may have this data:

    var jsdata = [
        {name:'something'},
        {name:'hello'},
        {name:'world'},
    ];

You notice that the variable is an array containing JS objects. It may be also an
nsIEnumerator object or an nsIArray object.


You can then use this array as a datasource for your XUL Template:

    <vbox id="root" datasources="javascript:jsdata" querytype="javascript"
        ref="." idprefix="">
        <template>
            <query idproperty="" filterfunc="" iteminterface=""/>
            <action>
                <button uri="?" label="?name"/>
            </action>
        </template>
    </vbox>

## SECURITY WARNING

-----------------------------------------------------------------------------------------
**WARNING**: DON'T USE IT WITH UNTRUSTED DATA, COMING FROM A WEB SERVICE OR FROM THE USER.
YOU COULD HAVE SECURITY ISSUES!!
-----------------------------------------------------------------------------------------
If you retrieve for example js objects from an unprivileged script, or if you "eval" some source code
from a web service (you MUST NOT do this kind of code anyway), objects could implement getters that
do unsafe things during the content generation...

If you want to use external data, retrieve them in JSON format for example, and use the JSON
object to parse data.

## Licence

This component is released under an opensource licence : Mozilla Public Licence.


## features

This datasource provider supports:

- sorting
- filters
- recursion


## installation

The component should work at least for Firefox 3.6/Gecko 1.9.2 and higher. 

Copy the jsDatasource.js file into the components/ directory of your extension or
your xul application.

If your project targets only Firefox 3.6/Gecko 1.9.2 and lower, installation is finished.

If your project targets Firefox 4/Gecko 2.0 and higher, you should add these lines
into your chrome.manifest file:

      component {EA696B77-AF80-4063-89AD-4985B14D0EBC} components/jsDatasource.js
      contract @mozilla.org/xul/xul-query-processor;1?name=javascript {EA696B77-AF80-4063-89AD-4985B14D0EBC}

## basic use

On the root element of your template:
- Indicate in the **datasources** attribute "javascript:" followed by the name
of the javascript variable name, containing the data. You can indicate a
property of an object: "javascript:myobject.jsdata"
- The **querytype** attribute should be equal to "javascript".

And that's all. The javascript variable should be a Javascript array (or a js
iterator/generator). This array should contains javascript objects as item. In
your template, indicate where to put values of items properties, with the usual
syntax: "?propertyname".

Note: even if the ref attribute is not used by jsDatasource, you must set it on
the root element, with a random value, typically `ref="."`. Else content won't be
generated.

Example:

    <vbox id="root" datasources="javascript:jsdata" querytype="javascript" ref=".">
        <template>
            <query/>
            <action>
                <button uri="?" label="?name"/>
            </action>
        </template>
    </vbox>

## id of generated elements

Like other datasources providers (sqlite, xml, rdf), jsDatasource create an id
attribute on generated elements. By default, the value of this attribute is an
UUID number.

If the root element have an id, generated elements will have this id as prefix
and a counter value as suffix. With the previous example, generated buttons are:

    <vbox id="root" ...>
        <template> ...</template>
        <button id="root:1" label="something"/>
        <button id="root:2" label="hello"/>
        <button id="root:3" label="world"/>
    </vbox>

You can indicate to use the value of a property of objects. On the `<query>`
element, indicate the property name in the  **idproperty** attribute. 

If this property contain only numbers, it's better to have real name (for
`document.getElementById`, etc..). In this case, you can indicate a prefix to
add to the value, in the **idprefix** attribute on the root element of the template.

For example:

    <vbox id="root" datasources="javascript:jsdata" querytype="javascript"
        ref="." idprefix="btn-">
        <template>
            <query idproperty="?name"/>
            <action>
                <button uri="?" label="?name"/>
            </action>
        </template>
    </vbox>

The result will be:

    <vbox id="root" ...>
        <template> ...</template>
        <button id="btn-something" label="something"/>
        <button id="btn-hello" label="hello"/>
        <button id="btn-world" label="world"/>
    </vbox>


# Sorting

The XUL template engine can sort results before using it to generate the content.

[As usual](https://developer.mozilla.org/en/XUL/Template_Guide/Sorting_Results),
use the **sort** and **sortDirection** attributes:

- **sort** to indicate the property on which the sort is applying. Ex: `sort="?name"`
- **sortDirection** to indicate the direction, "ascending" or "descending"

You can indicate also the type of data, with the **sortType** attribute, specific
to jsDatasource. Possible values are "int", "float" or "string" (default).


## data from an nsISimpleEnumerator or nsIArray object

Instead of using a javascript array,you can use an nsISimpleEnumerator or nsIArray
object.

Since these kind of objects contain necessarly XPCom objects, jsDatasource should
know the interface to query on these items.

You must indicate the interface with the **iteminterface** attribute on the `<query>`
element.

    <query iteminterface="nsIURI">
    <action>
        <hbox uri="?">
            <label value="?host" />
            <label value="?port" />
            <label value="?path" />
        </hbox>
    </action>

It items have no interface, and are only javascript objects with a **wrappedJSObject**
property, indicate **wrappedJSObject**  in **iteminterface**.


## filtering results

You may provide a function which will filter results. Indicate its name into the
**filterfunc** attribute on `<query>`. This function is the same kind of function as
callback for Array.filter(). It should accepts 4 arguments:

1. the object containing results (null if the datasource is not an Array object)
2. the current value
3. the current index
4. the Array object (null if the datasource is not an Array object) 

## recursion

Your data may have some properties which contain themselves array of data, and you may want
to iterate over them.

To activate recursion, just indicate the property name into the **uri** attribute.

Example:

here is some data, with a "subcat" property containing other data.

    var datatest2 = [
        {id:1, title:'aaaa'},
        {id:3, title:'ccc', subcat:[
            {id:6, title:'ccc1'},
            {id:8, title:'ccc3'},
            {id:7, title:'ccc2', subcat:[
                {id:10, title:'ccc22'},
                {id:9, title:'ccc21'},
                ]},
            ]},
        {id:5, title:'eee'},
        {id:4, title:'ddd', subcat:[
            {id:12, title:'ddd2'},
            {id:11, title:'ddd1'},
            ]},
        {id:2, title:'bbb', subcat:[]},
    ]

You may want display this data into a tree:

    <tree id="test" datasources="javascript:datatest2"
               querytype="javascript" ref="." idprefix="item-">
        <treecols>
            <treecol id="tree-name" label="Name" flex="1" primary="true"/>
        </treecols>
        <template>
            <query idproperty="id" />
            <action>
                <treechildren>
                    <treeitem uri="?subcat">
                        <treerow>
                            <treecell label="?title"/>
                        </treerow>
                    </treeitem>
                </treechildren>
            </action>
        </template>
    </tree>

Remember that the uri attribute should be on the element that will be the "start" element
for the recursion.
