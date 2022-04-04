# Webservice


## Server


## Create Order
POST: http://10.0.206.9:3000/api/order/
```yaml
Body:
  {"lieferAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": 1,
    "plz": 12345,
    "ort": ""
  },
  "rechnungsAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": 1,
    "plz": 12345,
    "ort": ""
  },
  "bestellung": {
    "type": "A",
    "anzahl": 1
  }
```

## Get one Order
GET: http://10.0.206.9:3000/api/order /
Parameter:
* order: int

## Get all Orders
GET: http://10.0.206.9:3000/api/order \
Datenschutz deluxe 

## Get Products
GET: http://10.0.206.9:3000/api/products \
übergibt alle produkte 
* id: int
* name: Char 
* beschreibung: String
* preis: int

## Json

```json lines
{
  "lieferAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": 1,
    "plz": 12345,
    "ort": ""
  },
  "rechnungsAdresse": {
    "vorname": "",
    "nachname": "",
    "strasse": "",
    "nr": 1,
    "plz": 12345,
    "ort": ""
  },
  "bestellung": {
    "type": "A",
    "anzahl": 1
  },
  "datum": "2020-01-01",
  "status": ""
}
```

---

# Log

### 2022-02-21

### 2022-03-07

- DB aufsetzen
- 

