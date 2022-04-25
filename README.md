# Webservice

## Server

## Create Order

POST: http://10.0.206.9:3000/api/order/ \
Body:

```json5
{
  "lieferAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": "1",
    "plz": "12345",
    "ort": ""
  },
  "rechnungsAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": "1",
    "plz": "12345",
    "ort": ""
  },
  "bestellung": {
      "A": 1,
      "B": 5
  }
}
```

Return:

* On Success
    * id: int
* On Error:
    * error: String

## Get Order Status

GET: http://10.0.206.9:3000/api/order/status \
Parameter:

* order: int

Return:

* status: String \
  z.B.: "offen"

## Get one Order

GET: http://10.0.206.9:3000/api/order?order=1 \
Parameter:

* order: int

Return:

* id: int
* liefer_adresse_id: int
* rechnungs_adresse_id: int
* produkt_id: int
* produkt_anzahl: int
* eingang: yyy-mm-ddThh:mm:ss.000Z\
  "2022-04-04T07:03:11.000Z"
* status: String \
  z.B.: "offen"

## Get all Orders

GET: http://10.0.206.9:3000/api/orders \
Datenschutz deluxe \
Liste mit allen vorhandenen Aufträgen wie oben

## Get Products

GET: http://10.0.206.9:3000/api/products \
übergibt alle produkte

* id: int
* name: Char
* beschreibung: String
* preis: int

## Create User
POST: http://10.0.206.9:3000/api/user/create \
Erstellt einen neuen User
Body:
```json5
{
  username: "name",
  password: "Safe@Password 5"
}
```

## Get orders from user
GET: http://10.0.206.9:3000/api/user/orders?user=1 \
[//]: # (todo)
---
# Log

## 2022-02-21

Routen für Aufträge erstellt

## 2022-03-07

DB aufgesetzt, verbindung erstellt und die erste Einträge reingeschrieben

## 2022-03-16

SQL Funktion erstellt um ID von Auftrag zu bekommen

## 2022-03-21

Aufträge können erstellt werden

## 2022-04-04

Routen erstellt und Doku geschrieben