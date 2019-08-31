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
					]
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
		getData(url, params, idKey="id", loadingKey = 'isLoading', success = null) { //获取左侧列表数据

      this.left[loadingKey] = true;
      this.$utils.getJson(url, (res) => {

        if(loadingKey == 'isLoadingMore') {

          this.left.list = this.left.list.concat(res.data.content);
        }else {

          this.left.list = res.data.content;
        }
        this.left.page.totalPages = res.data.totalPages;
        
        if(this.left.list.length) {

          this.left.activeId = this.left.list[0][idKey];
          this.currentData = this.left.list[0];
          typeof success == 'function' && success(this.left.activeId);
        }
        this.left[loadingKey] = false;
      }, () => this.left[loadingKey] = false, params)
    },
		selectType(item) {

			this.filter.selectedValue = item.value;
			this.isShowList = true;
			this.search && this.search();
		},
		handleSelect(item, idKey = 'id') {
			
      this.left.activeId = item[idKey];
      this.currentData= item;
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
    uploadSuccess(res, formKey = 'update') {

      this.handle.update.form.fileId = res.data[0].fileId;
    },
    uploadError(formKey = 'update') {

      this.handle[formKey].form.fileId = '';
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