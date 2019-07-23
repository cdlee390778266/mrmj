import Utils from './utils';
const DICT = {
	currencyList: [],
	countryList: []
}

function getCurrency() {	//获取币种列表
	Utils.getJson(Utils.CONFIG.api.currencyList, (res) => {
		DICT.currencyList = res.data;
	})
}

function getCountry() {	//获取国家列表
	Utils.getJson(Utils.CONFIG.api.countryList, (res) => {
		DICT.countryList = res.data;
	})
}

function init() {	//初始化
	getCurrency();
	getCountry();
}

init();

export default DICT;