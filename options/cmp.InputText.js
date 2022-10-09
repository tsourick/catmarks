import {e, list} from '../react-helpers.js';


export default class InputText extends React.Component {
	constructor(props, classOptions) {
		super(props);

		this.opts = {
			useLocalState: classOptions.useLocalState ?? true
		}
		
		if (this.opts.useLocalState)
			this.state = {value: props.value || ''};
	}
	
	handleChange(e) {
		if (this.opts.useLocalState)
			this.setState({value: e.target.value});
	}
	
	render() {
		return e('input', {
			style: this.props.style ?? undefined,
			type: 'text', 
			onChange: this.handleChange.bind(this), 
			value: this.opts.useLocalState ? this.state.value : (this.props.value ?? '') 
		},
		null);
	}
}