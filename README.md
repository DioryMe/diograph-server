## Diograph-server

## Run

```
ROOM_PATH=/tmp/room yarn start:dev
```

For S3 rooms or tests:

```
ROOM_PATH=/tmp/room BUCKET_NAME=****** BUCKET_ACCESS_KEY=****** BUCKET_SECRET_KEY=****** yarn start:dev
```

## Usage

```
http://localhost:3000/content?cid=[contentId]&mime=image/jpeg

http://localhost:3000/thumbnail?dioryId=[dioryId]
```

## Tests

See `tests/README.md`
