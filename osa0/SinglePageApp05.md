0.5: Single Page App

```mermaid
sequenceDiagram
    participant browser 
    participant server 

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: HTML-dokumentti

    browser->>server: HTTP GET main.css
    server-->>browser: css tiedosto
    browser->>server: HTTP GET spa.js
    server-->>browser: js tiedosto

    Note right of browser: JavaScript-koodi suoritetaan selaimessa

    browser->>server: HTTP GET /exampleapp/data.json
    server-->>browser: JSON-muotoinen muistiinpanodata

    Note right of browser: JavaScript käsittelee datan ja muistiinpanot renderöidään DOM-APIa käyttäen ilman sivun uudelleenlatausta
```
