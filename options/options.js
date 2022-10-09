

/* 
(async () => {
  if (somethingIsTrue) {
    const {
      default: myDefault,
      foo,
      bar,
    } = await import("/modules/my-module.js");
  }
})();
*/

import {e, list} from '../react-helpers.js';


import App from './app.Options.js';


const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(e(App, {}, null));

function testEvents(o, eventNames, msgTemplate = '%e', cb = null) {
	if (! Array.isArray(eventNames)) eventNames = [eventNames];
	
	eventNames.forEach((eventName) => {
		o.addEventListener(eventName, ((eventName, cb) => () => {
			console.log(msgTemplate.replace('%e', eventName));
			if (cb) cb();
		})(eventName, cb));
	})
}


testEvents(window, ['load', 'beforeload', 'unload', 'beforeunload'], 'window event - %e', () => { false && alert('?') });
testEvents(document.body, ['load', 'beforeload', 'unload', 'beforeunload'], 'doc body event - %e');
