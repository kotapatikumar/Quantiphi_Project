const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true
  },

  cost: {
    type: Number,
    required: true
  },

  billingCycle: {
    type: String,
    enum: ["Monthly", "Yearly"]
  },

  renewalDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    default: "Active"
  }
});

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);