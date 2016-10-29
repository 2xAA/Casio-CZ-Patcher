CCZP.envelopeEditor = function(className) {
	let r =  window.devicePixelRatio;
	let canvas = document.querySelector('canvas.' + className);
	let context = canvas.getContext('2d');

	this.divisions = 8;
	this.currentDivisions = this.divisions;
	this.dividedWidth = null;

	let points = Array(this.currentDivisions);
	let currentPoint;

	let mousedown = false;

	this.calculateDividedWidth = () => {
		return Math.round(canvas.width / this.currentDivisions);
	};

	this.rescalePoints = (lastDivisions) => {
		let maxDivisionWidth = (canvas.width / lastDivisions);

		for(let i=0; i < points.length; i++) {
			let point = points[i];

			let from = i * this.dividedWidth;
			let to = (i+1) * this.dividedWidth;

			let fakeX = Math.map(point.x, maxDivisionWidth * i, maxDivisionWidth * (i+1), from, to);

			point.x = fakeX;
		}
	};

	this.resize = () => {
		canvas.width = canvas.parentNode.offsetWidth * r;
		canvas.height = canvas.parentNode.offsetHeight * r;
	
		this.dividedWidth = this.calculateDividedWidth();

		let height = canvas.parentNode.offsetHeight;

		if(height > 310) height = 310;

		canvas.style.width = canvas.parentNode.offsetWidth + 'px';
		canvas.style.height = height + 'px';
	};

	window.addEventListener('resize', this.resize);
	this.resize();

	for(let i=0; i < points.length; i++) {
		let from = i * this.dividedWidth;

		points[i] = new CCZP.Point((from+1) / r, 10);
		let id = "point-" + i;
		points[i].id = id;
	}

	canvas.addEventListener('mousemove', e => {
		let x = e.clientX - canvas.offsetLeft;
		let y = e.clientY - canvas.offsetTop;

		if(!mousedown) {
			if(event.region) {
		    	currentPoint = event.region;
		    	canvas.style.cursor = 'pointer';
			} else {
				canvas.style.cursor = 'default';
				currentPoint = null;
			}
		} else {
			if(currentPoint === null) return;
			canvas.style.cursor = 'pointer';
			let pointIdx;
			try {
				pointIdx = parseInt(currentPoint.replace('point-', ''));
			} catch(error) {
				return;
			}

			let from = pointIdx * this.dividedWidth;
			let to = (pointIdx+1) * this.dividedWidth;

			if(x * r < from) x = from / r;
			if(x * r > to) x = to / r;

			if(y * r > 0 && y * r <= canvas.height) {

				points[pointIdx].x = x;
				points[pointIdx].y = y;

				console.log('level:', Math.round(Math.map(y * r, 1, canvas.height-1, 99, 0)));
				console.log('rate:', Math.round(Math.map(x * r, from, to, 0, 99)));
			}
		}
	});

	window.addEventListener('mousedown', () => {
		mousedown = true;
	});

	window.addEventListener('mouseup', () => {
		mousedown = false;
	});

	this.update = ()=> {
		let modifier = 1;
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.lineWidth = 1 * r;
		
		for(let i=0; i < this.currentDivisions; i++) {
			if(i % 2) context.fillStyle = '#aaa';
			else context.fillStyle = '#999';
			context.fillRect(this.dividedWidth * i, 0, this.dividedWidth, canvas.height);
		}

		// draw colour block
		context.beginPath();
		context.moveTo(0, canvas.height);
		for(let i=0; i < this.currentDivisions; i++) {
			let point = points[i];
			context.lineTo(point.x * r, point.y * r);

			if(i+1 <= this.currentDivisions-1) {
				let nextPoint = points[i+1];
				context.lineTo(nextPoint.x * r, nextPoint.y * r);
			}
		}
		context.lineTo(canvas.width, canvas.height);
		context.closePath();
		context.globalCompositeOperation = 'overlay';
		context.opacity = 0.3;
		context.fillStyle = 'green';
		context.fill();
		context.opacity = 1;
		context.globalCompositeOperation = 'normal';

		context.fillStyle = '#000';

		// draw lines and points
		for(let i=0; i < this.currentDivisions; i++) {
			let point = points[i];
			let nextPoint = points[i+1];
			
			if(point.id === currentPoint) {
				modifier = 1.5;
			} else {
				modifier = 1;
			}

			context.beginPath();
			context.arc(point.x * r, point.y * r, modifier * (2 * r), 0, 2 * Math.PI, true);
			context.addHitRegion({id: point.id});
			context.fill();
			context.closePath();

			if(i === 0) {
				context.beginPath();
				context.moveTo(0, canvas.height);
				context.lineTo(point.x * r, point.y * r);
				context.stroke();
			}

			if(i < this.currentDivisions-1) {
				context.beginPath();
				context.moveTo(point.x * r, point.y * r);
				context.lineTo(nextPoint.x * r, nextPoint.y * r);
				context.stroke();
			}

			if(i === this.currentDivisions-1) {
				context.beginPath();
				context.moveTo(canvas.width, canvas.height);
				context.lineTo(point.x * r, point.y * r);
				context.stroke();
			}
		}
	};

	let controls = this.createDOMControls();
	canvas.parentNode.appendChild(controls);
};

