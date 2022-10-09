
/**
* Intermediate loader is only necessary to use 'import' directives
*/

import {e, list} from '../react-helpers.js';


import App from './app.Content.js';


function runApp() {
	const root = ReactDOM.createRoot(document.getElementById('ffpluginWidgetApp'));
	root.render(e(App, {}, null));
}

runApp();