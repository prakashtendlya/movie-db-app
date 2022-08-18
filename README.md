<!--
title: 'Movie Database API'
description: 'This is a Movie Database application to search for movies by imdbID & title to save to local database and find top rated movies based on year from local database.'
layout: Doc
framework: v1
platform: Express
language: nodeJS
authorLink: 'https://github.com/prakashtendlya/'
authorName: 'Prakash Arumugam'
-->
# Movie Database API

This is a Movie Database application to search for movies by imdbID & title to upsert to local database and find top rated movies based on year from local database. Authentication is performed using JSON webtokens.

## Description

This service has it's core logic implemented in `routes/movie.js` which is to 1. get imdbID/movie title from user request, search movie from `OMDB API` using `axios`, save to `mongoDB` using `mongoose` ORM, share response to user. 2. get year and limit(optional) from user request to query top rated movies for given year in mongoDB and share resutl to user.

This service has a separate directory for authentication `routes/auth.js` which helps in registering new user, login existing user using `bcryptjs` & `joi` validation to get JSON webtoken using `jsonwebtoken`  which can be used to authenticate end points used for core logic.

### API Workflow

Incoming Request /movies/search >> find movie using OMDB API >> if(data) >> exists >> upsert local database with data >> return response with data to user
                                                             >> notfound >> return Movie not Found!

```mermaid
flowchart  LR
B <-- search movie --> C((OMDB API))
A((user )) <-- Req/Res  --> B{{Movie Database API}}
B <-- upsert data --> D[(mongoDB)]
```

Incoming Request /movies/toprated >> query mongoBD by year sort by rating and limit 5 >> return response with data to user
                                                             >> notfound >> return No Movie found for year in Database!

```mermaid
flowchart  LR
A((user )) <-- Req/Res  --> B{{Movie Database API}}
B <-- query data --> D[(mongoDB)]
```

## Use-cases

- Search movie by title/imdbID using OMDB API & save to mongoDB
- Query mongoDB for top rated movies

## Setup

```bash
npm install
```

installs `axios` `jsonwebtoken`  `express` `bcryptjs` `@hapi/joi` `dotenv` `cors` `mongoose` `mocha` `chai` `chai-http`

```json
  "dependencies": {
    "@hapi/joi": "^17.1.1",
    "axios": "^0.27.2",
    "bcryptjs": "^2.4.3",
    "chai": "^4.3.6",
    "chai-http": "^4.3.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.1",
    "express": "^4.18.1",
    "jsonwebtoken": "^8.5.1",
    "mocha": "^10.0.0",
    "mongoose": "^6.5.2"
  }
```
## scripts config

```json
"scripts": {
    "start": "node index.js",
    "test": "mocha spec/*.js --exit"
  }
```

## dotenv config

```bash
.env file
```

```bash
DB_CONNECT=mongodb+srv://<dbname>:<password>@cluster0.fn2cnhz.mongodb.net/?retryWrites=true&w=majority
TOKEN_SECRET=<secret>
OMDB_BASE_URL=https://www.omdbapi.com/
OMDB_API_KEY=<api-key>
```

## Run Local 

```bash
npm start
```

The expected result should be similar to:

```bash
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.

> movie-db-app@1.0.0 start
> node index.js

server running in port http://localhost:3200 🚀
Database connected!
```

## Run unit tests

uses jest for unit testing

```bash
npm test
```

The expected result should be similar to:

```bash
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.

> movie-db-app@1.0.0 test
> mocha spec/*.js --exit

server running in port http://localhost:3200 🚀


  GET /
    ✔ should return success...


  1 passing (32ms)
```

## Usage

This service can be used to authenticate user using JSON web token.

This Service can be used search movie by title/imdbID and query top rated movies for given year from mongoDB.

### Register user

```bash
curl -v --header "Content-Type: application/json" -d "{\"username\":\"usernameee\",\"password\":\"passworddd\"}" http://localhost:3200/register
```

Example Result:

```bash
*   Trying 127.0.0.1:3200...
* Connected to localhost (127.0.0.1) port 3200 (#0)
> POST /register HTTP/1.1
> Host: localhost:3200
> User-Agent: curl/7.83.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 49
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 29
< ETag: W/"1d-/weIDM29vqzRWE8F/MWa0BcDWkA"
< Date: Thu, 18 Aug 2022 16:34:19 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"message":"user registered"}* Connection #0 to host localhost left intact
```

