## Diograph-server

## Run

```
yarn start:dev
```

OR

```
aws-vault exec [username] -- yarn start:dev
```

## Usage

```
http://localhost:3000/content?cid=[contentId]&mime=image/jpeg

http://localhost:3000/thumbnail?dioryId=[dioryId]
```

## Tests

See `tests/robot/README.md`
