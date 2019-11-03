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
		image: baseUrl + 'fc/imgStreamOther', //图片接口
		customer: baseUrl + 'requirement/customer/qc', //客户名称查询接口
		qwm: baseUrl + 'requirement/saleOrder/qwm', //模具与零件号联动查询接口
		maxWorkTime: baseUrl + 'requirement/threshold/qc', //生产--查询工序估工阈值
		currency: baseUrl + 'requirement/currency/qwm', //生产--货币与汇率联动查询
		
		login: baseUrl + 'authMR/login', //登录

		/* 销售模块*/
		addRequirement: baseUrl + 'requirement/req/addRequirement', //需求--新增需求
		modifyRequirement: baseUrl + 'requirement/req/modifyRequirement', //需求--需求修改
		queryRequirement: baseUrl + 'requirement/req/queryRequirement', //需求--需求查询
		queryRequirementDetail: baseUrl + 'requirement/req/queryRequirementDetail', //需求--客户需求详细信息
		saveDemand: baseUrl + 'requirement/demand/saveDemand', //需求--需求终止
		querySaleOrderInModify: baseUrl + 'requirement/req/querySaleOrderInModify', //需求--需求下单出销售订单查询
		matchCodeType: baseUrl + 'requirement/demand/matchCodeType', //需求--终止类型联想匹配
		
		
		querySaleOrder: baseUrl + 'requirement/saleOrder/querySaleOrder', //销售订单开展--销售订单查询
		saveSaleOrder: baseUrl + 'requirement/saleOrder/saveSaleOrder', //销售订单开展--新增销售订单或保存为草稿
		checkRequirementNum: baseUrl + 'requirement/req/checkRequirementNum', //销售订单开展--需求编号验重
		editSaleOrder: baseUrl + 'requirement/saleOrder/editSaleOrder', //销售订单开展--编辑销售订单
		deleteSaleOrder: baseUrl + 'requirement/saleOrder/deleteSaleOrder', //销售订单开展--删除销售订单
		pauseOrStopSaleOrder: baseUrl + 'requirement/saleOrder/pauseOrStopSaleOrder', //销售订单开展--暂停或终止销售订单
		resetSaleOrder: baseUrl + 'requirement/saleOrder/resetSaleOrder', //销售订单开展--恢复已暂停的销售订单
		customerQueryCustomer: baseUrl + 'requirement/customer/queryCustomer', //客户档案--客户/供应商查询
		saveCustomerHeadPortraits: baseUrl + 'requirement/customer/saveCustomerHeadPortraits', //客户档案--存储客户当前上传的头像
		saveCustomer: baseUrl + 'requirement/customer/saveCustomer', //客户档案--客户/供应商信息录入
		customerQcip: baseUrl + 'requirement/customer/selectCustomer', //客户档案--查询客户/供应商信息
		modifyCustomerInfo: baseUrl + 'requirement/customer/modifyCustomerInfo', //客户档案--修改客户信息
		sumCusRequirement: baseUrl + 'requirement/customer/sumCusRequirement', //客户档案--统计当前符合条件的客户需求数量

		/* 生产模块*/
		saveSaleInProduct: baseUrl + 'requirement/productionOrder/saveSaleInProduct', //生产--工艺路线处新增销售订单
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
		editProductionTrack: baseUrl + 'requirement/productionOrder/editProductionTrack', //生产--编辑
		terminateOrPauseOrder: baseUrl + 'requirement/productionOrder/terminateOrPauseOrder', //生产--暂停与终止生产订单
		querySaleOrderInfo: baseUrl + 'requirement/saleOrder/querySaleOrderInfo', //生产--查看相关销售订单
		queryPlanList: baseUrl + 'requirement/makeworkplan/queryPlanList', //生产--查看制定作业计划
		queryRestartComponent: baseUrl + 'requirement/productionOrder/queryRestartComponent', //生产--零件重置版本信息查询
		queryTodayProcess: baseUrl + 'requirement/productionOrder/queryTodayProcess', //生产--工序生产列表
		queryTodayProcessByName: baseUrl + 'requirement/jobbooking/queryTodayProcessByName', //生产--报工工序查找
		queryProcessorById: baseUrl + 'requirement/productionOrder/queryProcessorById', //生产--派工加工人员信息查找
		checkNumber: baseUrl + 'requirement/idle/checkNumber', //生产-- 工序加工人员编号验重
		addProcessor: baseUrl + 'requirement/productionOrder/addProcessor', //生产--添加加工人员
		workTimeDays: baseUrl + 'requirement/workTimeDays/qc', //日工时查询
		setWorkTimeDays: baseUrl + 'requirement/workTimeDays/sou', //生产--设置日工时
		queryOperationalProcess: baseUrl + 'requirement/operationalPlan/queryOperationalProcess', //生产--派工工序查找
		queryAssignWorkInfo: baseUrl + 'requirement/productionOrder/queryAssignWorkInfo', //生产--派工页面详细信息
		processAssignWork: baseUrl + 'requirement/operationalPlan/processAssignWork', //生产--工序派工
		idle: baseUrl + 'requirement/idle/qc', //生产--报工处加工人员下拉框
		saveJobBooking: baseUrl + 'requirement/jobbooking/saveJobBooking', //生产--报工
		
		/* 计划模块*/
		setMaxWorkTime: baseUrl + 'requirement/threshold/sou', //计划--工序估工阈值设置
		getAllProcessOfIndex: baseUrl + 'requirement/productionOrder/getAllProcessOfIndex', //计划--获取计划表表头工序
		queryPlanList: baseUrl + 'requirement/makeworkplan/queryPlanList', //计划--当前生产计划列表
		sendOutGoods: baseUrl + 'requirement/plan/sendOutGoods', //生产进度跟踪--发货
		saveSelectedTask: baseUrl + 'requirement/plan/saveSelectedTask', //生产进度跟踪--记录勾选的任务
		queryPlanProcess: baseUrl + 'requirement/plan/queryPlanProcess', //生产进度跟踪--查询已制定的作业计划
		queryNeedStopOfOrder: baseUrl + 'requirement/plan/queryNeedStopOfOrder', //生产进度跟踪--未终止生产订单查询
		stopOrPauseOrder: baseUrl + 'requirement/term/stopOrPauseOrder', //生产进度跟踪--暂停与终止生产订单
		resetOrder: baseUrl + 'requirement/term/resetOrder', //生产进度跟踪--恢复订单
		stopOrPauseRoute: baseUrl + 'requirement/term/stopOrPauseRoute', //生产进度跟踪--暂停与终止零件工艺路线
		resetCraftRoute: baseUrl + 'requirement/term/resetCraftRoute', //生产进度跟踪--恢复生产
		makeOperationPlan: baseUrl + 'requirement/operationalPlan/makeOperationPlan', //生产进度跟踪--制定作业计划
		processTransferRegister: baseUrl + 'requirement/plan/processTransferRegister', //计划--工件流转登记
		queryNoReleasedPurchase: baseUrl + 'requirement/purchaseOrder/queryNoReleasedPurchase', //计划--外协申请
		deletePurchaseApply: baseUrl + 'requirement/purchaseOrder/deletePurchaseApply', //计划--删除外协申请
		queryReleasingPurchase: baseUrl + 'requirement/purchaseOrder/queryReleasingPurchase', //计划--查询当前选择的外协
		checkPurchaseOrderNo: baseUrl + 'requirement/purchaseOrder/checkPurchaseOrderNo', //计划--于采购订单号验重
		releasedPurchaseOrder: baseUrl + 'requirement/purchaseOrder/releasedPurchaseOrder', //计划--下达采购订单
		queryPurchaseOrder: baseUrl + 'requirement/purchaseOrder/queryPurchaseOrder', //计划--未发货的外协采购订单

		/* 质检模块*/
		queryGoodsInspectInfo: baseUrl + 'requirement/goodsInspection/queryGoodsInspectInfo', //质量质检--采购到货查询
		queryGoodsInspect: baseUrl + 'requirement/goodsInspection/queryGoodsInspect', //质量质检--未全部收货的采购订单表头查询
		saveGoodsInspection: baseUrl + 'requirement/goodsInspection/saveGoodsInspection', //质量质检--外协到货检验录入
		queryProcessInspectInfo: baseUrl + 'requirement/processInspection/queryProcessInspectInfo', //质量质检--完工检验查询
		queryNoJobBookingProcess: baseUrl + 'requirement/processInspection/queryNoJobBookingProcess', //质量质检--报工中未进行工序检验的零件查询
		saveProcessInspection: baseUrl + 'requirement/processInspection/saveProcessInspection', //质量质检--工序完工检验录入
		queryGoodsInspectInfo: baseUrl + 'requirement/goodsInspection/queryGoodsInspectInfo', //质量质检--采购到货不良品查询
		saveGoodsRejectsInfo: baseUrl + 'requirement/goodsInspection/saveGoodsRejectsInfo', //质量质检--采购到货不良品处置录入
		queryProcessInspectInfo: baseUrl + 'requirement/processInspection/queryProcessInspectInfo', //质量质检--工序完工不良品查询
		saveProcessRejectsInfo: baseUrl + 'requirement/processInspection/saveProcessRejectsInfo', //质量质检--工序完工不良品处置录入
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
		'-1078': '至少选中一项',
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
		
	}
}

export default CONFIG