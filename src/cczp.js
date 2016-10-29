var CCZP = class {
	constructor() {
		this.editors = [];

		this.editors.push(new CCZP.envelopeEditor('dcw1'));
		this.editors.push(new CCZP.envelopeEditor('dco1'));
		this.editors.push(new CCZP.envelopeEditor('dca1'));

		this.editors.forEach(editor => {
			editor.resize();
		});

		requestAnimationFrame(this.update.bind(this));
	}
};

window.CCZP = CCZP;