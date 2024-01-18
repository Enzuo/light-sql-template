'use strict';

// Declare defaults options or take provided options
// =================================================
var defaultConfig = {};
function setDefaultConfig ( opts ){
  defaultConfig = Object.assign({
    engine : 'mysql',
    array : 'split',
  }, opts);
};

setDefaultConfig();

/*=====================================================================

									Interface

=====================================================================*/
module.exports = generateTemplateFunction;

module.exports.setDefaultConfig = setDefaultConfig;

/**
 * sql moduleon generate template function whom generate plain sql & parameter values
 * @callback templateFunction
 * @param {array} data
 * @return {{sql:string, values:array}}
 */

/**
 * @param {String} sql : sql template to generate the template function from
 * @param {object=} config
 * @return {(data:object) => {sql:string, values:array}} template function
 */
function generateTemplateFunction( sql, config ){
  config = Object.assign({}, defaultConfig, config);

	var tb = '{{';
	var te = '}}';
	var varname = 'data';
  var _code = 'var vals = [], out="";\n';


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
        var valName = arr[m].substr(2).replace(/\s/g, '');
        // TODO remove varname
        _code += transformValue(varname + '.' + valName, config);
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
function transformValue(valName, config){
  var _code = '';
  _code += 'if(Array.isArray('+valName+')){';
  _code +=   transformArray(valName, config);
  _code += '} else {';
  _code += '  vals.push('+valName+');';
  _code += '  out += '+ transformParameter(config) + ';';
  _code += '}';
  return _code;
}

function transformArray (valName, config){
  var _code = '';
  if(config.array === 'string'){
    _code += 'vals.push('+valName+'.join(\',\'));';
    _code += 'out +=' + transformParameter(config) + ';';
    return _code;
  } else {
    _code += 'for(var i=0; i < '+valName+'.length; i++){';
    _code += '  vals.push('+valName+'[i]);';
    _code += '  if(i === 0){';
    _code += '    out +=' + transformParameter(config) + ';';
    _code += '  } else {';
    _code += '    out += \',\'+' + transformParameter(config) + ';';
    _code += '  }';
    _code += '}';
    return _code;
  }
}

function transformParameter (config) {
  if(config.engine === 'pg'){
    return '\'$\' + vals.length';
  } else {
    return '\'?\'';
  }
}
