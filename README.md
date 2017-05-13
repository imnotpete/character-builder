# characterbuilder
D&amp;D 3.5 character builder

Current status: Very very early. No security. In-memory database only -- any character data entered will be lost if/when the process ends.

Depends on Project Lombok -- make sure your IDE is set up right.

## Building
`mvn clean install` in main directory

## Running
`java -jar target/charsheet-dnd35-<version>.jar`

## Details

Backend is Java with Spring Boot/Spring Data JPA

Frontend is Bootstrap/jQuery/KnockoutJS

Favicon source: http://www.favicon.cc/?action=icon&file_id=754619
