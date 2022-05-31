# Webservice 

## Wichtige Hinweise
* Die eingangszeit wird in UTC gespeichert und zurückgegeben
  * ```2022-01-01T00:00:00.000Z```
  * Z am Ende steht für UTC → muss umgewandelt werden 
* Der Server läuft jetzt auch auf devel1:3000
## Create Order

### w/ Adresse

POST: http://devel1:3000/api/order/ \
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
  },
  "token":"??????????" ,
  "_token_comment": "token ist optional//bei falschen token 401"
}
```
return: [id1,id2]

### wo/ Adresse

POST: http://devel1:3000/api/order/ \
Body: 
```json5
{
  "bestellung": {
      "A": 1,
      "B": 5
  },
  "token":"??????????" 
}
```
return: [id1,id2] \
token ist hier nicht mehr optional

### Messages 
Bei Fehlern wird ein header mit weiteren informationen angefügt 
## Get Order Status

GET: http://devel1:3000/api/order/status \
Parameter:

* order: int

Return:

* status: String \
  z.B.: "offen"

## Get one Order

GET: http://devel1:3000/api/order?order=1 \
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

## ~~Get all Orders~~
GET: http://devel1:3000/api/orders \
Datenschutz deluxe \
Liste mit allen vorhandenen Aufträgen wie oben

## Get orders from user
GET: http://devel1:3000/api/orders?token= \
Get all orders nach user gefiltert 

## Get Products
GET: http://devel1:3000/api/products \
übergibt alle produkte

* id: int
* name: Char
* beschreibung: String
* preis: int

## Authentication
### Create User
POST: http://devel1:3000/api/user/create \
Erstellt einen neuen User
Body:
```json5
{
  "username": "name",
  "password": "Safe@Password 5"
}
```
return:
* token : String(10)
Status:
* 409: User existiert 

#### Login
POST: http://devel1:3000/api/user/login \
Gibt einen Token zurück
und gibt Status bei Veränderungen zurück
Body:
```json5
{
  "username": "User",
  "password": "PW",
  "token_duration":120
}
```
return
* token: String(10)
* status: "Token updated" / ""
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

## 2022-05-02

Login System erstellt

## 2022-05-25

created Password hashing
