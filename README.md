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
    "type": "A",
    "anzahl": 1
  }
}
```

## Get one Order
GET: http://10.0.206.9:3000/api/order \
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
GET: http://10.0.206.9:3000/api/order \
Datenschutz deluxe \
Liste mit allen vorhandenen Aufträgen wie oben 

## Get Products
GET: http://10.0.206.9:3000/api/products \
übergibt alle produkte 
* id: int
* name: Char 
* beschreibung: String
* preis: int

---
# Log

### 2022-02-21

### 2022-03-07

- DB aufsetzen
- 

