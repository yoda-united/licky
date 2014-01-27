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
   alert(AG.Cloud.sessionId);
   xhr.setRequestHeader( "Set-Cookie", "_session_id="+AG.Cloud.sessionId );
   xhr.send(data);
};

var url = Ti.App.Properties.getString("acs-service-baseurl-slimer");

if(url && url.replace(/^\s+|\s+$/g, "")) {
   exports.URL = url.replace(/^\s+|\s+$/g, "");
} else {
   exports.URL = "http://localhost:8080";
}

exports.application_index = function(data, cb) {
   var path = [];
   path.push('/');
   InvokeService(path.join(''), "GET", data, cb);
};

exports.pic_showPic = function(data, id, cb) {
   if(!id) throw 'id is required!';
   var path = [];
   path.push('/pic');
   if(id) {
      path.push('/' + id);
   }
   InvokeService(path.join(''), "GET", data, cb);
};

exports.pic_ogImage = function(data, id, cb) {
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
