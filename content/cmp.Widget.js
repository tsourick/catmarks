import {e, list} from '../react-helpers.js';


class Widget extends React.Component {
	constructor(props) {
		super(props);
		
		// this.state = {selectedBMKey: null};
		
		this.onClick = this.onClick.bind(this);
	}
	
	onClick(bmKey) {
		return this.props.onSelect?.(bmKey);
	}
	
	render() {
		let children = [];
		const createClickHandler = (bmKey) => (e) => { this.onClick(bmKey) };
		
		this.props.list?.forEach((item) => {
			let props = {
				className: this.props.selectedKey == item.bmKey ? 'selected' : null, 
				style: {"--color": item.color}, 
				onClick: createClickHandler(item.bmKey)
			};
			
			children.push(['li', props, `${item.name}`]);
		});
		
		children.push(
			['hr', {style: {width: '100%', margin: '0', padding: '0'}}, null],
			['li', {
				className: false ? 'selected' : null, 
				style: {"--color": 'blue'}, 
				onClick: createClickHandler('somerootkeyhere')
			}, `root`],
			['li', {
				className: false ? 'selected' : null, 
				style: {"--color": 'gray'}, 
				onClick: createClickHandler(null)
			}, `none`],
		);
		
		return e('div', {}, list([
			['ul', {}, list(children)]
		]));
	}
}

export default Widget;