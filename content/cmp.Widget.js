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
		const createClickHandler = (bmKey) => (e) => { this.onClick(bmKey) },
		      selectedKey = this.props.selectedKey
		;
		
		this.props.list?.forEach((item) => {
			let props = {
				className: selectedKey == item.bmKey ? 'selected' : null, 
				style: {"--color": item.color}, 
				onClick: createClickHandler(item.bmKey)
			};
			
			children.push(['li', props, `${item.name}`]);
		});
		
		children.push(
			['hr', {style: {width: '100%', margin: '0', padding: '0'}}, null],
			['li', {
				className: selectedKey == this.props.bmRootKey ? 'selected' : null, 
				style: {"--color": 'blue'}, 
				onClick: createClickHandler(this.props.bmRootKey)
			}, `root`],
			['li', {
				className: ! selectedKey ? 'selected' : null, 
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