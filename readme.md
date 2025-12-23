# What is this?
This is going to be a repository to publish our research and resources. It is for ourselves to look back to as reference as well as anyone who could benefit from it.


# Directory structure

```
compile.js - compiler
index.md   - main page

styles     - use for styles
|-- style.css

pages
|-- applications
    |-- research.if-m.md
|-- technoligies
    |-- static-site-generators.md
```

``` compile.js ``` will go through all files in the dir. If it is a markdown file, tranform to a HTML file. If it is a JS file, also transform into a HTML file and make comment blocks to be markdown. This is how the directory should look like after being transformed.

```
compile.js - compiler
compile.js.html 

index.md   - main page
index.html

styles     - use for styles
|-- style.css

pages
|-- applications
    |-- research.if-m.md
    |-- research.if-m.html
|-- technoligies
    |-- static-site-generators.md
    |-- static-site-generators.html

```

When transforming MD to HTML also make sure to change all ```.md``` refs to ```.html``` refs.

A JS file that looks like this: 

```
// # Title: Can be whatever
// Here is a console.log
console.log("Dawg")
// [link](research.if-m.works)
```

should transform to this html

```
<h1>Title: Can be whatever</h1>
<p>Here is a console.log</p>
<code>
  console.log("Dawg")
</code>
<a href='research.if-m.works'>link</a>
```

# Spec for this website
Let's begin with what is required.

### Pages
- An index page. (with about and all pages listed)
- Pages for categories
  - Technologies: Reactivity, DOM, Lisp, Are.na API, sqlite
  - Applications: How technologies are used: [Are.na API + sqlite] = Are.na Offline
- Playground: Import files from the repository, edit in codemirror and test out in an iframe. 

### SSG Structure
- Pages can be written in MD files. 
- Assets such as other JS files, CSS, images all can be relative to this MD file. 
- Perhaps a Lib folder where all importables can be.
- A site generator script can read all MD files, and transform them to html. 
- Code blocks in MD files will be turned into codemirror instances. 
  - If the code block has attribute that allows it to be runnable it can be run in an iframe beside the block. Else it's just a codeblock.

# Good References
> Good References of publishing code

[Parinfer](https://shaunlebron.github.io/parinfer/)

The gifs/visualisations are super helpful in order to understand the concepts and stuf. Outline helps with navigation and giving an understanding of where you are in the document. The typing animation is pretty fun too, + its an interactive demo...

[p5.js](https://p5js.org/tutorials/repeating-with-loops/)

Live edit and run. I like when there's specific examples that you can edit and re-run. I think you learn best when you see what happens when you change values. Also distinguishes runnable vs not runnable code by not having a play button. Runnable code runs by default, it can be rerun once you change stuff.
