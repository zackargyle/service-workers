const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const argv = require('yargs').argv;

// Constants
const packages = ['generate-service-worker', 'service-worker-plugin'];
const semver = { major: 0, minor: 1, bugfix: 2 };

// Update each package
shell.echo(process.cwd());
shell.cd(path.join(__dirname, '../packages'));
packages.forEach(package => {
  shell.cd(`./${package}`);
  shell.echo(process.cwd());
  // Update version number
  const json = require(path.join(process.cwd(), 'package.json'));
  const split = json.version.split('.').map(Number);
  const index = semver[argv.type || 'bugfix'];
  split[index] = (split[index] || 0) + 1;
  json.version = split.join('.');
  fs.writeFileSync('./package.json', JSON.stringify(json, null, 2));

  // Publish to npm
  shell.exec('npm publish');
  shell.cd('..');
});