### Login user

```bash
curl -v --header "Content-Type: application/json" -d "{\"username\":\"usernameee\",\"password\":\"passworddd\"}" http://localhost:3200/login
```

Example Result:

```bash
*   Trying 127.0.0.1:3200...
* Connected to localhost (127.0.0.1) port 3200 (#0)
> POST /login HTTP/1.1
> Host: localhost:3200
> User-Agent: curl/7.83.1
> Accept: */*
> Content-Type: application/json
> Content-Length: 49
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZlNmEwYjFhYTUyZjhlMDc2OGMwMWYiLCJpYXQiOjE2NjA4NDA1NTB9.c1z9-ocNfW2oAUVpNmiRI1IRI3qA5ISHlJga6uA9aAY
< Content-Type: application/json; charset=utf-8
< Content-Length: 161
< ETag: W/"a1-ahQOZ0o5DeEfBuRtYoOHi62RHkc"
< Date: Thu, 18 Aug 2022 16:35:50 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZlNmEwYjFhYTUyZjhlMDc2OGMwMWYiLCJpYXQiOjE2NjA4NDA1NTB9.c1z9-ocNfW2oAUVpNmiRI1IRI3qA5ISHlJga6uA9aAY"}* Connection #0 to host localhost left intact
```

### Search Movie using title or imdbID

By imdbID

```bash
curl -v --header "auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiYmQ4ZWZmYTk4YzRlYjE1ZTE0NWEiLCJpYXQiOjE2NjA2Njc2Mjl9.WF6hrVXcq3RB4C7yYMCIa_XzeUgFfrYI1VfwQXiNnzM" http://localhost:3200/movie/search?id=tt3896198
```
By Title

```bash
curl -v --header "auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiYmQ4ZWZmYTk4YzRlYjE1ZTE0NWEiLCJpYXQiOjE2NjA2Njc2Mjl9.WF6hrVXcq3RB4C7yYMCIa_XzeUgFfrYI1VfwQXiNnzM" http://localhost:3200/movie/search?title=inception
```

Example Result:

```bash
*   Trying 127.0.0.1:3200...
* Connected to localhost (127.0.0.1) port 3200 (#0)
> GET /movie/search?id=tt3896198 HTTP/1.1
> Host: localhost:3200
> User-Agent: curl/7.83.1
> Accept: */*
> auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiYmQ4ZWZmYTk4YzRlYjE1ZTE0NWEiLCJpYXQiOjE2NjA2Njc2Mjl9.WF6hrVXcq3RB4C7yYMCIa_XzeUgFfrYI1VfwQXiNnzM
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 1072
< ETag: W/"430-O0t8txNGqoOyOXPGjXzDQJ11+D8"
< Date: Thu, 18 Aug 2022 16:41:33 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":{"Title":"Guardians of the Galaxy Vol. 2","Year":"2017","Rated":"PG-13","Released":"05 May 2017","Runtime":"136 min","Genre":"Action, Adventure, Comedy","Director":"James Gunn","Writer":"James Gunn, Dan Abnett, Andy Lanning","Actors":"Chris Pratt, Zoe Saldana, Dave Bautista","Plot":"The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.","Language":"English","Country":"United States","Awards":"Nominated for 1 Oscar. 15 wins & 59 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BNjM0NTc0NzItM2FlYS00YzEwLWE0YmUtNTA2ZWIzODc2OTgxXkEyXkFqcGdeQXVyNTgwNzIyNzg@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.6/10"},{"Source":"Rotten Tomatoes","Value":"85%"},{"Source":"Metacritic","Value":"67/100"}],"Metascore":"67","imdbRating":"7.6","imdbVotes":"665,736","imdbID":"tt3896198","Type":"movie","DVD":"22 Aug 2017","BoxOffice":"$389,813,101","Production":"N/A","Website":"N/A","Response":"True"}}* Connection #0 to host localhost left intact
```

### Query Top Rated Movies by year

```bash
curl -v --header "auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiYmQ4ZWZmYTk4YzRlYjE1ZTE0NWEiLCJpYXQiOjE2NjA2Njc2Mjl9.WF6hrVXcq3RB4C7yYMCIa_XzeUgFfrYI1VfwQXiNnzM" http://localhost:3200/movie/toprated?year=2011
```

Example Result:

