import {e, list} from '../react-helpers.js';

import InputTextStateless from './cmp.InputTextStateless.js';
import HTMLSelect from './cmp.HTMLSelect.js';
import Categories from './cmp.Categories.js';
// import { Utils } from '../Utils.js';
import Dialog from './cmp.Dialog.js';

import * as bapi from '../bookmarksAPI.js';


class BMRootSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {newSubfolderTitle: ''};
		
		this.onNewSubfolderTitleChange = this.onNewSubfolderTitleChange.bind(this);
		this.onNewSubfolderAddClick = this.onNewSubfolderAddClick.bind(this);
	}
	
	onNewSubfolderTitleChange(v) {
		this.setState({newSubfolderTitle: v});
	}

	onNewSubfolderAddClick() {
		this.props.onAddSubfolder?.(this.state.newSubfolderTitle);
	}
		
	
	handleChange(e) {
		// console.log('BMRootSelector selected value: ', e.target.value);
		this.props.onChange(e.target.value);
	}
	
	render() {
		let optList = [];
		// console.log('BMRootSelector render()', this.props);
		// console.log('BMRootSelector options: ', this.props.options);
		this.props.foldersList.forEach((folder) => {
			const text = '\u00A0'.repeat(folder.depth * 2) + `${folder.title} [ID:${folder.id}]`;
			optList.push(['option', {value: folder.id}, text]);
		});
		
		const addBtnDisabled = ! (this.props.selectedKey && this.state.newSubfolderTitle);

		return e('div', {}, list([
			['div', {style: {display: 'flex'}}, list([
				['label', {style: {flexGrow: '1'}}, 'Bookmarks root:'],
				[InputTextStateless, {style: {width: '10%'}, value: this.state.newSubfolderTitle, onChange: this.onNewSubfolderTitleChange}, null],
				['button', {type: 'button', onClick: this.onNewSubfolderAddClick, disabled: addBtnDisabled}, 'add subfolder'],
			])],
			['select', {
					name: 'bm_root', size: '10', style: {width: '100%'}, onChange: this.handleChange.bind(this),
					value: this.props.selectedKey
				},
				list(optList)
			],
		]));
	}
}

class HostOptionsForm extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {options: {showWidget: true}, bmRootKey: '', title: '', hostname: ''};
		this.state = {...this.props.host, subsList: []};
		
		this.categories = React.createRef();
			
		this.onChangeBMRoot = this.onChangeBMRoot.bind(this);
		this.onChangeTitle = this.onChangeTitle.bind(this);
		this.onChangeHostname = this.onChangeHostname.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onAddSubfolder = this.onAddSubfolder.bind(this);
		
		console.log('HostOptionsForm created w/props', this.props);
	}
	
	componentDidMount() {
		this.updateSubs();
	}
	
	readSubs(bmRootKey) {
		return new Promise((v, j) => {
			browser.bookmarks.getChildren(bmRootKey).then((nodes) => {
				const subsList = [];
				
				for (const node of nodes)
					if (bapi.isFolder(node))
						subsList.push(node);
	
				v(subsList);
			}, j);
		})
	}
	
	updateSubs() {
		this.readSubs(this.state.bmRootKey ?? '').then((subsList) => {
			this.setState({subsList});
		});
	}
	
	onChangeBMRoot(bmRootKey) {
		/* // This flickers...
		this.readSubs(bmRootKey).then((subsList) => {
			this.setState({bmRootKey, subsList});
		})
		*/
		this.setState({bmRootKey}, () => {
			this.updateSubs();
		});
	}
	onChangeTitle(title) { this.setState({title}); }
	onChangeHostname(hostname) { this.setState({hostname}); }
	onSubmit(e) {
		e.preventDefault();
			
		const categories = this.categories.current;

		const data = {
			catList:   categories.state.catList,
			bmRootKey: this.state.bmRootKey,
			title:     this.state.title,
			hostname:  this.state.hostname,
			options:   this.state.options,
		};
		
		this.props.onSave(data);
	}
	onAddSubfolder(title) {
		if (this.state.bmRootKey) {
			// console.log(this.state.bmRootKey);
			bapi
			.create({title, type: 'folder', parentId: this.state.bmRootKey})
			.then((node) => {
				// reply({result: true, url: href, hostname, id: message.id});
			})
			.catch((error) => { console.log(error) });
		}
	}
	
	render() {
		console.log('HostOptionsForm render w/props', this.props);
		const p = this.props, s = this.state;
		
		return e('form', {onSubmit: this.onSubmit},
			e('fieldset', {}, list([
				['legend', {}, s.title],
				['label', {style: {display: 'block'}}, 'Hostname:'],
				[InputTextStateless, {style: {width: '100%'}, value: s.hostname, onChange: this.onChangeHostname}, null],
				['label', {style: {display: 'block'}}, 'Title:'],
				[InputTextStateless, {style: {width: '100%'}, value: s.title, onChange: this.onChangeTitle}, null],
				[BMRootSelector, {selectedKey: s.bmRootKey, foldersList: p.bmFoldersList, onChange: this.onChangeBMRoot, onAddSubfolder: this.onAddSubfolder}, null],
				[Categories, {ref: this.categories, catList: s.catList, subsList: s.subsList}, null],
				['button', {type: "submit"}, 'Save'],
			]))
		);
	}
}



