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
Utils.getTipText = function(type , code) {
	if(!type || !code) return;
	return CONFIG[type][code] || '';
}

/**
 * Shows the tip. 显示提示
 *
 * @param      {<string>}  type    	   提示框类型
 * @param      {<string>}  textType    提示文字类型
 * @param      {<string>}  code        提示代码
 */
Utils.showTip = function(type, textType, code, text) {
	MessageBox({
		title: '消息',
		showClose: true,
		message: text ? text : Utils.getTipText(textType, code),
		type: type ? type: 'success'
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
Utils.hideTip = function() {
	Message.close();
}

/**
 * Shows the modal dialog.	弹出框
 *
 * @param      {<type>}  type      弹出框类型
 * @param      {<type>}  textType  弹出文字类型
 * @param      {<type>}  code      弹出文字代码
 */
Utils.showModalDialog = function(type, textType, code) {
	MessageBox.alert(Utils.getTipText(textType, code), '提示', {
    	confirmButtonText: '确定',
    	type: type ? type: 'success'
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
Utils.getJson = function(url, success, error, params = {}, isShowPop=false, urlParams) {
	if(!url) return;
	var loadingInstance;
	if(isShowPop) {
		loadingInstance = Loading.service({
			fullscreen: true,
			customClass: 'loading page-loading'
		});
	}
	Utils.ajaxCount++;
	Utils.$http({
			method: 'post',
			url: url,
			timeout: 5000,
			data: params,
			params: urlParams
		})
		.then(function(res){
			// if(!(--Utils.ajaxCount) && isShowPop) {
			// 	loadingInstance.close()
			// }
			if(isShowPop) {
				loadingInstance.close()
			}
            if(typeof success == 'function') success(res.data)
        }, function(err){
        	if(isShowPop) {
        		loadingInstance.close();
        	}
        	Utils.showTip('error', 'error', '-1');
            if(typeof error == 'function') error(err)
        })
}

export default Utils