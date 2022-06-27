create table Adresse
(
    id           int unsigned auto_increment
        primary key,
    vorname      varchar(25) not null,
    nachname     varchar(25) not null,
    strasse      varchar(25) not null,
    hausnummer   varchar(7)  not null,
    postleitzahl varchar(5)  not null,
    ort          varchar(25) not null
);

create table Produkt
(
    id           int unsigned auto_increment
        primary key,
    name         varchar(30)    not null,
    beschreibung varchar(30)    not null,
    preis        decimal(10, 2) null,
    constraint name
        unique (name)
);

create table Users
(
    id              int unsigned auto_increment
        primary key,
    Username        varchar(255)                          not null,
    Password        varchar(255)                          not null,
    API_TOKEN       varchar(10)                           null,
    expiration_date timestamp default current_timestamp() not null on update current_timestamp(),
    constraint API_TOKEN
        unique (API_TOKEN),
    constraint Username
        unique (Username)
);

create table Adresse_User
(
    id         int unsigned auto_increment
        primary key,
    Adresse_id int unsigned not null,
    User_id    int unsigned not null,
    constraint Adresse_User_Adresse_id_fk
        foreign key (Adresse_id) references Adresse (id)
            on update cascade on delete cascade,
    constraint Adresse_User_Users_id_fk
        foreign key (User_id) references Users (id)
            on update cascade on delete cascade
);

create table Auftrag
(
    id                   int unsigned auto_increment
        primary key,
    liefer_adresse_id    int unsigned                            not null,
    rechnungs_adresse_id int unsigned                            not null,
    produkt_id           int unsigned                            not null,
    produkt_anzahl       int                                     not null,
    eingang              timestamp   default current_timestamp() not null on update current_timestamp(),
    status               varchar(50) default 'offen'             null,
    user_id              int unsigned                            null,
    constraint Auftrag_Adresse_id_fk
        foreign key (liefer_adresse_id) references Adresse (id)
            on update cascade on delete cascade,
    constraint Auftrag_Adresse_id_fk_2
        foreign key (rechnungs_adresse_id) references Adresse (id)
            on update cascade on delete cascade,
    constraint Auftrag_Produkt_id_fk
        foreign key (produkt_id) references Produkt (id)
            on update cascade on delete cascade,
    constraint Auftrag_Users_id_fk
        foreign key (user_id) references Users (id)
            on update set null on delete set null
);

create function add_address_to_user(i_vorname varchar(25), i_nachname varchar(25), i_strasse varchar(25),
                                    i_hnr varchar(7), i_plz varchar(5), i_ort varchar(25),
                                    i_token varchar(255)) returns int(1) unsigned zerofill
    no sql
BEGIN
	DECLARE v_addId INTEGER;
    DECLARE v_usrId INTEGER;

    SELECT 0 into v_addId;
    SELECT 0 into v_usrId;

    SELECT adresse_index(i_vorname, i_nachname, i_strasse, i_hnr, i_plz, i_ort) INTO v_addId;

    SELECT id into v_usrId FROM Users WHERE API_TOKEN = i_token;

	IF v_usrId = 0 THEN
    	RETURN 0;
    END IF;

	DELETE from Adresse_User WHERE User_id = v_usrId;

	INSERT INTO Adresse_User (Adresse_id, User_id) VALUES (v_addId, v_usrId);
    RETURN 1;
END;

create function adresse_index(i_vorname varchar(255), i_nachname varchar(255), i_strasse varchar(255), i_nr varchar(7),
                              i_plz varchar(5), i_ort varchar(255)) returns int(10)
    modifies sql data
