let leftMixin = {
	data() {
		return {
			defaultImg: require('../assets/img/img1.svg'),
			isLoading: false,
			maxHeight: 600,
      multipleSelection: [],
			table: {
				isLoading: false,
				page: Object.assign({}, this.$utils.CONFIG.page),
				srcData: [],
				data: []
			}
		}
	},
	methods: {
    getList(url, obj, key, params = {}, success = null) {

      this.$utils.getJson(url, (res) => {
 
        obj[key] = res.data || [];
        if (typeof success == 'function') success(res.data)
      }, () => obj[key] = [], params)
    },
    resetForm(formName) {

      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    onSubmitForm(ref, success = null, res = null) {

      this.$refs[ref].validate((valid) => {
        if (valid) {

          if(typeof success == 'function') success()
        }
      })
    },
    handleSelectionChange(val) {

      this.multipleSelection = val;
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
    addAttachments(fileRef, obj) { //新增附件

      let fileId = new Date().getTime();
      fileRef.files[0].fileId = fileId;
      obj.addFiles.push(fileRef.files[0]);
      obj.form.attachments.push({
        type: 'add',
        fileId: fileId,
        fileName: fileRef.files[0].name
      })
      fileRef.value = '';
    },
    deleteAttachments(row, obj) {
  
      obj.form.attachments = obj.form.attachments.filter(item => item.fileId != row.fileId);

      if(row.type == 'add') {
        obj.addFiles = obj.addFiles.filter(item => item.fileId != row.fileId);
      }
    },
    
    saveDataAfterFile(obj, success, formName) { //保存附件然后再保存数据

      let saveData = () => { //表单验证成功后的回调

        if(obj.addFiles.length) {

          let formData = new FormData();
          obj.addFiles.map(item => formData.append("file", item));
        
          obj.isLoading = true;
          this.$utils.getJson(this.$utils.CONFIG.api.attachmentUpload, (res) => {

            if(typeof success == 'function') success(res);
          }, () => obj.isLoading = false, formData)
        }else {

          if(typeof success == 'function') success();
        }
      }

      if(formName) {

        this.onSubmitForm(formName, saveData);
      }else {

        saveData();
      }

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