var fs = require('fs');
var concat = require('concat-stream');
var dateFormat = require('dateformat');
var pres = [
	"//! Copyright 2018 Keynes Software Co.,Ltd. ",
	"//! Build time: " + dateFormat(new Date(), "yyyy/m/d HH:MM:ss"),
	""
];

function preCode(code)
{
	return pres.join('\n') + code;
}

process.stdin.pipe(concat(function(codeBuffer) {
	var code = String(codeBuffer);
 	code = preCode(code);
	process.stdout.write(code);
}));