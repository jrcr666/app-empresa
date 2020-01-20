const Vue = require('../../../modules/VueFW');
const fs = require('fs');

const template = fs.readFileSync(__dirname + '/template.html', 'utf8');

const formContainer = Vue.component('form-container', {
	model: {
		prop: 'modified',
		event: 'Inputchanged'
	},
	props: ['dataId', 'disabled', 'onsubmit', 'modified'],
	data: function() {
		return {
			_onsubmit: this.onsubmit || null
		}
	},
	methods: {
		hasChanged(event){
			this.$emit('Inputchanged', true);
		}
	},
/*	computed: {
		isModified() {
			debugger

			return this.modified;
		}
	},*/
	template
});

module.exports = formContainer;