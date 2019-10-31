import axios from 'axios';
import CONFIG from './config';
import { Loading, Message, MessageBox } from 'element-ui';
import Menu from '../js/menu';

var Utils = {}

Utils.$http = axios;

Utils.CONFIG = CONFIG;

/**
 * Gets the tip text 获取提示文字
 *
 * @param      {<string>}  type    提示类型
 * @param      {<string>}  code    提示代码
 * @return     {<string>}  提示文字
 */
Utils.getTipText = function (type, code) {

	if (!type || !code) return;
	return CONFIG[type][code] || '';
}

/**
 * Shows the tip. 显示提示
 *
 * @param      {<string>}  type    	   提示框类型
 * @param      {<string>}  textType    提示文字类型
 * @param      {<string>}  code        提示代码
 */
Utils.showTip = function (type, textType, code, text) {

	Message({
		title: '消息',
		showClose: true,
		message: text ? text : Utils.getTipText(textType, code),
		type: type ? type : 'success'
	})
}
// Utils.showTip = function(type, textType, code, text) {
// 	Message({
//       showClose: true,
//       message: text ? text : Utils.getTipText(textType, code),
//       type: type ? type: 'success'
//     })
// }

/**
 * Hides the tip. 关闭提示框
 */
Utils.hideTip = function () {

	Message.close();
}

/**
 * Shows the modal dialog.	弹出框
 *
 * @param      {<type>}  type      弹出框类型
 * @param      {<type>}  textType  弹出文字类型
 * @param      {<type>}  code      弹出文字代码
 */
Utils.showModalDialog = function (type, textType, code) {

	MessageBox.alert(Utils.getTipText(textType, code), '提示', {
		confirmButtonText: '确定',
		type: type ? type : 'success'
	})
}

/**
 * Gets the json. 获取json数据
 *
 * @param      {<type>}    url      url
 * @param      {Function}  success  成功回调
 * @param      {Function}  error    失败回调
 * @param      {string}    params   参数
 */
Utils.getJson = function (url, success, error, params = {}, method='post', isFile = false) {

	if (!url) return;
	var loadingInstance;
	var config = {
		headers: {
			Authorization: localStorage.getItem('token') || ''
		},
		method: method,
		url: url,
		timeout: 5000,
		data: params
	}

	isFile && (config['Content-Type'] = 'multipart/form-data');

	Utils.$http(config)
		.then(function (res) {

			if(res.data.status == 'OK' ) {

				if (typeof success == 'function') success(res.data)
			}else {

				Utils.showTip('error', 'error', '', res.data.message);
				if (typeof error == 'function') error(res.data)
			}
		}, function (err) {

			Utils.showTip('error', 'error', '-1');
			if (typeof error == 'function') error(err)
		})
}

/**
 * 取得本地存储值
 */
Utils.getStorage = function(key) {

	return key ? localStorage.getItem(key) : '';
}

/**
 * 设置本地存储值
 */
Utils.setStorage = function(key, value) {

	return key ? localStorage.setItem(key, value) : '';
}

/**
 * 移除本地存储值
 */
Utils.removeStorage = function(key) {

	return key ? localStorage.removeItem(key) : '';
}

/**
 * 设置用户本地存储值
 */
Utils.setUserStorage = function(token, userId, userName, orgCode) {

	if(!token) return;

	Utils.setStorage(CONFIG.storageNames.tokenName, token);
	Utils.setStorage(CONFIG.storageNames.useridName, userId);
	Utils.setStorage(CONFIG.storageNames.usernameName, userName);
	Utils.setStorage(CONFIG.storageNames.orgcodeName, orgCode);
}

/**
 * 移除用户本地存储值
 */
Utils.removeUserStorage = function() {

	Utils.removeStorage(CONFIG.storageNames.tokenName);
	Utils.removeStorage(CONFIG.storageNames.useridName);
	Utils.removeStorage(CONFIG.storageNames.usernameName);
	Utils.removeStorage(CONFIG.storageNames.orgcodeName);
}

/**
 * 取得sessionStorage值
 */
Utils.getSessionStorage = function(key) {

	return key ? sessionStorage.getItem(key) : '';
}

/**
 * 设置sessionStorage值
 */
Utils.setSessionStorage = function(key, value) {

	return key ? sessionStorage.setItem(key, value) : '';
}

/**
 * 检查部门是否存在，并返回数据对象
 * orgCode 部门代码
 */
Utils.checkModuleExistence = function(orgCode) {

	let existence = false;
	let webOrgKey = '';

	for(let key in Menu) {

		if(Menu[key].orgCode == orgCode) {

			existence = true;
			webOrgKey = key;
			break;
		}
	}
	return {existence: existence, webOrgKey: webOrgKey};
}

/**
 * 数组或对象深度拷贝
 */
Utils.deepCopy = function(o) {
	if (o instanceof Array) {
	    var n = [];
	    for (var i = 0; i < o.length; ++i) {
	        n[i] = Utils.deepCopy(o[i]);
	    }
	    return n;

	} else if (o instanceof Object) {
	    var n = {}
	    for (var i in o) {
	        n[i] = Utils.deepCopy(o[i]);
	    }
	    return n;
	} else {
	    return o;
	}
}

/**
 * 按指定格式-格式化时间 如：new Date().Format('yyyy-MM-dd hh:mm:ss');
 * hasWeek用来显示是否显示星期
 */
Date.prototype.Format = function(fmt, hasWeek) {

	let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	let o = {
		'M+': this.getMonth() + 1,
		'd+': this.getDate(),
		'h+': this.getHours(),
		'm+': this.getMinutes(),
		's+': this.getSeconds(),
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		'S': this.getMilliseconds() //毫秒
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '')).substr(4 - RegExp.$1.length);
	for(var k in o) {
		if(new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length ==  1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
	}
	return fmt + (hasWeek ? '&nbsp;&nbsp;&nbsp;&nbsp;' + weekday[this.getDay()] : '');
}

// 拿到表格的高度和最高高度 高度===最高高度
Utils.getTableMaxHeight = (minusSelectors = ['.crumbs', '.detail-footer'], minusHeight = 55, containerSelector = '.content') => {

  let [container, minusHeightTotal]  = [document.querySelector(containerSelector), minusHeight];
  if (!container) return 200;

  let [boxHeight, maxHeight] = [container.clientHeight, maxHeight];

  if (navigator.userAgent.includes('Firefox')) minusHeightTotal += 20;
  for (let selector of minusSelectors) {

    minusHeightTotal += container.querySelector(selector).clientHeight;
  }

  maxHeight = boxHeight - minusHeightTotal;
  return  maxHeight > 200 ? maxHeight : 200;
};

//模拟请求
Utils.mock = function(url, success, error, params = {}, resData = {}) {

	window.setTimeout(() => {
		let res = {
			data: resData
		}
		if (typeof success == 'function') success(res)
	}, 1000)
}

export default Utils