```bash
*   Trying 127.0.0.1:3200...
* Connected to localhost (127.0.0.1) port 3200 (#0)
> GET /movie/toprated?year=2011 HTTP/1.1
> Host: localhost:3200
> User-Agent: curl/7.83.1
> Accept: */*
> auth-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmZiYmQ4ZWZmYTk4YzRlYjE1ZTE0NWEiLCJpYXQiOjE2NjA2Njc2Mjl9.WF6hrVXcq3RB4C7yYMCIa_XzeUgFfrYI1VfwQXiNnzM
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 1769
< ETag: W/"6e9-lvdsST4S8Q1LbZdb+MhnoUzCKBA"
< Date: Thu, 18 Aug 2022 16:46:02 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
{"data":[{"id":"tt1832382","Actors":"Payman Maadi, Leila Hatami, Sareh Bayat","Director":"Asghar Farhadi","Plot":"A married couple are faced with a difficult decision - to improve the life of their child by moving to another country or to stay in Iran and look after a deteriorating parent who has Alzheimer's disease.","Title":"A Separation","UpdatedAt":"2022-08-18T15:16:59.191Z","Year":"2011","imdbRating":"8.3"},{"id":"tt1201607","Actors":"Daniel Radcliffe, Emma Watson, Rupert Grint","Director":"David Yates","Plot":"Harry, Ron, and Hermione search for Voldemort's remaining Horcruxes in their effort to destroy the Dark Lord as the final battle rages on at Hogwarts.","Title":"Harry Potter and the Deathly Hallows: Part 2","UpdatedAt":"2022-08-18T15:10:28.749Z","Year":"2011","imdbRating":"8.1"},{"id":"tt1827487","Actors":"Muhammet Uzuner, Yilmaz Erdogan, Taner Birsel","Director":"Nuri Bilge Ceylan","Plot":"A group of men set out in search of a dead body in the Anatolian steppes.","Title":"Once Upon a Time in Anatolia","UpdatedAt":"2022-08-18T15:17:47.201Z","Year":"2011","imdbRating":"7.8"},{"id":"tt0780504","Actors":"Ryan Gosling, Carey Mulligan, Bryan Cranston","Director":"Nicolas Winding Refn","Plot":"An action drama about a mysterious Hollywood stuntman and mechanic who moonlights as a getaway driver, and finds himself in trouble when he helps out his neighbor.","Title":"Drive","UpdatedAt":"2022-08-18T15:17:16.653Z","Year":"2011","imdbRating":"7.8"},{"id":"tt1316540","Actors":"János Derzsi, Erika Bók, Mihály Kormos","Director":"Béla Tarr, Ágnes Hranitzky","Plot":"A rural farmer is forced to confront the mortality of his faithful horse.","Title":"The Turin Horse","UpdatedAt":"2022-08-18T15:17:28.476Z","Year":"2011","imdbRating":"7.7"}]}* Connection #0 to host localhost left intact
```

### mongoDB

set up your mongodb use connection url in .env file

Sample mongoDB Record for user:

```bash
username    Type - string
pasword     Type - string hashed using bcryptjs
date        Type - Date
```


```json
{
    "_id": {
        "$oid": "62fbbd8effa98c4eb15e145a"
    },
    "username": "username",
    "password": "$2a$10$n30SxpXX.i61frjXk7X5YOUa5iFL3yLGqwa4VJgsn7UpO38UOBYa6",
    "date": {
        "$date": {
            "$numberLong": "1660665223912"
        }
    },
    "__v": {
        "$numberInt": "0"
    }
}
```

Sample mongoDB Record for Movie:

```bash
id          Type - string imdbID
Title       Type - string
Year        Type - string
Director    Type - string
Actors      Type - string
Plot        Type - string
imdbRating  Type - string
UpdatedAt   Type - Date
```

```json
{
    "_id": {
        "$oid": "62fe43819572011167dddd56"
    },
    "id": "tt3896198",
    "Actors": "Chris Pratt, Zoe Saldana, Dave Bautista",
    "Director": "James Gunn",
    "Plot": "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father the ambitious celestial being Ego.",
    "Title": "Guardians of the Galaxy Vol. 2",
    "UpdatedAt": {
        "$date": {
            "$numberLong": "1660831013990"
        }
    },
    "Year": "2017",
    "__v": {
        "$numberInt": "0"
    },
    "imdbRating": "7.6"
}
```
