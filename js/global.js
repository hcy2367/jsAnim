/*
 * @js anim
 * @authod chmyun
 * @date 2015-1-8
 * @email hcy2367@163.com
 */
(function(window) {
	/*
	 * 工具对象
	 * 包含基本的dom操作，event操作
	 */
	var util = {};
	util.dom = {
		createElem: function(tagName) {
			return tagName ? document.createElement(tagName) : null;
		},
		getElemById: function(id) {
			return id ? document.getElementById(id) : null;
		},
		// 获取元素计算样式
		getPropValue: function(element, propName) {
			return 'defaultView' in document && 'getComputedStyle' in document.defaultView ?
				document.defaultView.getComputedStyle(element, null)[propName] :
				element.currentStyle[propName]
		},
		// 获取元素相对于浏览器视口viewport的位置
		getElemPos: function(element) {
		    var actualLeft = element.offsetLeft,
		    	actualTop = element.offsetTop,
		    	current = element.offsetParent,
		    	scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
				scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (element.getBoundingClientRect) {
				var rect = element.getBoundingClientRect();
			    return {
			        left: rect.left,
			        right: rect.right,
			        top: rect.top,
			        bottom: rect.bottom
			    }
			} else {
				while (current !== null) {
			        actualLeft += current.offsetLeft;
			        actualTop += current.offsetTop;
			        current = current.offsetParent;
			    }
			    return {
			    	left: actualLeft - scrollLeft,
			    	top: actualTop - scrollTop,
			    	right: actualLeft + element.offsetWidth - scrollLeft,
			    	bottom: actualTop + element.offsetHeight - scrollTop
			    };
			}
		},
		setOpacity: function(obj, num) {
			document.all ? obj.filters.alpha.opacity = num : obj.style.opacity = num / 100;
	    }
	};
	util.event = {
		getEvent: function(event) {
			return event ? event : window.event;
		},
		getTarget: function(event) {
			return event.target ? event.target : event.srcElement;
		},
		addEvent: function(element, event, handler) {
			if (element.addEventListener) {
				element.addEventListener(event, handler, false);
			} else if (element.attachEvent) {
				element.attachEvent('on' + event, handler);
			} else {
				element['on' + event] = handler;
			}
		},
		removeEvent: function(element, event, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(event, handler, false);
			} else if (element.detachEvent) {
				element.detachEvent('on' + event, handler);
			} else {
				element['on' + event] = null;
			}
		},
		preventDefault: function(event) {
			if (event.preventDefault()) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		stopPropagation: function(event) {
			if (event.stopPropagation()) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		}
	};

	/*
	* 动画缓动函数
	* t: currentCount 当前执行第t次(第t帧)
	* b: initPos 初始值(开始位置)
	* c: targetPos - initPos 发生偏移的距离值(当前位置)
	* d: count 一共执行d次(总帧数)
	*/
	var Tween = {
	    Linear: function (t, b, c, d) { return c * t / d + b; },
	    Quad: {
	        easeIn: function (t, b, c, d) {
	            return c * (t /= d) * t + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return -c * (t /= d) * (t - 2) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t + b;
	            return -c / 2 * ((--t) * (t - 2) - 1) + b;
	        }
	    },
	    Cubic: {
	        easeIn: function (t, b, c, d) {
	            return c * (t /= d) * t * t + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return c * ((t = t / d - 1) * t * t + 1) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
	            return c / 2 * ((t -= 2) * t * t + 2) + b;
	        }
	    },
	    Quart: {
	        easeIn: function (t, b, c, d) {
	            return c * (t /= d) * t * t * t + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
	            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	        }
	    },
	    Quint: {
	        easeIn: function (t, b, c, d) {
	            return c * (t /= d) * t * t * t * t + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
	            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	        }
	    },
	    Sine: {
	        easeIn: function (t, b, c, d) {
	            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return c * Math.sin(t / d * (Math.PI / 2)) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	        }
	    },
	    Expo: {
	        easeIn: function (t, b, c, d) {
	            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if (t == 0) return b;
	            if (t == d) return b + c;
	            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
	            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	        }
	    },
	    Circ: {
	        easeIn: function (t, b, c, d) {
	            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	        },
	        easeOut: function (t, b, c, d) {
	            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	        },
	        easeInOut: function (t, b, c, d) {
	            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
	            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	        }
	    },
	    Elastic: {
	        easeIn: function (t, b, c, d, a, p) {
	            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
	            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
	            else var s = p / (2 * Math.PI) * Math.asin(c / a);
	            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	        },
	        easeOut: function (t, b, c, d, a, p) {
	            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
	            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
	            else var s = p / (2 * Math.PI) * Math.asin(c / a);
	            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	        },
	        easeInOut: function (t, b, c, d, a, p) {
	            if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
	            if (!a || a < Math.abs(c)) { a = c; var s = p / 4; }
	            else var s = p / (2 * Math.PI) * Math.asin(c / a);
	            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	        }
	    },
	    Back: {
	        easeIn: function (t, b, c, d, s) {
	            if (s == undefined) s = 1.70158;
	            return c * (t /= d) * t * ((s + 1) * t - s) + b;
	        },
	        easeOut: function (t, b, c, d, s) {
	            if (s == undefined) s = 1.70158;
	            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	        },
	        easeInOut: function (t, b, c, d, s) {
	            if (s == undefined) s = 1.70158;
	            if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
	            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	        }
	    },
	    Bounce: {
	        easeIn: function (t, b, c, d) {
	            return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
	        },
	        easeOut: function (t, b, c, d) {
	            if ((t /= d) < (1 / 2.75)) {
	                return c * (7.5625 * t * t) + b;
	            } else if (t < (2 / 2.75)) {
	                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
	            } else if (t < (2.5 / 2.75)) {
	                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
	            } else {
	                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
	            }
	        },
	        easeInOut: function (t, b, c, d) {
	            if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
	            else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	        }
	    }
	};

	/*
	 * 核心动画
	 * @elem 要执行动画的元素
	 * @options left、top、opacity、width、height、border、marginLeft、marginRight、marginTop、marginBottom
	 */
	function Anim(elem, options) {
		this.elem = elem;
		this.options = options;
		this.defaults = {
			pos: {
				left: parseInt(util.dom.getPropValue(this.elem, 'left')),
				top: parseInt(util.dom.getPropValue(this.elem, 'top'))
			},
			width: parseInt(util.dom.getPropValue(this.elem, 'width')),
			height: parseInt(util.dom.getPropValue(this.elem, 'height')),
			opacity: util.dom.getPropValue(this.elem, 'opacity') * 100,
			border: util.dom.getPropValue(this.elem, 'border')
		};
	}
	Anim.prototype = {
		constructor: Anim,
		// 初始化动画
		init: function() {
			this.isStart = false;
			this.isStop = false;
			this.isComplete = false;
			this.isBack = false;
			this.start();
		},

		// 初始化数据
		before: function() {
			var animElem = this.elem;
			this.curFrame = 0;
			this.frames = Math.ceil(this.options.duration / 1000 * this.options.frequence) || 1;
			this.timer = 50;
			this.timerId = null;
			// 初始位置，随着位置改变而不断改变
			this.initPos = {
				left: parseFloat(util.dom.getPropValue(animElem, 'left')),
				top: parseFloat(util.dom.getPropValue(animElem, 'top'))
			};
			// 初始透明度
			this.initOpacity = util.dom.getPropValue(animElem, 'opacity') * 100;
			// 初始宽度
			this.initWidth = parseFloat(util.dom.getPropValue(animElem, 'width'));
			// 初始高度
			this.initHeight = parseFloat(util.dom.getPropValue(animElem, 'height'));
			// 初始边框
			this.initBorderWidth = parseFloat(util.dom.getPropValue(animElem, 'border'));
			this.tweenFunc = this.options.tweenFunc || function(t, b, c, d) {return c * t / d + b;};
			this.onStart = this.options.onStart ? this.options.onStart : function() {};
			this.onStop = this.options.onStop ? this.options.onStop : function() {};
			this.onComplete = this.options.onComplete ? this.options.onComplete : function() {};
		},

		// 开始动画
		start: function() {
			this.isStart = true;
			this.isStop = false;
			this.run();
		},

		// 动画过程
		run: function() {
			this.before();

			// 动画参数匹配
			this.match();

			// 原路返回
			if (this.isBack) {
				this.initPos = this.targetPos;
				this.targetPos = this.defaults.pos;
				this.initOpacity = this.targetOpacity;
				this.targetOpacity = this.defaults.opacity;
				this.initWidth = this.targetWidth;
				this.targetWidth = this.defaults.width;
				this.initHeight = this.targetHeight;
				this.targetHeight = this.defaults.height;
				this.initBorderWidth = this.targetBorderWidth;
				var targetBorder = this.defaults.border.split(' ');
				this.targetBorderWidth = parseInt(targetBorder[0]);
				this.targetBorderStyle = targetBorder[1];
				this.targetBorderColor = targetBorder[2];
			}

			if (this.isStart) {
				this.onStart.call(this.elem);
				// 计算动画
				this.count();
			}
		},

		// 匹配动画的参数：left、top、opacity、width、height、border、marginLeft、marginRight、marginTop、marginBottom
		match: function() {
			for (var name in this.options) {
				if (this.options.hasOwnProperty(name)) {
					switch (name) {
						case 'targetPos':
							// 注意不是this.options.name，这样就是获取this.options对象的name属性
							this.targetPos = this.options.targetPos;
							continue;
						case 'opacity':
							this.targetOpacity = this.options.opacity;
							continue;
						case 'width':
							this.targetWidth = this.options.width;
							continue;
						case 'height':
							this.targetHeight = this.options.height;
							continue;
						case 'border':
							var targetBorder = this.options.border.split(' ');
							this.targetBorderWidth = parseInt(targetBorder[0]);
							this.targetBorderStyle = targetBorder[1];
							this.targetBorderColor = targetBorder[2];
							continue;
						// 外边距动画原理是改变元素的left、top，如传入marginRight参数，则元素向右移动给定的右边距，如传入marginLeft参数，则元素向左移动给定的左边距，并且此时的left为负值，上下边距同理。同时传入targetPos参数和外边距参数，会发生left、top值覆盖的情况
						case 'marginRight':
							this.targetPos = {left: this.options.marginRight, top: this.initPos.top};
							continue;
						case 'marginLeft':
							this.targetPos = {left: -this.options.marginLeft, top: this.initPos.top};
							continue;
						case 'marginTop':
							this.targetPos = {left: this.initPos.left, top: -this.options.marginTop};
							continue;
						case 'marginBottom':
							this.targetPos = {left: this.initPos.left, top: this.options.marginBottom};
							continue;
					}
				}
			}
		},

		// 计算动画
		count: function() {
			var that = this,
				animElem = this.elem,
				timerId = this.timerId,
				tweenFunc = this.tweenFunc,
				curFrame = this.curFrame,
				frames = this.frames;
			timerId = setInterval(function() {
				// 停止动画，清除间歇调用id
				if (that.isStop && timerId) {
					clearInterval(timerId);
					that.onStop.call(animElem);
				}

				if (curFrame < frames) {
					curFrame++;
					if (that.targetPos) {
						var curLeft = tweenFunc(curFrame, that.initPos.left, (that.targetPos.left - that.initPos.left), frames),
							curTop = tweenFunc(curFrame, that.initPos.top, (that.targetPos.top - that.initPos.top), frames);
						animElem.style.left = curLeft.toFixed(2) + 'px';
						animElem.style.top = curTop.toFixed(2) + 'px';
					}
					if (that.targetOpacity) {
						var curOpacity = tweenFunc(curFrame, that.initOpacity, (that.targetOpacity - that.initOpacity), frames);
						util.dom.setOpacity(animElem, curOpacity);
					}
					if (that.targetWidth) {
						var curWidth = tweenFunc(curFrame, that.initWidth, (that.targetWidth - that.initWidth), frames);
						animElem.style.width = parseFloat(curWidth) + 'px';
					}
					if (that.targetHeight) {
						var curHeight = tweenFunc(curFrame, that.initHeight, (that.targetHeight - that.initHeight), frames);
						animElem.style.height = parseFloat(curHeight) + 'px';
					}
					if (that.targetBorderWidth) {
						var curBorderWidth = tweenFunc(curFrame, that.initBorderWidth, (that.targetBorderWidth - that.initBorderWidth), frames);
						animElem.style.border = curBorderWidth + 'px ' + that.targetBorderStyle + ' ' + that.targetBorderColor;
					}
				} else {
					that.isComplete = true;
					clearInterval(timerId);
					that.onComplete.call(animElem);
				}
			}, this.timer);
		},

		// 原路返回
		back: function() {
			this.isBack = true;
			this.run();
		},

		// 停止动画
		stop: function() {
			this.isStop = true;
			this.run();
		},

		// 重置元素
		reset: function() {
			var elem = this.elem,
				defaults = this.defaults;
			elem.style.left = defaults.pos.left + 'px';
			elem.style.top = defaults.pos.top + 'px';
			util.dom.setOpacity(elem, 100);
			elem.style.width = defaults.width + 'px';
			elem.style.height = defaults.height + 'px';
			elem.style.border = defaults.border;
			elem.innerHTML = '';
		}
	};

	// 全局使用
	if (!window.util) {
		window.util = util;
	}
	if (!window.Anim) {
		window.Anim = Anim;
	}
	if (!window.Tween) {
		window.Tween = Tween;
	}

})(window);