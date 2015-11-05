require('dotenv').load();

var plan = require('flightplan'),
    utils = require('./utils.js');


plan.target('staging', {
  host: process.env.STAGING_HOST,
  username: process.env.STAGING_USERNAME,
  agent: process.env.SSH_AUTH_SOCK
});


plan.local(function(local) {
  local.waitFor(utils.buildConfigs);
  local.log("Done");
});
