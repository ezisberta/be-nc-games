const express = require("express");
const app = express();
const {
  getCategories,
  getReviewByID,
  patchReviewByID,
  getUsers,
  getReviews,
  getCommentsByReviewID,
  postCommentByReviewID,
  removeCommentByID,
  getApi,
} = require("./controllers/controller");
console.log("Line 14");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/users", getUsers);

app.get("/api/reviews", getReviews);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewID);

app.delete("/api/comments/:comment_id", removeCommentByID);

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
