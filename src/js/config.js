var baseUrl = 'http://118.178.229.13:41000/requirement/';

const CONFIG = {
	activeMenuType: 'sale',
	cookieKey: 'user',
	page: {
		size: 10,
		total: 101,
	},
	api: {
		//公共
		currencyList: baseUrl + 'currency/qc', //货币种类列表
		countryList: baseUrl + 'country/qc', //国家列表
		uploadFiles: baseUrl + 'fc/uploadFiles', //上传文件
		download: baseUrl + 'fc/downloadFiles', //下载文件

		login: baseUrl + 'auth/login', //登录

		//销售
		saveCustomer: baseUrl + 'customer/saveCustomer', //客户/供应商信息录入
		
	},
	success: {
		"1": "加载数据成功",
		'101': "注册成功",
	},
	error: {
		'-1': '加载数据失败，请检查网络！',
		'-1010': '请输入客户名称！',
		'-1011': '长度不得大于20位！',
		'-1012': '请输入客户简称！',
		'-1013': '请选择客户所在国！',
		'-1014': '请输入详细地址！',
		'-1015': '请输入联系电话！',
		'-1016': '请输入正确的电话号码！',
		'-1017': '请选择常用货币！',
		'-1018': '请输入付款账期！',
		'-1030': '请输入用户名！',
		'-1031': '请输入密码！',
		'-1032': '请输入6-20位密码！',
	}
}

export default CONFIG