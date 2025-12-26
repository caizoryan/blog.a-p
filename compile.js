import fs from 'fs'
import markdownIt from "./markdown-it/markdown-it.js";
import { iframescript } from "./iframify.js"
import { convertRawRowOptionsToStandard } from 'console-table-printer/dist/src/utils/table-helpers.js';

let host = "http://localhost:3000/api";
let auth = ''
let options = {
	headers: {
		Authorization: `Bearer ${auth}`,
		cache: "no-store",
		"Cache-Control": "max-age=0, no-cache",
		referrerPolicy: "no-referrer",
	},
};
let md = new markdownIt('commonmark')//.use(makrdownItMark);

const image = (block) => `<img src="${block.image.display.url}" />`;
const media_embed = (block) =>
	`<span class="media">${block.embed?.html}</span>`;

const media = (block) => `
	<a href=${block?.source?.url}>
		<div class="media">
			<p class="title">${block.title}</p>
			<img src="${block.image.display.url}" />
			<p class="metadata">${block.source?.url}</p> 
		</div>
	</a>
`;

const video = (block) =>
	`<video src=${block.attachment.url} controls loop></video> `;
const link = (block) =>
	`<span class="link"> <a target="_blank" href=${block.source.url}>${block.title} ${link_svg}</a> </span>`;

const pdf = (block) => `
	<a target="_blank" href=${block.attachment.url}>
		<p class="pdf">
			<span>
			${block.title} ${link_svg}
			</span>
			<img src="${block.image.display.url}" />
		</p>
	</a>
`;

const fetch_json = (link, options) =>
	fetch(link, options).then((r) => r.json());
const get_channel = (slug) => {
	console.log("getting", slug)
	return fetch_json(host + "/channels/" + slug, options)
}
const get_block = (id) => fetch_json(host + "/blocks/" + id, options);
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
				let p = item.type === "softbreak"
					? "<br></br>"
					: item.type === "fence"
						? codeblock(item)
						: item.content;
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

setHookFor(['index.md', "pages/wrapping_2025.md"], {
	condition: (item, child) => {
		return item.tag == 'a' &&
			(attrs(item).href.includes('are.na/block')
			 || attrs(item).href.includes('feed.a-p.space/blocks')
			)
	},
	element: async (item, child) => {
		let block = await get_block(attrs(item).href.split("/").pop().trim())
		if (block.class == 'Image') return image(block)
		// --------------------------------
		// Attachment
		// --------------------------------
		if (block.class == "Attachment") {
			if (block.attachment.extension == "mp4") {
				return video(block);
			} else if (block.attachment.extension == "pdf") {
				return pdf(block);
			}
		}

		// --------------------------------
		// Media
		// --------------------------------
		else if (block.class == "Media") {
			if (block.class == "Media" && block.embed) {
				return media_embed(block);
			}
			else return media(block);

		}
		if (block.class == 'Text') {
			let transformed = await transform(block.content)
			if (child.trim().toLowerCase() == 'clip') return `<div class='clip'>
${transformed.slice(0,3).join("\n")}

<a href='https://feed.a-p.space/blocks/${block.id}' target="_blank">
Read More
</a>
</div>`
			// else return `<div class='text block'>${transformed.join("\n")}</div>`
		}
		// let removed = child.replace("insert: ", "")
	}
})
setHookFor(['index.md', "pages/wrapping_2025.md",], {
	condition: (item, child) => {
		return item.tag == 'p' && child.split(" ")[0] == 'insert:'
	},
	element: (item, child) => {
		let removed = child.replace("insert: ", "")
		console.log(removed)
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
let transform = async content => MD(content)
let transformmd = async (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content = await transform(file);
	let split = path.split('.')
	let ext = split.pop()
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content.join("\n")))
}
let transformjs = async (path) => {
	let file = fs.readFileSync("./" + path, { encoding: 'utf-8' })
	let content = `<pre>${file.replaceAll("<", "&lt;")}</pre>`;
	let split = path.split('.')
	let htmlpath = split.join(".") + '.html'
	fs.writeFileSync(htmlpath, html(content))
}

let files = fs.readdirSync('./', { recursive: true })
for (const path of files) {
	if (path.includes('.git')) continue
	if (path.includes('#')) continue
	if (path.includes('markdown-it')) continue

	if (hookMap[path]) { hookMap[path].forEach(e => beforeElementHooks.push(e)) }

	let split = path.split('.')
	let ext = split.pop()
	if (ext == 'md') await transformmd(path)
	if (ext == 'js') await transformjs(path)

	beforeElementHooks = []

	console.log(path)
}
