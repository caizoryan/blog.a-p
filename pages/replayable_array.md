
### Replayable Arrays
So what is this replayable array?

> clean this up, rephrase for clarity and add some diagrams.
Essentially what we want is that all mutations on the array should happen through an intermediary. The benefit this provides us is that all mutations to the array can then be tracked. And for each mutation we can create an opposite function that will just undo the change. And with that we can use these mutations, or transactions to create trees.

[see trees in affinity software]()

... or 

[git trees]()

These arrays are also going to be nested arrays so locations have to be a list of indexes.

```
arr.location([0,0,1]).push(["hello", 'world'])
```


And if we can construct such trees, then we can record and replay it. Sort of like macros.

So what does this look like from a usage pov

[see solid stores]()
Solid store is a nice example. 

Something like this Maybe: 
```
// location
arr.apply([0,0,1]), "push", ["hello", 'world'])
```

[also look at prosemirror transactions](https://prosemirror.net/docs/guide/#transform)

I can also go this route, which can be interesting. In this case state can be used to make a transaction object. This transaction object copies the data. Then you can apply transactions on it that you can record and also hold the data with the transactions applied. And each single mutation is a 'Step'. Steps can be reversible.
```js
// in this case its more lke 
let tr = new Transform(myDoc)
tr.delete(5, 7) // Delete between position 5 and 7
tr.split(5)     // Split the parent node at position 5
console.log(tr.doc.toString()) // The modified document
console.log(tr.steps.length) // 2
```

Also an problem I didn't think of...

Prosemirror mapping, for their implementation its strings. So this problem is more apparent. But still if I wanna do some batchy updates this might be useful to think about.

Excerpt: We often do need to preserve positions across document changes, for example the selection boundaries. To help with this, steps can give you a map that can convert between positions in the document before and after applying the step.

```
let step = new ReplaceStep(4, 6, Slice.empty) // Delete 4-5
let map = step.getMap()
console.log(map.map(8)) // → 6
console.log(map.map(2)) // → 2 (nothing changes before the change)
```

This also made me think of are.na block position stuff. Before I was always vary of changing block position stuff, cause when you move things then order is changed, and syncing all the blocks for each update is expensive. It's very trivial to figure it out but just reminded me, it's the same sort of problem.

But then I also wonder, this replayable array, or trackable array would be useful to make an Are.na editor where I can make changes offline and they can be a series of changes which can the be synced later. Because I'm tracking all changes and actions it would be pretty easy to make it sync.

You can implement a constrained Replayable that would work the way you would with the are.na api. then the 'steps' can be readily translated.

