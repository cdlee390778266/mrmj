import Vue from 'vue'

Vue.filter('filterNull', function (value, defaultString) {

  return value ? value : ( defaultString ? defaultString : '-');
})