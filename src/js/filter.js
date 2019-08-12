import Vue from 'vue'
import Dict from './dict'

Vue.filter('filterNull', function (value, defaultString = '-') {	//转空字符

  return value ? value : defaultString;
})

Vue.filter('filterValueToLabel', function (key, data = {}, defaultString = '-') {	//value转label
 
  let label = key ? data[key] : '';
  return label ? label : defaultString;
})