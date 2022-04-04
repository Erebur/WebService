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