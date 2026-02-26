import fs from "fs"
import cp from "child_process"

let files = [
	'./pages/publication_tools/chronological.md',
	'./pages/publication_tools/categorically.md'
]

let run = () => {
	console.log("File changed, running ./compile.js")
	cp.fork("./compile.js")
}

console.log("Started process, watching", files)

files.forEach(e => fs.watchFile(e, run))
