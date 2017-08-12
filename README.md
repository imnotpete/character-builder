# characterbuilder
D&amp;D 3.5 character builder

Current status: Very very early.

Depends on [Project Lombok](https://projectlombok.org/) -- make sure your IDE is set up right.

## Building
`mvn clean install` in main directory

## Running
`java -jar target/charsheet-dnd35-<version>.jar`

## Details
Frontend is Bootstrap/jQuery/KnockoutJS

Backend is Java with Spring Boot/Spring Data JPA/Spring Security. Currently the backend doesn't do much. Knockout does the heavy lifting in the browser; the backend just stores characters as JSON strings in the DB, and manages security access at a minimal level (only the character's owner can take any action on it, but the GET operations are unsecured).

Security is property-based right now -- users/passwords are configured directly in the application.properties filed and loaded at startup.

Works with either H2 or MySQL -- configured in the application.properties file.

Bootstrap theme: https://bootswatch.com/journal/

Favicon: http://www.favicon.cc/?action=icon&file_id=754619

Markdown processing by: https://github.com/p01/mmd.js
