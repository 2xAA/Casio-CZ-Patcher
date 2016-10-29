CCZP.envelopeEditor.prototype.createDOMControls = function() {
	let divisionsPlusButton = document.createElement('button');
	let divisionsMinusButton = document.createElement('button');

	let controlsContainer = document.createElement('div');

	controlsContainer.appendChild(divisionsMinusButton);
	controlsContainer.appendChild(divisionsPlusButton);

	divisionsMinusButton.textContent = '-';
	divisionsMinusButton.classList.add('pure-button');
	divisionsMinusButton.addEventListener('click', () => {
		if(this.currentDivisions > 1) {
			this.currentDivisions--;
			this.dividedWidth = this.calculateDividedWidth();
			this.rescalePoints(this.currentDivisions+1);
		}
	});

	divisionsPlusButton.textContent = '+';
	divisionsPlusButton.classList.add('pure-button');
	divisionsPlusButton.addEventListener('click', () => {
		if(this.currentDivisions < this.divisions) {
			this.currentDivisions++;
			this.dividedWidth = this.calculateDividedWidth();
			this.rescalePoints(this.currentDivisions-1);
		}
	});

	return controlsContainer;
};