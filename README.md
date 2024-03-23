## Diograph-server

## Run

```
yarn start:dev
```

For S3 rooms:

```
DCLI_S3_CLIENT_ACCESS_KEY_ID=****** DCLI_S3_CLIENT_SECRET_ACCESS_KEY=****** yarn start:dev
```

## Usage

```
http://localhost:3000/content?cid=[contentId]&mime=image/jpeg

http://localhost:3000/thumbnail?dioryId=[dioryId]
```

## Tests

See `tests/README.md`
