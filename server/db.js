const sqlite = require('better-sqlite3');
const appDb = new sqlite('data/appDb.db');

appDb.prepare(`
  CREATE TABLE IF NOT EXISTS userInfo (
    id TEXT PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    refreshToken TEXT NOT NULL
  )
`).run();

//saves information into sqlite userInfo table
const saveUserProfile = (googleId, email, name, picture, refreshToken) => {
  const stmt = appDb.prepare(`
    INSERT INTO userInfo (id,email,name,picture,refreshToken)
    VALUES (?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET 
      email = excluded.email,
      name = excluded.name,
      refreshToken=excluded.refreshToken
  `);
  return stmt.run(googleId, email, name, picture, refreshToken);
}

//gets information from sqlite userInfo table
const getUserProfile = (googleId) => {
  const stmt = appDb.prepare(`
      SELECT id, email, name, picture FROM userInfo WHERE id = ?
  `);
  return stmt.get(googleId);
}

//gets information from sqlite userInfo table
const getUserRefreshToken = (googleId) => {
  const stmt = appDb.prepare(`
      SELECT id, refreshToken FROM userInfo WHERE id = ?
  `);
  return stmt.get(googleId);
}

//debug
function getAllData(tableName) {
    const rows = appDb.prepare(`SELECT * FROM ${tableName}`).all();
    return rows;
}
module.exports = { 
  getUserProfile, 
  getUserRefreshToken,
  saveUserProfile, 
  getAllData
};