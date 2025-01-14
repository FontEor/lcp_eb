const { engines } = require('../package.json')

let semver = null
try {
    semver = require('semver')
} catch (error) { }

const version = engines.node
if (semver && (!semver.satisfies(process.version, version))) {
    console.error(`Required node version ${version}, got: ${process.version}.`)
    process.exit(1)
}
if (!semver && (process.version !== version)) {
    console.error(`Required node version ${version} and npm version ${engines.npm}, got: ${process.version}.`)
    process.exit(1)
}