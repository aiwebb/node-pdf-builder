# node-pdf-builder 0.2.0
Requires [wkhtmltopdf](wkhtmltopdf.org).

# Installation
```
npm install pdf-builder
```

# Example
```js
var PDF = require('pdf-builder')

new PDF()
	.setGlobalOptions({
		headerFontSize:  18,
		headerSpacing:   10,
		marginTop:       30,
		debugJavascript: true
	})
	.addPath('http://google.com', {
		headerCenter: 'Google',
		runScript: 'console.log("Google input being processed...")'
	})
	.addPath('http://wkhtmltopdf.com/', {
		headerCenter: 'wkhtmltopdf',
		runScript: 'console.log("wkhtmltopdf input being processed...")'
	})
	.setCustomCommand(function() {
		// Inject custom logic into command construction
		return this.getCommand().replace(/wkhtmltopdf.com/g, 'wkhtmltopdf.org')
	})
	.writeFile('output.pdf', function(err, result) {
		// result contains any warnings / console output from input execution
		console.log(result)
		console.log('Done!')

		/*
			Output:

			:1 Google input being processed...
			:1 wkhtmltopdf input being processed...
			Done!
		*/
	})
```

# TODO
- Accept promises for input paths
- Accept promises for `runScript` arguments
- `.stream()`
- `.addTableOfContents()`