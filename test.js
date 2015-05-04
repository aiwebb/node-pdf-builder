#!/usr/bin/env node

var PDF = require('./index.js')

new PDF()
	.setGlobalOptions({
		headerFontSize: 18,
		headerSpacing:  10,
		marginTop:      30
	})
	.addInput('http://google.com',       {headerCenter: 'Google'})
	.addInput('http://wkhtmltopdf.com/', {headerCenter: 'wkhtmltopdf'})
	.setOutput('output.pdf')
	.setCustomCommand(function() {
		// Inject custom logic into command construction
		return this.getCommand().replace(/wkhtmltopdf.com/g, 'wkhtmltopdf.org')
	})
	.generate()