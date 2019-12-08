let leftMixin = {
	data() {
		return {
			defaultImg: require('../assets/img/img1.svg'),
			isLoading: false,
			maxHeight: 600,
			table: {
				isLoading: false,
				page: Object.assign({}, this.$utils.CONFIG.page),
				srcData: [],
				data: []
			}
		}
	},
	methods: {
    resetForm(formName) {

      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    beforeAvatarUpload(file) {	//上传头像之前判断
	    	
			let fileTypeArr = ['image/jpeg', 'image/gif', 'image/png'];
			let isLt2M = file.size / 1024 / 1024 < 2;

			if (!fileTypeArr.includes(file.type)) {
				this.$message.error('上传头像图片只能是 JPG、GIF、PNG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return fileTypeArr.includes(file.type) && isLt2M;
		},
    down(fileId) {

    	window.open(`${this.$utils.CONFIG.api.download}?fileId=${fileId}`, "_blank")
    },
    search() {

      this.table.page.currentPage = 1;
      this.getData();
    },
    showInput(list, index, key, defaultObj = {}, isAdd = true) {
    	
    	this.$set(list[index], key, true);
      if(list.length -1 == index && isAdd) list.push(Object.assign({}, defaultObj))
    },
  	showObjInput(obj, key) {
    	
    	this.$set(obj, key, true);
    },
  	querySearch(queryString, cb, list, valueKey = 'name') {
  		
      var restaurants = list;
      var results = queryString ? restaurants.filter(this.createFilter(queryString, valueKey)) : restaurants;
      // 调用 callback 返回建议列表的数据

      cb(results);
    },
    createFilter(queryString, valueKey) {
      return (restaurant) => {
        return (restaurant[valueKey] && restaurant[valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    setTableMaxHeight() {

    	this.maxHeight = this.$utils.getTableMaxHeight();
    },
    back() {

    	this.$router.go(-1);
    },
	},
	computed: {

  },
	destroyed() {

		window.onresize = null;
	}
}

export default leftMixin;