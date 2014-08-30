/**
 * New node file
 */


/*
 * GET users listing.
 */

module.exports = function (db) {

    var util = require('../util');
    var dao = require('../dao')(db);
    var W = require('when');
    var crypto = require('crypto');

    return {
        logout: function (req, res) {
            delete req.session.userId;
            delete req.session.loggedIn;
        }
    }

}
