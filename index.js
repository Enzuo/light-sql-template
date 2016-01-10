'use strict';

var sql_templates_func = {};

module.exports = function( templateName, sql ) {

	// Check if the template has already been created
	var tplFunc = sql_templates_func[ templateName ];

	if(typeof tplFunc === 'function'){
		return tplFunc;
	}

	else{
		if(typeof sql === 'undefined'){
			return false;
		}
		//generate the function if SQL was provided
		else{

			tplFunc = generateFunction( sql );

			sql_templates_func[ templateName ] = tplFunc ;

			return tplFunc;
		}
	}
};

/**
 * @param  {String} sql : sql to generate from
 * @return {Function} template function
 */
function generateFunction( sql ){

	//var _code = "var out = 'hello'";
	//sql = 'SELECT * FROM {{= hello }} FROM {{? hello }} only if hello {{?}}';
	var tb = '{{';
	var te = '}}';
	var varname = 'data';
	var _code = '';

	var arr = sql.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g, '')
		.split(tb).join(te +'\x1b')
		.split(te);

	console.log(arr);


	for (var m=0, l=arr.length; m < l; m++) {
		if( arr[m].charAt(0) !== '\x1b' ){
			_code += "out+='" + arr[m].replace(/(\\|["'])/g, '\\$1') + "'";

		}
		else{			
			if(arr[m].charAt(1) === '='){
				_code += ';out+=( "?" );';
				_code += 'vals.push(' + varname + '.' + arr[m].substr(2).replace(/\s/g, '') + ');';
			}
			else if(arr[m].charAt(1) === '?' && arr[m].length === 2){
				_code += "}";
			}
			else if(arr[m].charAt(1) === '?'){
				_code += ';if(' ;
				_code += varname + '.' + arr[m].substr(2).replace(/\s/g, '') ;
				_code += '){';
			}
			else{
				_code += ';' + arr[m].substr(1);
			}
		}
	}



	_code = ('var vals = [], out="";'+_code+';return { sql:out, values:vals };')
		.split("out+='';").join('')
		.split('var out="";out+=').join('var out=');
	console.log(_code);

	try {
		return new Function( varname, _code);
	} catch (e) {
		if (typeof console !== 'undefined') console.log("Could not create a template function: " + _code);
		throw e;
	}
}