import {transform, attrs} from "../compile.js"

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
export default {
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

		// --------------------------------
		// Text
		// --------------------------------
		if (block.class == 'Text') {
			let transformed = await transform(block.content)
			if (child.trim().toLowerCase() == 'clip') return `<div class='clip'>
<a href='https://feed.a-p.space/' target="_blank">From [ FEED.A-P ]</a>
${transformed.slice(0,4).join("\n")}

<a href='https://feed.a-p.space/blocks/${block.id}' target="_blank">
Read More
</a>
</div>`
		}
	}
}
