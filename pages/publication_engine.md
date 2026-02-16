# Publication Engine

> I literally cannot think of a good name.

Here is an outline of my ongoing thesis project where I've been exploring the technical aspects of the typographical stack. + Investigating different ways of producing publication through writing programs.

This project started in about March of 2025. Although I would say I'd been experimenting with some of these concepts since my second year at OCAD U specifically Anthony Campea's TYPE 3 (2023). For which I made this p5 based typesetting tool that gave words weight depending on their word length.

[IMAGE](https://www.are.na/block/40525391)

caption: Words weight depending on their word length 


### Getting things off the ground

Anyways. The project really started in its current form in March 2025 when I was doing an Independent Study with Roderick. I started off with writing an implementation for basic typesetting, with the idea that later I can intervene in this process and use it in interesting ways.

[IMAGE](https://www.are.na/block/35440196)

Plus(+) also linked text boxes so words that overflow from one can go into the next.

[IMAGE](https://www.are.na/block/35462595)

caption: First implementation of linked text boxes.

Eventually I also added hyphenation (can see below marked by red text), a simple column based grid and the ability to collect spreads together into a 'Book'. 

[IMAGE](https://www.are.na/block/35931770)

At this point I was also heavily using Javascript classes to model all of this elements. I later revised them to be functions, which I will talk aboutlater.

[VIDEO](https://www.are.na/block/35931897)

Another thing that isn't visible in the screen grabs is the management of DPI and Units. Essentially, I wanted to use typographic units, such as ems, picas, points and inches. And these units also need to correspond to the paper sizing. Plus, I was doing all of this in p5, which meant everything was raster, so it didn't print great unless you upscaled it to have about 300DPI which wouldn't fit on the screen and be really expensive and slow to draw. 

Anyways, to circumvent all of this, I thought I should have a Scale object, which would have helper functions that would provide pixel values for any given DPI. Given that all elements use this Scale for positioning and sizing, everything would stay in proportion. Then it can be designed at a lower DPI and exported at a higher one.

### Imposition

Once I had basic text formatting and layout down + a grid system to locate and position the items onto a page, a data structure/interface to save data and easily express these elements and a Scale that manages sizing for different DPIs I was almost done. The only thing left to figure out was imposition.

How do I turn 2D surfaces ~> Spreads into printable sheets that can be bound as a booklet.

[IMAGE](https://www.are.na/block/43641321)

This took some time to figure out.

[VIDEO](https://www.are.na/block/43641418)

I had to simulate this process by moving pieces of paper around or drawing and making arrows to slowly understand what the pattern was. Once I did that a few times I was able to write some helper functions that given an array of page numbers: 

```js
let pages = [[0,1], [2, 3], [4, 5], [6, 7], [8, 9], [10,11], [12, 0]]
```

Would return imposed pages like this

```js
let imposed = imposePages(pages)
// imposed = [[12, 1], [2, 11], [4, 9], [6, 7], [8,5],  [10, 3]]
```

I had a lot of fun figuring this imposition stuff out. Because it was a very tactile experience with programming and algorithms. And just how these numbers come together on paper to form that booklet is just so satisfying, and being able to undestand it through numbers in such an abstract sense is quite fun!

[IMAGE](https://www.are.na/block/43641318)

### Vertical Offsets

With imposition figured out, I had all the first principles that are (probably) necessary for a publication software down. 

It was time to intervene!

Naturally, since I had just spend so much time trying to figure out imposition, that's where I ended up intervening. 

[VIDEO](https://www.are.na/block/36148752)
[VIDEO](https://www.are.na/block/36148763)

So the first idea I had was, to take sheets and offset them by some amount vertically. This is the finaly booklet that I submitted for my ISP and its interface counterpart.

[VIDEO](https://www.are.na/block/38994296)
[VIDEO](https://www.are.na/block/36378554)

### Horizontal Offsets

Over the summer I had the chance to work on a menu design for a restaurant. So I took this opportunity to explore what horizontal offsets would look like (in terms of implementation). 

The horizontal offsets were a little harder to implement. Because offsetting a sheet will change the dimensions of the spreads it is a part of. So managing that was a hassle. But eventually I was able to figure it out [^geometry].

[^geometry]: I was having fun doing all this math cause it was just geometry which I think just works very well with Graphic Design. And also some basic arithmetics and algebra.

[VIDEO](https://www.are.na/block/40566557)

Overall I also didn't have as much trouble as I thought with sizing and printing upscaled raster type. And somehow everything worked out pretty well. 

The production was much more intensive though. Since unlike trimming regular publications -- where you can trim all the pages together after theyre bound -- with this menu I had to trim them all before binding and correctly bind them together with the offsets. 
[IMAGE](https://www.are.na/block/43658899)
[VIDEO](https://www.are.na/block/43658913)

<!-- caption: My brother took this video -->

This is how the final thing came out to be: 

[IMAGE](https://www.are.na/block/40957412)
[IMAGE](https://www.are.na/block/40957411)
[IMAGE](https://www.are.na/block/40957414)

### Technical Detour

> If you're not interested in this feel free to skip to [The Next Section](#interface)

Up until this point, I didn't have a graphical interface. Whatever I was making, I was hardcoding it into a Javascript file. 


### <span id="interface">Interface</span>

Even though the grid positioning was helpful, I still needed some form of a graphical interface, not only because it would be more intuitive, but that gives me more opportunities to think about interface in interesting ways [^2]. 



[^2]: Interface has been a tangential exploration and a project in itself. However I'm not sure if I would or should present it alongside this project as another part of it, or just have it as something else entirely.





