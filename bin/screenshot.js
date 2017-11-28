
const debug = require('debug')('app:screenshot');
const path = require('path');
const join = path.join;
const commander = require('commander');
const Nightmare = require('nightmare');
const pkg = require('../package.json');

commander
  .version(pkg.version)
  .option('-p, --port <port>', 'specify a port number to run on', parseInt)
  .option('-n, --name <name>', 'specify the name for demos')
  .parse(process.argv);

const DELAY = 3000;
const port = commander.port;
const name = commander.name;

const t0 = Date.now();
const nightmare = Nightmare({
  gotoTimeout: 600000,
  show: false
});
const url = `http://127.0.0.1:${port}/demos/${name}.html`;
const target = join(process.cwd(), `./demos/assets/screenshots/${name}.png`);
nightmare.viewport(800, 450) // 16 x 9
  .goto(url)
  .wait(DELAY)
  .screenshot(target, () => {
    debug(name + ' took ' + (Date.now() - t0) + ' to take a screenshot.');
    process.exit(0);
  })
  .end()
  .catch(e => {
    debug(url);
    debug(target);
    debug(name + ' failed to take a screenshot: ' + e);
    process.exit(1);
  });

