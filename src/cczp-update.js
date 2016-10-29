CCZP.prototype.update = function() {
	requestAnimationFrame(this.update.bind(this));

	this.editors.forEach((editor) => {
		editor.update();
	});

};