const format = require("pg-format");
const db = require("../connection");
const seed = ({
  userData,
  activitiesData,
  foodData,
  filmsData,
  tv_showsData,
  couplesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS couples_table`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS tv-shows_table`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS films_table`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS foods_table`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users_table`);
    })
    .then(() => {
      return db.query(`
    CREATE TABLE users_table(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR,
    activities REFERENCES activities(activity_id),
    foods REFERENCES foods(food_id),
    films REFERENCES films(film_id),
    tv_shows REFERENCES tv_shows(tv_show_id))`);
    })
    .then(() => {
      return db.query(`CREATE TABLE activities_table(
            activity_id SERIAL PRIMARY KEY,
            activity VARCHAR NOT NULL,
            is_collab BOOLEAN,
            alcohol BOOLEAN,
            cost BOOLEAN)`);
    })
    .then(() => {
      return db.query(`CREATE TABLE foods_table(
            food_id SERIAL PRIMARY KEY,
            food VARCHAR NOT NULL,
            vegetarian BOOLEAN,
            vegan BOOLEAN,
            meat BOOLEAN,
            allergies BOOLEAN)`);
    })
    .then(() => {
      return db.query(`CREATE TABLE films_table(
            film_id SERIAL PRIMARY KEY,
            film_title VARCHAR NOT NULL,
            genre VARCHAR NOT NULL)`);
    })
    .then(() => {
      return db.query(`CREATE TABLE tv_shows_table(
            tv_show_id SERIAL PRIMARY KEY,
            tv_show_title VARCHAR NOT NULL,
            genre VARCHAR NOT NULL)`);
    })
    .then(() => {
      return db.query(`CREATE TABLE pairing_table(
            couple_id SERIAL PRIMARY KEY,
            user1 REFERENCES users(user_id)),
            user2 REFERENCES users(user_id)),
            activities REFERENCES activities(activity_id),
            foods REFERENCES foods(food_id),
            films REFERENCES films(film_id),
            tv_shows REFERENCES tv_shows(tv_show_id))`);
    })
    .then(() => {
        return db.query(`INSERT INTO users_table(
          user_id, username, activities, foods, films, tv_shows)
          VALUES %L RETURNING*;`, userData.map(({ user_id, username, activities, foods, films, tv_shows }) => [user_id, username, activities, foods, films, tv_shows]))
    })
    .then(() => {
        return db.query(`INSERT INTO activities_table(
            activity, is_collab, alcohol, cost)
            VALUES %L RETURNING*;`, activitiesData.map(({activity, is_collab, alcohol, cost}) => [activity, is_collab, alcohol, cost]))
    })
    .then(() => {
        return db.query(`INSERT INTO foods_table(
            food, vegetarian, vegan, meat, allergies)
            VALUES %L RETURNING*;`, foodData.map(({food, vegetarian, vegan, meat, allergies}) => [food, vegetarian, vegan, meat, allergies]))
    })
    .then(() => {
        return db.query(`INSERT INTO films(
            film_title, genre)
            VALUES %L RETURNING*;`, filmsData.map(({film_title, genre}) => [film_title, genre]))
    })
    .then(() => {
        return db.query(`INSERT INTO tv_shows_table(
            tv_show_title, genre)
            VALUES %L RETURNING*;`, tv_showsData.map(({tv_show_title, genre}) => [tv_show_title, genre]))
    })
    .then(() => {
        return db.query(`INSERT INTO pairing_table(
            user1, user2, activities, foods, films, tv_shows)
            VALUES %L RETURNING*;`, couplesData.map(({user1, user2, activities, foods, films, tv_shows}) => [user1, user2, activities, foods, films, tv_shows]))
    })
};

module.exports = seed;
