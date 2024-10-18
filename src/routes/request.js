const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (request, response) => {
    try {
      const fromUserId = request.user._id;
      const toUserId = request.params.toUserId;
      const status = request.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("invalid status");
      }

      // check if user exist in db or not

      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        throw new Error("User does not exist");
      }

      // if there is existing connectionRequest

      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      console.log(existingRequest);

      if (existingRequest) {
        return response.send("Request is already send to this user");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      response.json({
        message: "Connections request send successfully",
        data,
      });

      // response.send("request send successfully!!");
    } catch (err) {
      console.log(err.message);
      response.status(404).send("ERROR : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (request, response) => {
    try {
      const currentUser = request.user;
      const status = request.params.status;
      const requestId = request.params.requestId;

      // validated the status

      const allowedStatus = ["accepted", "rejected"];
      const isStatusValid = allowedStatus.includes(status);
      if (!isStatusValid) {
        throw new Error("Request is not valid");
      }

      // validate currentUserId is same as toUserId corresponding to the requestId data

      const requestDetails = await ConnectionRequest.findById(requestId);
      if (
        !requestDetails?.toUserId?.equals(currentUser._id) ||
        requestDetails.status !== "interested"
      ) {
        throw new Error("Connection request not found!");
      }

      requestDetails.status = status;

      const data = await requestDetails.save();

      response
        .status(200)
        .json({ message: "Connection request" + status, data });
    } catch (err) {
      response.status(404).send(err.message);
    }
  }
);

module.exports = requestRouter;
