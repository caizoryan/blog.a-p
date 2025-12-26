import fs from 'fs'
import markdownIt from "./markdown-it/markdown-it.js";
import { iframescript } from "./iframify.js"

let md = new markdownIt('commonmark')//.use(makrdownItMark);

let attrs = (item) => {
	let attrs = item.attrs;
	if (!attrs) return {};
	return Object.fromEntries(attrs);
};

let attrsToString = at => 
				Object.entries(at)
					.map(([key, value]) => `${key} = "${value}"`)
					.join(" ");

let beforeElementHooks = []
let hookMap = {}

let setHookFor = (path, hook) =>{
	if (!Array.isArray(path)) path = [path]

	path.forEach(path => {
		hookMap[path]
			? hookMap[path].push(hook)
			: hookMap[path] = [hook]
		})
}

function eat(tree) {
	let ret = [];
	if (!tree) return "";
	while (tree.length > 0) {
		let item = tree.shift();
		if (item.nesting === 1) {
			let at = attrs(item);
			let ignore = false;

			if (at.href) {
				// check if href is md
				let href = at.href
				let split = href.split('.')
				let ext = split.pop()
				if (ext == 'md') at.href = split.join('.') + '.html'
				if (ext == 'js.html') at.href = split.join('.') + '.html'
			}

			let at_string = attrsToString(at)

			if (!ignore) {
				let children =  eat(tree);
				children = Array.isArray(children) ? children.join("") : children;
				let done = false
				for (let i = 0; i < beforeElementHooks.length; i++) {
					if (done) continue
					if (beforeElementHooks[i].condition(item, children)) {
						let el = beforeElementHooks[i].element(item, children)
						ret.push(el)
						done = true
					}
				}

				if (!done) ret.push(`<${item.tag}${at_string ? " " + at_string : ''}> ${children} </${item.tag}>`);

			}
		}

		if (item.nesting === 0) {
			if (!item.children || item.children.length === 0) {
				let p = item.type === "softbreak"
					? "<br></br>"
					: item.type === "fence"
						? codeblock(item)
						: item.content;
				ret.push(p);
			} else {
				let children =  eat(item.children);
				children = Array.isArray(children) ? children.join("") : children;
				ret.push(children);
			}
		}

		if (item.nesting === -1) break;
	}
	return ret;
}

setHookFor(['index.md',"pages/wrapping_2025.md",], {
	condition: (item, child) => {
		return item.tag == 'p' && child.split(" ")[0] == 'insert:'
	},
	element: (item, child) => {
		let removed = child.replace("insert: ", "")
		return `<${item.tag} class='insert'> ${removed} </${item.tag}>`
	}
})

setHookFor("pages/wrapping_2025.md", {
	condition: (item, child) => {
		return item.tag == 'p' && child.split(" ")[0] == 'date:'
	},
	element: (item, child) => {
		let removed = child.replace("date: ", "")
		return `<${item.tag} class='date'> ${removed} </${item.tag}>`
	}
})

setHookFor("pages/wrapping_2025.md", {
	condition: (item, child) =>{
		if (item.tag == 'a' && attrs(item).href?.includes('feed.a-p.space')) return true
		else false
	},
	element: (item, child) => `
<${item.tag} class='feed-link' ${attrsToString(attrs(item))}>
<span>(FEED)</span>&nbsp;${child}
</${item.tag}>`
})


let codeblock = (item) => {
	if (item.info == 'js-run') return `<div class='two-col codeblock'>
		<textarea>${item.content}</textarea>
		<iframe srcdoc='${iframescript(item.content)}'></iframe>
		<button>run</button>
	</div>`

	else return `<pre>${item.content}</pre>`
}

let safe_parse = (content) => {
	try {
		return md.parse(content, { html: true });
	} catch (e) {
		return undefined;
	}
};

const MD =  (content) => {
	let tree, body;
	tree = safe_parse(content);

	if (tree) body =  eat(tree);
	else body = content;

	return body;
};

let html = body => `
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="/styles/style.css">
</head> 
<body>
	${body}
</body>
<script type='module' src='script.js'></script>
`
let transform =  (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content =  MD(file);
	let split = path.split('.')
	let ext = split.pop()
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content.join("\n")))
}

let transformjs =  (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content = `<pre>${file.replaceAll("<", "&lt;")}</pre>`;
	let split = path.split('.')
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content))
}

let files = fs.readdirSync('./', { recursive: true })
files.forEach(path => {
	if (path.includes('.git')) return
	// emacs pain...
	if (path.includes('#')) return
	if (path.includes('markdown-it')) return

	if (hookMap[path]){hookMap[path].forEach(e => beforeElementHooks.push(e))}

	let split = path.split('.')
	let ext = split.pop()
	if (ext == 'md') transform(path)
	if (ext == 'js') transformjs(path)

	beforeElementHooks = []

	console.log(path)
})
