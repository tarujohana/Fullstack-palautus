sequenceDiagram
    participant User as Käyttäjä
    participant Browser as Selain
    participant Server as Palvelin

    User->>Browser: Kirjoittaa muistiinpanon ja painaa "tallenna"
    Note over Browser: JavaScript käsittelee lomakkeen submit-tapahtuman

    Browser->>Server: HTTP POST  https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Note over Browser:  Lähettää muistiinpanon JSON-muodossa

    Note over Server: Palvelin tallentaa muistiinpanon
    Server-->>Browser: HTTP 201 Created 

    Note over Browser: JavaScript lisää uuden muistiinpanon sovelluksen tilaan
    Note over Browser: DOM päivitetään ilman sivun uudelleenlatausta
