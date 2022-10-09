import {e, list} from '../react-helpers.js';

import InputTextStateless from './cmp.InputTextStateless.js';
import HTMLSelect from './cmp.HTMLSelect.js';
import CatBtnAdd from './cmp.CatBtnAdd.js';
import CatBtnRemove from './cmp.CatBtnRemove.js';
import ColorPicker from './cmp.ColorPicker.js';
import CategoriesContext from './ctx.Categories.js';


class CatName extends InputTextStateless {}

class Category extends React.Component {
	constructor(props) {
		super(props);
		
		this.onRemove = this.onRemove.bind(this);
		this.onRename = this.onRename.bind(this);
		this.onChangeColor = this.onChangeColor.bind(this);
		this.onChangeBMKey = this.onChangeBMKey.bind(this);		
	}
	
	onRemove() {
		this.context?.removeCat(this.props.index);
	}
	
	onRename(value) {
		this.context?.renameCat(this.props.index, value);
	}
	
	onChangeColor(value) {
		this.context?.changeCatColor(this.props.index, value);
	}
	
	onChangeBMKey(value) {
		this.context?.changeCatBMKey(this.props.index, value);
	}
	

	
	render() {
		let subsOptions = [{value: '', text: 'create new'}];
		
		this.props.subsList.forEach(item => {
			subsOptions.push({value: item.id, text: item.title});
		});
		
		
		return e('li', {}, list([
    	[CatBtnRemove, {onClick: this.onRemove}, null],
			[CatName, {value: this.props.name, onChange: this.onRename}, null],
			[ColorPicker,  {cname: 'none', value: this.props.color, onChange: this.onChangeColor}, null],
			[HTMLSelect, {options: subsOptions, onChange: this.onChangeBMKey, value: this.props.bmKey}, null],
		]));
	}
}
Category.contextType = CategoriesContext;

class CategoryList extends React.Component {
	render() {
		console.log('CategoryList render w/props', this.props);
		let catList = [];

		let subsListAll = this.props.subsList;
		let occupiedKeys = new Set(this.props.catList.map(cat => cat.bmKey));
		this.props.catList.forEach((cat) => {
			// if (cat.bmKey != '') occupiedKeys.add(cat.bmKey);
			
			const subsList = subsListAll.filter((sub) => {
				// console.log('sub.id', sub.id, 'cat.bmKey', cat.bmKey, 'occupiedKeys.has(sub.id)', occupiedKeys.has(sub.id));
				return sub.id == cat.bmKey || ! occupiedKeys.has(sub.id);
			});
			catList.push([Category, {bmKey: cat.bmKey, name: cat.name, color: cat.color, subsList}, null]);
		});

		return e('ul', {style: {listStyle: 'none', padding: 0}}, list(catList));
	}
}

class Categories extends React.Component {
	catDefaults = {bmKey: '', name: 'NEW CAT', color: '#44bbbb'};
	
	
	constructor(props) {
		super(props);

		this.state = {catList: this.props.catList ?? [this.catDefaults]};

		
		this.add = this.add.bind(this);
		this.rename = this.rename.bind(this);
		this.changeColor = this.changeColor.bind(this);
		this.remove = this.remove.bind(this);
		this.changeBMKey = this.changeBMKey.bind(this);
	}

	add() {
		this.setState((state, props) => {
			return {catList: [...state.catList, this.catDefaults]};
		});
	}

	rename(index, name) {
		this.setState( (state, props) => ({catList: state.catList.map((el, i) => i == index ? {...el, name} : el)}) );
	}
	
	changeColor(index, color) {
		this.setState( (state, props) => ({catList: state.catList.map((el, i) => i == index ? {...el, color} : el)}) );
	}
	
	changeBMKey(index, bmKey) {
		this.setState( (state, props) => ({catList: state.catList.map((el, i) => i == index ? {...el, bmKey} : el)}) );
	}
	
	remove(index) {
		this.setState((state, props) => {
			let ss = state.catList.filter((el, i) => i != index);

			return {catList: ss};
		});
	}

	render() {
		const ctx = {changeCatBMKey: this.changeBMKey, renameCat: this.rename, changeCatColor: this.changeColor, removeCat: this.remove};
		// console.log('Categories this.props.subsList', this.props.subsList);
		return e(CategoriesContext.Provider, {value: ctx}, 
			e('fieldset', {className: 'cat'}, list([
				['legend', {}, 'Categories'],
				[CategoryList, {catList: this.state.catList, subsList: this.props.subsList}, null],
				[CatBtnAdd, {onClick: this.add}, null],
			]))
		);
	}
}

export default Categories;