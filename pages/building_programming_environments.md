# Experiences of Building Programming Environments 

WIP: WORK IN PROGRESS (!)

> Ruminating on experiences I've had building programming environments and quirks of practicing programming as a graphic designer.

Before I start, to quickly define what I mean when I say programming environment: Any interface that lets a person (user) manipulate and in some cases run programs. Code editors as well as Visual Programming Langauges (Max MSP, VVVV, Pure Data, etc)

## Intro
I started learning programming in 2022, in my first year at OCAD U as a graphic design undergrad. At school, the approach towards learning and teaching design, especially in 1st year is quite recursive. You're learning about how to do design by doing the thing (producing design artifacts) but simultaneously you're also observing yourself → learn about design → through documentation and reflective writing. The thing being designed is a design process rather than the outcomes. Ways of seeing, and thinking through things (Maybe this is what all "good" education seeks to do).

Practicing programming in an environment such as this naturally made me approach my software practice in a similar way. I often found myself wondering about the way I think, write and make when I sit down to program. 

++ 

as someone learning about typography, and how
-  the organization of text and how that alters the semantics and
- how the graphical treatment of text and its context helps in the way the text is parsed.

made me want to explore the tools I write code with, as graphical instruments. Obviously I make this statement lightly looking back at it after 3 years, but this has been a long process of learning, stumbling, making and producing things. 

## First way around
The first experience I had making a rudimentary programming 

