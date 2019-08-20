const MENU = {
	sale: {
		orgCode: 'org_sale',
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
				icon: '',
				isSubPage: true
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
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		]
	},
	product: {
		orgCode: 'org_manu',
		list: [
			{
				name: '首页',
				path: '/home',
				icon: 'el-icon-lx-home'
			},
			{
				name: '工艺设计与估工',
				path: '/technology',
				icon: 'el-icon-edit'
			},
			{
				name: '制定工艺卡',
				path: '/processCard',
				paramsPath: '/processcard/:id?',
				icon: '',
				isSubPage: true
			},
			{
				name: '电极设计任务',
				path: '/task',
				icon: 'el-icon-potato-strips'
			},
			{
				name: '生产进度跟踪',
				path: '/progress',
				icon: 'el-icon-s-operation'
			},
			{
				name: '工序生产',
				path: '/procedure',
				icon: 'el-icon-paperclip'
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
				name: '委托加工',
				path: '/entrust',
				icon: 'el-icon-potato-strips'
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
				name: '制定作业计划',
				path: '/task',
				icon: 'el-icon-s-operation'
			},
			{
				name: '跟踪生产进度',
				path: '/progress',
				icon: 'el-icon-lx-service'
			},
			{
				name: '信息查询与分析',
				path: '/query',
				icon: 'el-icon-lx-rank'
			}
		]
	}
}

export default MENU