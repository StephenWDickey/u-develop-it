-- when we source this file and a table already exists we will delete it
-- then we create a new table with correct info

-- votes table must come first because it relies on all the other tables
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS voters;

CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  -- CONSTRAINT is called fk_party
  -- the FOREIGN KEY is attached to the party_id column in candidates table
  -- REFERENCES refers to the table it is referencing, with column in ()
  -- ON DELETE SET NULL means if id in parties is deleted 
  -- we set the value of party_id to NULL
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

CREATE TABLE voters (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  -- we use DATETIME data type
  -- we set the DEFAULT setting to CURRENT_TIMESTAMP
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE votes (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  -- we need to keep track of each vote
  voter_id INTEGER NOT NULL,
  -- we need to keep track of each candidate
  candidate_id INTEGER NOT NULL,
  -- gives us the time of the vote
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- voter ids must be unique
  CONSTRAINT uc_voter UNIQUE (voter_id),
  -- we set foreign key to voters table (id)
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  -- we set foreign key to the candidates table (id)
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);