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
		
		this.props.list?.forEach((item) => {
			let props = {
				className: this.props.selectedKey == item.bmKey ? 'selected' : null, 
				style: {"--color": item.color}, 
				onClick: ((bmKey) => (e) => { this.onClick(bmKey) })(item.bmKey)
			};
			
			children.push(['li', props, `${item.name}`]);
		});
		
		
		return e('div', {}, list([
			['ul', {}, list(children)]
		]));
	}
}

export default Widget;