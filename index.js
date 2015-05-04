var PdfClass = function() {
	this.global_options = {}
	this.pages          = []
	this.wkpath         = 'wkhtmltopdf'
	this.command        = ''
	this.customCommand  = ''
	this.output         = ''

	return this
}

PdfClass.prototype.setPath = function setPath(wkpath) {
	this.wkpath = wkpath
	return this
}

PdfClass.prototype.setCustomCommand = function setCustomCommand(cmd) {
	if (typeof cmd == 'string') {
		this.customCommand = cmd
	}
	else if (typeof cmd == 'function') {
		this.customCommand = cmd.call(this, this.getCommand())
	}

	return this
}

PdfClass.prototype.setGlobalOptions = function setGlobalOptions(global_options) {
	this.global_options = global_options
	return this
}

PdfClass.prototype.setOutput = function setOutput(output) {
	this.output = output
	return this
}

PdfClass.prototype.addInput = function addInput(path, options) {
	this.pages.push({
		path:   path,
		options: options || {}
	})

	return this
}

PdfClass.prototype.buildCommand = function buildCommand(log) {
	if (!this.wkpath) {
		throw new Error('wkhtmltopdf: wkpath not specified!')
	}

	if (!this.output) {
		throw new Error('wkhtmltopdf: output not specified!')
	}

	this.command = [
		this.wkpath,
		getOptionsCmdString(this.global_options),
		getPagesCmdString(this.pages),
		this.output
	].join(' ')

	if (log) {
		console.log(this.command)
	}

	return this

	function getOptionsCmdString(options) {
		var parts = []

		for (var key in options) {
			if (options.hasOwnProperty(key)) {
				var value = options[key]
				key = key.length === 1 ? '-' + key : '--' + dasherize(key)

				if (value !== false) {
					parts.push(key)
				}

				if (typeof value !== 'boolean') {
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

PdfClass.prototype.generate = function generate(callback) {
	require('child_process').exec(this.customCommand || this.getCommand(), function(err, stdout, stderr) {
		var js_output = stderr.replace(/\r/g, '\n').split('\n').filter(function(line) {
			return /^(Warning|Error)/.test(line)
		}).join('\n')

		console.log(js_output)
	})
}

module.exports = PdfClass