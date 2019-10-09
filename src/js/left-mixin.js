let leftMixin = {
	data() {
		return {
			defaultImg: require('../assets/img/img1.svg'),
			isShowList: true,
			filter: {
				selectedValue: '',
				typeList: [
					{
						label: '按照客户名称搜索需求',
						value: '1',
					},
					{
						label: '按照零件号搜索需求',
						value: '2',
					},
					{
						label: '按照客户PO号搜索需求',
						value: '3',
					}
				],
				listType: {
					project: [
						{
							label: '按照客户名称搜索',
							value: '1',
						},
						{
							label: '按照模具号搜索',
							value: '3',
						}
					],
					product: [
						{
							label: '按照客户名称搜索',
							value: '1',
						},
						{
							label: '按照模具号搜索',
							value: '3',
						},
						{
							label: '按照零件号搜索',
							value: '2',
						}
					],
				},
				sort: {
					sortType: '',
					sortField: '_MrSaleOrder.mouldNo',
					listType: {
						product: [
							{
								label: '按模具号排序',
								value: '_MrSaleOrder.mouldNo',
							},
							{
								label: '按客户名称排序',
								value: '_MrCustomer.name',
							},
							{
								label: '按要求交期排序',
								value: '_MrSaleOrder.completionDate',
							},
							{
								label: '按订单类型排序',
								value: '_MrSaleOrder.saleOrderType',
							},
						],
						project: [
							{
								label: '按客户名称排序',
								value: '_MrCustomer.name',
							},
							{
								label: '按订单金额排序',
								value: '_MrSaleOrder.completionDate',
							},
							{
								label: '按要求交期排序',
								value: '_MrSaleOrder.saleOrderType',
							},
						]
					}
				}
			},
			form: {
				text: '',
				type: ''
			},
			left: {
				activeId: '',
				isLoading: false,
				isLoadingMore: false,
				page: Object.assign({}, this.$utils.CONFIG.page),
				list: []
			},
			currentData: {
			},
			right: {
				isLoading: false,
				page1: {},
				page2: {},
				page3: {},
				page4: {}
			}
		}
	},
	methods: {
		setCurrentData(idKey, success) {

			if(this.left.activeId) {

				let currentData = {};
				this.left.list.map(item => {

					if(item[idKey] == this.left.activeId) this.currentData = item;
				})

				if(!this.currentData[idKey]) {

					this.left.activeId = this.left.list[0][idKey];
      		this.currentData = this.left.list[0];
				}
			}else {

				this.left.activeId = this.left.list[0][idKey];
      	this.currentData = this.left.list[0];
			}
			
      typeof success == 'function' && success(this.left.activeId);
		},
		getData(url, params, idKey="id", loadingKey = 'isLoading', success = null, isSetCurrentData = false) { //获取左侧列表数据

	      this.left[loadingKey] = true;
	      this.$utils.getJson(url, (res) => {

	        if(loadingKey == 'isLoadingMore') {

	          this.left.list = this.left.list.concat(res.data.content || res.data);
	        }else {

	          this.left.list = res.data.content || res.data;
	        }
	        this.left.page.totalPages = res.data.totalPages;
	        
	        if(this.left.list.length) {

	        	if(!isSetCurrentData) {
		          
		          this.setCurrentData(idKey, success);
		        }else {
		        	let index = this.left.list.findIndex(item => item[idKey] == this.left.activeId);
		        	this.currentData = this.left.list[index];
		        	typeof success == 'function' && success(this.left.activeId);
		        }
	        }
	        this.left[loadingKey] = false;
	      }, () => this.left[loadingKey] = false, params)
	    },
	    getList(url, obj, key, params = {}) {

	    	this.$utils.getJson(url, (res) => {
	 
	        obj[key] = res.data || [];
	      }, () => obj[key] = [], params)
	    },
			selectType(item) {

				this.filter.selectedValue = item.value;
				this.isShowList = true;
				this.search && this.search();
			},
			handleSelect(item, idKey = 'id', callback = null) {

	      this.left.activeId = item[idKey];
	      this.currentData= item;
	      typeof callback == 'function' && callback();
	    },
	    closeDialog(formKey = 'update') {
	        
	      this.handle[formKey].isLoading = false;
	      this.handle[formKey].dialogVisible = false;
	    },
			resetUpload(ref = 'upload') {

	      this.$refs[ref] && this.$refs[ref].clearFiles();
	    },
	    resetForm(formName) {

	      this.$refs[formName] && this.$refs[formName].resetFields();
	    },
	    beforeAvatarUpload(file) {	//上传头像之前判断
			const isJPG = file.type === 'image/jpeg';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG) {
				this.$message.error('上传头像图片只能是 JPG 格式!');
			}
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isJPG && isLt2M;
		},
	    uploadFile(dialog = null) {
	    
	      let formData = new FormData();
	      if(dialog && dialog.addFiles && dialog.addFiles.length) {

	      	dialog.addFiles.map(item => {

	      		formData.append('files', item);
	      	})
	      }else {

	      	formData.append('files', this.$refs.file.files[0]);
	      }
	      

	      dialog ? (dialog.isLoading = true) : (this.right.isLoading = true);
	      this.$utils.getJson(this.$utils.CONFIG.api.uploadFiles, (res) => { //版本详情 

	        dialog ? (dialog.isLoading = false) : (this.right.isLoading = false);
	        typeof this.uploadSuccess == 'function' && this.uploadSuccess(res);
	      }, () => {

	      	dialog ? (dialog.isLoading = false) : (this.right.isLoading = false);
	      	this.$refs.file && (this.$refs.file.value = '');
	      }, formData, 'post', true);
	    },
	    uploadSuccess(res, formKey = 'update') {

	      this.handle.update.form.fileId = res.data[0].fileId;
	    },
	    uploadError(formKey = 'update') {

	      this.handle[formKey].form.fileId = '';
	    },
	    deleteFiles(fileId, deleteRow) {

	    	this.right.isLoading = true;
	    	this.deleteRow = deleteRow;
	      this.$utils.getJson(this.$utils.CONFIG.api.deleteFiles, (res) => { //版本详情 

	        this.right.isLoading = false;
	        typeof this.deleteSuccess == 'function' && this.deleteSuccess();
	      }, () => this.right.isLoading = false, {fileId: fileId});
	    },
	    down(fileId) {

	    	window.open(`${this.$utils.CONFIG.api.download}?fileId=${fileId}`, "_blank")
	    },
	    saveFile(id, formKey = 'update') {
	        
	      let params = {
	        fileId: this.handle[formKey].form.fileId,
	        customerId: id
	      }
	      this.$utils.getJson(this.$utils.CONFIG.api.saveCustomerHeadPortraits, (res) => {

	        this.closeDialog();
	        this.$utils.showTip('success', 'success', '102');
	        this.search();
	      }, () => this.handle.update.isLoading = false, params)
	    },
	    checkSort(sortType) {

	    	this.filter.sort.sortType = sortType;
	    	this.$refs.sort.hide();
	    	this.search();
	    },
	    search() {
	      this.left.page.pageNo = 1;
	      this.getLeftList();
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
	    isExistenceVersion(versionList, value, key) {	//版本列表中是否存在版本号

	    	return versionList.find(item => item[key] == value);
	    },
	    getSelectedProcesses(versions, selectedVersionNo) {

	    	if(selectedVersionNo) {
	    		let selectedVersion = versions.find(itemc => itemc.versionNo == selectedVersionNo);
	    		return selectedVersion.processes || [];
	    	}else {
	    		return [];
	    	} 	
	    },
	    getSelectedVersionStuffNo(versions, selectedVersionNo) {

	    	if(selectedVersionNo) {
	    		let selectedVersion = versions.find(itemc => itemc.versionNo == selectedVersionNo);
	    		return selectedVersion.stuffNo;
	    	}else {
	    		return '';
	    	} 	
	    },
	    back() {

	    	this.$router.go(-1);
	    }
	},
	mounted() {
		let _this = this;
		let prevScrollTop = 0;
		let isScrollDown = false;
		if(this.$refs.list) {
	
			this.$refs.list.onscroll = function() {	//下拉加载更多

		   		let scrollTop = this.scrollTop;
		   		let clientHeight = this.clientHeight;
		   		let scrollHeight = this.scrollHeight;
					isScrollDown = prevScrollTop < scrollTop;
					prevScrollTop = scrollTop;
		      if((scrollTop+clientHeight+40 > scrollHeight) && isScrollDown && !_this.left.isLoadingMore && (_this.left.page.pageNo < _this.left.page.totalPages)){
			
					_this.left.isLoadingMore = true;
					_this.left.page.pageNo++;
					_this.getLeftList('isLoadingMore');
				}
			}
		}
	},
	destroyed() {

		this.$refs.list && (this.$refs.list.onscroll = null);
	}
}

export default leftMixin;