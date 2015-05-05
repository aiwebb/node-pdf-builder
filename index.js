var PdfClass = function() {
	this.global_options  = {}
	this.pages           = []
	this.wkpath          = 'wkhtmltopdf'
	this.command         = ''
	this.custom_command  = ''

	return this
}

PdfClass.prototype.setPath = function setPath(wkpath) {
	this.wkpath = wkpath
	return this
}

PdfClass.prototype.setCustomCommand = function setCustomCommand(cmd) {
	if (typeof cmd == 'string') {
		this.custom_command = cmd
	}
	else if (typeof cmd == 'function') {
		this.custom_command = cmd.call(this, this.getCommand())
	}

	return this
}

PdfClass.prototype.setGlobalOptions = function setGlobalOptions(global_options) {
	this.global_options = global_options
	return this
}

PdfClass.prototype.addPath = function addPath(path, options) {
	this.pages.push({
		path:   path,
		options: options || {}
	})

	return this
}

PdfClass.prototype.buildCommand = function buildCommand(log) {
	if (!this.wkpath) {
		throw new Error('pdf-builder: wkpath not specified!')
	}

	this.command = [
		this.wkpath,
		getOptionsCmdString(this.global_options),
		getPagesCmdString(this.pages)
	].join(' ')

	if (log) {
		console.log(this.command)
	}

	return this

	function getOptionsCmdString(options) {
		var parts = []

		for (var key in options) {
			if (key == 'fnInput') {continue}

			if (options.hasOwnProperty(key)) {
				var value = options[key]
				key = key.length === 1 ? '-' + key : '--' + dasherize(key)

				if (value !== false) {
					parts.push(key)
				}

				if (typeof value === 'function') {
					parts.push(
						quote(
							'(' + value.toString() + ')(' + JSON.stringify(options.fnInput || null) + ')'
						)
					)
				}
				else if (typeof value !== 'boolean') {
					parts.push(quote(value))
				}
			}
		}

		return parts.join(' ')

		function dasherize(input) {
			return input.replace(/\W+/g, '-')
				.replace(/([a-z\d])([A-Z])/g, '$1-$2')
				.toLowerCase()
		}

		function quote(val) {
			// escape and quote the value if it is a string and this isn't windows
			if (typeof val === 'string' && process.platform !== 'win32') {
				val = '"' + val.replace(/(["\\$`])/g, '\\$1') + '"'
			}

			return val
		}
	}

	function getPagesCmdString(pages) {
		var parts = []

		for (var i = 0; i < pages.length; i++) {
			parts.push(
				pages[i].path,
				getOptionsCmdString(pages[i].options)
			)
		}

		return parts.join(' ')
	}
}

PdfClass.prototype.getCommand = function getCommand() {
	return this.buildCommand().command
}

PdfClass.prototype.writeFile = function writeFile(path, callback) {
	if (!path) {
		throw new Error('pdf-builder-builder: path required for writeFile()')
	}

	var cmd = (this.custom_command || this.getCommand()) + ' ' + path

	require('child_process').exec(cmd, function(err, stdout, stderr) {
		var js_output = []

		stderr.replace(/\r/g, '\n').split('\n').forEach(function(value, index) {
			if (/^(Warning|Error)/.test(value)) {
				value = value.replace(/^(Warning|Error)\:\ /, '')

				if (!/SSL error ignored/.test(value)) {
					js_output.push(value)
				}
			}
		})

		js_output = js_output.join('\n')

		if (callback && typeof callback == 'function') {
			callback(err, js_output)
		}
	})
}

module.exports = PdfClass