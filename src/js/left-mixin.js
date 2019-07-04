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
			}
		}
	},
	methods: {

	}
}

export default leftMixin;