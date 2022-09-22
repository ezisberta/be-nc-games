# About

This is the api used on NC Games, a platform where users can vote and comment on several game reviews. It can take several requests (check below).

# Requests

## GET https://ezisberta-be-nc-games.herokuapp.com/api/
- The response will contain an array with a brief description of all the endpoints contained within an 'endpoints' key - 200 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/categories/
- The response will contain an array of category objects contained within a 'categories' key - 200 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/reviews/
- It can have the following queries:
  * sort_by: it can take any of the review properties, defaults to created_at if not added;
  * order: it can either be ASC or DESC which is the default if not added;
  * category: it will select the reviews of a certain category, therefore, it will only accept existing category names (check development-data).
- The response will contain an array of review objects contained within a 'reviews' key - 200 status.
- It will respond with a 'Bad request' error message if either the query or its value is not valid - 400 status.
  
## GET https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/
- The response will contain a review object contained within a 'review' key, it will match the given review_id - 200 status.
- It will respond with a 'Bad request' error message if the review_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/votes/
- The response will contain an array of vote objects contained within a 'votes' key, these will match the given review_id - 200 status.
- It will respond with a 'Bad request' error message if the review_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/comments/
- The response will contain an array of comment objects contained within a 'comments' key, these will match the given review_id - 200 status.
- It will respond with a 'Bad request' error message if the review_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/comments/:comment_id/votes/
- The response will contain an array of vote objects contained within a 'votes' key, these will match the given comment_id - 200 status.
- It will respond with a 'Bad request' error message if the comment_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the comment with the given comment_id does not exist - 404 status.

## GET https://ezisberta-be-nc-games.herokuapp.com/api/users/
- The response will contain an array of user objects contained within a 'users' key - 200 status.

## POST https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/comments/
- The request object must have the following structure:
  * key: username, value type: string, value constraints: must be an existing user (check development-data).
  * key: body, value type: string, value constraints: none.
  * e.g.: {
        username: "happyamy2016",
        body: "Sad ending but I had loads of fun!",
      }
- The response will contain the added comment object contained within a 'comment' key, it will be assigned the given review_id - 201 status.
- It will respond with a 'Bad request' error message if either the review_id or the request object is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## POST https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/votes/
- The request object must have the following structure:
  * key: user, value type: string, value constraints: must be an existing user (check development-data).
  * e.g.: {
        user: "happyamy2016",
      }
- The response will contain a username string contained within a 'voter' key, the vote will get the given review_id - 201 status.
- It will respond with a 'Bad request' error message if either the review_id or the request object is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## POST https://ezisberta-be-nc-games.herokuapp.com/api/comments/:comment_id/votes/
- The request object must have the following structure:
  * key: user, value type: string, value constraints: must be an existing user (check development-data).
  * e.g.: {
        user: "happyamy2016",
      }
- The response will contain a username string contained within a 'voter' key, the vote will get the given comment_id - 201 status.
- It will respond with a 'Bad request' error message if either the comment_id or the request object is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the comment with the given comment_id does not exist - 404 status.

## DELETE https://ezisberta-be-nc-games.herokuapp.com/api/comments/:comment_id/
- This will delete the comment with the given comment_id. - 204 status.
- It will respond with a 'Bad request' error message if the comment_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the comment with the given comment_id does not exist - 404 status.

## DELETE https://ezisberta-be-nc-games.herokuapp.com/api/reviews/:review_id/votes?voter=:username/
- This will delete the vote with the given review_id and username (this query is mandatory). - 204 status.
- It will respond with a 'Bad request' error message if the review_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the review with the given review_id does not exist - 404 status.

## DELETE https://ezisberta-be-nc-games.herokuapp.com/api/comments/:comment_id/votes?voter=:username/
- This will delete the vote with the given comment_id and username (this query is mandatory). - 204 status.
- It will respond with a 'Bad request' error message if the comment_id is not in a valid format - 400 status.
- It will respond with a 'Not found' error message if the comment with the given comment_id does not exist - 404 status.

# Tech used

This app uses NodeJS and has an MVC architecture, the controllers were built using Express, and the database and models using Postgress. Jest and Supertest were used for testing and the api is currently being hosted on Heroku (although this may change if Heroku moves forward with its decision to charge for their Postgres hosting service).

# Launch

Feel free to fork and clone this repo, then you should follow these steps:

- In the project directory, run npm install to get the required libraries.
- Then you'll need to create 2 .env files: 
  * 1 for testing - .env.test;
  * 1 for development - .env.development; 
  * you may even add a 3rd one for production, but all must contain the following line: PGDATABASE=<database_name>

# Related Links

## Front-end

- Visit: https://github.com/ezisberta/fe-nc-games/

## Browse

- Visit: https://ezisberta-nc-games.netlify.app/

# Final words

Thanks for viewing my first software development project, done as part of the Northcoders bootcmap program. I had great pleasure in making it and am overall satisfied with the end result, although I'm a strong believer that there's always room for improvement and I was very happy with the constant feedback we got from our tutors throughout the building of this app, so please don't hesitate in reaching out! 
