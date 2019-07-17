<p style='display:block; text-align: center; font-size: 0.5rem'>LAST EDITED: 23/02/2019</p>

# React.js Guidelines

## Implementing a component in React
Before you begin, remember: *only one class declaration per file*, make use of import/export functionality.

1) Always import React before declaring any new component

```javascript
import React, { Component } from "react";
```

(When you import `React, { Component }` it means that React.Component is stored in a variable named `Component`)

2) Remember to export as default the class you are declaring

```javascript
export default class ...
```

3) The declared class **MUST** extend *Component* (case-sensitive):

```javascript
export default class App extends Component

```

4) The class **MUST** have a *render()* method declared:

```javascript
export default class App extends Component
	render() {
```

5) The render() method MUST return a React component (HTML tags):

```javascript
export default class App extends Component
	render() {
		return (
			<div>
				<h1>This is our new app!</h1>
				<header className='header'>
					<a href="/">Feed</a>
					<a href="/profile">Profile</a>
					<a href="/about">About</a>
				</header>
				<div className='content'>

				</div>
			</div>
		);
	}
}
```

## File Hierarchy
The src folder will be organised in a similar fashion:

```
src
├── App
│   └── index.js
├── Component1
│   └── index.js
├── Component2
│   └── index.js
├── index.js
└── stylesheets
    └── style.sass
```

`index.js` at the root of the src folder is going to be responsible for initialising our React application, please avoid touching it unless you have been told and you know what you're doing.

`App` will hold the main React component of our application.

When working with components, you might want use a sub-component within a React component, this process can be good to partition the code and make it easily traversable.



### Setting up a single-use component

If it's reasonable that the sub-component that you need will only be used in a specific component, you should do the following:

1. Create a new javascript file in the current component's folder. `src/Component1/idk.js`
2. Follow the process as described in **Implementing a component in React** in this guide.
3. Import the newly created Component in `Component1`:
	```
		import Component3 from './idk.js';
	```

### Setting up a new independent/reusable component

When you want to implement a new subcomponent, for instance `Component3` to be used in `Component2`, you'll need to:

1. Create a new folder in `src` named `Component3`: `src/Component3`
2. Create a new file inside `src/Component3` named `index.js`
3. Follow the process as described in **Implementing a component in React** in this guide.
4. Import the newly created Component in `Component2`:
	```
		import Component3 from '../Component3';
	```
5. Use the Component3 in your Component2 as you normally would `<Component3 prop1={'a'}/>`

```
src
├── App
│   └── index.js
├── Component1
│   └── index.js
├── Component2
│   └── index.js
├── Component2
│   └── index.j3
├── index.js
└── stylesheets
    └── style.sass
```

## Disclaimer
This guidelines file is a work in progress and might change at any time without prior notice. In case of any further doubts please contact the author.


<p style='display:block; text-align: right; font-size: 0.5rem'>AUTHOR: <b>ALESSANDRO ROMANELLI</b></p>
