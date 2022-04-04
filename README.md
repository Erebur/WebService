# Webservice


## Server


## Create Order

```yaml
Head: http://10.0.206.9:3000/api/order/
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

## Get Order


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

