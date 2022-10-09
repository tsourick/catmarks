import InputText from './cmp.InputText.js';


export default class InputTextStateless extends InputText {
	constructor(props){
		super(props, {useLocalState: false});
	}
	
	handleChange(e) {
		// this.setState({value: e.target.value});
		this.props.onChange(e.target.value);
	}
}