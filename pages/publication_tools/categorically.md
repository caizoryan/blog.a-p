# Publication Engine (process)

> SORRY THIS IS WORK IN PROGRESS!

## Letter (but also words)

### Folded letters

[IMAGE](https://www.are.na/block/43885970)

caption: Folded into a letter form

Once the points are entered into the program, it can generate the letterform.

[IMAGE](https://www.are.na/block/43885966)

And from here, this form can be iterated on by changing the parameters. For instance if we change the width of the sheet in the program while keeping the points the same, because with sheet is thinner, the angles of the foldlines change, causing the form to deviate. 

[IMAGE](https://www.are.na/block/43886001)

[VIDEO](https://www.are.na/block/43923862)

### Physarium based lettering

I wanted to play around with this stuff:

[LINK](https://www.are.na/block/43733333)

So I implemented a basic low res version for it

[VIDEO](https://www.are.na/block/43733431)

Made it so it renders ascii chars instead of circles

[VIDEO](https://www.are.na/block/43733433)

Then constrained it into the walls of a letterform. The sad part now is that the organic forms that the physarium produces is completely hidden now since it doesn't have the room to move...

But the motion is pretty interesting and organic.

So I just iterated a bunch on this

[VIDEO](https://www.are.na/block/43733430)

[VIDEO](https://www.are.na/block/43733432)

And I think this form looks awesome!

Going to turn this into a screen print :)

## Paragraph

Anyways. The project really started in its current form in March 2025 when I was doing an Independent Study with Roderick. I started off with writing an implementation for basic typesetting, with the idea that later I can intervene in this process and use it in interesting ways.

[IMAGE](https://www.are.na/block/35440196)

Plus(+) also linked text boxes so words that overflow from one can go into the next.

[IMAGE](https://www.are.na/block/35462595)

caption: First implementation of linked text boxes.

Eventually I also added hyphenation (can see below marked by red text), a simple column based grid and the ability to collect spreads together into a 'Book'. 

[IMAGE](https://www.are.na/block/35931770)


[IMAGE](https://www.are.na/block/40525391)
[IMAGE](https://www.are.na/block/40525392)

caption: Words weight depending on their word length 


As an explanatory exercise of the process behind setting a paragraph I made a book that shows the process underneath (for a left-aligned paragraph).

[VIDEO](https://www.are.na/block/43923888)

This got compiled, imposed into signatures and printed and bound into a book. Going forward I think this is an an interesting presentation for step-wise program execution. I can see conditional typesetting logic being expressed aptly here.

[IMAGE](https://www.are.na/block/43922598)

<div class="two-col">

 [IMAGE](https://www.are.na/block/43898372)

 [IMAGE](https://www.are.na/block/43898373)

</div> 

Played around with baseline shifts and conditional styling (see below).

[IMAGE](https://www.are.na/block/43922874)

caption: Craig's annotational feedback. Since the tool didn't support PDF exports yet, "PDF" was sent as an mp4


## Structure

This section is sort of murky cuz all work would fall into here, but none of the work really explains this.

[IMAGE](https://www.are.na/block/43937649)

## Impostion

This guy: 

[VIDEO](https://www.are.na/block/40570288)

and:

[IMAGE](https://www.are.na/block/43937725)

[IMAGE](https://www.are.na/block/43937724)

[IMAGE](https://www.are.na/block/43937723)

[IMAGE](https://www.are.na/block/40957412)

[IMAGE](https://www.are.na/block/40957411)

<div class="two-col">

 [VIDEO](https://www.are.na/block/38994296)

 [VIDEO](https://www.are.na/block/36378554)

</div>

<div class="two-col">

 [IMAGE](https://www.are.na/block/43898394)

 [IMAGE](https://www.are.na/block/43898393)

</div> 


## Interface

[VIDEO](https://www.are.na/block/41015241)

#### Loops
[VIDEO](https://www.are.na/block/41101627)


However I still wanted to keep the constraint of not having elements draggable on the canvas itself. I wanted to maintain the dataness of the elements on the screen. What I mean to say is, _I want the elements to be a result of data_ rather than the elements being able to control the data (moving them mutates their x and y positions).

[IMAGE](https://www.are.na/block/42926965)

caption: Initial sketch for how I could incorporate mouse controlled elements to this existing UI.

[VIDEO](https://www.are.na/block/43668419)

caption: First implementation for this.

I kept going back to the UI's of Max MSP, Pure Data, Grasshoper or even Touch Designer. Eventually I decided to turn the whole structure into a node based canvas UI.

[IMAGE](https://www.are.na/block/42926964)

caption: Initial sketch

[VIDEO](https://www.are.na/block/42924978)

[VIDEO](https://www.are.na/block/43857838)

