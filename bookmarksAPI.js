
function traverseNode(node, cb, depth = 0) {
  if (node.url) {
    cb({type: 'item', node, depth});
  } else {
  	cb({type: 'folder', node, depth});
    depth++;
  }
  
  if (node.children) {
    for (const child of node.children) traverseNode(child, cb, depth);
  }
  
  depth--;
}

function getRoot() {
	return new Promise((resolve, reject) => {
		browser.bookmarks.getTree().then(
			(items) => { resolve(items[0]); },
			reject
		);	
	});
}
/*
export function loadTree(nodeCallback)
{
	return new Promise((resolve, reject) => {
		getRoot().then((root) => {
				traverseNode(root, nodeCallback);
				
				resolve(true);
			},
			reject 
	3	);
	});
}
*/
export function loadTree() {
	return getRoot();
}

export function loadTreeAsList() {
	return loadTree()
		.then((root) => {
			let list = [];

			traverseNode(root, ({type, node, depth}) => {
				list.push({node, depth});
			});

			return Promise.resolve(list);
		});
}

export function isFolder(node) {
	return node.type == 'folder';
}

export function create(details) {
	return browser.bookmarks.create(details)
}

export function get(idOrIdList) {
	return browser.bookmarks.get(idOrIdList)
}

export function remove(id) {
	return browser.bookmarks.remove(id)
}

export async function searchWithinSubtree(search, parentNode) {
	console.log('withinSubtree() search for ', search, 'within', parentNode);	
	const nodeWithinParent = async (node) => {
		if (! node.parentId) return false; // root
		
		let r = false;
			
		do {
			// console.log('check node', node, 'against parent', parentNode);
			if (node.parentId == parentNode.id) {
				console.log('WITHIN');
				r = true;
				break;
			}
			// console.log('NOT WITHIN');
			[node] = await browser.bookmarks.get(node.parentId);
			// console.log('next node', node);
		}
		while (node && node.parentId);
		// console.log('result', r);
		return r;
	};
	
	return new Promise((v, j) => {
		let nodesFound = [];

		if (! parentNode) v(nodesFound);
		else
			browser.bookmarks
			.search(search)
			.then(async (nodes) => {
				console.log('nodes found', nodes);
				
				for (const node of nodes) {
					if (await nodeWithinParent(node)) {
						// console.log('node', node, 'IS within');
						nodesFound.push(node);
					}
				}
				
				v(nodesFound);
			})
			.catch(j);
	})
}