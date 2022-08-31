const express = require("express");
const cors = require("cors");
const app = express();
const {
  getCategories,
  getReviewByID,
  patchReviewByID,
  getUsers,
  getReviews,
  getVotesByReviewID,
  getVotesByCommentID,
  getCommentsByReviewID,
  postCommentByReviewID,
  postVoterByReviewID,
  postVoterByCommentID,
  removeCommentByID,
  removeVoteByCommentID,
  removeVoteByReviewID,
  getApi,
} = require("./controllers/controller");

app.use(cors());

app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.get("/api/reviews/:review_id/votes", getVotesByReviewID);

app.get("/api/comments/:comment_id/votes", getVotesByCommentID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewID);

app.post("/api/reviews/:review_id/votes", postVoterByReviewID);

app.post("/api/comments/:comment_id/votes", postVoterByCommentID);

app.delete("/api/comments/:comment_id", removeCommentByID);

app.delete("/api/comments/:comment_id/votes", removeVoteByCommentID);

app.delete("/api/reviews/:review_id/votes", removeVoteByReviewID);

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "23503"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  }
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
