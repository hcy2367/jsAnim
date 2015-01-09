# jsAnim

一个简单而实用的js动画框架，支持动画缓动算法函数，如Linear、Cubic、Back、Bounce等，支持改变高度，宽度，透明度，边框，外边距的基本动画，支持动画的回调函数，如开始、暂停、完成callback等。

## Usage

### 参数
| 参数名称        | 参数说明                              		| 是否必须  |
| :-------------: |  :---------------------------------------:  | :-------: |
| duration        | 动画持续时间                          		| 是        |
| frequence       | 帧频，推荐30                          		| 是        |
| tweenFunc       | 动画缓动函数，如：Tween.Bounce.easeIn      	| 是        |
| targetPos       | 动画元素目标位置，如：{left: 300, top: 400} | 是        |
| opacity         | 透明度，如60      		                    | 否        |
| width           | 宽度，不带单位，如200      		            | 否        |
| height          | 高度，不带单位，如200      		            | 否        |
| marginX         | 外边距，其中X表示Top、Left、Right、Bottom   | 否        |
| border          | 边框，如：'2px solid red'                   | 否        |
| onStart         | 动画开始callback，其中this执行当前动画元素  | 否        |
| onStop          | 动画停止callback，其中this执行当前动画元素  | 否        |
| onComplete      | 动画完成callback，其中this执行当前动画元素  | 否        |

### 方法
| 方法名称        | 方法说明                              		| 是否共用  |
| :-------------: |  :---------------------------------------:  | :-------: |
| init            | 动画实例初始化                              | 是        |
| stop            | 停止动画                          		    | 是        |
| back            | 动画原路返回     	                        | 是        |

### 使用
	var options = {
		duration: 2000,
		frequence: 30,
		tweenFunc: Tween.Linear,
		targetPos: {left: 400, top: 300},
		opacity: 40,
		width: 80,
		height: 80,
		onComplete: function() {
			console.log('done');
		}
	};
	var anim = new Anim(animElem, options);
	anim.init();

## Demo

动画[demo](http://hcy2367.github.io/jsAnim)展示

## License

[MIT](http://opensource.org/licenses/MIT)
