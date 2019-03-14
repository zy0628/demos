Vue.use(window['vue-cropper'])
var a = new Vue({
	el: '#app',
	data: {
		crap: false,
		previews: {},
		option: {
			img: 'https://qn-qn-kibey-static-cdn.app-echo.com/goodboy-weixin.PNG',
			outputType: 'png', //输出图片格式
			fixed: true, //是否开启截图框宽高固定比例
			fixedNumber: [1,1],
			original: false, //上传图片是否显示原始宽高 (针对大图 可以铺满)
			autoCrop: true, //是否自动生成截图框
			autoCropWidth: 200,// 只有自动截图开启 宽度高度才生效
			autoCropHeight: 200,// 只有自动截图开启 宽度高度才生效
			centerBox: true, //截图框是否限制在图片里(只有在自动生成截图框时才能生效)
			high: true //是否根据dpr生成适合屏幕的高清图片
		},
		show: true
	},
	methods: {
		refreshCrop() {
			// clear
			this.$refs.cropper.refresh()
		},
		changeScale(num) {
			num = num || 1
			this.$refs.cropper.changeScale(num)
		},
		rotateLeft() {
			this.$refs.cropper.rotateLeft()
		},
		rotateRight() {
			this.$refs.cropper.rotateRight()
		},
		// 实时预览函数
		realTime(data) {
			this.previews = data
			console.log(data)
		},
		down(type) {
			// event.preventDefault()
			var aLink = document.createElement('a')
			aLink.download = 'demo'
			// 输出
			if (type === 'blob') {
				this.$refs.cropper.getCropBlob((data) => {
					this.downImg = window.URL.createObjectURL(data)
					aLink.href = window.URL.createObjectURL(data)
					aLink.click()
				})
			} else {
				this.$refs.cropper.getCropData((data) => {
					this.downImg = data
				aLink.href = data
				aLink.click()
			})
			}
		},

		uploadImg(e, num) {
			//上传图片
			// this.option.img
			var file = e.target.files[0]
			if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
				return false
			}
			var reader = new FileReader()
			reader.onload = (e) => {
				let data
				if (typeof e.target.result === 'object') {
					// 把Array Buffer转化为blob 如果是base64不需要
					data = window.URL.createObjectURL(new Blob([e.target.result]))
				} else {
					data = e.target.result
				}
				if (num === 1) {
					this.option.img = data
				} else if (num === 2) {
					this.example2.img = data
				}
			}
			// 转化为base64
			// reader.readAsDataURL(file)
			// 转化为blob
			reader.readAsArrayBuffer(file)
		},
		imgLoad(msg) {
			console.log(msg)
		}
	},
	mounted: function () {
		// console.log(window['vue-cropper'])
	}
})