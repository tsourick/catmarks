
export const Utils = {
	
	loadScript(src, attrs) { 
		return new Promise((v, j) => {
				console.log(`loadScript(${src})`);
		
			var script = document.createElement('script');
			script.setAttribute("type", "text/javascript");
			// script.setAttribute("async", true);
			
			if (attrs) for (const [k, v] of Object.entries(attrs))	{
				script.setAttribute(k, v);
			}
			
			script.addEventListener("load", () => {
				console.log(`script loaded ${src}, ${typeof window.jQuery}`);
				v();
			});
			script.addEventListener("error", () => { j(); });
		
			// script.onload = () => { v(); };
			// script.onerror = () => { j(); };
			
			script.src = src;
			
			document.head.appendChild(script);
		});
	},
	
	loadReact()  {
		// console.log(`loadReact()`);
		const urlBase =	'https://unpkg.com/';
		const urls = {
			react:     urlBase + 'react@18/umd/react.development.js',
			react_dom: urlBase + 'react-dom@18/umd/react-dom.development.js',
		};
	
		return Promise.resolve(true)
		.then(() => window.loadScript(urls.react, {crossorigin: ''}))
		.then(() => window.loadScript(urls.react_dom, {crossorigin: ''}))
		.then(() => window.loadScript(urls.jq))
	},
	
  htmlToDom(html) {
    const placeholder = document.createElement("div");
    placeholder.innerHTML = html;
    const node = placeholder.firstElementChild;
    return node;
  },

  addStyles(css) {
    var styleSheet = document.createElement("style");
    // styleSheet.setAttribute('id', 'style-ffplugin');
    styleSheet.setAttribute('class', 'ffplugin'); // for remove
    styleSheet.setAttribute('rel', 'stylesheet');
    styleSheet.setAttribute('type', 'text/css');
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
	}
}