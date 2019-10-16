import Utils from './utils';
let Dict = {
	currencyList: [],	//币种列表
	countryList: [],	//国家列表
	reqTypeList: [ //需求类型列表
		{
			label: '模具零件',
			value: 10
		},
		{
			label: '整体零件',
			value: 20
		}
	],	//需求类型
	reqTypeValToLab: {
		10: '模具零件',
		20: '整体零件'
	},	
	reqStatusList: [ //需求状态列表
		{
			label: '待报价',
			value: 10
		},
		{
			label: '已报价',
			value: 20
		},
		{
			label: '终止',
			value: 30
		},
		{
			label: '已下单',
			value: 40
		}
	],	//需求状态
	reqStatusValToLab: {
		10: '待报价',
		20: '已报价',
		30: '终止',
		40: '已下单'
	},
	outsourceList: [	//是否委外列表
		{
			label: '是',
			value: 1
		},
		{
			label: '否',
			value: 0
		}
	],
	outsourceLabelList: [	//是否委外列表
		{
			label: '外协',
			value: 1
		},
		{
			label: '非外协',
			value: 0
		}
	],
	progressList: [	//完成阶段列表
		{
			label: '设计完成',
			value: 0
		},
		{
			label: '标件到货',
			value: 1
		},
		{
			label: '模板到货',
			value: 2
		},
		{
			label: '零件加工完成',
			value: 3
		},
		{
			label: '塑料到货',
			value: 4
		},
		{
			label: '装模完成',
			value: 5
		},
		{
			label: 'T0试模完成',
			value: 6
		},
		{
			label: 'FA测量完成',
			value: 7
		},
		{
			label: 'T0样品提交',
			value: 8
		},
		{
			label: '移模',
			value: 9
		},
	],
	maxWorkTime: 100,
}

Dict.getCurrency = () => {	//获取币种列表
	Utils.getJson(Utils.CONFIG.api.currencyList, (res) => {
		Dict.currencyList = res.data;
	})
}

Dict.getCountry = () => {	//获取国家列表
	Utils.getJson(Utils.CONFIG.api.countryList, (res) => {
		Dict.countryList = res.data;
	})
}


Dict.getMaxWorkTime = () => {	//查询工序估工阈值
	Utils.getJson(Utils.CONFIG.api.maxWorkTime, (res) => {
		Dict.maxWorkTime = res.data && res.data.length && res.data[0].maxWorkTime ? res.data[0].maxWorkTime : 100;
	})
}

function init() {	//初始化
	Dict.getCurrency();
	Dict.getCountry();
	Dict.getMaxWorkTime();
}

init();

export default Dict;