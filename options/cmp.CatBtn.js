import {e, list} from '../react-helpers.js';


export default class CatBtn extends React.Component {
	text = '?';
	
	constructor(props) {
    super(props);
    // this.state = {date: new Date()};
    
    this.handleClick = this.handleClick.bind(this); 
  }
  
	render() {
    return e('div', {className: 'btn', onClick: this.handleClick}, this.text);
	}
}