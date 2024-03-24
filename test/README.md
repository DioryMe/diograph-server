## Robot framework tests

1. Install robotframework and python with instructions from https://docs.robotframework.org/docs/getting_started/testing

2. Install required libraries/dependencies

```
pip install robotframework-requests
pip install robotframework-browser
rfbrowser init
```

3. Start server

S3 test needs server to be started with access key & secret as envs:

```
ROOM_PATH=./test/demo-content/room-1 BUCKET_NAME=****** BUCKET_ACCESS_KEY=****** BUCKET_SECRET_KEY=****** yarn start:dev
```

4. Run tests

```
robot main.robot
```
