(function() {

var _root = this;

if (_root.JM) return false;
_root.JM = {};
var el, data, template = '';
_root.JM.init = function(opts) {
	data = _root.JM.data = opts.data;
	el = document.querySelector(opts.el);
	template = el.innerHTML;
	analysis();
	observe(opts.data);
	update();
}
/* 正则 */
var tagRE = /\{\{((?:.|\n)+?)\}\}/g,
	keyRE = /\{\{((?:.|\n)+?)\}\}/

/* Observer */
function observe(data) {
	return _isPlainObject(data)? new Observer(data): false;
}
function Observer(data) {
	this.data = data;
	this.proxy(data);
}
Observer.prototype.proxy = function(data) {
	for (var key in data) {
		defineReactive(data, key, data[key]);
	}
};
function defineReactive(data, key, value) {
	Object.defineProperty(data, key, {
		enumerable: true,
		configurable: true,
		get: function() {
			return value;
		},
		set: function(newValue) {
			if (newValue === value) return;
			observe(newValue);
			value = newValue;
			update();
		}
	});
	// 递归
	observe(value);
}


/* 虚拟DOM */
function analysis() {
	var div = document.createElement('div');
	div.innerHTML = template;
	var result = resolve(div).child;
	console.log(result);
}
var attrRE    = /([^\s]+)=(\"([^\"]+)?\")/g,
	attrKeyRE = /([^\s]+)=(\"([^\"]+)?\")/;
var attrMapping = {
	class: 'className'
};
function resolve(parent, idx) {
	var tagName = parent.tagName;
	if (tagName) {
		var opts   = { attr: {} },
			attr   = opts.attr;
		var lab    = parent.outerHTML.match(/^\<.*?\>/)[0],
			labStr = lab.match(attrRE),
			nodes  = parent.childNodes,
			result = [];
		var forVal = 0;
		if (labStr) {
			labStr.map(function(_) {
				var __ = _.match(attrKeyRE);
					k  = __[1],
					v  = __[3];
				k = attrMapping[k] || k;
				v = v? v: true;
				forVal = k === 'j-for'? v: 0;
				if (!/j-/.test(k)) attr[k] = v;
			});
		}
		if (forVal) {
			debugger;
			console.log(parent.outerHTML);
			var mat = forVal.match(/([a-zA-Z_$]([^\s]+)?)\s+in\s+(([^\s]+)?)/),
				arr = mat[3],
				key = mat[1];
			var array = getData(arr);
			if (array) {
				array.map(function(_,__) {
					console.log(_,__);
				})
				console.log(array)
			}
		}
		nodes.forEach(function(_) {
			result.push(resolve(_));
		});
		opts.tag = tagName;
		opts.child = result;
		return opts;
	} else {
		return parent.data;
	}
}
function update() {
	var html = template;
	var ma = html.match(tagRE);
	if (ma) {
		ma.map(function(_) {
			var key = _.match(keyRE)[1];
			key = key.replace(/\s/g, '');
			var val = getData(key);
			html = html.replace(_, val);
		});
	}
	el.innerHTML = html;
}
// 获取字段值
function getData(key) {
	var key = key.split('.'),
		len = key.length,
		val = data;
	for (var i = 0; i < len; i++) {
		val = val[key[i]] || '';
		if (!val) break;
	}
	return val;
}


/* 数据校验 */
// 真实获取参数的类名
function _getClass(obj) {
	return toString.call(obj).match(/[A-Z]\w*/)[0];
}
function _isObject(obj) {
	return obj && typeof obj === 'object';
}
// 判断参数是否是真实对象
function _isPlainObject(obj) {
	return _getClass(obj) === 'Object';
}
// 判断参数是否是真实数组类型
function _isArray(arr) {
	return _getClass(arr) === 'Array';
}

}.call(this));