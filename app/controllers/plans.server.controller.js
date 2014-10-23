'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Plan = mongoose.model('Plan'),
    _ = require('lodash');

/**
 * Create a plan
 */
exports.create = function (req, res) {
    var plan = new Plan(req.body);
    plan.user = req.user;

    plan.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plan);
        }
    });
};

/**
 * Show the current plan
 */
exports.read = function (req, res) {
    res.jsonp(req.plan);
};

/**
 * Update a plan
 */
exports.update = function (req, res) {
    var plan = req.plan;

    plan = _.extend(plan, req.body);

    plan.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plan);
        }
    });
};

/**
 * Delete an plan
 */
exports.delete = function (req, res) {
    var plan = req.plan;

    plan.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plan);
        }
    });
};

/**
 * List of Plans
 */
exports.list = function (req, res) {
    Plan.find().sort('-created').populate('user', 'displayName').exec(function (err, plans) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plans);
        }
    });
};

/**
 * Plan middleware
 */
exports.planByID = function (req, res, next, id) {
    Plan.findById(id).populate('user', 'displayName').exec(function (err, plan) {
        if (err) return next(err);
        if (!plan) return next(new Error('Failed to load plan ' + id));
        req.plan = plan;
        next();
    });
};

/**
 * List of filtered Plans
 */
exports.search_list = function (req, res) {
    var re = new RegExp(req.params.search_text, 'i');
    Plan.find().find({'destination': { $regex: re }}).sort('-created').populate('user', 'displayName').exec(function (err, plans) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plans);
        }
    });
};

/**
 * List of future Plans
 */
exports.future_list = function (req, res) {
    var current_date = new Date();
    var range_start = new Date(current_date.getFullYear(), current_date.getMonth()+1, 1);
    var range_end = new Date(current_date.getFullYear(), current_date.getMonth()+2, 1);
    Plan.find().find({'start_date': {'$gte': range_start, '$lt': range_end}}).sort('-created').populate('user', 'displayName').exec(function (err, plans) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(plans);
        }
    });
};

/**
 * Plan authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.plan.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};