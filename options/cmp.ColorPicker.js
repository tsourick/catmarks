import {e, list} from '../react-helpers.js';


export default class ColorPicker extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {value: props.value || '#44bbbb'};
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(e, ...params) {
		// console.log(e, params);
		
		// this.setState({value: e.target.value});
		this.props.onChange(e.target.value);
	}
	
	render() {
		return e('input', {
				type: 'color',
				value: this.props.value, // this.state.value,
				style: {padding: 0, border: 'solid 1px #999'},
				onChange: this.handleChange.bind(this)
			},
			null
		)
	}
}
