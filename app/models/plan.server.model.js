'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Plan Schema
 */
var PlanSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    destination: {
        type: String,
        default: '',
        trim: true,
        required: 'Destination cannot be blank'
    },
    comment: {
        type: String,
        default: '',
        trim: true
    },
    start_date: {
        type: Date
    },
    end_date: {
        type: Date
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Plan', PlanSchema);