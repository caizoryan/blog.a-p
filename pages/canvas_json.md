# Are.na Canvas and the open file

> Awesome sauce gang. Tonight we steal the moon!

We're  going to be implementing an Are.na Canvas. So something like a figma or a miro whiteboard, but the content will be Are.na blocks and channels.

[INSERT IMAGE OF whiteborards]()

In the implementation, we're going to use [this spec](https://jsoncanvas.org/spec/1.0/). What is this you ask? It is a spec for a file format for infinite canvas apps. The benefit of using this is that if we make our app import and export this file format; then the file can be used in other apps such as Obsidian or Kinopio. Open file formats facilitate interoperability. You can read a little bit about it [here](https://obsidian.md/blog/json-canvas/) for more details.

- Get a channel's contents.
- check if there is a block title .canvas and if it parses as canvas data.
- parse data and assign all blocks location
- when block moves, update this canvas data
- save button to sync it back

```
nodes: [
  // text block
  {
	id: 0,
	type: 'text',
	text: 'whatevere text block',
	x: 0,
	y: 0,
	width: 0,
	height: 0,
  },
  
  
  // link
  {
	type: 'link',
	url: 'linktourl',
	...
  }

  // everything else
  {
	type: 'link',
	url: 'link to are.na block',
	...
  }
]

```

An obsidian importer for this can transform links to blocks to files that can be linked better or something.

