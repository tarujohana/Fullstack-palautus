sequenceDiagram
    participant User as Käyttäjä
    participant Browser as Selain
    participant Server as Palvelin

    User->>Browser: Siirtyy osoitteeseen https://studies.cs.helsinki.fi/exampleapp/spa

    Browser->>Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server-->>Browser: HTML-dokumentti

    Note over Browser: HTML sisältää vain perusrakenteen ja viittaukset JS- ja CSS-tiedostoihin

    Browser->>Server: HTTP GET main.css
    Browser->>Server: HTTP GET spa.js

    Note over Browser: JavaScript-koodi suoritetaan selaimessa

    Browser->>Server: HTTP GET /exampleapp/data.json
    Server-->>Browser: JSON-muotoinen muistiinpanodata

    Note over Browser: JavaScript käsittelee datan
    Note over Browser: Muistiinpanot renderöidään DOM-APIa käyttäen ilman sivun uudelleenlatausta
