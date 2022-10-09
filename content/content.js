
	
(async () => {
  if (window.hasRun) return;

  window.hasRun = true;


  const { Utils } = await import(browser.runtime.getURL('/Utils.js'));


  const CONTAINER_CLASSNAME = 'ffplugin-widget-container';
  const WIDGET_CLASSNAME = 'ffplugin-widget';
  
  
  function makeCtrlHTML() {
		const ctrlHTML = `
			<div class="${CONTAINER_CLASSNAME}">
				<div class="${WIDGET_CLASSNAME}">
					<!-- react app -->
					<div id="ffpluginWidgetApp">loading widget...</div>
				</div>
			</div>
		`;
  
		return ctrlHTML;
	}


  function addUIContainer() {
  	// Remove existing if any
  	
  	document.querySelectorAll('.' + CONTAINER_CLASSNAME).forEach(element => {
  		element.remove();
  	});
  	
  	
  	// Add CSS
  	
    // addStyles(ctrlCSS);
    
    // console.log('XXX');
    
    
    // Add HTML
    
    const ctrlHTML = makeCtrlHTML();
    // alert(ctrlHTML);
    let node = Utils.htmlToDom(ctrlHTML);
    document.body.appendChild(node);
  }


  // Run
  
  function run() {
		addUIContainer();			
		
		const url = browser.runtime.getURL('/content/appLoader.js');
		import(url);
	}
	
	run();
	
})();
