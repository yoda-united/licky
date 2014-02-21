exports.cliVersion = '>=3.X';

exports.init = function (logger, config, cli, appc) {

    cli.addHook('build.pre.compile', function (build, finished) {
        // "build" arg contains the state of the build
        // note: "build" arg is null for "build.pre.construct" event
        build.tiapp.properties["ti.facebook.appid"] = build.tiapp.properties["ti.facebook.appid"] || {};
        if(build.deployType == "production"){
        	build.tiapp.properties["ti.facebook.appid"].value = "***REMOVED***";
        }else{
        	build.tiapp.properties["ti.facebook.appid"].value = "***REMOVED***";
        }
		
        finished(); // remember to call finished!
    });

};