BEGIN
	DECLARE v_id int;

	SELECT a.id INTO v_id FROM Adresse a
    WHERE a.vorname = i_vorname
    AND a.nachname = i_nachname
    AND a.strasse = i_strasse
    AND a.hausnummer = i_nr
    AND a.postleitzahl = i_plz
    AND a.ort = i_ort;

 	IF v_id IS NULL THEN
            INSERT INTO Adresse (vorname, nachname, strasse, hausnummer, postleitzahl, ort)
            VALUES
            (i_vorname, i_nachname, i_strasse, i_nr, i_plz, i_ort);
    END IF;

    SELECT a.id INTO v_id FROM Adresse a
    WHERE a.vorname = i_vorname
    AND a.nachname = i_nachname
    AND a.strasse = i_strasse
    AND a.hausnummer = i_nr
    AND a.postleitzahl = i_plz
    AND a.ort = i_ort;

    RETURN v_id;
END;

create function create_order(i_lVor varchar(255), i_lNach varchar(255), i_lStr varchar(255), i_lNr varchar(7),
                             i_lPlz varchar(5), i_lOrt varchar(255), i_eVor varchar(255), i_eNach varchar(255),
                             i_eStr varchar(255), i_eNr varchar(7), i_ePlz varchar(5), i_eOrt varchar(255),
                             i_pName varchar(255), i_pAnzahl int, i_token varchar(10)) returns int(10)
    no sql
BEGIN

    DECLARE v_lId INTEGER;
    DECLARE v_eId INTEGER;
    DECLARE v_pId INTEGER;

    DECLARE v_eCount INTEGER;

    SELECT adresse_index(i_lVor, i_lnach, i_lstr, i_lnr, i_lplz, i_lort) INTO v_lid;

    SELECT adresse_index(i_eVor, i_enach, i_estr, i_enr, i_eplz, i_eort) INTO v_eid;

    SELECT id INTO v_pid FROM Produkt WHERE i_pname = name;


    SELECT COUNT(*)
    INTO v_eCount
    FROM Auftrag
    WHERE eingang >= SUBTIME(CURRENT_TIMESTAMP, '0 0:0:30.000000')
      AND liefer_adresse_id = v_lId
      AND rechnungs_adresse_id = v_eId
      AND produkt_id = v_pId
      AND produkt_anzahl = i_pAnzahl;

    IF (v_eCount = 0) THEN
        IF (i_token is not null) THEN
            INSERT INTO Auftrag (liefer_adresse_id, rechnungs_adresse_id, produkt_id, produkt_anzahl, user_id)
            VALUES (v_lId, v_eId, v_pId, i_pAnzahl, (SELECt id from Users where API_TOKEN = i_token));
        ELSE
            INSERT INTO Auftrag (liefer_adresse_id, rechnungs_adresse_id, produkt_id, produkt_anzahl)
            VALUES (v_lId, v_eId, v_pId, i_pAnzahl);
        END IF;
    END IF;
    RETURN (SELECT id
            FROM Auftrag
            WHERE liefer_adresse_id = v_lId
              AND rechnungs_adresse_id = v_eId
              AND produkt_id = v_pId
              AND produkt_anzahl = i_pAnzahl
            ORDER BY eingang DESC
            LIMIT 1);
END;

create function create_user(i_username varchar(255), i_password varchar(255),
                            i_uuid varchar(10)) returns int(1) unsigned
    no sql
BEGIN

    Declare v_count int;

    SELECT count(*) into v_count from Users
    where Username = i_username
    and Password = i_password
    and CURRENT_TIMESTAMP< expiration_date;

    IF (v_count = 0)
        THEN
            INSERT INTO Users (Username, PASSWORD, API_TOKEN, expiration_date)
            VALUES (i_username,
                    i_password,
                    i_uuid,
                    (SELECT date_add(CURRENT_TIMESTAMP, INTERVAL 10 minute)));
         	Return 1;
            END IF;
    RETURN 0;
END;

create function get_adresse_from_token(i_token varchar(10)) returns varchar(2500)
    no sql
    return (SELECT a.vorname as vorname,
      a.nachname as nachname
      ,a.strasse as strasse,
      a.hausnummer as hausnumer
      ,a.postleitzahl as postleitzahl ,a.ort as ort
      from Adresse_User au inner join Adresse a on au.Adresse_id=a.id inner join Users u on u.id = au.User_id where u.API_TOKEN = i_token);

