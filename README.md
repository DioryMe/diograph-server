## Diograph-server

## Run

```
DIOGRAPH_SERVER_STARTUP=1 yarn start:dev
```

For S3 rooms or tests:

```
DIOGRAPH_SERVER_STARTUP=1 BUCKET_NAME=****** BUCKET_ACCESS_KEY=****** BUCKET_SECRET_KEY=****** yarn start:dev
```

## Usage

```
http://localhost:3000/room-1/content?cid=[contentId]&mime=image/jpeg

http://localhost:3000//room-1/thumbnail?dioryId=[dioryId]
```

## Tests

See `tests/README.md`
