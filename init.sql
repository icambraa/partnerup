CREATE TABLE IF NOT EXISTS perfiles (
  id SERIAL PRIMARY KEY,
  admin BOOLEAN NOT NULL,
  banned BOOLEAN NOT NULL,
  deleted_ads_count INTEGER NOT NULL,
  email VARCHAR(255) NOT NULL,
  firebase_uid VARCHAR(255) NOT NULL,
  nombreusuario VARCHAR(255) NOT NULL,
  region VARCHAR(50) NOT NULL,
  riotnickname VARCHAR(50) NOT NULL,
  rolprincipal VARCHAR(50) NOT NULL
);

INSERT INTO perfiles (admin, banned, deleted_ads_count, email, firebase_uid, nombreusuario, region, riotnickname, rolprincipal)
VALUES (true, false, 0, 'admin@uoc.edu', 'VT4nhO0T4XNr6nhmKil2Rx9Buir2', 'Admin', 'EUW', 'Erubin#Fenix', 'ADC');