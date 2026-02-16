# Publication Engine

> I literally cannot think of a good name.

Here is an outline of my ongoing thesis project where I've been exploring the technical aspects of the typographical stack. + Investigating different ways of producing publication through writing programs.

This project started in about March of 2025. Although I would say I'd been experimenting with some of these concepts since my second year at OCAD U specifically Anthony Campea's TYPE 3 (2023) [^1]. For which I made this p5 based typesetting tool that gave words weight depending on their word length.

### Getting things off the ground

Anyways. The project really started in its current form in March 2025 when I was doing an Independent Study with Roderick. I started off with writing an implementation for basic typesetting, with the idea that later I can intervene in this process and use it in interesting ways.

[IMAGE](https://www.are.na/block/35440196)

+ also linked text boxes so words that overflow from one can go into the next.

[IMAGE](https://www.are.na/block/35462595)

caption: First implementation of linked text boxes.

Eventually I also added hyphenation (can see below marked by red text), a simple column based grid and the ability to collect spreads together into a 'Book'. 

[IMAGE](https://www.are.na/block/35931770)

At this point I was also heavily using Javascript classes to model all of this elements. I later revised them to be functions, which I will talk aboutlater.

[VIDEO](https://www.are.na/block/35931897)

[^1]: Words weight depending on their word length [IMAGE](https://www.are.na/block/40525391)
