<p style='display:block; text-align: center; font-size: 0.5rem'>LAST EDITED: 23/02/2019</p>

# HTML + SASS Guidelines

## Style for a specific page

Each page should be contained within a div that explicitly refers to the contents that will be displayed inside it.

```
<div class='feed'>
	<!-- Feed components -->
</div>
```

Components should not have specific classes referring to the component they are contained within.

####DO: 
```
<div class='feed'>
	<div class='component'></div>
</div>
```

####DONT:
```
<div class='feed'>
	<div class='feed-component'></div>
</div>
```

This allows the div with class `component` to be inherit the style that might be already defined globally.

## Selectors

For the previous example, to write specific style for a component within feed and not other components in other pages we should:

####DO:
```
.feed .component 
	// Rules

```
####DONT:
```
.component 
	// Rules

```

## Nesting

When we need to target a specific component, we should avoid being too detailed as this will create a very strong rule, which is generally harder to override.

```
<div class='feed'>
	<div class='component'>
		<div class='subcomponent'>
			<div class='element'/>
		</div>
	</div>
</div>
```

####DO:
```
.feed .component .subcomponent .element
	// Rules
```

####DONT:
```
.feed 
	.component 
		.subcomponent
			.element
				// Rules
```

**This is important because each indentation level puts stress on the SASS compiler, so avoid pyramidal structures as much as possible!**

## Variables
Do not use explicit values for properties. Explicit values need to be changed everywhere in the code and make the stylesheet hard to edit/maintain. Also, (re-)using variables increases the consistency of the styling.

####DO:
```
(_variables.sass)
$component-radius: 13px

~~~~~~~~~~~~~~~~~~~~~

(_page.sass)
.feed .component
	border-radius: $component-radius
```

####DONT: 

```
(_page.sass)
.feed .component
	border-radius: 13px
```


## Disclaimer
This guidelines file is a work in progress and might change at any time without prior notice. In case of any further doubts please contact the author.


<p style='display:block; text-align: right; font-size: 0.5rem'>AUTHOR: <b>ALESSANDRO ROMANELLI</b></p>
