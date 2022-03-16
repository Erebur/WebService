const Adresse = class{
    get vorname() {
        return this._vorname;
    }

    get nachname() {
        return this._nachname;
    }

    get strasse() {
        return this._strasse;
    }

    get nr() {
        return this._nr;
    }

    get plz() {
        return this._plz;
    }

    get ort() {
        return this._ort;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    constructor(vorname, nachname, strasse, nr, plz, ort ,id) {
        this._vorname = vorname;
        this._nachname = nachname;
        this._strasse = strasse;
        this._nr = nr;
        this._plz = plz;
        this._ort = ort;
        this._id = id;
    }
}
module.exports = Adresse