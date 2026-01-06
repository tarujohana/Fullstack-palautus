```mermaid
sequenceDiagram
    participant browser 
    participant server 

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: HTML-dokumentti

    Note right of browser: HTML sisältää vain perusrakenteen ja viittaukset JS- ja CSS-tiedostoihin

    browser->>server: HTTP GET main.css
    browser->>server: HTTP GET spa.js

    Note right of browser: JavaScript-koodi suoritetaan selaimessa

    browser->>server: HTTP GET /exampleapp/data.json
    server-->>browser: JSON-muotoinen muistiinpanodata

    Note right of browser: JavaScript käsittelee datan
    Note right of browser: Muistiinpanot renderöidään DOM-APIa käyttäen ilman sivun uudelleenlatausta
```
