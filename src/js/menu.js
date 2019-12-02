const MENU = {
	sale: {
		orgCode: 'org_sale',
		name: '销售',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '跟踪需求',
				path: '/demand',
				icon: 'el-icon-lx-edit'
			},
			{
				name: '销售订单开展',
				path: '/order',
				icon: 'el-icon-tickets'
			},
			{
				name: '售后反馈',
				path: '/service',
				icon: 'el-icon-lx-service'
			},
			{
				name: '应收款',
				path: '/money',
				icon: 'el-icon-lx-redpacket'
			},
			{
				name: '客户档案',
				path: '/user',
				icon: 'el-icon-lx-people'
			},
			{
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			},
			{
				name: '详情',
				path: '/detail',
				paramsPath: '/detail/:id',
				icon: '',
				isSubPage: true, //不生成标签
				meta: '/detail' //标签唯一匹配字符串
			},
			{
				name: '编辑客户投诉',
				path: '/serviceEdit',
				paramsPath: '/serviceEdit/:type?/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '投诉完成',
				path: '/serviceComplete',
				paramsPath: '/serviceComplete/:id',
				icon: '',
				isSubPage: true
			}
		]
	},
	project: {
		orgCode: 'org_proj',
		name: '项目',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '查看待立项订单',
				path: '/order',
				icon: 'el-icon-folder-add'
			},
			{
				name: '整体模具立项',
				path: '/approval',
				paramsPath: '/approval/:id',
				icon: '',
				isSubPage: true
			},
			{
				name: '项目开展',
				path: '/progress',
				icon: 'el-icon-s-fold'
			},
			
			{
				name: '标件采购',
				path: '/purchase',
				icon: 'el-icon-lx-cart'
			},
			{
				name: '售后反馈',
				path: '/service',
				icon: 'el-icon-lx-service'
			},
			{
				name: '客户投诉回复',
				path: '/reply',
				paramsPath: '/reply/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		]
	},
	product: {
		orgCode: 'org_manu',
		name: '生产',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '工艺设计与估工',
				path: '/technology',
				paramsPath: '/technology/:id?',
				icon: 'el-icon-edit'
			},
			{
				name: '制定工艺卡',
				path: '/processCard',
				paramsPath: '/processcard/:id?',
				icon: '',
				isSubPage: true, //不生成标签
				meta: '/processcard' //标签唯一匹配字符串
			},
			{
				name: '电极设计与CNC编程',
				path: '/task',
				icon: 'el-icon-potato-strips'
			},
			{
				name: '完成电极设计任务',
				path: '/designElectrode',
				paramsPath: '/designElectrode/:id?',
				icon: '',
				isSubPage: true,
				meta: '/designElectrode' //标签唯一匹配字符串
			},
			{
				name: '生产订单跟踪',
				path: '/progress',
				icon: 'el-icon-s-operation'
			},
			{
				name: '下达重制订单',
				path: '/remanufacture',
				paramsPath: '/remanufacture/:id?',
				icon: '',
				isSubPage: true,
				meta: '/remanufacture' //标签唯一匹配字符串
			},
			{
				name: '手动增加生产订单',
				path: '/editOrder',
				paramsPath: '/editOrder/:id?',
				icon: '',
				isSubPage: true,
				meta: '/editOrder' //标签唯一匹配字符串
			},
			{
				name: '查看当前生产计划安排',
				path: '/detail',
				paramsPath: '/detail/:id?',
				icon: '',
				isSubPage: true,
				meta: '/detail' //标签唯一匹配字符串
			},
			{
				name: '当日工序生产',
				path: '/procedure',
				icon: 'el-icon-paperclip'
			},
			{
				name: '工序派工',
				path: '/dspwk',
				paramsPath: '/dspwk/:id?',
				icon: '',
				isSubPage: true,
				meta: '/dspwk' //标签唯一匹配字符串
			},
			{
				name: '生产报工',
				path: '/npwk',
				paramsPath: '/npwk/:id?',
				icon: '',
				isSubPage: true,
				meta: '/npwk' //标签唯一匹配字符串
			},
			{
				name: '设备管理',
				path: '/equipment',
				icon: 'el-icon-refrigerator'
			},
			{
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		],
	},
	plan: {
		orgCode: 'org_plan',
		name: '计划',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '制定生产计划',
				path: '/plan',
				icon: 'el-icon-tickets'
			},
			{
				name: '生产进度跟踪',
				path: '/progress',
				icon: 'el-icon-s-operation'
			},
			{
				name: '制定作业计划',
				path: '/edit',
				paramsPath: '/edit/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '终止生产订单',
				path: '/stop',
				paramsPath: '/stop',
				icon: '',
				isSubPage: true
			},
			{
				name: '委托加工',
				path: '/entrust',
				icon: 'el-icon-potato-strips'
			},
			{
				name: '编辑采购订单',
				path: '/placeOrder',
				paramsPath: '/placeOrder/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '到货登记',
				path: '/register',
				paramsPath: '/register/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '下达采购订单',
				path: '/order',
				paramsPath: '/order/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '采购订单完成确认',
				path: '/finish',
				paramsPath: '/finish/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		]
	},
	quality: {
		orgCode: 'org_qa',
		name: '质检',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '质量检验',
				path: '/test',
				icon: 'el-icon-tickets'
			},
			{
				name: '录入采购到货检验结果',
				path: '/registerArrival',
				paramsPath: '/registerArrival/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '录入工序完工检验结果',
				path: '/registerFinished',
				paramsPath: '/registerFinished/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '不良品处理',
				path: '/rejects',
				icon: 'el-icon-s-operation'
			},
			{
				name: '录入采购到货检验结果',
				path: '/registerArrivalRejects',
				paramsPath: '/registerArrivalRejects/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '录入工序完工检验结果',
				path: '/registerFinishedRejects',
				paramsPath: '/registerFinishedRejects/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '客户质量处理',
				path: '/progress',
				icon: 'el-icon-lx-service'
			},
			{
				name: '客户投诉回复',
				path: '/reply',
				paramsPath: '/reply/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '质量情况分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		]
	}
}

export default MENU