import Utils from './utils';
let Dict = {
	currencyList: [],	//币种列表
	exchangeRateList: [],	//汇率列表
	countryList: [],	//国家列表
	areaList: [], //地区列表
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
	maxWorkTime: 100,
	mouldNoList: []
}

Dict.getCurrency = () => {	//获取币种列表
	Utils.getJson(Utils.CONFIG.api.queryCurrencyList, (res) => {
		Dict.currencyList = res.data;
	})
}

Dict.getExchangeRate = () => {	//获取汇率列表
	Utils.getJson(Utils.CONFIG.api.queryExchangeRateList, (res) => {
		Dict.exchangeRateList = res.data;
	})
}

Dict.getCountry = () => {	//获取国家列表
	Utils.getJson(Utils.CONFIG.api.queryCountryList, (res) => {
		Dict.countryList = res.data;
	})
}

Dict.getArea = () => {	//获取地区列表
	Utils.getJson(Utils.CONFIG.api.queryAreaList, (res) => {
		Dict.areaList = res.data;
	})
}


// Dict.getMaxWorkTime = () => {	//查询工序估工阈值
// 	Utils.getJson(Utils.CONFIG.api.maxWorkTime, (res) => {
// 		Dict.maxWorkTime = res.data && res.data.length && res.data[0].maxWorkTime ? res.data[0].maxWorkTime : 100;
// 	})
// }

// Dict.getMouldNoList = () => {	//查询模具与零件号联动列表
// 	Utils.getJson(Utils.CONFIG.api.qwm, (res) => {
// 		Dict.mouldNoList = res.data ? res.data : [];
// 	})
// }

function init() {	//初始化
	Dict.getCurrency();
	Dict.getExchangeRate();
	Dict.getCountry();
	Dict.getArea();
	// Dict.getMaxWorkTime();
	// Dict.getMouldNoList();
}

init();

export default Dict;