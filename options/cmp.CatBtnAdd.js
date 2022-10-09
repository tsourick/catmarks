import CatBtn from './cmp.CatBtn.js';


export default class CatBtnAdd extends CatBtn {
	text = '+';
	
	handleClick() {
		// alert(`add to forum ID:${this.props.forumId}`);
		this.props.onClick?.();
	}
}