/**
 * New node file
 */

var W = require('when');

exports.stdSeqSuccess = function (res, obj) {
    res.setHeader('Content-Type', 'application-json');
    res.send(200, obj || {});
};

exports.stdErr500 = function (res, message) {
    res.send(500, message);
}

exports.stdErr400 = function (res, message) {
    res.send(400, message);
}

exports.stdSeqError = function (res, err) {
    exports.stdErr500(res, err.message);
};

exports.reject = function (reason) {
    throw new Error(reason);
}

exports.commit = function (t) {
    var df = W.defer();
    t.commit(t)
        .success(df.resolve)
        .error(df.reject);
    return df.promise;
}

exports.rollback = function (t, err) {
    var df = W.defer();
    t.rollback(t)
        .success(function() { df.reject(err)} )
        .error(function() { df.reject(err)} );
    return df.promise;
}

exports.gentops = function(t) {
    var opts = {};
    if (t) opts.transaction = t;
    return opts;
}

exports.addTrans = function(t, obj) {
    if (!t) return obj;
    else {
        obj.transaction = t;
        return obj;
    }
}