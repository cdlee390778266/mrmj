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
}

function getCurrency() {	//获取币种列表
	Utils.getJson(Utils.CONFIG.api.currencyList, (res) => {
		Dict.currencyList = res.data;
	})
}

function getCountry() {	//获取国家列表
	Utils.getJson(Utils.CONFIG.api.countryList, (res) => {
		Dict.countryList = res.data;
	})
}

function init() {	//初始化
	getCurrency();
	getCountry();
}

init();

export default Dict;