class Hosts extends React.Component {
	render() {
    return e('div', {style: {display: 'flex', gap: '1em'}}, list([
			'Hosts: ',
    	[HTMLSelect, {options: this.props.hostOptions ?? [], onChange: this.props.onHostSelect ?? null, value: this.props.selectedHostId}, null],
   		['button', {type: 'button', onClick: this.props.onHostAdd ?? null}, 'new host'], 
   		this.props.selectedHostId && ['button', {type: 'button', onClick: this.props.onHostRemove ?? null}, 'delete host'],
    ]));    
	}
}

/* 

{
	hosts: [
		{ id: <auto>, title, hostname, bmRootKey, catList: [
			{id: <auto>, title, color, bmRoot},
			{id: <auto>, title, color, bmRoot},
			{id: <auto>, title, color, bmRoot},
		], options: {showWidget}}
	]
}

{
	hosts: [
		{ [hostname], title,  bmRootKey, catList: [
			{[bmKey], title, color},
			{[bmKey], title, color},
			{[bmKey], title, color},
		], options: {showWidget}}
	]
}

*/

class App extends React.Component {
	hostDefaults = {
		id: null,
		title: 'NEW',
		hostname: '',
		bmRootKey: null,
		catList: [],
		options: {showWidget: true}
	};
	
	
	constructor(props) {
    super(props);
    this.state = {hosts: [], selectedHostId: null, bmFoldersList: [], selectedHost: null};

		this.onSaveOptionsForm = this.onSaveOptionsForm.bind(this);
		this.onHostSelect = this.onHostSelect.bind(this);
		this.onHostAdd = this.onHostAdd.bind(this);
		this.onHostRemove = this.onHostRemove.bind(this);
		
		this.fo = React.createRef();
		this.alertDlg = React.createRef();
  }
  
  bmListFoldersOnly(bmList) {
		return bmList
			.filter(item => bapi.isFolder(item.node))
			.map(item => ({id: item.node.id, title: item.node.title, depth: item.depth}));
  }
  
  readBMFoldersList() {
  	return new Promise((v, j) => {
			bapi
			.loadTreeAsList()
			.then((bmList) => {
				this.bmFoldersList = this.bmListFoldersOnly(bmList);
				
				v(true);
			})
			.catch(j)
  	});
  }
  
  readHosts() {
  	return new Promise((v, j) => {
			browser.storage.local
			.get(null)
			.then((storageData) => {
				this.hosts = storageData.hosts ?? [];
				
				v(true);
			})
			.catch(j)
  	});
	}
  
  componentDidMount() {
  	this.bmFoldersList = [];

  	Promise
  	.all([
			this.readBMFoldersList(),
			this.readHosts(),
  	])
  	.then(() => {
  		// console.log('bmFoldersList', this.bmFoldersList);
  		// console.log('storage.hosts', this.hosts);
  		
  		return new Promise((v, j) => {
  			this.setState({hosts: this.hosts, bmFoldersList: this.bmFoldersList}, () => { v() });
			});
		})
		.then(() => {
 			this.addBMChangeListener(this.onBMChange.bind(this));
		})
  }
  
  addBMChangeListener(onBMChange) {
		const bms = browser.bookmarks,
		      evtHost = this,
		      lst = () => {
		      	if (! evtHost.skipBMEvents) onBMChange();
		      };
		
		bms.onCreated.addListener(lst);
		bms.onRemoved.addListener(lst);
		bms.onChanged.addListener(lst);
		bms.onMoved.addListener(lst);
		bms.onChildrenReordered?.addListener(lst);

		bms.onImportBegan?.addListener(() => {
			evtHost.skipBMEvents = true;
		});
		bms.onImportEnded?.addListener(() => {
			evtHost.skipBMEvents = false;
			onBMChange();
		});
	}
	
	onBMChange() {
		this
		.readBMFoldersList()
		.then(() => {
  		return new Promise((v, j) => {
  			this.setState({bmFoldersList: this.bmFoldersList}, () => { v() });
			});
		});
	}
	
  getHostNewId() {
  	let id = 1;
  	
  	this.state.hosts.forEach(item => {
  		id = Math.max(id, item.id + 1);
		})
		
		return id;
  }
  
  saveDataToStorage(data) {
  	return new Promise((v, j) => {
			browser.storage.local.set(data).then(v).catch(j)
  	});
  }
  
