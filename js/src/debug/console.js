var PopupConsole = {
	init: function()
	{
		if (window.SystemConsole) return;
	
		window.SystemConsole = window.console;
		window.console = PopupConsole;
		
		var domElement = document.createElement("div");
		domElement.id = "console";
		domElement.style.cssText = '-webkit-overflow-scrolling:touch';
		domElement.style.position = 'absolute';
		domElement.style.bottom = '0px';
		domElement.style.left = '0px';
		domElement.style.width = '100%';
		domElement.style.height = '200px';
		domElement.style.background = 'black';
		domElement.style.color = 'white';
		domElement.style.opacity = 0.8;
		domElement.style.padding = '2px';
		domElement.style.overflow = 'auto';
		domElement.style.zIndex = 100;
		domElement.style.border = '1px solid gray';
		document.body.appendChild( domElement );
		PopupConsole.domElement = domElement;
		PopupConsole.clear();
	},
	log: function(obj)
	{
		SystemConsole.log(obj);
		PopupConsole.domElement.innerHTML = '<br/>' + obj + PopupConsole.domElement.innerHTML;
	},
	warn: function(obj)
	{
		SystemConsole.warn(obj);
		PopupConsole.domElement.innerHTML = '<br/>[WARN] ' + obj + PopupConsole.domElement.innerHTML;
	},
	error: function(obj)
	{
		SystemConsole.error(obj);
		PopupConsole.domElement.innerHTML = '<br/>[ERROR] ' + obj + PopupConsole.domElement.innerHTML;
	},
	clear: function()
	{
		PopupConsole.domElement.innerHTML = '<button style="position:fixed;left:5px;bottom:5px" onClick="console.clear()">clear</button>';
	},
	time: function(obj)
	{
	},
	timeEnd: function(obj)
	{
	},
	trace: function()
	{
		window.SystemConsole.trace();
	},
	destroy: function()
	{
		if (PopupConsole.domElement)
			PopupConsole.domElement.parentNode.removeChild(PopupConsole.domElement);
		window.console = window.SystemConsole;
	}
};

module.exports = PopupConsole;