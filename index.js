'use strict';

// Declare defaults options or take provided options
// =================================================
var config = {
	engine : 'mysql',

};


/*=====================================================================

									Interface

=====================================================================*/
/**
 * @param  {Object} opts (Optional) :
 *
 * @return {Function} template function
 */
module.exports = function( sql ) {
	return generateFunction( sql );
};

module.exports.setConfig = function( opts ){
	config.engine = opts.engine || config.engine;
};


/**
 * @param  {String} sql : sql template to generate the template function from
 * @return {Function} template function
 */
function generateFunction( sql ){

	var tb = '{{';
	var te = '}}';
	var varname = 'data';
  var _code = 'var vals = [], out="";\n';

  _code +='var transformParameter = ';
  _code += config.engine === 'pg' ? transformParameter.pg.toString() : transformParameter.mysql.toString()
  _code += ';\n';
  _code +='var transformArray = '
    + transformArray.split.toString()
    + ';\n';
  _code +='var transformValue = '
    + transformValue.toString()
    + ';\n';

	var arr = sql.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\t]|(\/\*[\s\S]*?\*\/)/g, ' ')
		.split(tb).join(te +'\x1b')
		.split(te);

	for (var m=0, l=arr.length; m < l; m++) {
		if( arr[m].charAt(0) !== '\x1b' ){
			_code += 'out+=\'' + arr[m].replace(/(\\|["'])/g, '\\$1').replace(/\n/g, '\\n') + '\';';
		}
		else{
			if(arr[m].charAt(1) === '='){
				// console.log(JSON.stringify(arr[m]), arr[m].replace(/[^\w]/g, '.'), arr[m].substr(2).replace(/\s/g, ''))
        var name = arr[m].substr(2).replace(/\s/g, '');
        // _code += pushValueCode(varname, arr[m].substr(2).replace(/\s/g, ''));
        // TODO remove varname
        _code += 'out+= transformValue(vals, '+ varname + '.' + name+');\n';
      }
			else if(arr[m].charAt(1) === '?' && arr[m].length === 2){
				_code += '}';
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

	_code += 'return { sql:out, values:vals };';

	try {
		return new Function( varname, _code);
	} catch (e) {
		if (typeof console !== 'undefined') console.log('Could not create a template function: ' + _code);
		throw e;
	}
}


/*=================================================================

						Template Generator Helper Functions

=================================================================*/
function transformValue(vals, value){
  if(Array.isArray(value)){
    return transformArray(vals, value);
  }
  vals.push(value);
  return transformParameter(vals);
}

var transformArray = {
  split : function (vals, arr){
    var out = '';
    for(var i=0; i < arr.length; i++){
      vals.push(arr[i]);
      out += i === 0 ? transformParameter(vals) : ','+transformParameter(vals);
    }
    return out;
  }
};

var transformParameter = {
  pg : function (vals){
    return '$'+ vals.length;
  },
  mysql : function(

  ){
    return '?';
  }
};
