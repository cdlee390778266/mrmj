import Vue from 'vue'
import Dict from './dict'

Vue.filter('filterNull', function (value, defaultString = '-') {	//转空字符

  return value ? value : defaultString;
})

Vue.filter('filterValueToLabel', function (key, data = {}, defaultString = '-') {	//value转label
 
  let label = key ? data[key] : '';
  return label ? label : defaultString;
})

Vue.filter('concatString', function (data = [], key, defaultString = '/') {	//字符串连接
 
  let arr = [];
  data.forEach(item => {

    arr.push(item[key]);
  })
  
  return arr.join(defaultString);
})

Vue.filter('sum', function (data = [], key) {	//字符串连接
 
  let sum = 0;

  data.forEach(item => {

    sum += parseFloat(item[key]) || 0;
  })
  
  return sum;
})