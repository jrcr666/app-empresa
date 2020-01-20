const Vue = require('../../../modules/VueFW');
const fs = require('fs');

const template = fs.readFileSync(__dirname + '/template.html', 'utf8');

module.exports = Vue.component('input-text', {
	model: {
		prop: 'value',
		event: 'input'
	},
	props: ['label', 'ariaLabel', 'dataId', 'onchange', 'oninput', 'value'],
	data: function() {
		return {
			onChange: this.onchange || (() => {})
		}
	},
	methods: {
		onInput(event) {
			if (this.$parent.$options._componentTag === 'form-container') {
				this.$parent.$data.modified = true;
			}
			this.$emit('input', event.target.value);
			this.oninput ? this.input() : (() => {})
		}
	},
	template
});
//<small id="ariaLabel" class="form-text text-muted">We'll never share your email with anyone else.</small>