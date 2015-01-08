# jsAnim

一个简单而实用的js动画框架，支持动画缓动算法函数，如Linear、Cubic、Back、Bounce等，支持改变高度，宽度，透明度，边框，外边距的基本动画，支持动画的回调函数，如开始、暂停、完成callback等。

## Usage

    // 动画参数设置
	var options = {
		duration: 2000, // 动画持续时间
		frequence: 30, // 帧频
		tweenFunc: Tween.Linear, // 动画缓动函数
		targetPos: {left: 400, top: 300}, // 元素目标位置
		opacity: 40, // 透明度(可选)
		width: 80, // 宽度(可选)
		height: 80, // 高度(可选)
		// marginTop: 100, // 上边距(可选)
		border: '2px solid red', // 边框(可选)
		// 动画开始callback(可选)
		onStart: function() {
			// this指向当前动画元素
		},
		// 动画停止callback(可选)
		onStop: function() {
			// this指向当前动画元素
		},
		// 动画完成callback(可选)
		onComplete: function() {
			// this指向当前动画元素
		}
	};
	var anim = new Anim(animElem, options);

## Demo

[demo](http://hcy2367.github.io/jsAnim)

## License

[MIT](http://opensource.org/licenses/MIT)
