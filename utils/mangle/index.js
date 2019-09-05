var fs = require('fs');
var esprima = require('esprima');
var estraverse = require('estraverse');
var escodegen = require('escodegen');
var concat = require('concat-stream');

var mangleString = require('./mangle-string');
var mangleIdentity = require('./mangle-identity');

var mangleStack = [mangleString, mangleIdentity];

function manglePass(code, mangler)
{
	var tree = esprima.parse(code);	
	
	estraverse.replace(tree, {
	    leave: function(node, parent){
	        mangler.mangle(node, parent);
	    }
	});

	code = [
		mangler.getCode(),
		escodegen.generate(tree, {verbatim: 'x-verbatim-property'})
	].join('\n');
	return code; 		
}

function mangleCode(code)
{
	var mangler = undefined;
	while (mangler = mangleStack.pop())
	{
		code = manglePass(code, mangler);
	}
	return [
		"(function(){",
		code,
		"}());"
	].join('\n');
}

var mode = 'pipe';
if (mode === 'file')
{
	var filePath = "C:\\work\\workspace_keynes\\vr_player\\js\\vrvideo.js";
	var code = fs.readFileSync(filePath, "utf-8");
	code = mangleCode(code);
	fs.writeFile(filePath, code, function(err){
		err ? console.log(err) : console.log('mangle complete');
	});
} 
else if (mode === 'pipe')
{
	process.stdin.pipe(concat(function(codeBuffer) {
		var code = String(codeBuffer);
	 	code = mangleCode(code);
		process.stdout.write(code);
	}));
}
