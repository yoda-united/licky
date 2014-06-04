/**
 * This is generated code - it will be overwritten. Do not modify.
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 */

function InvokeService(path, method, data, cb) {
   if (typeof(data) == "function") {
      cb = data; data = null;
   }
   if (typeof(cb) !== "function")
      throw new Error("callback must be provided!");
   var xhr = Ti.Network.createHTTPClient();
   xhr.onerror = function(e) {
      cb(e.error);
   };
   xhr.onload = function(e) {
      var r = this.responseText;
      try {
         if (xhr.getResponseHeader("content-type").indexOf("json") != -1) {
             r = JSON.parse(r);
         }
      } catch (E) {}
      cb(null, r);
   };
   if(exports.URL.match('/$') == '/' && path.indexOf('/') == 0) {
       xhr.open(method, exports.URL + path.substring(1));
   } else {
       xhr.open(method, exports.URL + path);
   }
   xhr.send(data);
};

var url = Ti.App.Properties.getString("acs-service-baseurl-slimer");

if(!url) throw new Error("Url not found by acs-service-baseurl-slimer.");
if(url.replace(/^\s+|\s+$/g, "")) {
   exports.URL = url.replace(/^\s+|\s+$/g, "");
} else {
   exports.URL = "http://localhost:8080";
}

exports.application_index = function(data, cb) {
   var path = [];
   path.push('/');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.post_showPost = function(data, id, cb) {
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/post');
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.post_ogImage = function(data, id, cb) {
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/og_image');
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.application_showMe = function(data, cb) {
   var path = [];
   path.push('/show_me');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.application_loginOnlyPage = function(data, cb) {
   var path = [];
   path.push('/login');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.user_showUser = function(data, id, cb) {
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/user');
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.useraccess_login = function(data, cb) {
   var path = [];
   path.push('/api/login');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.useraccess_betaLogin = function(data, cb) {
   var path = [];
   path.push('/api/betaLogin');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.useraccess_logout = function(data, cb) {
   var path = [];
   path.push('/api/logout');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.api_changeStatus = function(data, cb) {
   var path = [];
   path.push('/api/changeBetaStatus');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.api_updateUsersEmail = function(data, cb) {
   var path = [];
   path.push('/api/updateUsersEmail');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.application_appBetaPage_dummy = function(data, cb) {
   var path = [];
   path.push('/beta_admin');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.acs_callback = function(data, acs_method_name, id, cb) {
   if(!acs_method_name) throw 'acs_method_name is required!';
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/api/acs');
   if(acs_method_name) {
      path.push('/' + acs_method_name);
   }
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.acs_callback1 = function(data, acs_method_name, cb) {
   if(!acs_method_name) throw 'acs_method_name is required!';
   var path = [];
   path.push('/api/acs');
   if(acs_method_name) {
      path.push('/' + acs_method_name);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.acs_callback2 = function(data, acs_method_name, cb) {
   if(!acs_method_name) throw 'acs_method_name is required!';
   var path = [];
   path.push('/api/acs');
   if(acs_method_name) {
      path.push('/' + acs_method_name);
   }
   InvokeService(path.join(''), "POST", data, cb);
};

exports.acs_callback3 = function(data, acs_method_name, id, cb) {
   if(!acs_method_name) throw 'acs_method_name is required!';
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/api/acs');
   if(acs_method_name) {
      path.push('/' + acs_method_name);
   }
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "DELETE", data, cb);
};

exports.application_mobileconfig = function(data, cb) {
   var path = [];
   path.push('/licky.mobileconfig');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.application_appBetaUdid = function(data, cb) {
   var path = [];
   path.push('/device_reg_handler/');
   InvokeService(path.join(''), "POST", data, cb);
};

exports.application_fblogin = function(data, cb) {
   var path = [];
   path.push('/device_reg_result/');
   InvokeService(path.join(''), "GET", data, cb);
};
