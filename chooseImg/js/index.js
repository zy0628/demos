Vue.use(window['vue-cropper'])
var vm = new Vue({
	el: '#app',
	data: {
		page: 1, //当前页面 1表示上传图片  2表示裁剪编辑  3表示点击图片进入删除
		title: '上传图片', //页面标题
		isIos: false,
		showBtmChoose: false,
		imgList: [],
		composeCanvas: document.createElement('canvas'),
		composeCtx: null,
		composeBase64: [],
		composeImgUrl: '',
		showCrop: false,
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
		imgList: [],
		showPreview: false, //点击图片，进入预览状态，默认false
		previewUrl: '', //预览图片的地址
		previewId: 0 //当前预览图片的索引
	},
	created: function() {
		// this.judgeUserAgent();
		this.composeCtx = this.composeCanvas.getContext('2d')
	},
	methods: {
		//判断系统android或ios
		judgeUserAgent: function() {
			var u = navigator.userAgent;
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;//android终端
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if(isiOS) {
				this.isIos = true;
			} else {
				this.isIos = false;
			}
		},
		//显示“编辑”页的处理
		showCropHandle: function() {
			this.showCrop = true;
			this.page = 2;
			this.title = '编辑图片';
			this.refreshCrop();
		},
		//点击合成后的处理
		composeHandle: function() {
			this.showCrop = false;
			var data = this.imgList;
			var canvasHeight = 0;
			data.forEach(function(item,index){
				canvasHeight += item.height;
			});
			this.composeCanvas.width = window.innerWidth;
			this.composeCanvas.height = canvasHeight;
			this.composeCtx.rect(0,0,this.composeCanvas.width,this.composeCanvas.height);
			this.composeCtx.fillStyle='#fff';
			this.composeCtx.fill();
			this.drawHandle(0);
		},
		//实现合成的处理
		drawHandle: function(n) {
			var that = this;
			if(n < that.imgList.length){
				var img = new Image;
				//img.crossOrigin = 'Anonymous'; //解决跨域
				img.src = that.imgList[n].url;
				img.onload=function(){
					//要拼接上logo，一起合成
					var logoWidth = that.$refs.logoImg.offsetWidth; //logo的宽度
					var logoHeight = that.$refs.logoImg.offsetHeight; //logo的高度
					var logoTop = that.imgList[0].height + that.imgList[1].height; //logo的y轴坐标
					//上传的图片超过2张，则在第二张的下面，生成logo，logo下面的图片（即第三张开始），Y轴都要向下移动logo的高度。
					if(n >= 2) {
						that.composeCtx.drawImage(that.$refs.logoImg,0,logoTop,logoWidth,logoHeight);
						that.composeCtx.drawImage(img,0,that.imgList[n].height * n + logoHeight,that.imgList[n].width,that.imgList[n].height);
					} else {
						that.composeCtx.drawImage(img,0,that.imgList[n].height * n,that.imgList[n].width,that.imgList[n].height);
					}
					that.drawHandle(n+1);//递归
				}
			} else {
				//先清空数组，保证，每次点击合成，都是把当前所有图片，重新合成一张新的。是这个数组唯一的，也就是索引为0的元素。
				//解决的问题描述：添加一张图片，点击合成，后续添加图片，再点击合成。发现始终显示第一次合成的图片。
				that.composeBase64 = [];
				//保存生成作品图片
				that.composeBase64.push(that.composeCanvas.toDataURL("image/jpeg",0.8));
				// console.log(JSON.stringify(that.composeBase64));
				that.composeImgUrl = that.composeBase64[0];
			}
		},
		//重置画布
		refreshCrop: function() {
			// clear
			this.$refs.cropper.refresh()
		},
		//改变上传图片在画布中的比例
		changeScale: function(num) {
			num = num || 1
			this.$refs.cropper.changeScale(num)
		},
		//控制图片向左旋转
		rotateLeft: function() {
			this.$refs.cropper.rotateLeft()
		},
		//控制图片向右旋转
		rotateRight: function() {
			this.$refs.cropper.rotateRight()
		},
		// 实时预览函数
		realTime: function(data) {
			this.previews = data
		},
		//点击“完成”的处理
		down: function(type) {
			// event.preventDefault()
			// 输出
			var that = this;
			if (type === 'blob') {
				that.$refs.cropper.getCropBlob(function(data) {
					that.downImg = window.URL.createObjectURL(data);
					that.imgList.push({
						width: window.innerWidth,
						height: (window.innerWidth/that.$refs.cropper.cropW) * that.$refs.cropper.cropH,
						url: that.downImg
					});
					// console.log(that.imgList)
				})
			} else {
				that.$refs.cropper.getCropData(function(data) {
					that.downImg = data;
					that.imgList.push({
						width: window.innerWidth,
						height: (window.innerWidth/that.$refs.cropper.cropW) * that.$refs.cropper.cropH,
						url: that.downImg
					});
					// console.log(that.imgList)
				})
			}
			this.showCrop = false;
			this.page = 1;
			this.title = '上传图片';
		},
		//点击“上传图片”的处理
		uploadImg(e, num) {
			//上传图片
			// this.option.img
			var file = e.target.files[0]
			if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
				alert('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
				return false
			}
			var reader = new FileReader();
			reader.onload = (e) => {
				var data
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
			reader.readAsArrayBuffer(file);
			// this.showBtmChoose = false;
		},
		//点击“返回”的处理
		goBack: function() {
			if(this.page == 2) {
				this.showCrop = false;
				this.title = '上传图片';
				this.page = 1;
			} else if (this.page == 1) {
				this.showCrop = true;
				this.title = '编辑图片';
				this.page = 2;
			} else if (this.page == 3) {
				this.showCrop = false;
				this.showPreview = false;
				this.title = '上传图片';
				this.page = 1;
			}
		},
		//显示预览图片的处理
		showPreviewHandle: function(url,index) {
			this.showPreview = true;
			this.previewUrl = url;
			this.previewId = index;
			this.title = '预览图片';
			this.page = 3;
		},
		//点击“删除”的处理
		deleteImg: function() {
			this.imgList.splice(this.previewId,1);
			this.goBack();
		}
	}
})