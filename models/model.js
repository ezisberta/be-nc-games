const db = require("../db/connection");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewByID = (revID) => {
  return db
    .query(
      "SELECT reviews.*, COUNT(DISTINCT comments.comment_id) :: INT comment_count, COUNT(DISTINCT review_votes.voter) :: INT vote_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id LEFT OUTER JOIN review_votes ON review_votes.review_id = reviews.review_id WHERE reviews.review_id=$1 GROUP BY reviews.review_id;",
      [revID]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No review_id: ${revID}`,
        });
      }
      return rows[0];
    });
};

exports.updateReviewByID = (revID, incVotes) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes +$2 WHERE review_ID=$1 RETURNING *;",
      [revID, incVotes]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviews = (where, cat, sort, order) => {
  if (cat) {
    where = `WHERE reviews.category='${cat}' `;
    return db
      .query("SELECT * FROM categories WHERE slug=$1", [cat])
      .then(({ rows }) => {
        if (rows[0]) {
          return db
            .query(
              `SELECT reviews.*, COUNT(comments.review_id) :: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id ${where}GROUP BY reviews.review_id ORDER BY ${sort} ${order};`
            )
            .then(({ rows }) => {
              return rows;
            });
        } else {
          return Promise.reject({
            status: 400,
            msg: `Bad Request, this category doesn't exist: ${cat}`,
          });
        }
      });
  }
  return db
    .query(
      `SELECT reviews.*, COUNT(DISTINCT comments.comment_id) :: INT comment_count, COUNT(DISTINCT review_votes.voter) :: INT vote_count FROM reviews LEFT OUTER JOIN comments ON comments.review_id = reviews.review_id LEFT OUTER JOIN review_votes ON review_votes.review_id = reviews.review_id ${where}GROUP BY reviews.review_id ORDER BY ${sort} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByReviewID = (revID) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query("SELECT * FROM comments WHERE review_id=$1", [revID])
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.fetchVotesByReviewID = (revID) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query("SELECT * FROM review_votes WHERE review_id=$1", [revID])
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.fetchVotesByCommentID = (commID) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [commID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query("SELECT * FROM comment_votes WHERE comment_id=$1", [commID])
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commID}`,
        });
      }
    });
};

exports.insertCommentByReviewID = (revID, auth, body) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "INSERT INTO comments (review_id, author, body) VALUES ($1,$2,$3) RETURNING*",
            [revID, auth, body]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.insertVoteByReviewID = (revID, voter) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "INSERT INTO review_votes (review_id, voter) VALUES ($1,$2) RETURNING*",
            [revID, voter]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};

exports.insertVoteByCommentID = (commID, voter) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [commID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "INSERT INTO comment_votes (comment_id, voter) VALUES ($1,$2) RETURNING*",
            [commID, voter]
          )
          .then(({ rows }) => {
            return rows[0];
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commID}`,
        });
      }
    });
};

exports.deleteCommentByID = (comID) => {
  const deleteCommentVotesPromise = db.query(
    "DELETE FROM comment_votes WHERE comment_id=$1 RETURNING *;",
    [comID]
  );

  const deleteCommentPromise = db
    .query("DELETE FROM comments WHERE comment_id=$1 RETURNING *;", [comID])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comID}`,
        });
      }
    });

  return Promise.all([deleteCommentVotesPromise, deleteCommentPromise]);
};

exports.deleteVoteByCommentID = (commID, voter) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [commID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "DELETE FROM comment_votes WHERE comment_id=$1 AND voter=$2 RETURNING *;",
            [commID, voter]
          )
          .then(({ rows }) => {
            if (!rows[0]) {
              return Promise.reject({
                status: 404,
                msg: `No vote found for user ${voter} on comment_id: ${commID}`,
              });
            }
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${commID}`,
        });
      }
    });
};

exports.deleteVoteByReviewID = (revID, voter) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id=$1", [revID])
    .then(({ rows }) => {
      if (rows[0]) {
        return db
          .query(
            "DELETE FROM review_votes WHERE review_id=$1 AND voter=$2 RETURNING *;",
            [revID, voter]
          )
          .then(({ rows }) => {
            if (!rows[0]) {
              return Promise.reject({
                status: 404,
                msg: `No vote found for user ${voter} on review_id: ${revID}`,
              });
            }
          });
      } else {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id: ${revID}`,
        });
      }
    });
};
