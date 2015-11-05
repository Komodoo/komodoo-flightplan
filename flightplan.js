require('dotenv').load();

var plan = require('flightplan'),
    utils = require('./utils.js');


plan.target('x', {
  host: process.env.STAGING_HOST,
  username: process.env.STAGING_USERNAME,
  agent: process.env.SSH_AUTH_SOCK
});


plan.local(function(local) {
  local.debug('Start to build configs file');
  local.waitFor(utils.buildConfigs);
  local.debug('Config file built');

  local.debug('Start to send configs file');
  local.transfer('./komodoo-discourse.yml', '/var/discourse/containers/');

  local.log('Config file sent to each targets');
});
