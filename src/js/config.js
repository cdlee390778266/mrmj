var baseUrl = 'http://118.178.229.13:41000/';

const CONFIG = {
	activeMenuType: 'sale',
	cookieKey: 'user',
	page: {
		currentPage: 0,
		offset: 0,
		limit: 10,
		totalElements: 0,
		totalPages: 0
	},
	api: {
		//公共
		currencyList: baseUrl + 'requirement/currency/qc', //货币种类列表
		countryList: baseUrl + 'requirement/country/qc', //国家列表
		uploadFiles: baseUrl + 'fc/uploadFiles', //上传文件
		download: baseUrl + 'fc/downloadFiles', //下载文件
		image: baseUrl + 'fc/imgStreamOther	', //图片接口

		login: baseUrl + 'authMR/login', //登录

		/* 销售模块*/
		customerQueryCustomer: baseUrl + 'requirement/customer/queryCustomer', //客户档案--客户/供应商查询
		saveCustomerHeadPortraits: baseUrl + 'requirement/customer/saveCustomerHeadPortraits', //客户档案--存储客户当前上传的头像
		saveCustomer: baseUrl + 'requirement/customer/saveCustomer', //客户档案--客户/供应商信息录入
		customerQcip: baseUrl + 'requirement/customer/qcip', //客户档案--查询客户/供应商信息
		modifyCustomerInfo: baseUrl + 'requirement/customer/modifyCustomerInfo', //客户档案--修改客户信息
		sumCusRequirement: baseUrl + 'requirement/customer/sumCusRequirement', //客户档案--统计当前符合条件的客户需求数量
		saveRequirement: baseUrl + '/requirement/req/saveRequirement', //需求--新增需求
		modifyRequirement: baseUrl + '/requirement/req/modifyRequirement', //需求--需求修改
		queryRequirement: baseUrl + '/requirement/req/queryRequirement', //需求--需求查询
		queryRequirementDetail: baseUrl + '/requirement/req/queryRequirementDetail', //需求--客户需求详情
		sumRequirement: baseUrl + '/requirement/requirement/sumRequirement', //需求--统计符合条件
		saveDemand: baseUrl + '/requirement/demand/saveDemand', //需求--需求终止
		sysCodeQc: baseUrl + '/requirement/sysCode/qc', //需求--需求终止类型查询
		inputDemand: baseUrl + '/requirement/demand/inputDemand', //需求--终止类型联想匹配
		saveComponentOfferRecord: baseUrl + '/requirement/componentOfferRecord/saveComponentOfferRecord', //需求--零件报价


		
	},
	success: {
		"1": "加载数据成功",
		'101': "注册成功",
		'102': '保存成功'
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