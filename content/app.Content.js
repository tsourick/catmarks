
import {e, list} from '../react-helpers.js';


import Widget from './cmp.Widget.js';


class App extends React.Component {
	constructor(props) {
    super(props);

    this.state = {catList: [], selectedCatBMKey: null};
    
    this.onCatSelect = this.onCatSelect.bind(this);
  }
  
  /*
  windowMatchesHost(host) {
  	const tabUrl = window.location.href;
  	const tabHostname = new URL(tabUrl).hostname;
  	
  	return host.hostname.trim() != '' && tabHostname == host.hostname;
  }
  */
  
  componentDidMount() {
  	// alert('window.host caught = ' + window.host);
  	console.log('window.host', window.host, 'window.catBMKey', window.catBMKey);

  	
  	/*
		browser.storage.local.get(null).then((data) => {
			const hosts = data.hosts ?? [];
			
			const host = hosts.find(host => this.windowMatchesHost(host));

			if (host) {
				this.setState({list: host.catList});
			}
		})
		*/
  	
		if (window.host) {
			this.setState({
				catList: window.host.catList,
				selectedCatBMKey: window.catBMKey ?? null
			});
		}
  }
  
  onCatSelect(bmKey) {
  	console.log(`${bmKey} clicked`);

  	browser.runtime
  	.sendMessage({type: 'bm', bmKey})
  	.then(({result, url, hostname, bmKey} = {}) => { // on response
  			if (result) {
  				console.log(`URL '${url}' with '${hostname}' config bm'ed as '${bmKey}'`);
  				
  				this.setState({selectedCatBMKey: bmKey});
				}
  		}, (error) => { // on error
  		}
  	);
  }
  
	render() {
		const s = this.state;
		
		return e(Widget, {list: s.catList, selectedKey: s.selectedCatBMKey, onSelect: this.onCatSelect}, null);
	}
}

export default App;