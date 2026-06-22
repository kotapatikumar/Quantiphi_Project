
const express = require("express");
const router = express.Router();

const Subscription =
require("../models/Subscription");


// Add Subscription

router.post("/", async (req, res) => {

  try {

    const subscription =
      new Subscription(req.body);

    await subscription.save();

    res.json(subscription);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Get All

router.get("/", async (req, res) => {

  try {

    const subscriptions =
      await Subscription.find();

    res.json(subscriptions);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Toggle Active/Paused

router.put("/:id", async (req, res) => {

  try {

    const subscription =
      await Subscription.findById(req.params.id);

    subscription.status =
      subscription.status === "Active"
        ? "Paused"
        : "Active";

    await subscription.save();

    res.json(subscription);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;