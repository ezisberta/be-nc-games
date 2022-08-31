const {
  fetchCategories,
  fetchReviewByID,
  updateReviewByID,
  fetchUsers,
  fetchReviews,
  fetchVotesByReviewID,
  fetchVotesByCommentID,
  fetchCommentsByReviewID,
  insertCommentByReviewID,
  insertVoteByReviewID,
  insertVoteByCommentID,
  deleteCommentByID,
  deleteVoteByCommentID,
  deleteVoteByReviewID,
} = require("../models/model");

const endpoints = require("../endpoints.json");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.send({ categories });
  });
};

exports.getReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewByID(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.patchReviewByID = (req, res, next) => {
  const { review_id } = req.params;
  const incVotes = req.body.inc_votes;
  updateReviewByID(review_id, incVotes)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => {
    res.send({ users });
  });
};

exports.getReviews = (req, res, next) => {
  const where = "";

  const sortBy = req.query.sort_by || "created_at";
  const order = req.query.order || "DESC";

  fetchReviews(where, req.query.category, sortBy, order)
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch(next);
};

exports.getCommentsByReviewID = (req, res, next) => {
  const { review_id } = req.params;

  fetchCommentsByReviewID(review_id)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.getVotesByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  fetchVotesByReviewID(review_id)
    .then((votes) => {
      res.send({ votes });
    })
    .catch(next);
};

exports.getVotesByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  fetchVotesByCommentID(comment_id)
    .then((votes) => {
      res.send({ votes });
    })
    .catch(next);
};

exports.postCommentByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  const author = req.body.username;
  const body = req.body.body;

  insertCommentByReviewID(review_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.postVoterByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  const { user } = req.body;

  insertVoteByReviewID(review_id, user)
    .then(({ voter }) => {
      res.status(201).send({ voter });
    })
    .catch(next);
};

exports.postVoterByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  const { user } = req.body;

  insertVoteByCommentID(comment_id, user)
    .then(({ voter }) => {
      res.status(201).send({ voter });
    })
    .catch(next);
};

exports.removeCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentByID(comment_id)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.removeVoteByCommentID = (req, res, next) => {
  const { comment_id } = req.params;
  const { voter } = req.query;

  deleteVoteByCommentID(comment_id, voter)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};

exports.removeVoteByReviewID = (req, res, next) => {
  const { review_id } = req.params;
  const { voter } = req.query;

  deleteVoteByReviewID(review_id, voter)
    .then(() => {
      res.status(204).send({});
    })
    .catch(next);
};
exports.getApi = (req, res) => {
  res.send({ endpoints });
};
