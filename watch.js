import fs from "fs"
import cp from "child_process"

let files = [
	'./compile.js',
	'./index.md',
	'./pages/building_programming_environments.md',
	'./pages/publication_tools/categorically.md',
	'./pages/publication_tools/chronological.md'
]

let run = () => {
	console.log("File changed, running ./compile.js")
	cp.fork("./compile.js")
}

console.log("Started process, watching", files)

files.forEach(e => fs.watchFile(e, run))
