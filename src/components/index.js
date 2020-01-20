const components = [
	'button-default',
	'form-container',
	'input-text'
];

module.exports = components.map(component => require(`./${component}/component`));