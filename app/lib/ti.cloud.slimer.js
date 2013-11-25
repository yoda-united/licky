/**
 * This is generated code - it will be overwritten. Do not modify.
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 */

function InvokeService(path, method, data, cb) {
   if (typeof(data) == "function") {
      cb = data; data = null;
   }
   var xhr = Ti.Network.createHTTPClient();
   if (typeof(cb) == "function") {
        xhr.onload = function(e) {
           var r = this.responseText;
           if (xhr.getResponseHeader("content-type").indexOf("json") != -1) {
               try { r = JSON.parse(r); } catch (E) { }
           }
           cb(r, e);
        };
   }
   if(exports.URL.match('/$') == '/' && path.indexOf('/') == 0) {
       xhr.open(method, exports.URL + path.substring(1));
   } else {
       xhr.open(method, exports.URL + path);
   }
   xhr.send(data);
};

var url = Ti.App.Properties.getString("acs-service-baseurl-slimer");

if(url && url.replace(/^\s+|\s+$/g, "")) {
   exports.URL = url.replace(/^\s+|\s+$/g, "");
} else {
   exports.URL = "http://localhost:8080";
}

exports.application_index = function (data, cb) {
   InvokeService("/index", "GET", data, cb);
};

exports.application_chatroom = function (data, cb) {
   InvokeService("/", "GET", data, cb);
};

exports.application_loginUser = function (data, cb) {
   InvokeService("/testLogin", "GET", data, cb);
};

exports.application_test = function (data, cb) {
   InvokeService("/test", "GET", data, cb);
};

exports.application_userList = function (data, cb) {
   InvokeService("userList", "GET", data, cb);
};

exports.application_haha = function (data, cb) {
   InvokeService("haha", "GET", data, cb);
};
