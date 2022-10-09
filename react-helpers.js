export const e = React.createElement;

export const list = (list, o) => {
	o = o || {};
	
	return list.map((eOrParams, index) => {
		if (Array.isArray(eOrParams))
		{
			if ((! eOrParams[1]) || (typeof eOrParams[1] !== 'object')) eOrParams[1] = {};
			
			if (! o.noKey) eOrParams[1].key = eOrParams[1].key || index;
			eOrParams[1].index = index;
			
			eOrParams = e(...eOrParams);
		}
		
		return eOrParams;
	}) 
}
