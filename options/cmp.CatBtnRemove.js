import CatBtn from './cmp.CatBtn.js';


export default class CatBtnRemove extends CatBtn {
	text = '-';
	
	handleClick() {
		// alert(`remove cat '${this.props.cname}'`);
		this.props.onClick?.();
	}	
}