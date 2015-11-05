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


plan.remote('deploy', function(remote) {
  remote.debug('Move to discourse directory');
  remote.with('cd /var/discourse/', function(){
    remote.exec('./launcher bootstrap komodoo-discourse');
  });
});


plan.remote('redeploy', function(remote) {
  remote.debug('Move to discourse directory');
  remote.with('cd /var/discourse/', function(){
    remote.exec('./launcher rebuild komodoo-discourse');
  });
});


plan.remote(['start', 'deploy', 'deploy'], function(remote) {
  remote.debug('Move to discourse directory');
  remote.with('cd /var/discourse/', function(){
    remote.exec('./launcher start komodoo-discourse');
  });
});


plan.remote('stop', function(remote) {
  remote.debug('Move to discourse directory');
  remote.with('cd /var/discourse/', function(){
    remote.exec('./launcher ststopart komodoo-discourse');
  });
});
