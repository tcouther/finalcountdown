/*
	It's the FinalCounterDown!
	Animated Counter with formatting options
	By Terrill Couther
*/

(function(){



//USAGE BASE : Set everything you need to animate
		var count1 = new CountDown({
			'elements': {
				'counter' : document.querySelector("[data-countdown-init]"),
				'digital' : document.querySelector("[data-countdown-digital]"), //optional
				'bar' : document.querySelector("[data-countdown-bar]"), //optinal
				'guage' : document.querySelector("[data-countdown-guage]") //optinal
			},
			'format' : 'percentage_html',
			'newNum' : 10000,
			'min' : 0,
			'max' : 30000,
			'runtime' : 3, //animation framecount
			'easing': true, //rate of slowdown to divide speed
			'idelay' : 200, //initial animation delay
			'decimal': 4 //decimal count
		});
		count1.init();





//USAGE UI : Use graphingFunction to animate your graphs
		count1.graphingFunction = function(num,numFormatted) {
			this.displayGraphGuage(num);
			this.displayGraphBar(num);
		}
		count1.displayGraphBar = function(num) {
			if ( this.elements.bar ) {
				this.elements.bar.style.transform = "translateX("+num+"%)";
			}
		}
		count1.displayGraphGuage = function(num) {
			if ( this.elements.guage ) {
				let val = (num/100 * 180);
				this.elements.guage.style.transform = "rotate("+val+"deg)";
			}
		}




//USAGE EVENTS
		count1.el.addEventListener('eventCountdownStop', function(evt) {
			console.log('stopped');
		}, false);
		//'eventCountdownInit'
		//'eventCountdownStart'
		//'eventCountdownStop'
		//'eventCountdownChange'

		//SINGLE VALUE COUNT
		//count1.countStart({'newNum' : 9869876987765});

		//PERCENTAGE COUNT
		//count1.countTo({'newNum' : 550, 'min' : 0, 'max' : 30000, 'format':'percentage_html'})
		//count1.countTo({'newNum' : 3000.5, 'min' : 0, 'max' : 30000, 'format':'percentage_html'})





//FORM INTERACTIONS
		let formcoEl = document.getElementById('formy')
		let formatEl = document.getElementById('formatnum');
		let newnumEl = document.getElementById('newval');
		let maxnumEl = document.getElementById('maxval');

		function setFormatForm(element) {
			let el = element;

			function getFormats() {
				let formats = count1.formatNum;
				let output = [];
				for (x in formats) {
					output.push(x);
				}
				return output;
			};
			function delOptions() {
				let tags = el.getElementsByTagName('option');
				let arry = Array.prototype.slice.call(tags);
				for ( var i=0; i < arry.length; i++ ) {
					el.removeChild(arry[i]);
				}
			}
			function addOptions(item,index) {
				let newOpt = document.createElement('option');
				newOpt.innerHTML = newOpt.value = item;
				el.appendChild(newOpt);
			}

			delOptions();

			let frmts = getFormats();
			frmts.map(addOptions);
		}

		function changeVal(event) {
			event.preventDefault();
			let format = formatEl.options[formatEl.selectedIndex].value;
			let newnum = parseInt(newnumEl.value);
			let maxnum = parseInt(maxnumEl.value);

			count1.countTo({
				'newNum' : newnum,
				'min' : 0,
				'max' : maxnum,
				'format': format
			});
		}

		formatEl.onchange = function(event) {
			let val = this.options[this.selectedIndex].value;
			if ( val.match('percentage_') ) {
				maxnumEl.className = '';
			} else {
				maxnumEl.className = 'disable-form';
			}
		}

		formcoEl.onsubmit = function(event) {
			changeVal(event);
		}

		setFormatForm(formatEl);
})();
