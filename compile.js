import fs from 'fs'
import markdownIt from "./markdown-it/markdown-it.js";
import markdownItMark from "./markdown-it/markdown-it-mark.js";
import { footnote_plugin } from "./markdown-it/markdown-it-footnote.js"
import { iframescript } from "./iframify.js"
import { minimatch } from "minimatch"
import arena from './extensions/arena.js';

let md = new markdownIt('commonmark').use(footnote_plugin).use(markdownItMark);

export let attrs = (item) => {
	let attrs = item.attrs;
	if (!attrs) return {};
	return Object.fromEntries(attrs);
};

let attrsToString = at =>
	Object.entries(at)
		.map(([key, value]) => `${key} = "${value}"`)
		.join(" ");

let beforeElementHooks = []
let styles = []
let hookMap = {}
let styleMap = {
	"pages/wrapping_2025.md": ['repo.css']
}

let setHookFor = (path, hook) => {
	if (!Array.isArray(path)) path = [path]

	path.forEach(path => {
		hookMap[path]
			? hookMap[path].push(hook)
			: hookMap[path] = [hook]
	})
}

async function eat(tree) {
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
				let children = await eat(tree);
				children = Array.isArray(children) ? children.join("") : children;
				let done = false
				for (let i = 0; i < beforeElementHooks.length; i++) {
					if (done) continue
					let is = await beforeElementHooks[i].condition(item, children)
					if (is) {
						let el = await beforeElementHooks[i].element(item, children)
						ret.push(el)
						done = true
					}
				}

				if (!done) ret.push(`<${item.tag}${at_string ? " " + at_string : ''}> ${children} </${item.tag}>`);
			}
		}

		if (item.nesting === 0) {
			if (!item.children || item.children.length === 0) {
				let p
				if (item.type == 'softbreak') p = "<br></br>"
				else if (item.type == 'footnote_anchor')
					p = `<a id="footnote-anchor-${item.meta.id}" href="#footnote-ref-${item.meta.id}"> back </a>`
				else if (item.type == 'footnote_ref')
					p = `<a href="#footnote-anchor-${item.meta.id}"  id="footnote-ref-${item.meta.id}"> [${item.meta.label}] </a>`
				else if (item.type == 'fence') p = codeblock(item)
				else p = item.content;

				ret.push(p);
			} else {
				let children = await eat(item.children);
				children = Array.isArray(children) ? children.join("") : children;
				ret.push(children);
			}
		}

		if (item.nesting === -1) break;
	}
	return ret;
}

setHookFor(["*", "*/*"], arena)
setHookFor("**/*.md", {
	condition: (item, child) => {
		return item.tag == 'p' && child.split(" ")[0] == 'insert:'
	},
	element: (item, child) => {
		let removed = child.replace("insert: ", "")
		return `<${item.tag} class='insert'> ${removed} </${item.tag}>`
	}
})

setHookFor("**/*.md", {
	condition: (item, child) => {
		return item.tag == 'p' && child.split(" ")[0] == 'caption:'
	},
	element: (item, child) => {
		let removed = child.replace("caption: ", "")
		return `<${item.tag} class='caption'> ${removed} </${item.tag}>`
	}
})

setHookFor("pages/publication_engine.md", {
	condition: (item, child) => {
		if (item.tag == 'a') {
			return false
		}
		else false
	},
	element: (item, child) => {
		let removed = child.replace("date: ", "")
		return `<${item.tag} class='date'> ${removed} </${item.tag}>`
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

setHookFor("**/*.md", {
	condition: (item, child) => {
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

const MD = async (content) => {
	let tree, body;
	tree = safe_parse(content);

	if (tree) body = await eat(tree);
	else body = content;

	return body;
};

let stylesheet = e => "<link rel='stylesheet' href='/styles/" + e + "'>"
let html = (body, styles = []) => `
<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="/styles/style.css">
	${styles.map(stylesheet).join("")}
</head> 
<body>
	${body}
</body>
<script type='module' src='/script.js'></script>
`

export let transform = async content => MD(content)
export let transformmd = async (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content = await transform(file);
	let split = path.split('.')
	let ext = split.pop()
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content.join("\n"), styles))
}
export let transformjs = async (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content = `<pre>${file.replaceAll("<", "&lt;")}</pre>`;
	let split = path.split('.')
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content))
}

let files = fs.readdirSync('./', { recursive: true })

for (const path of files) {
	if (path.includes('.git')) continue
	if (path.includes('fonts')) continue
	if (path.includes('node_modules')) continue
	if (path.includes('#')) continue
	if (path.includes('markdown-it')) continue

	Object.entries(hookMap).forEach(([glob, hooks]) => {
		if (minimatch(path, glob)) {
			hooks.forEach(e => beforeElementHooks.push(e))
		}
	})

	Object.entries(styleMap).forEach(([glob, styleList]) => {
		if (minimatch(path, glob)) {
			styleList.forEach(e => styles.push(e))
		}
	})

	let split = path.split('.')
	let ext = split.pop()
	if (ext == 'md') await transformmd(path)
	if (ext == 'js') await transformjs(path)

	beforeElementHooks = []

}
