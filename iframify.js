export let iframescript = js => {
	return `<body></body><script type="module">${js.replaceAll(`'`, `\'`)}</script>`
	// return `<body></body><script type="module">${js.replaceAll(`'`, `"`)}</script>`
}
