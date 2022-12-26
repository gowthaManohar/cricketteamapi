const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let path = require("path");
let dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;

let initializationDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("server starts at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`db error ${e.message}`);
    process.exit(1);
  }
};

initializationDbAndServer();

let responseobject = (object) => {
  return {
    playerId: object.player_id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  };
};

//api1 get player details
app.get("/players/", async (request, response) => {
  let playersquery = `SELECT * FROM cricket_team;`;
  let dbresponse = await db.all(playersquery);
  response.send(dbresponse.map((player) => responseobject(player)));
});

//api2 get one player details

app.get("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;

  let playersquery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  let dbresponse = await db.get(playersquery);
  response.send(responseobject(dbresponse));
});

// API3 add a player

app.post("/players/", async (request, response) => {
  let { playerName, jerseyNumber, role } = request.body;
  const query = `INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES
    ('${playerName}',${jerseyNumber},'${role}');`;
  let dbresponse = await db.run(query);
  response.send("Player Added to Team");
});

// api 4 update player

app.put("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;
  let { playerName, jerseyNumber, role } = request.body;
  const query = `UPDATE  cricket_team 
  SET
  player_name = '${playerName}',jersey_number= ${jerseyNumber},role='${role}'
  WHERE 
  player_id = ${playerId};`;

  let dbresponse = await db.run(query);
  response.send("Player Details Updated");
});

// DELETE A PLAYER API5
app.delete("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;

  let playersquery = `DELETE  FROM cricket_team WHERE player_id = ${playerId};`;
  let dbresponse = await db.run(playersquery);
  response.send("Player Removed");
});

module.exports = app;
