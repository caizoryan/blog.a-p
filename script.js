import {iframescript} from "./iframify.js"

document.querySelectorAll(".codeblock")
	.forEach(e => {
		let [code, iframe, button] = e.children
		console.log("code: ", code.value)
		console.log("btn: ", button) // 
		button.onclick = () => {
			iframe.srcdoc = iframescript(code.value)
		}
	})
