import {e, list} from '../react-helpers.js';


export default class Dialog extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			title: props.title ?? '',
			msg: props.msg ?? '',
			content: props.content ?? '',
			buttons: this.parseButtons(props.buttons ?? []),
		};
		
		this.onClose = this.onClose.bind(this); 

		this.dlg = React.createRef();
		
		this.closeResolve = null;
	}
	
	parseButtons(buttons) {
		let res = [];
		
		if (! Array.isArray(buttons)) buttons = [buttons];
		
		buttons.forEach((button) => {
			if (typeof button == 'string') button = {text: button, value: button};
			
			button.text = button.text ?? '';
			button.value = button.value ?? false;
			
			res.push(button);
		});
		
		return res;
	}	 
	
	onClose({target:dialog}) {
		if (this.closeResolve) {
			const v = this.closeResolve;
			
			this.closeResolve = null;
			
			v(dialog.returnValue);
		}
			
		// this.props.onResult?.(dialog.returnValue);
	}
	
	parseO(o) {
		if (typeof o == 'string') o = {msg: o};
		
		return o;
	}
	
	showModal(o) {
		o = this.parseO(o);
		
		return this.show({...o, modal: true});
	}
	
	show(o) {
		o = this.parseO(o);
		
		if (this.closeResolve) // dialog is not closed
			return Promise.reject();
		else
			return new Promise((v, j) => {
				this.closeResolve = v; // save callback to resolve outside (on close)

				this.setState(o, () => {
					this.dlg.current[o.modal ? 'showModal' : 'show']();
				});
			});
	}
	
	render() {
		const s = this.state;
		
		let btnList = s.buttons.map((button) => ['button', {value: button.value}, button.text]);
		
		return e('dialog', {open: false, ref: this.dlg, onClose: this.onClose}, list([
			['form', {method: "dialog"}, list([
				['header', {}, s.title],
				['p', {}, s.msg],
				btnList.length && ['menu', {}, list(btnList
					/*	
				[
					['button', {value: 'OK value'}, 'OK'],
					['button', {value: 'Cancel value'}, 'Cancel'],
					['button', {}, 'No value'],
				]
				*/
				)],
			])],				
		]));
	}
}