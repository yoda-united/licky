// base on https://github.com/dbankier/ticonfig
// var _ = require("underscore");
var os = require('os');

exports.cliVersion = '>=3.2';
 
var ifaces=os.networkInterfaces();
var ip_address;
for (var dev in ifaces) {
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4' && !details.internal) {
      ip_address = details.address;
    }
  });
}

exports.init = function (logger, config, cli, appc) {
  // credits to @fokkezb for pointing out the build.pre.contruct hook - https://github.com/dbankier/TiShadow/pull/213/
  cli.addHook('build.pre.compile', function (build, finished) {
    if (build.tiapp && build.tiapp.properties && build.deployType !== "production") {
      var keys = Object.keys(build.tiapp.properties).filter(function(e) { return e.match("^dev\.");});
      keys.forEach(function(k) {
        build.tiapp.properties[k.replace(/^dev\./,'')].value = build.tiapp.properties[k].value.replace(/__IP_ADDRESS__/,ip_address);
        console.log(build.tiapp.properties[k.replace(/^dev\./,'')]);
      });
    }
    finished();
  });
};
