```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note rigth of browser: Lähettää lomakkeen datan 

    Note right of browser: Palvelin tallentaa muistiinpanon palvelimen muistiin
    server-->>browser: HTTP 302 Redirect -> https://studies.cs.helsinki.fi/exampleapp/notes

    Note of browser: Selain seuraa uudelleenohjausta

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>browser: HTML-dokumentti

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js

    Note right of browser: JavaScript suoritetaan

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: JSON-muotoinen muistiinpanodata

    Note right of browser: Tapahtumankäsittelijä renderöi muistiinpanot DOM-APIa käyttäen

```

