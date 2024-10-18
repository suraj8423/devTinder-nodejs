const express = require("express");
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter,profileRouter,requestRouter,userRouter);

connectDB()
  .then(() => {
    console.log("Database Connection established succesfully!");
    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });



// Feed API Get - call to get the data of all the users

// app.get("/feed", userAuth, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.send(users);
//   } catch (err) {
//     console.log(err.message);
//     res.status(401).send("Something went wrong");
//   }
// });

// // delete user by id

// app.delete("/user", userAuth, async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     await User.findByIdAndDelete(userId);
//     res.send(`user with userId : ${userId} got successfully deleted`);
//   } catch (err) {
//     res.status(404).send("Something went wrong");
//   }
// });

// // update user data

// app.patch("/user/:userId", userAuth, async (req, res) => {
//   try {
//     const userId = req.params?.userId;
//     const dataToUpdate = req.body;
//     const ALLOWED_UPDATES = ["about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(dataToUpdate).every((k) => {
//       ALLOWED_UPDATES.includes(k);
//     });
//     if (!isUpdateAllowed) {
//       throw new Error("These updates are not allowed");
//     }
//     if (dataToUpdate?.skills?.length > 5) {
//       throw new Error("You cannot add more than 5 skills");
//     }
//     const options = { returnDocument: "after" };
//     const resi = await User.findByIdAndUpdate(userId, dataToUpdate, options);
//     res.status(200).send(resi);
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

