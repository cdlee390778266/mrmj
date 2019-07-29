import axios from 'axios'
import CONFIG from './config'
import { Loading, Message, MessageBox } from 'element-ui';

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
	MessageBox({
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
Utils.getJson = function (url, success, error, params = {}, isShowPop = false, urlParams) {
	if (!url) return;
	var loadingInstance;
	if (isShowPop) {
		loadingInstance = Loading.service({
			fullscreen: true,
			customClass: 'loading page-loading'
		});
	}
	Utils.ajaxCount++;
	Utils.$http({
		headers: {
			Authorization: localStorage.getItem('token') || ''
		},
		method: 'post',
		url: url,
		timeout: 5000,
		data: params,
		params: urlParams
	})
		.then(function (res) {
			// if(!(--Utils.ajaxCount) && isShowPop) {
			// 	loadingInstance.close()
			// }
			if (isShowPop) {
				loadingInstance.close()
			}
			if(res.data.status == 'OK' ) {
				if (typeof success == 'function') success(res.data)
			}else {
				Utils.showTip('error', 'error', '', res.data.message);
			}
		}, function (err) {
			if (isShowPop) {
				loadingInstance.close();
			}
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

export default Utils