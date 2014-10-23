'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
    plans = require('../../app/controllers/plans');

module.exports = function (app) {
    function supportCrossOriginScript(req, res, next) {
        res.status(200);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }
    // Plan Routes
    app.route('/plans')
        .get(supportCrossOriginScript, plans.list)
        .options(supportCrossOriginScript)
        .post(supportCrossOriginScript, users.requiresLogin, plans.create);

    app.route('/plans/search/:search_text')
        .get(supportCrossOriginScript, plans.search_list);

    app.route('/plans/future_list')
        .get(supportCrossOriginScript, plans.future_list);

    app.route('/plans/:planId')
        .get(supportCrossOriginScript, plans.read)
        .options(supportCrossOriginScript)
        .put(supportCrossOriginScript, users.requiresLogin, plans.hasAuthorization, plans.update)
        .delete(supportCrossOriginScript, users.requiresLogin, plans.hasAuthorization, plans.delete);

    // Finish by binding the plan middleware
    app.param('planId', plans.planByID);
};