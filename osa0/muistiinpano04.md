sequenceDiagram
    participant user
    participant browser
    participant server

    ```mermaid

    user->>browser: Kirjoittaa muistiinpanon ja painaa "tallenna"
    Note over browser: Lomakkeen submit-tapahtuma laukeaa

    browser->>server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note over browser: Lähettää lomakkeen datan 

    Note over server: Palvelin tallentaa muistiinpanon palvelimen muistiin
    server-->>browser: HTTP 302 Redirect -> https://studies.cs.helsinki.fi/exampleapp/notes

    Note over browser: Selain seuraa uudelleenohjausta

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
    server-->>browser: HTML-dokumentti

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js

    Note over browser: JavaScript suoritetaan

    browser->>server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    server-->>browser: JSON-muotoinen muistiinpanodata

    Note over browser: Tapahtumankäsittelijä renderöi muistiinpanot DOM-APIa käyttäen

   ```
