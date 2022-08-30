const os = require('node:os')
const core = require('@actions/core')
const child_process = require('node:child_process')

function install(platform) {
    var command

    if (platform === 'win32') {
        command = 'pwsh --command \"choco install zerotier-one\"'
        child_process.exec(command,
            function (error, stdout, stderr) {
                if (stderr !== "") {
                    throw `ERROR: ${stderr}`
                }

                if (!stdout.includes('zerotier-one has been installed')) {
                    throw `ERROR: ${stdout}`
                }

                console.log('zerotier-one has been installed')
                join(platform)
            })

    } else if (platform === 'linux') {
        command = 'curl -s https://install.zerotier.com | sudo bash'
        child_process.exec(command,
            function (error, stdout, stderr) {
                if (!stdout.includes('Success! You are ZeroTier address')) {
                    throw `ERROR: ${stdout}`
                }

                console.log('zerotier-one has been installed')
                join(platform)
            })
    }
}

function join(platform) {
    var base_command
    if (platform === 'win32') {
        base_command = '\"C:\\Program Files (x86)\\ZeroTier\\One\\zerotier-cli.bat\"'
    } else if (platform === 'linux') {
        base_command = 'sudo zerotier-cli'
    }

    const network_id = core.getInput('network_id')
    const command = `${base_command} join ${network_id}`
    child_process.exec(command,
        function (error, stdout, stderr) {
            if (stderr !== "") {
                throw `ERROR: ${stderr}`
            }

            if (!stdout.includes('200 join OK')) {
                throw `ERROR: ${stdout}`
            } else {
                console.log("network join successful")
            }
        })
}

try {
    install(os.platform())
} catch (error) {
    core.setFailed(error.message)
}