  saveHostsState () {
  	return this.saveDataToStorage({hosts: this.state.hosts});
  }
  
  getSelectedHost() {
		return this.state.selectedHost;
  }
  
  addHost() { 
  	let id = this.getHostNewId();
	  let host = {...this.hostDefaults, id};
	  host.title += ` (${id})`;

	  this.setState((state, props) => {
	  	return {hosts: [...state.hosts, host], selectedHostId: host.id, selectedHost: host};
	  }, () => {
	  	this.saveHostsState();
	  });
  }
  
  removeSelectedHost() {
		this.setState((state, props) => {
			const hosts = state.hosts.filter(host => host.id != state.selectedHostId);
			// const selectedHostId = hosts.length ? hosts[hosts.length - 1].id : null;
			const selectedHostId = null, selectedHost = null;
			return {hosts, selectedHostId, selectedHost};
		}, () => {
			this.saveHostsState();
		});
  }
  
	onHostSelect(v) {
		// console.log(`${v} selected`);

		const host = this.state.hosts.find(host => host.id == v);
		// console.log(`host found`, host);
		this.setState({selectedHostId: host ? v : null, selectedHost: host});
	}
	
	onHostAdd() {
		this.addHost();
	}
	
	onHostRemove() {
		const host = this.getSelectedHost();
		if (confirm(`Delete '${host.title}' (${host.hostname}) host?`)) this.removeSelectedHost();
	}
	
	onSaveOptionsForm(data) {
		data.id = this.state.selectedHostId; // inject current ID into form data
		
		
		let alertDlg = this.alertDlg.current;

		
		// Check for empty hostname
		
		if (data.hostname == '') {
			alertDlg.showModal('hostname should not be empty');
			return false;
		}
		
		
		// Check for duplicate hostname
		
		let hasHostname = this.state.hosts.some((host) => {
			if (host.hostname != '' && host.id != data.id) { // except the one being saved and empties
				return (host.hostname == data.hostname)
			}
		});
		
		if (hasHostname) {
			alertDlg.showModal({msg: `'${data.hostname}' hostname is already used`})
			return false;
		}

		
		
		const updatedHosts = this.state.hosts.map(host => host.id == data.id ? data : host);
		
		const storageData = {hosts: updatedHosts};
		
		browser.storage.local
		.set(storageData)
		.then(() => {
			// Update host UI
			this.setState((state, props) => {
				return {hosts: storageData.hosts, selectedHost: data};
			}, () => {
				// alert('Saved!')				
				alertDlg.showModal('saved.');
			});
		})
		.catch(() => {
			alert('Error!')
		});
		
	}
	
	render() {
		let hostOptions = [{value: '', text: 'select host', hidden: 'hidden'}];
		// debugger;
		this.state.hosts.forEach(host => {
			let text = (host.title ? `${host.title} - ` : '') + host.hostname;
			hostOptions.push({value: host.id, text});
		});
		
    return e('div', {}, list([
			[Hosts, {
					hostOptions,
					selectedHostId: this.state.selectedHostId ?? '',
					onHostSelect: this.onHostSelect,
					onHostAdd: this.onHostAdd,
					onHostRemove: this.onHostRemove
				},
				null
			],
		
    	this.state.selectedHost
			&& ['div', {}, 
				e(HostOptionsForm, {ref: this.fo,
					host: this.state.selectedHost,
					bmFoldersList: this.state.bmFoldersList,
					onSave: this.onSaveOptionsForm,
					key: this.state.selectedHostId}, null)
			],
			
			e('button', {onClick: () => {
				chrome.windows.create({ 
						url: 'https://www.google.com', 
						height: 330, 
						width: 430,
						left: screen.width-430,
						top: screen.height-330,
						type: "popup"
					});
			}}, 'Open window'),
/*
<dialog open>
  <p>Greetings, one and all!</p>
  <form method="dialog">
    <button>OK</button>
  </form>
</dialog>
*/

			/*
			
			e('dialog', {open: false, ref: this.dlg, onClose: (e) => { console.log(e.target.returnValue); }}, list([
				['p', {}, 'Greetings, one and all!'],
				['form', {method: "dialog"}, list([
						
					['button', {value: 'OK value'}, 'OK'],
					['button', {value: 'Cancel value'}, 'Cancel'],
					['button', {}, 'No value'],
				])],				
			])),
			*/
			e(Dialog, {ref: this.alertDlg, title: 'Alert', buttons: 'OK'}, []),
			
			e('button', {onClick: (() => {
				let dialog = this.alertDlg.current;

				dialog
				.showModal({msg: 'This is the message'})
				.then((result) => {
					alert(`result was '${result}'`);
				});
				
			}).bind(this)}, 'Open dialog'),
			
    ]));    
	}
}

export default App;