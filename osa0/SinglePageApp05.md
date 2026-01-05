sequenceDiagram
    participant user
    participant browser 
    participant server 

    user->>browser: Siirtyy osoitteeseen https://studies.cs.helsinki.fi/exampleapp/spa

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    server-->>browser: HTML-dokumentti

    Note over browser: HTML sisältää vain perusrakenteen ja viittaukset JS- ja CSS-tiedostoihin

    browser->>server: HTTP GET main.css
    browser->>server: HTTP GET spa.js

    Note over browser: JavaScript-koodi suoritetaan selaimessa

    browser->>server: HTTP GET /exampleapp/data.json
    server-->>browser: JSON-muotoinen muistiinpanodata

    Note over browser: JavaScript käsittelee datan
    Note over browser: Muistiinpanot renderöidään DOM-APIa käyttäen ilman sivun uudelleenlatausta
