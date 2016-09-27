'use strict';
var common = require('../common');

if (!common.hasCrypto) {
  common.skip('missing crypto');
  return;
}
var tls = require('tls');
var net = require('net');

var bonkers = Buffer.alloc(1024, 42);

var server = net.createServer(common.mustCall(function(c) {
  setTimeout(common.mustCall(function() {
    var s = new tls.TLSSocket(c, {
      isServer: true,
      server: server
    });

    s.on('error', common.mustCall(function() {}));

    s.on('close', function() {
      server.close();
      s.destroy();
    });
  }), 200);
})).listen(0, function() {
  var c = net.connect({port: this.address().port}, function() {
    c.write(bonkers);
  });
});