[video](https://www.are.na/block/23725988)


[video](https://www.are.na/block/23727076)


## Editor Editor: Dogfooding / Bootstrapping 

At some point I had this idea for bootsrapping an editor using iframes. A webpage made with a textbox, a button and an iframe. When you click the button, the content from the textbox becomes the src for the iframe. That's the core logic. I also added codemirror so I could have all the awesomeness of using a code editor and actually use this.

And the gimmicky thing with this project was that I could use the editor to edit its own self and then run that file to make the next version of itself!

[CLIP](https://feed.a-p.space/blocks/34402531)

The other big part of this editor was (ui-code) components. A component had a render function and a transformation function that will return the code. The returned code just gets compiled together to form the iframe. This means certain parts of the code can take a shape of ui specific to the shape of the data and state is stored as code.

Here is an example of a tile editor for exploring [wave function collapse](https://robertheaton.com/2018/12/17/wavefunction-collapse-algorithm/).

[CLIP](https://feed.a-p.space/blocks/33857682)

One of the things I'm really proud of from this project is hooking this whole environment to an LSP! This wasn't easy in itself and the file being split into multiple codemirror instances made it even harder.

The main function of the editor is to give you components that add up to the file. So a file is split up into smaller self contained chunks. This works all and good till the tsserver returns a {from, to} position for the diagnostics. 

Each codemirror instance can work with from and to position only relative to its own state and has no way of knowing what had come before or after it. The way I fixed it was adding start property in each blocks state which the parent of the block manages. So everytime you save a file it increments and assigns a start value to each block.

There was also a whole thing about managing a live version of the file seperate than the file that is saved for iframe to update (can't update iframe at every key press, but need autcomplete response at each key press, so have to maintain two versions..)

Anyways, here's a clip of when I first figured it out!

[VIDEO](https://www.are.na/block/34503395)

More details about it here:

[CLIP](https://feed.a-p.space/blocks/34503089)

Eventually this project turned became a canvas editor. The codemirror instances placed onto an infinite canvas to be moved around based on logic of the program or whatever the user pleases.

[VIDEO](https://www.are.na/block/35440277)

This was also the first time I made a contribution to an open source project! I was using the vim extension for codemirror and they hadn't implemented cursor scaling when css transforms change the viewport. I tried my best to implement this and got it to working at 90% "good" (cursor scaling wasn't absolutely accurate) and submitted the PR :) I got feedback... which I didn't know how to implement and the maintainer eventually did it themselves and merged. But regardless, first experience!

And finally, I started my [Publication tools project](./publication_tools/chronological.md) in this environment too!

[CLIP](https://feed.a-p.space/blocks/35440203)

summary: I learned a lot about javascript, module loading, LSPing, working with code editors, managing complex state, canvasing, file management and so much more. I don't know how much the environment was actual useful as a writing environment. It just felt like it wasn't adding too much, it was a fun though, to have total control over your environemnt. But running you editor in the same context as your program is a baddddd idea. Bunch of times, it would happen that I would write a function that crashes, and the tab crashes and so does the editor. Stuff like that was super annoying, so thats definelty a major lesson.

## Reducing the scope

publication design tools as programming environments

While investigating the typographical stack, I was simultaneously also having a tangential explortation -- interface. 

For the most part of the project, I didn't have a graphical interface. Whatever I was making, I was hardcoding it into a Javascript files. Here are some excerpts from how the code is structured underneath, or this is how the programatic interface looked like.

To create the scale, we initalize the class with a DPI

```js
let s = new Scale(150)

// and then use it to get px values
let fourInches = s.inch(4) // 4*150 = 600px
```

This is how the grid structure is defined:

```js
export let grid = new Grid({
	page_width: s.inch(9.5),
	page_height: s.inch(6.5),

	margin: {
		top: s.em(2),
		bottom: s.em(2),
		inside: s.em(1),
		outside: s.em(2),
	},

	columns: 8,
	gutter: s.point(6),
	hanglines: [
		s.em(3),
		s.em(6),
		s.em(9),
		s.em(12),
	],
})
```

And then we can use the grid structure to position a text frame on a page, you could write it as a nested array:

```js
let frame = ["TextFrame",
    ["text", "Text on column 2 on Verso"],
    ["font_family", fonts.ouma],
    ["height", ["em", 12]],
    ["y", ["hangline", 1]],
    ["x", ["verso",  2]],
]
```

Paragraph styles are defined like this

```js
export let paragraphStyles = {
	"+:title": {
		font_weight: 500,
		font_family: "stolzl",
		font_size: s.point(17),
		leading: s.point(21)
	},
	"+:comment": {
		font_weight: 300,
		font_family: "freight-macro-pro",
		font_size: s.point(9),
		leading: s.point(10),
	}
}
```

And can be activated by using them in text like this: 

```js
let frame = ["TextFrame",
    ["text", "+:comment Text on column 2 on Verso"],
    ["y", ["hangline", 1]],
    ["x", ["verso",  2]],
]
```

[IMAGE](https://www.are.na/block/43937649)

### Graphical Interface

Even though the grid positioning makes it much easier to put things on a page, I still needed some form of a graphical interface, not only because it would be more intuitive, but that it also gives me more opportunities to utilise interfaces in interesting ways [^2]. 

[^2]: Interface has been a tangential exploration and a project in itself. However I'm not sure if I would or should present it alongside this project as another part of it, or just have it as something else entirely.

My first attempt at an interface for this tool was for a virtual book that I made. This was my Workshop Proposal for our [Anti-thesis cohort](../antithesis_cohort.md).

[VIDEO](https://www.are.na/block/43667811)

As it is evident, all the interface does is makes the nested Array structure into an html interface. So it doesn't add much other than a shorter feedback loop for positioning items and such. Rather it is a downgrade because now I'm unable to use the affordances I have from programming with this (such as for loops, using variables, etc). 

To overcome this I started adding keywords that would invoke functions. So the nested Array structure turned into a Lisp.

[VIDEO](https://www.are.na/block/43668008)

For instance,

```js
TextFrame({
    text: "hello world",
    x: multiply(Math.random(), inch(4)),
    y: inch(2),
})
```

Could be written as

```js
["TextFrame", "{}",
  ["text", "hello world"],
  ["x", ["mul", "rand", ["inch", 4]]],
  ["y", ["inch", 2]],
]
```

[VIDEO](https://www.are.na/block/43668080)

And then I iterated on this a bunch. At this point I wanted this to be a [scratch](https://scratch.mit.edu/) or [fructure](https://fructure-editor.tumblr.com/) type software.

[VIDEO](https://www.are.na/block/41015241)
[VIDEO](https://www.are.na/block/41014081)

#### Loops
[VIDEO](https://www.are.na/block/41101627)

Initially I was trying to restrict myself from involving the mouse in these interfaces and was wondering if I could find interesting patterns of working with form if I stuck to keyboard only editing. Although I came to the conclusion that this was a foolish idea [^4].

[^4]: why was it a foolish idea?

However I still wanted to keep the constraint of not having elements draggable on the canvas itself. I wanted to maintain the dataness of the elements on the screen. What I mean to say is, _I want the elements to be a result of data_ rather than the elements being able to control the data (moving them mutates their x and y positions).

[IMAGE](https://www.are.na/block/42926965)

caption: Initial sketch for how I could incorporate mouse controlled elements to this existing UI.

[VIDEO](https://www.are.na/block/43668419)

caption: First implementation for this.

After implementing this, I realised that managing the layout with this kind of UI in a static sidebar is going to be a giant pain. It could work decently for small stuff like the above example, but if this composition got complex it would be a pain to navigate.

I kept going back to the UI's of Max MSP, Pure Data, Grasshoper or even Touch Designer. Eventually I decided to turn the whole structure into a node based canvas UI.

[IMAGE](https://www.are.na/block/42926964)

caption: Initial sketch

[VIDEO](https://www.are.na/block/42924978)

caption: First Draft of the UI

This is how it looks currently...

#### Positioning Stuff

[VIDEO](https://www.are.na/block/43857838)

#### Updating text

[VIDEO](https://www.are.na/block/43857835)

Text updates when you change it :)

As it may or may not be evident from the videos, data flows from one node to another, which takes the data it recieves and transforms it in its programmed way and sends it forward. Most imporantly, __It can have any UI to reflect and edit its state.__ This is the primary  PRO of this approach [^pure-functions]. 


[^pure-functions]: I haven't figured out how to articulate this, but In a way its akin to being able to write pure functions. I mean to be fair they are pure functions with some state and UI attached.

summary: Did some basic interfaces and slowly progressed to a node based interface. Currently struggling with making the node based interface intuitive and easy to navigate around.
