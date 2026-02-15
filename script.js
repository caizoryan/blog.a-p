import { iframescript } from "./iframify.js"

document.querySelectorAll(".codeblock")
	.forEach(e => {
		let [code, iframe, button] = e.children
		button.onclick = () => {
			iframe.srcdoc = iframescript(code.value)
		}
	})

