var baseUrl = 'http://118.178.229.13:41000/';

const CONFIG = {
	activeMenuType: 'sale',
	cookieKey: 'user',
	page: {
		size: 10,
		total: 101,
	},
	api: {
		//公共
		currencyList: baseUrl + 'requirement/currency/qc', //货币种类列表
		countryList: baseUrl + 'country/qc', //国家列表
		uploadFiles: baseUrl + 'fc/uploadFiles', //上传文件
		download: baseUrl + 'fc/downloadFiles', //下载文件

		//销售
		saveCustomer: baseUrl + 'customer/saveCustomer', //客户/供应商信息录入
		
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