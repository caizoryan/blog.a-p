# BLOG A-P

What is this: [take a look at the readme](./readme.md)


### Here is a codeblock
this code block runs if it is tagged with js-run
```js-run

import {test} from "./test.js"
document.body.style.backgroundColor = 'red'
document.body.innerHTML = test
console.log("running")
```


### Add support for hooks.

So there should be a hook when creating an element. For instance there can be a beforeElement hook, that will take in the tag, attr and children. 

```
# Hello world
this is a p
;funky this is also a p

```

if there is a hook that says, if p first word is ;funky change style to be xyz. 

The hook can be added by creating a condition fn and a return fn. If the cond returns true, then will use given fn to create el. Otherwise continue.

;funky lets see...
