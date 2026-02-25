import fs from "fs"
import cp from "child_process"

let watching = './pages/publication_tools/chronological.md'

let run = () => {
	console.log("File changed, running ./compile.js")
	cp.fork("./compile.js")
}

console.log("Started process, watching", watching)
fs.watchFile(watching, run)
