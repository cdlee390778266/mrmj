var baseUrl = 'http://112.19.171.231:8080/fests/';

const CONFIG = {
	activeMenuType: 'quality',
	cookieKey: 'user',
	page: {
		size: 10,
		total: 101,
	},
	api: {
		testUrl: baseUrl + 'comcenter/replylist.do', //测试
	},
	success: {
		"1": "加载数据成功",
		'101': "注册成功",
	},
	error: {
		'-1': '加载数据失败，请检查网络！',
		'-1010': '手机号码不能为空！',
	}
}

export default CONFIG