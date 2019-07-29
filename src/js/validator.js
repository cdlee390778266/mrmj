// element ui 自定义表单验证
import Utils from './utils'
var Validator = {}

Validator.checkPhone = (rule, value, callback) => {
  if(!value) {

    callback(new Error(Utils.getTipText('error', '-1015')));
  }else if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {

    callback(new Error(Utils.getTipText('error', '-1016')));
  }else {

  	callback();
  }
}

export default Validator;