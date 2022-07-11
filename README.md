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
    "hausnummer": "1",
    "postleitzahl": "12345",
    "ort": ""
  },
  "rechnungsAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "hausnummer": "1",
    "postleitzahl": "12345",
    "ort": ""
  },
  "bestellung": {
      "VRB": 1,
      "VRBC": 5
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
      "VRB": 1,
      "VRBC": 5
  },
  "token":"??????????" 
}
```
return: [id1,id2] \
token ist hier nicht mehr optional

### Messages 
Bei Fehlern wird ein header mit weiteren informationen angefügt 
## Orders 
### Status

GET: http://devel1:3000/api/order/status \
Query Parameter:
* order: int

Return:

* status: String \
  z.B.: "offen"

### Get one Order

GET: http://devel1:3000/api/order \
Query Parameter:
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

### ~~Get all Orders~~
GET: http://devel1:3000/api/orders \
Datenschutz deluxe \
Liste mit allen vorhandenen Aufträgen wie oben

### Get orders from user
GET: http://devel1:3000/api/orders \
Query Params :
* token : string[10]
Get all orders nach user gefiltert 

## Get Products
GET: http://devel1:3000/api/products \
übergibt alle produkte

* id: int
* name: String
* beschreibung: String
* preis: number
## Standard Adresse 
### Get 
GET: http://devel1:3000/api/user/address \
Query Parameter :
* token : string[10]
return : 
``` json5 
{
  "vorname":"",
  "nachname":"",
  "strasse":"",
  "hausnummer":"",
  "postleitzahl":"",
  "ort":"",
}
```
### Set
POST: http://devel1:3000/api/user/address \
Speichert eine Adresse zu dem eingegebenen User

```json5
{
  "vorname":"",
  "nachname":"",
  "strasse":"",
  "hausnummer":"",
  "postleitzahl":"",
  "ort":"",
  "token":""
}
```
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
* token : string[10] 

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
  "new_password": "",
  "token_duration":120
}
```
return
* token: string[10]
* status: "Token updated" / ""
