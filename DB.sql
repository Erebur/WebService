create or replace TABLE Carlos.Produkt (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(30) NOT NULL UNIQUE,
    beschreibung varchar(30) NOT NULL,
    preis decimal(15,2),
--    Einheit ?
    CONSTRAINT PK_PRODUKTID PRIMARY KEY(id)
);

-- needed ?
-- CREATE TABLE Carlos.LAGER (
--    produkt_id int,
--    menge int NOT NULL,
--    CONSTRAINT FK_PRODUKTID FOREIGN KEY(
-- );

create or replace TABLE Carlos.Adresse (
    id int NOT NULL AUTO_INCREMENT,
    vorname VARCHAR(25) NOT NULL,
    nachname VARCHAR(25) NOT NULL,
    strasse VARCHAR(25) NOT NULL,
    hausnummer int NOT NULL,
    postleitzahl int NOT NULL,
    ort VARCHAR(25) NOT NULL,
    CONSTRAINT PK_ADRESSE PRIMARY KEY(id)
);

create or replace TABLE Carlos.Auftrag (
    id int NOT NULL AUTO_INCREMENT,
    liefer_adresse_id int NOT NULL,
    rechnungs_adresse_id int NOT NULL,
    produkt_id int NOT NULL,
    produkt_anzahl int NOT NULL,
    eingang TIMESTAMP,
    status varchar(50),
    CONSTRAINT PK_PRODUKTID PRIMARY KEY(id)
);

INSERT INTO `Produkt` (`id`, `name`, `beschreibung`, `preis`) VALUES (NULL, 'A', '', '10'), (NULL, 'B', '', '20')
