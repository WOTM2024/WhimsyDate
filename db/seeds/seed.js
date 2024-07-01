const format = require("pg-format");
const db = require("../connection");
const seed = ({ userData, activitiesData, foodData, filmsData, tv_showsData, couplesData }) => {
  // console.log(userData);
  return db
    .query(`DROP TABLE IF EXISTS couples_table`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_activities`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users_table`);
    })
    .then(() => {
      console.log("test123");
      return db.query(`DROP TABLE IF EXISTS tv_shows_table`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS films_table`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS foods_table`);
    })

    .then(() => {
      return db.query(`DROP TABLE IF EXISTS activities_table`);
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE activities_table(
            activity_id SERIAL PRIMARY KEY,
            activity VARCHAR NOT NULL,
            is_collab BOOLEAN,
            alcohol BOOLEAN,
            cost BOOLEAN)`
        )
        .then((data) => console.log("1"));
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE foods_table(
            food_id SERIAL PRIMARY KEY,
            food VARCHAR NOT NULL,
            vegetarian BOOLEAN,
            vegan BOOLEAN,
            meat BOOLEAN,
            allergies BOOLEAN)`
        )
        .then((data) => console.log("2"));
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE films_table(
            film_id SERIAL PRIMARY KEY,
            film_title VARCHAR NOT NULL,
            genre VARCHAR NOT NULL)`
        )
        .then((data) => console.log("3"));
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE tv_shows_table(
            tv_show_id SERIAL PRIMARY KEY,
            tv_show_title VARCHAR NOT NULL,
            genre VARCHAR NOT NULL)`
        )
        .then((data) => console.log("4"));
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE users_table(
        user_id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL)`
        )
        .then((data) => console.log(data, "5"));
    })

    .then(() => {
      const formattedActivities = format(
        `INSERT INTO activities_table( activity, is_collab, alcohol, cost)
          VALUES %L RETURNING *;`,
        activitiesData.map(({ activity, is_collab, alcohol, cost }) => [activity, is_collab, alcohol, cost])
      );
      return db.query(formattedActivities).then((data) => console.log("I1"));
    })
    .then(() => {
      const formattedFoods = format(
        `INSERT INTO foods_table(
            food, vegetarian, vegan, meat, allergies)
            VALUES %L RETURNING *;`,
        foodData.map(({ food, vegetarian, vegan, meat, allergies }) => [food, vegetarian, vegan, meat, allergies])
      );
      return db.query(formattedFoods).then((data) => console.log("I2"));
    })
    .then(() => {
      const formattedFilm = format(
        `INSERT INTO films_table(
            film_title, genre)
            VALUES %L RETURNING *;`,
        filmsData.map(({ film_title, genre }) => [film_title, genre])
      );
      return db.query(formattedFilm).then((data) => console.log("I3"));
    })
    .then(() => {
      console.log(tv_showsData);
      const formattedTVShows = format(
        `INSERT INTO tv_shows_table(
            tv_show_title, genre)
            VALUES %L RETURNING *;`,
        tv_showsData.map(({ tv_show_title, genre }) => [tv_show_title, genre])
      );
      return db.query(formattedTVShows).then((data) => console.log("I4"));
    })
    .then(() => {
      console.log(userData);
      const formattedUsers = format(
        `INSERT INTO users_table(username)
          VALUES %L RETURNING *;`,
        userData.map(({ username }) => [username])
      );

      return db.query(formattedUsers).then((data) => console.log("I5"));
    })

    .then(() => {
      return db.query(`CREATE TABLE user_activities (
          user_id INT REFERENCES users_table(user_id),
          activity_id INT REFERENCES activities_table(activity_id)
          )`);
    })
    .then(() => {
      return db
        .query(
          `SELECT users_table.user_id, user_activities.activity_id FROM users_table
          JOIN user_activities
          ON user_activities.user_id = users_table.user_id
          JOIN activities_table
          ON user_activities.activity_id = activities_table.activity_id;`
        )
        .then((data) => {
          console.log(data);
        });
    });
  // .then((data) => {
  //   console.log(data);
  // });
};

module.exports = seed;

//   .then(() => {
//     return db.query(`
// CREATE TABLE users_table(
// user_id SERIAL PRIMARY KEY,
// username VARCHAR,
// activities INT REFERENCES activities_table(activity_id),
// foods INT REFERENCES foods_table(food_id),
// films INT REFERENCES films_table(film_id),
// tv_shows INT REFERENCES tv_shows_table(tv_show_id))`);
//   })
// .then(() => {
//   return db.query(`CREATE TABLE pairing_table(
//         couple_id SERIAL PRIMARY KEY,
//         user1 REFERENCES users(user_id)),
//         user2 REFERENCES users(user_id)),
//         activities REFERENCES activities(activity_id),
//         foods REFERENCES foods(food_id),
//         films REFERENCES films(film_id),
//         tv_shows REFERENCES tv_shows(tv_show_id))`);
// })

// .then(() => {
//   return db.query(
//     `INSERT INTO pairing_table(
//       user1, user2, activities, foods, films, tv_shows)
//       VALUES %L RETURNING*;`,
//     couplesData.map(({ user1, user2, activities, foods, films, tv_shows }) => [
//       user1,
//       user2,
//       activities,
//       foods,
//       films,
//       tv_shows,
//     ])
//   );
// })

// .then(() => {
//   const formattedUsers = format(
//     `INSERT INTO users_table(
//     user_id, username, activities, foods, films, tv_shows)
//     VALUES %L RETURNING *;`,
//     userData.map(({ user_id, username, activities, foods, films, tv_shows }) => [
//       user_id,
//       username,
//       activities,
//       foods,
//       films,
//       tv_shows,
//     ])
//   );

//   return db.query(formattedUsers);
// })
