const Vue = require('../../../modules/VueFW');
const fs = require('fs');

const template = fs.readFileSync(__dirname + '/template.html', 'utf8');

module.exports = Vue.component('button-default', {
	props: ['label', 'dataId', 'disabled', 'type', 'onclick'],
	data: function() {
		return {}
	},
	template
});