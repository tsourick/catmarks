
	
(async () => {
  if (window.hasRun) return;

  window.hasRun = true;


  const { Utils } = await import(browser.runtime.getURL('/Utils.js'));


  const CONTAINER_CLASSNAME = 'ffplugin-widget-container';
  const WIDGET_CLASSNAME = 'ffplugin-widget';
  
  
  function makeCtrlHTML(list) {
  	let html = '';
  	
  	list.forEach((item) => {
  		html += `<li style="--color: ${item.color}">${item.name}</li>`;
		});
		
		const ctrlHTML = `
			<div class="${CONTAINER_CLASSNAME}">
				<div class="${WIDGET_CLASSNAME}">
					<!-- obsolete list -->
					<ul>${html}</ul>
					
					<!-- react app -->
					<div id="ffpluginWidgetApp">loading widget...</div>
				</div>
			</div>
		`;
  
		return ctrlHTML;
	}


  function addControllerUI(list) {
  	// Remove existing if any
  	
  	document.querySelectorAll('.' + CONTAINER_CLASSNAME).forEach(element => {
  		element.remove();
  	});
  	
  	
  	// Add CSS
  	
    // addStyles(ctrlCSS);
    
    // console.log('XXX');
    
    
    // Add HTML
    
    const ctrlHTML = makeCtrlHTML(list);
    // alert(ctrlHTML);
    let node = Utils.htmlToDom(ctrlHTML);
    document.body.appendChild(node);


    const onCatClick = (e) => {
			const node = e.target;

			node.parentElement.querySelectorAll('li').forEach(element => {
				element.classList.remove('selected');
			});

			node.classList.add('selected');
			
			
			if (confirm('Close?')){
				window.close();
			}
		}
		
    node.querySelectorAll('li').forEach((item) => {
    	item.addEventListener('click', onCatClick);
		})
  }


  // Run
  
  function run() {
  	Promise.all([
 			browser.storage.local.get(null),
  		// browser.tabs.insertCSS( {file: '/content/content.css'} ),
 		])
 		.then(([ data, ...rest ]) => {
			addControllerUI(data.list ?? []);			
			
			const url = browser.runtime.getURL('/content/appLoader.js');
			import(url);
 		})
		
	}
	
	run();
	
})();
