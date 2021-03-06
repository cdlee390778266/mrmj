import Utils from './utils';

var baseUrl = 'http://132.232.51.40:9106';
//var baseUrl = '/api/';

const CONFIG = {
	activeMenuType: 'sale',
	storageNames: {
		tokenName: 'token',
		useridName: 'userId',
		usernameName: 'userName',
		orgcodeName: 'org',
	},
	page: {
		pageNo: 1,
		pageSize: 1000,
		totalElements: 0,
		totalPages: 0
	},
	api: {
		//公共
		queryCurrencyList: baseUrl + '/sys/currency/queryCurrencyList', //货币种类列表
		queryExchangeRateList: baseUrl + '/sys/exchangeRate/queryExchangeRateList', //汇率列表
		queryCountryList: baseUrl + '/sys/country/queryCountryList', //国家列表
		queryAreaList: baseUrl + '/sys/area/queryAreaList', //地区列表
		attachmentUpload: baseUrl + '/sys/attachment/attachmentUpload', //上传附件
		queryProcessList: baseUrl + '/sys/process/queryProcessList', //工序列表
		queryStuffList: baseUrl + '/sys/stuff/queryStuffList', //材料列表

		login: baseUrl + '/sys/login/doLogin', //登录

		//销售
		queryCustomerList: baseUrl + '/sale/customer/queryCustomerList', //客户档案-列表
		customerDetail: baseUrl + '/sale/customer/queryCustomerDetail', //客户档案-客户详情
		checkCustomerName: baseUrl + '/sale/customer/checkCustomerName', //客户档案-客户名称验重
		editCustomer: baseUrl + '/sale/customer/editCustomer', //客户档案-编辑客户档案
		queryCustomerMettingRecordList: baseUrl + '/sale/customer/queryCustomerMettingRecordList', //客户档案-会议记录列表
		editCustomerMettingRecord: baseUrl + '//sale/customer/editCustomerMettingRecord', //客户档案-增加会议记录
		delCustomer: baseUrl + '/sale/customer/delCustomer', //客户档案-删除客户档案
		queryOfferList: baseUrl + '/sale/offer/queryOfferList', //报价管理-报价记录列表
		queryOfferDetail: baseUrl + '/sale/offer/queryOfferDetail', //报价管理-客户项目详细信息
		editOffer: baseUrl + '/sale/offer/editOffer', //报价管理-编辑客户项目信息
		delOffer: baseUrl + '/sale/offer/delOffer', //报价管理-删除项目
		editOfferRecord: baseUrl + '/sale/offer/editOfferRecord', //报价管理-编辑报价记录
		dowloadOfferRecordPdf: baseUrl + '/sale/offer/dowloadOfferRecordPdf', //报价管理-生成报价单
		queryOfferRecord: baseUrl + '/sale/offer/queryOfferRecord', //报价管理-报价详细信息
		placeSaleOrder: baseUrl + '/sale/offer/placeSaleOrder', //报价管理-下达销售订单
		delOfferRecord: baseUrl + '/sale/offer/delOfferRecord', //报价管理-删除报价
		queryOrderSerialNo: baseUrl + '/sale/offer/queryOrderSerialNo', //报价管理-查询订单流水号
		
		queryOrderList: baseUrl + '/sale/order/queryOrderList', //订单管理-列表
		queryOrderListTitle: baseUrl + '/sale/order/queryOrderListTitle', //订单管理-表头工序列表
		queryShipableOrderList: baseUrl + '/sale/order/queryShipableOrderList', //订单管理-查询可以发货的销售订单及其零件列表
		editShipableOrder: baseUrl + '/sale/order/editShipableOrder', //订单管理-出货
		editSuspendOrder: baseUrl + '/sale/order/editSuspendOrder', //订单管理-暂停
		editStopOrder: baseUrl + '/sale/order/editStopOrder', //订单管理-终止
		queryComplaintList: baseUrl + '/sale/complaint/queryComplaintList', //客户投诉-列表
		editComplaint: baseUrl + '/sale/complaint/editComplaint', //客户投诉-列表
		editComplaintDetail: baseUrl + '/sale/complaint/editComplaintDetail', //客户投诉-处理完成
	},
	success: {
		"1": "加载数据成功",
		'101': "注册成功",
		'102': '保存成功',
		'103': '申领成功',
		'104': '删除成功',
		'105': '暂停成功',
		'106': '终止成功',
		'107': '已消除警告',
		'108': '下达采购订单成功',
		'109': '提交成功',
		'110': '上报成功',
		'111': '新增成功',
		'112': '回复成功',
		'113': '下达订单成功',
		'114': '已暂停',
		'115': '已终止',
		'116': '删除成功',
		'117': '操作成功',
		'118': '发货成功',
		'119': '恢复成功',
		'120': '修改成功',
		'121': '设置成功',
	},
	error: {
		'-1': '加载数据失败，请刷新页面重试！',
		'-2': '上传失败！',
		'-3': '操作失败！',
		'-1000': '数据出错，没有对应的部门！',
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
		'-1040': '请选择一个或多个零件，制定工艺。当选择多个零件时，表示对所选的多个零件制定相同的工艺。',
		'-1041': '未制定零件工艺！',
		'-1042': '还存在零件未制定工艺！',
		'-1043': '请输入工艺路线版本号！',
		'-1044': '输入工艺路线版本号已存在，请重新输入！',
		'-1045': '输入工艺路线版本号与选中工艺路线版本号不一致',
		'-1046': '未制定电极工艺，不能下达电极生产订单',
		'-1047': '请输入材料！',
		'-1050': '电极号不能为空',
		'-1060': '请选择一个或多个需要外协的零件',
		'-1070': '请选择客户',
		'-1071': '请选择模具号',
		'-1072': '请选择零件号',
		'-1073': '请选择报工日期',
		'-1074': '请选择报工人员',
		'-1075': '请选择报工工序',
		'-1076': '请输入员工编号',
		'-1077': '员工编号重复',
		'-1078': '至少选中一条数据',
		'-1079': '没有要保存的数据',
		'-1080': '请输入供应商名称',
		'-1081': '请输入供应商简称',
		'-1082': '请输入详细地址',
		'-1083': '请输入联系电话',
		'-1084': '零件清单至少有一条数据，并且零件号、数量、客户编号、要求交期不能为空',
		'-1085': '请输入需求终止原因',
		'-1086': '请输入客户PO.号',
		'-1087': '请输入需求编号',
		'-1088': '需求编号已存在',
		'-1089': '需求明细至少有一条数据，并且零件号、客户编号、数量、要求交期不能为空',
		'-1090': '请输入模具号',
		'-1091': '请选择结算货币',
		'-1092': '请选择结算汇率',
		'-1093': '请输入结算货币总价',
		'-1094': '模具号已存在',
		'-1095': '请选择交易货币',
		'-1096': '请选择汇率',
		'-1097': '请选择管理费用上浮比例',
		'-1098': '请输入报价单编号',
		'-1099': '报价单编号已存在',
		'-1100': '报价零件列表不能为空(有Det No.才为有效的数据)',
		'-1101': '没有选中要保存的数据',
		'-1102': '采购订单号不存在',
		'-1103': '请输入主题',
		'-1104': '请输入地点',
		'-1105': '请选择时间',
		'-1106': '请选择处理状态',
		'-1107': '请选择客户所在区域',
		'-1108': '请输入客户名称',
		'-1109': '客户名称已存在',
		'-1110': '请输入加工数量',
		'-1111': '请输入投诉数量',
		'-1112': '请输入责任人',
		'-1113': '请输入项目编号',
		'-1114': '请选择联系人',
		'-1115': '请输入报价单号',
		'-1116': '请输入佣金率',
		'-1117': '请输入费用率',
		'-1118': '请输入调整率',
		'-1119': '请选择交易货币',
		'-1120': '请选择汇率',
	}
}

export default CONFIG