# node-pdf-builder
Requires [wkhtmltopdf](http://wkhtmltopdf.org).

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
		runScript: function() {
			console.log('Google input being processed...')
		}
	})
	.addPath('http://wkhtmltopdf.com/', {
		headerCenter: 'wkhtmltopdf',
		fnInput: 'wkhtmltopdf input being processed...',
		runScript: function(foo) {
			console.log(foo) // wkhtmltopdf input being processed...
		}
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

# Features
- Supports multiple pages
- Supports global and page-level `wkhtmltopdf` options
- Supports custom commands - use the helper functions as much or as little as you want
- Suppresses `wkhtmltopdf` progress messages and only returns actual page outputs and errors
- Supports passing actual functions as `runScript` values, with `fnInput` as its input

# TODO
- `.stream()`
- `.addTableOfContents()`

# Acknowledgments
- Inspired by (and some internal helper functions lifted from) [devongovett/node-wkhtmltopdf](http://github.com/devongovett/node-wkhtmltopdf)
