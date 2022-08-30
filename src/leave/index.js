const os = require('node:os')
const core = require('@actions/core')
const child_process = require('node:child_process')

function leave(platform) {
    var base_command
    if (platform === 'win32') {
        base_command = '\"C:\\Program Files (x86)\\ZeroTier\\One\\zerotier-cli.bat\"'
    } else if (platform === 'linux') {
        base_command = 'sudo zerotier-cli'
    }

    const network_id = core.getInput('network_id')
    const command = `${base_command} leave ${network_id}`
    child_process.exec(command,
        function (error, stdout, stderr) {
            if (stderr !== "") {
                throw stderr
            }

            if (!stdout.includes('200 leave OK')) {
                throw `ERROR: ${stdout}`
            } else {
                console.log("network leave successful")
            }
        })
}

try {
    leave(os.platform())
} catch (error) {
    core.setFailed(error.message)
}
