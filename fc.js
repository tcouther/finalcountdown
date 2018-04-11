/*
	It's the FinalCounterDown!
	Animated Counter with formatting options
	By Terrill Couther
*/

var CountDown = function(options) {
	this.elements = options.elements;
	this.el = this.elements.counter;
	let elCurrentValue = this.el.getAttribute('data-current-number');
	let elNewValue = this.el.getAttribute('data-new-number');

	this.curNum = options.curNum || parseInt(elCurrentValue) || 0;
	this.newNum = options.newNum || parseInt(elNewValue) || 0;
	this.easing = options.easing || null;
	this.format = options.format || null;
	this.runtime = options.runtime || 3;
	this.idelay = options.idelay || null;
	this.cntNum = this.curNum;
	this.decimals = options.decimal || 2;
	this.events = {};
	this.displayTarget = '';
	this.min = options.min || null;
	this.max = options.max || null;
	this.graphingFunction = function(){};

	this.setEvents();
};

CountDown.prototype.set = function(options) {
	this.curNum = options.curNum || this.curNum;
	this.newNum = options.newNum || this.newNum;
	this.easing = options.easing || this.easing;
	this.format = options.format || this.format;
	this.runtime = options.runtime || this.runtime;
	this.idelay = options.idelay || this.idelay;
	this.decimals = options.decimal || this.decimals;
	this.min = options.min || this.min || 0;
	this.max = options.max || this.max || 0;
};
CountDown.prototype.init = function() {
	this.el.dispatchEvent(this.events.eventCountdownInit);

	if ( this.el && this.el.getAttribute('data-countdown-init') ) {
		let runCount = function(){
			this.countTo({'newNum' : this.newNum});
		}.bind(this);

		let idelay = this.idelay;
		if ( idelay ) {
			window.setTimeout(runCount,idelay);
		} else {
			runCount();
		}
	}
};
CountDown.prototype.setEvents = function(){
	//set custom events
	this.events.eventCountdownInit = new Event('eventCountdownInit');
	this.events.eventCountdownStart = new Event('eventCountdownStart');
	this.events.eventCountdownStop = new Event('eventCountdownStop');
	this.events.eventCountdownChange = new Event('eventCountdownChange');

	this.el.addEventListener('eventCountdownStart', function(evt) {
		this.el.setAttribute('data-countdown-animate','start');
	}.bind(this), false);
	this.el.addEventListener('eventCountdownStop', function(evt) {
		this.el.setAttribute('data-countdown-animate','stop');
	}.bind(this), false);
};
CountDown.prototype.numDiff = function(num1, num2){
	return (num1 > num2) ? num1-num2 : num2-num1;
};
CountDown.prototype.changeNumber = function(num) {
	let value = num || this.cntNum;
	let frmat = this.format || null;
	let decimals = this.decimals;
	let displayed = (frmat) ? this.formatNum[frmat](value,decimals) : value;
	this.displayDigital(displayed);
	this.displayGraph(value,displayed);
	this.el.dispatchEvent(this.events.eventCountdownChange);
	return displayed;
};
CountDown.prototype.displayDigital = function(num) {
	if (this.elements.digital) this.elements.digital.innerHTML = num;
};
CountDown.prototype.displayGraph = function(value,formatted) {
	this.graphingFunction(value,formatted);
};
CountDown.prototype.easeOutX = function(t, b, c, d) {
	return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
};
CountDown.prototype.countAnimate = function() {
	if ( this.stop == null ) {
		this.timestamp = Date.now();
		let diffCurNew = this.numDiff(this.curNum,this.newNum);
		let display = '';
		let timeElampsed = this.timestamp - this.startTime;

		if ( this.easing ) {
			if (this.dirNum == -1) {
				this.cntNum = this.curNum - this.easeOutX(timeElampsed, 0, diffCurNew, this.duration);

			} else {
				this.cntNum = this.easeOutX(timeElampsed, this.curNum, diffCurNew, this.duration);
			}
		} else {
			if (this.dirNum == -1) {
				this.cntNum = this.curNum - (this.curNum * (timeElampsed / this.duration));
			} else {
				this.cntNum = this.curNum + (this.curNum * (timeElampsed / this.duration));
			}
		}

		//Limit
		if (this.dirNum == -1) {
			this.cntNum = (this.cntNum <= this.newNum) ? this.newNum : this.cntNum;
		} else {
			this.cntNum = (this.cntNum >= this.newNum) ? this.newNum : this.cntNum;
		}

		//display Number
		display = this.changeNumber();

		// whether to stop
		if (timeElampsed >= this.duration) {
			this.stop = true;
		}

		//one more time =)
		window.requestAnimationFrame(this.countAnimateBound);
	} else {
		this.countStop();
	}
};
CountDown.prototype.countStop = function(display) {
	this.stop = true;
	this.cntNum = this.newNum;
	this.curNum = this.newNum;

	if ( this.el ) {
		this.el.setAttribute('data-current-number',this.newNum);
		this.el.setAttribute('data-new-number',this.newNum);
		if ( display ) this.changeNumber();
	}

	//trigger stop
	this.el.dispatchEvent(this.events.eventCountdownStop);
};
CountDown.prototype.countStart = function(options) {
	//Prep the count formatting
	if ( this.format.match('percentage_') ) {
		if (this.min || this.max) {
			this.majority = this.numDiff(this.min,this.max);
			this.newNum = ((this.newNum / this.majority) * 100);
			this.dirNum = (this.curNum < this.newNum) ? 1 : -1;
		} else {
			console.log('percentage requires min and max values');
			this.format = 'decimal_default';
		}
	}

	this.dirNum = (this.curNum < this.newNum) ? 1 : -1;
	this.stop = null;
	this.stopped = null;
	this.displayTarget = this.formatNum[this.format](this.newNum,this.decimals);
	this.countAnimateBound = this.countAnimate.bind(this);
	this.duration = Number(this.runtime) * 1000 || 2000;
	this.startTime = this.timestamp = Date.now();
	this.el.dispatchEvent(this.events.eventCountdownStart);

	//Start the count animation
	this.countAnimate();
};
CountDown.prototype.countTo = function(options) {
	if ( options ) this.set(options);
	this.countStart();
};
CountDown.prototype.formatNum = {
	'percentage_html' : function(a,b) {
		return "<span>" + parseFloat(a).toFixed(b) + "</span><span aria-label=\"percent\">%</span>";
	},
	'byte_1024Txt' : function(a,b) {if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));
		f = ( f < 1 ) ? 0 : f;
		return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
	},
	'byte_1024Html' : function(a,b) {
		if(0==a)return"0 Bytes";
		var c=1024, d=b||2, f=Math.floor(Math.log(a)/Math.log(c)), e=[["B","Bytes"],["KB","Kilobytes"],["MB","Megabytes"],["GB","Gigabytes"],["TB","Terabytes"],["PB","Petabytes"],["EB","Exabytes"],["ZB","Zettabytes"],["YB","Yottabytes"]];
		f = ( f < 1 ) ? 0 : f;
		return "<span>"+parseFloat((a/Math.pow(c,f)).toFixed(d))+"</span><span aria-label=\""+e[f][1]+"\">"+e[f][0]+"</span>";
	},
	'byte_1000' : function(a,b) {if(0==a)return"0 Bytes";var c=1000,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));
		f = ( f < 1 ) ? 0 : f;
		return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]
	},
	'decimal_default' : function(a,b) {
		return parseFloat(a).toFixed(b);
	}
};
