# Experiences of Building Programming Environments

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


