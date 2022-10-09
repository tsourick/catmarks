import {e, list} from '../react-helpers.js';

export default class HTMLSelect extends React.Component {
	handleChange(e) {
		this.props.onChange(e.target.value);
	}
	
	render() {
		let options = [];
		
		this.props.options?.forEach(({text, ...rest}) => { options.push(['option', rest, text]); });
		
		return e('select', { ...this.props, onChange: this.handleChange.bind(this)}, list(options));
	}
}
