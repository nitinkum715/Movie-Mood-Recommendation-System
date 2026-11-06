# Movie Mood Recommendation System

-------------LIVE LINK: https://movie-mood.hatchable.site/ -------------

Developers: Nitin Kumar (25BCA10442) and Anshika (25BCA10338).

Objective: A full-stack DBMS project using relational mood-to-movie recommendations plus authentication, reviews, watch history, search/filtering and admin CRUD.

Technology: HTML/CSS/JavaScript frontend, Hatchable server functions, PostgreSQL database, passwordless email-code authentication.

Schema: app_users (application profile table corresponding to the requested users entity), movies, moods, movie_mood, reviews, watch_history. users has one-to-many relationships with reviews and watch_history. movies has one-to-many relationships with reviews and watch_history. movies and moods have a many-to-many relationship through movie_mood, whose composite primary key is movie_id + mood_id.

Recommendation query: SELECT m.* FROM movies m JOIN movie_mood mm ON mm.movie_id=m.movie_id JOIN moods mo ON mo.mood_id=mm.mood_id WHERE mo.mood_name=$1 ORDER BY m.rating DESC;

Other SQL examples:
SELECT genre, AVG(rating), COUNT(*) FROM movies GROUP BY genre;
SELECT title,rating FROM movies WHERE rating > (SELECT AVG(rating) FROM movies);
SELECT MAX(rating) FROM movies;
SELECT * FROM movies WHERE title ILIKE '%dark%';

Run: deploy on Hatchable. Migrations and seed data run automatically. Sign in with email OTP and create your profile. The first registered profile is marked admin for the college demo; later profiles are normal users.

Security note: the requested password column is not stored because Hatchable's supported end-user authentication is passwordless email-code auth. This avoids storing plaintext passwords while providing secure registration/login.
