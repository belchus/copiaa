// userModel.js

User.create = (userData, callback) => {
    connection.query('INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)', [userData.username, userData.password, userData.is_admin], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  };
  