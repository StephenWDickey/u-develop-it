-- when we source this file and a table already exists we will delete it
-- then we create a new table with correct info
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;

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

