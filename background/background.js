

(async () => {

// import * as bapi from '../bookmarksAPI.js';
const bapi = await import('../bookmarksAPI.js');

// console.log(bapi);


function initContentWidget(tab, host) {
	console.log(`init widget on tab '${tab.title}'...`);
	
	const execs = (details) => browser.tabs.executeScript(tab.id, details);
	const incss = (details) => browser.tabs.insertCSS(tab.id, details);

	
	Promise.resolve(true)
	.then(() => execs({ code: 'window.host = ' + JSON.stringify(host) }) ) // set host at content script window, must have
	.then(() => getURLCatBMKey(tab.url, host))
	.then((bmKey) => {
		if (bmKey)
			return execs({ code: `window.catBMKey = '${bmKey}'` }); // set catBMKey at content script window, if any
	})
	.then(() => execs({file: "/react.production.min.js"}))
	.then(() => execs({file: "/react-dom.production.min.js"}))
	.then(() => incss({file: "/content/content.css"}))
	.then(() => incss({file: "/content/widget.css"}))
	.then(() => execs({file: "/content/content.js"}))
	.catch((e) => { console.log(`error loading content scripts on tab '${tab.title}' (${tab.url})`, e); })
}

function tabMatchesHost(tab, host) {
	// console.log(`matching tab url:${tab.url ?? ""}`);
	
	const tabUrl = tab.url ?? '';
	const tabHostname = (new URL(tab.url ?? '')).hostname;

	// console.log(`url hostname:${tabHostname} ? forum hostname:${host.hostname}`);
		
	return host.hostname.trim() != '' && tabHostname == host.hostname;
}

function tabInitContentWidget(tab, storageData = null) {
	
	const initWidget = (data) => {
		data.hosts?.forEach((host) => {
			if (tabMatchesHost(tab, host))
				initContentWidget(tab, host);
		})
	};
	
	
	Promise.all([
		storageData ? Promise.resolve(storageData) : browser.storage.local.get(null)
	])
	.then(([data]) => {
		initWidget(data);
	});
}

Promise.all([
	browser.tabs.query({}),
	browser.storage.local.get(null)
])
.then(([tabs, data]) => {
	tabs.forEach((tab) => {
			
		tabInitContentWidget(tab, data);
		
	});	
});


/*
browser.tabs.query().then((tabs) => {
	browser.storage.local.get(null)
		
	tabs.forEach((tab) => {
		tab.url
	});	
});
*/

/**
* Plugin API
*/

/**
* Returns the bookmark folder key of a category the URL resides in, if any (first only).
* Search is made within a host's configured subtree, including root itself.
*/

function getURLCatBMKey(url, host) {
	return bapi
	.get(host.bmRootKey)
	.then(([hostFolder]) => {
		return bapi.searchWithinSubtree({url}, hostFolder);
	})
	.then((existingBMs) => {
		let key = false;
			
		const bm = existingBMs.shift();
		
		if (bm) {
			if (bm.parentId == host.bmRootKey) { // bm in root folder
				key = host.bmRootKey;  // bm in category folder
			}
			else {
				const bmCat = host.catList.find(cat => cat.bmKey == bm.parentId);
				
				if (bmCat) key = bmCat.bmKey;  // bm in category folder
			}
		}
		
		return key;
	})
}



browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	console.log(Date.now(), `TABUPDATE tabID: ${tabId}, new url: '${tab.url}'`, changeInfo);
	console.log(`tab ID: ${tabId} - ${tab.status}`);
	
	if (true || tab.status == "complete") {
		tabInitContentWidget(tab);
	}		
},{
	properties: ["url"]
});


browser.runtime.onMessage.addListener((message, sender, reply) => {
	console.log('message received', message, sender);
	const url = new URL(sender.url), tab = sender.tab;

	if (message.type == 'bm') {
		const {hostname, href} = url;

		const {bmKey = null} = message;

		
		Promise.resolve(true)
		.then(() => browser.tabs.executeScript(tab.id, { code: 'window.host' }) ) // read 'host' from content window
		.then(([host]) => {
			console.log('window host is', host);
			
			return bapi.get(host.bmRootKey);
		})
		.then(([hostFolder]) => { // get BM host folder (cat root)
			console.log('host folder found', hostFolder);
			
			return bapi.searchWithinSubtree({url: href}, hostFolder);
		})
		.then((existingBMs) => {
			console.log('BMs found within host folder', existingBMs);
			
			if (existingBMs.length)
				return Promise.all(existingBMs.map(node => bapi.remove(node.id))); // remove all
			else
				return Promise.resolve();
		})
		.then(() => {
			if (! bmKey) { // 'none' clicked
				return Promise.resolve(true); // Nothing to do
			}
			else { // some cat OR 'root' clicked
				return bapi.create({title: tab.title, url: href, parentId: bmKey}); // create new in category OR root
			}
		})
		.then((node) => {
			reply({result: true, url: href, hostname, bmKey});
		})
		.catch((error) => { console.log(error) });

		
		return true; // required for async reply
	}
})

console.log('BACKGROUND SCRIPT EXECUTED');

})();
