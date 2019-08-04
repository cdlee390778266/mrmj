let leftMixin = {
	data() {
		return {
			isShowList: true,
			filter: {
				typeList: [
					{
						label: '按照客户名称搜索需求',
						value: '1',
					},
					{
						label: '按照模具号搜索需求',
						value: '2',
					},
					{
						label: '按照零件号搜索需求',
						value: '3',
					},
					{
						label: '按照需求说明内容搜索需求',
						value: '4',
					}
				]
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
			currentData: {}
		}
	},
	methods: {

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
		      if((scrollTop+clientHeight+40 > scrollHeight) && isScrollDown && !_this.left.isLoadingMore && (_this.left.page.currentPage < _this.left.page.totalPages)){

					_this.left.isLoadingMore = true;
					_this.left.page.currentPage++;
					_this.getLeftList('isLoadingMore');
				}
			}
		}
	},
	destroyed() {
		this.$refs.list.onscroll = null;
	}
}

export default leftMixin;