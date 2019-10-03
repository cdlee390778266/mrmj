import Utils from './utils';

var baseUrl = 'http://118.178.229.13:41000/';

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
		currencyList: baseUrl + 'requirement/currency/qc', //货币种类列表
		countryList: baseUrl + 'requirement/country/qc', //国家列表
		uploadFiles: baseUrl + 'fc/uploadFiles', //上传文件
		deleteFiles: baseUrl + 'fc/deleteFiles', //生产--删除服务器端的文件
		download: baseUrl + 'fc/downloadFiles', //下载文件
		image: baseUrl + 'fc/imgStreamOther	', //图片接口

		login: baseUrl + 'authMR/login', //登录

		/* 销售模块*/
		customerQueryCustomer: baseUrl + 'requirement/customer/queryCustomer', //客户档案--客户/供应商查询
		saveCustomerHeadPortraits: baseUrl + 'requirement/customer/saveCustomerHeadPortraits', //客户档案--存储客户当前上传的头像
		saveCustomer: baseUrl + 'requirement/customer/saveCustomer', //客户档案--客户/供应商信息录入
		customerQcip: baseUrl + 'requirement/customer/selectCustomer', //客户档案--查询客户/供应商信息
		modifyCustomerInfo: baseUrl + 'requirement/customer/modifyCustomerInfo', //客户档案--修改客户信息
		sumCusRequirement: baseUrl + 'requirement/customer/sumCusRequirement', //客户档案--统计当前符合条件的客户需求数量
		saveRequirement: baseUrl + 'requirement/req/saveRequirement', //需求--新增需求
		modifyRequirement: baseUrl + 'requirement/req/modifyRequirement', //需求--需求修改
		queryRequirementDetail: baseUrl + 'requirement/req/queryRequirementDetail', //需求--需求查询
		sumRequirement: baseUrl + 'requirement/requirement/sumRequirement', //需求--统计符合条件
		saveDemand: baseUrl + 'requirement/demand/saveDemand', //需求--需求终止
		sysCodeQc: baseUrl + 'requirement/sysCode/qc', //需求--需求终止类型查询
		inputDemand: baseUrl + 'requirement/demand/inputDemand', //需求--终止类型联想匹配
		saveComponentOfferRecord: baseUrl + 'requirement/componentOfferRecord/saveComponentOfferRecord', //需求--零件报价

		/* 生产模块*/
		queryPendingSaleOrder: baseUrl + 'requirement/saleOrder/queryPendingSaleOrder', //生产--待处理的销售订单列表
		queryPendingSaleOrderDetail: baseUrl + 'requirement/saleOrder/queryPendingSaleOrderDetail', //生产--销售订单详细信息
		modifyCraftRouteLine: baseUrl + 'requirement/productionOrder/modifyCraftRouteLine', //生产--修改零件工艺与下料清单
		deleteCraftInfoById: baseUrl + 'requirement/productionOrder/deleteCraftInfoById', //生产--删除已制定工艺卡
		designCraftRouteLine: baseUrl + 'requirement/productionOrder/designCraftRouteLine', //生产--制定零件工艺与下料清单
		queryNoMakeCraft: baseUrl + 'requirement/productionOrder/queryNoMakeCraft', //生产--待制定订单零件列表查询
		queryHaveMakeCraftComponent: baseUrl + 'requirement/productionOrder/queryHaveMakeCraftComponent', //生产--已制定工艺列表查询
		queryProductionOrderInfo: baseUrl + 'requirement/productionOrder/queryProductionOrderInfo', //生产--查询待下达生产订单时的详细信息
		releasedProductionOrder: baseUrl + 'requirement/productionOrder/releasedProductionOrder', //生产--下达生产订单
		saveAsDraft: baseUrl + 'requirement/productionOrder/saveAsDraft', //生产--将生产订单保存为草稿

		stuff: baseUrl + 'requirement/stuff/qc', //生产--材料列表
		process: baseUrl + 'requirement/process/qc', //生产--工序名称查询
		sysCode: baseUrl + 'requirement/sysCode/qc', //生产--工序内容查询
		queryComponentVersion: baseUrl + 'requirement/productionOrder/queryComponentVersion', //生产--零件版本查询接口
		queryVersionDetail: baseUrl + 'requirement/productionOrder/queryVersionDetail', //生产--版本详细信息查询接口
		saveCraftAttachment: baseUrl + 'requirement/productionOrder/saveCraftAttachment', //生产--存储上传的文件
		deleteCraftAttachment: baseUrl + 'requirement/productionOrder/deleteCraftAttachment', //生产--删除本地文件信息
		
		queryNoDealEleOrCNC: baseUrl + 'requirement/productionOrder/queryNoDealEleOrCNC', //生产--待设计电极与待处理CNC编程查询
		queryElectrodeComponentInfo: baseUrl + 'requirement/electrodeOrder/queryElectrodeComponentInfo', //生产--电极设计完成页面查询
		electrodeDesignCompletion: baseUrl + 'requirement/electrodeOrder/electrodeDesignCompletion', //生产--电极设计完成
		saveEleAsModify: baseUrl + 'requirement/electrodeOrder/saveEleAsModify', //生产--将电极生产订单保存为草稿
		applyElectrodeDesignTasks: baseUrl + 'requirement/electrodeOrder/applyElectrodeDesignTasks', //生产--申领电极任务
		queryElectrodeNoById: baseUrl + 'requirement/electrodeOrder/queryElectrodeNoById', //生产--电极工艺版本列表查询
		modifyEleInfo: baseUrl + 'requirement/electrodeOrder/modifyEleInfo', //生产--修改电极工艺版本列表信息
		deleteElectrodeList: baseUrl + 'requirement/electrodeOrder/deleteElectrodeList', //生产--删除电极列表
		designElectrodeDesignTasks: baseUrl + 'requirement/electrodeOrder/designElectrodeDesignTasks', //生产--设计电极任务
		saveEleAttachment: baseUrl + 'requirement/electrodeOrder/saveEleAttachment', //生产--存储电极附件
		deleteAttachment: baseUrl + 'requirement/attachment/deleteAttachment', //生产--删除本地电极附件
		applyProgrammeTask: baseUrl + 'requirement/electrodeOrder/applyProgrammeTask', //生产--申领编程任务
		saveProAttachment: baseUrl + 'requirement/electrodeOrder/saveProAttachment', //生产--编程任务附件存储
		queryAttInProgramme: baseUrl + 'requirement/electrodeOrder/queryAttInProgramme', //生产--编程任务附件列表
		releasedElectrodeProductionOrder: baseUrl + 'requirement/electrodeOrder/releasedElectrodeProductionOrder', //生产--下达电极生产订单
		trackProductionOrder: baseUrl + 'requirement/productionOrder/trackProductionOrder', //生产--生产订单跟踪查询
		terminateOrPauseOrder: baseUrl + 'requirement/productionOrder/terminateOrPauseOrder', //生产--暂停与终止生产订单
		querySaleOrderInfo: baseUrl + 'requirement/saleOrder/querySaleOrderInfo', //生产--查看相关销售订单
		queryPlanList: baseUrl + 'requirement/makeworkplan/queryPlanList', //生产--查看制定作业计划
		queryTodayProcess: baseUrl + 'requirement/productionOrder/queryTodayProcess', //生产--工序生产列表
		queryTodayProcessByName: baseUrl + 'requirement/jobbooking/queryTodayProcessByName', //生产--查找报工的工序
		processAssignWork: baseUrl + 'requirement/operationalPlan/processAssignWork', //生产--工序派工
		saveJobBooking: baseUrl + 'requirement/jobbooking/saveJobBooking', //生产--报工
		
		/* 计划模块*/
		queryNoReleasedPurchase: baseUrl + 'requirement/purchaseOrder/queryNoReleasedPurchase', //计划--查询外协任务
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
	},
	error: {
		'-1': '加载数据失败，请检查网络！',
		'-2': '上传失败！',
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
		'-1060': '请选择一个或多个需要外协的零件'
	}
}

export default CONFIG