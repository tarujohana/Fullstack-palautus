sequenceDiagram
    participant User as Käyttäjä
    participant Browser as Selain
    participant Server as Palvelin

    User->>Browser: Kirjoittaa muistiinpanon ja painaa "tallenna"
    Note over Browser: Lomakkeen submit-tapahtuma laukeaa

    Browser->>Server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note
    Note over Browser: Lähettää lomakkeen datan 

    Note over Server: Palvelin tallentaa muistiinpanon palvelimen muistiin
    Server-->>Browser: HTTP 302 Redirect -> https://studies.cs.helsinki.fi/exampleapp/notes

    Note over Browser: Selain seuraa uudelleenohjausta

    Browser->>Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
    Server-->>Browser: HTML-dokumentti

    Browser->>Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Browser->>Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js

    Note over Browser: JavaScript suoritetaan

    Browser->>Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    Server-->>Browser: JSON-muotoinen muistiinpanodata

    Note over Browser: Tapahtumankäsittelijä renderöi muistiinpanot DOM-APIa käyttäen
