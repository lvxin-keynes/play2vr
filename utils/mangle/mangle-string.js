var escodegen = require('escodegen');

var compress128 = "ÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿĀāĂăĄąĆćĈĉĊċČčĎďĐđĒēĔĕĖėĘęĚěĜĝĞğĠġĢģĤĥĦħĨĩĪīĬĭĮįİıĲĳĴĵĶķĸĹĺĻļĽľĿŀŁłŃńŅņŇ";
compress128 = stringShuffle(compress128);

var strs = [], strIndex=-1;

function stringShuffle(str) {
    var a = str.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}

function stringToUnicode(string) {
    return '"' + string.replace(/[\s\S]/g, function (escape) {
       return '\\u' + ('0000' + escape.charCodeAt().toString(16)).slice(-4);
    }) + '"';
}

function stringEncode(str) 
{
	function encode(a)
	{
		a = Math.abs(a);
	    var b = "",c;
	    while (a != 0) {
			c = a & 127;
			a >>>= 7;
			b = (compress128[c] || compress128.charAt(c)) + b;
	    }
	    return b;		
	}

    return '"' + str.replace(/[\s\S]/g, function (escape) {    
       var z = encode(escape.charCodeAt());
       return z;
    }) + '"';		
}

function addOrFind(str)
{
	var idx = -1;
	for (var i=0; i<strs.length; i++)
		if (strs[i].length === str.length && strs[i] === str) return i;
	
	if (idx === -1)
		strs.push(str);
	
	return strs.length-1;
}

function mangle(node, parent)
{
	if (node.type === 'Literal' && (node.raw[0] === '"' || node.raw[0] === '\'' )){
    	if (parent && parent.type === 'Property') 
    	{
            node['x-verbatim-property'] = {
                content : stringToUnicode(node.value),
                precedence: escodegen.Precedence.Primary
            };	        		        		
    	}
    	else
    	{
    		var idx = addOrFind(stringEncode(node.value));
            node['x-verbatim-property'] = {
                content : "_strs["+idx+"]",
                precedence: escodegen.Precedence.Primary
            };	        	
    	}
    }
}

function getCode()
{
	addOrFind('"' + compress128 + '"');
	
	return [
		"var _strs = [" + strs + "], _strslength = _strs.length-1;",
		"for (var i=0; i<_strslength; i++) _strs[i] = _d(_strs[i]);",	
		"function _dn(_num) {",
		"	var _r = 0, _l = _num.length;",
		"	for (var i=0; i<_l; i++) {",
		"		var _idx = _strs[_strslength].indexOf(_num.charAt(i));",
		"		if (_idx) _r += Math.pow(128, _l-1-i) * _idx;",
		"	}",
		"	return _r;",
		"}",
		"function _d(_str){",
		"	var _tmpArray = _str.split(''), _result = ''; ",
		"	for (var i=0; i<_tmpArray.length; i++) ",
		"	{ _result += String.fromCharCode(_dn(_tmpArray[i]));}",
		"	return _result;",
		"}"		
	].join('\n');
}

module.exports = {
	mangle: mangle,
	getCode: getCode
}