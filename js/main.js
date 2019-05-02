Number.prototype.fixed = function(digits) {
	digits = digits || 0;
	return this.toFixed(digits);
};
HTMLElement.prototype.attr = function(name, value) {
    if(value === undefined){
        return this.getAttribute(name);
    }
    this.setAttribute(name, value);
};


var ACTIVITY_COEFFS = [1.2, 1.375, 1.55, 1.725, 1.9];
function getByID(id){
	return document.getElementById(id);
}
function getValByID(id){
	return document.getElementById(id).value;
}
function getByClass(cls){
	return Array.prototype.slice.call(document.getElementsByClassName(cls));
}


function init() {
	getByClass('collapse').forEach(function(arg){
		// console.log(arg);
		var content = getByID(arg.attr('data-for'));
		content.style['max-height'] = content.scrollHeight + "px";
		arg.addEventListener('click', function(){
			if (content.style['max-height'] && content.style['max-height'] != '0px'){
				content.style['max-height'] = '0px';
		    } else {
		      content.style['max-height'] = content.scrollHeight + "px";
		    }
		});
	});
	recalc();
}

function recalc() {
	var age = Number(getValByID('age'));
	var sex = Number(getValByID('sex'));
	var size = Number(getValByID('size'));
	var weight = Number(getValByID('weight'));

	if(!age || isNaN(sex) || !size || !weight) return

	var basic = sex === 0 ? 
		(66.47 + (13.7 * weight) + (5 * size) - (6.8 * age))
		: (655.1 + (9.6 * weight) + (1.8 * size) - (4.7 * age));

	getByID('basic').innerHTML = basic.fixed(1);

	var bmr = basic * ACTIVITY_COEFFS[getValByID('activity')];
	getByID('cals').innerHTML = bmr.fixed(1);
	var weekly = bmr * 7;
	getByID('week-cals').innerHTML = weekly.fixed(1);

	var surplus = Number(getValByID('surplus'));
	var delta = Number(getValByID('delta'));
	var workout = Number(getValByID('workout'));
	var maxWorkFat = Number(getValByID('fat'));
	var kProtein = Number(getValByID('proteinX'));
	
	var protein = weight * kProtein;
	
	if(workout) {			
		var rest = 7 - workout;
		var weekTotal = weekly + surplus;

		var wCals = weekTotal / 7 + delta / 2;
		var rCals = weekTotal / 7 - delta / 2;

		var normFactor = (weekTotal - (wCals * workout + rCals * rest)) / 7;

		wCals += normFactor;
		rCals += normFactor;
		// console.log(wCals, rCals);

		var maxRestCarbs = weight;

		getByID('work-protein').innerHTML = protein.fixed(1);

		getByID('work-fat').innerHTML = maxWorkFat.fixed(1);
		getByID('rest-fat').innerHTML = ((rCals - protein * 4 - maxRestCarbs * 4) / 9).fixed(1);

		getByID('work-carb').innerHTML = ((wCals - protein * 4 - maxWorkFat * 9) / 4).fixed(1);
		getByID('rest-carb').innerHTML = maxRestCarbs.fixed(1);

		getByID('work-cal').innerHTML = wCals.fixed(1);
		getByID('rest-cal').innerHTML = rCals.fixed(1);

	}
	
	var plainFat = Number(getValByID('plain-fat')) * weight;
	if(!isNaN(plainFat)){

		var dailyKCal = bmr + surplus / 7;

		getByID('plain-cal').innerHTML = dailyKCal.fixed(1);
		getByID('plain-protein').innerHTML = protein.fixed(1);
		getByID('plain-carb').innerHTML = ((dailyKCal - protein * 4 - plainFat * 9) / 4).fixed(1);
		getByID('plain-fat-res').innerHTML = plainFat.fixed(1);
	}
}



var app6 = new Vue({
	el: '#app-6',
	data: {
	message: 'Hello Vue!'
	}
})