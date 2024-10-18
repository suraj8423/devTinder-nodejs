const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "gender", "about"];

userRouter.get(
  "/user/requests/received",
  userAuth,
  async (request, response) => {
    try {
      const currentUser = request.user;
      const connectionRequests = await ConnectionRequest.find({
        toUserId: currentUser._id,
        status: "interested",
      }).populate("fromUserId", USER_SAFE_DATA);

      response.status(200).json({
        message: "Connection requests fetched successfully!",
        data: connectionRequests,
      });
    } catch (err) {
      response.status(400).send("ERROR: " + err.message);
    }
  }
);

userRouter.get("/user/connections", userAuth, async (request, response) => {
  try {
    const currentUserId = request.user._id;
    const connections = await ConnectionRequest.find({
      status: "accepted",
      $or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connections.map((connection) => {
      return connection.fromUserId;
    });

    response.json({
      message: "All connections are fetched successfully!",
      data,
    });
  } catch (err) {
    response.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (request, response) => {
  try {
    const page = parseInt(request.query.page) || 1;
    let limit = parseInt(request.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const currentUserId = request.user._id;
    const connectionRequestDetails = await ConnectionRequest.find({
      $or: [{ fromUserId: currentUserId }, { toUserId: currentUserId }],
    });

    const filteredUsedIds = connectionRequestDetails.map(
      (connectionRequestDetail) => {
        const { fromUserId, toUserId } = connectionRequestDetail;

        if (fromUserId === currentUserId) {
          return toUserId;
        }
        return fromUserId;
      }
    );

    const userFeed = await User.find({
      _id: { $nin: filteredUsedIds, $ne: currentUserId },
    })
      .select(USER_SAFE_DATA)
      .skip((page - 1) * 10)
      .limit(limit);

    response.json({
      message: "Fedd for the current user",
      userFeed,
    });
  } catch (err) {
    response.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
