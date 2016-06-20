if(!Package['iron:router']) return;var RouteController = Package['iron:router'].RouteController;var Router = Package['iron:router'].Router;//assuming, no runtime routes will be addedMeteor.startup(function() {  // this is trick to run the processRoutes at the   // end of all Meteor.startup callbacks  Meteor.startup(processRoutes);});function processRoutes() {  Router.routes.forEach(function(route) {    route.options = route.options || {};    if(route.options.ironMeta) {      handleRoute(route);    } else if(        getController(route) &&         getController(route).prototype &&         getController(route).prototype.ironMeta    ) {      handleRoute(route);    }  });  InitialIronMeta.onAllRoutes(function(path) {    var self = this;  });};function handleRoute(route) {  InitialIronMeta.route(getPath(route), onRoute);  function onRoute(params, path) {    var self = this;    var metaFunc = route.options['meta'];    var context = {      params: params,      path: path    };    var metaData = {};    // TODO Wrap this in a wee try catch sometime!    if(typeof metaFunc == 'function') {        metaData = metaFunc.call(context);    } else if (metaFunc instanceof Array) {        metaData = metaData;    } else if (typeof metaFunc == "object")        metaData = metaFunc;    else        metaData = {};    // Check for array of objects with key values here incase we get an array out of the function call    if (metaData instanceof Array){        var metaDataReplace = {};        _.each(metaData, function(obj){          metaDataReplace[obj.name] = obj.content;        });        metaData = metaDataReplace;    }    return metaData;  }}function getPath(route) {  if(route._path) {    // for IR 1.0    return route._path;  } else {    // for IR 0.9    var name = (route.name == "/")? "" : name;    return route.options.path || ("/" + name);  }}function getController(route) {  if(route.findControllerConstructor) {    // for IR 1.0    return route.findControllerConstructor();  } else if(route.findController) {    // for IR 0.9    return route.findController();  } else {    // unsupported version of IR    return null;  }}