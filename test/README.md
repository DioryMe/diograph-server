## Robot framework tests

1. Install robotframework and python with instructions from https://docs.robotframework.org/docs/getting_started/testing

2. Install required libraries/dependencies

```
pip install robotframework-requests
pip install robotframework-browser
rfbrowser init
```

3. Copy demo-content-room stuff to /tmp folder

```
cp -r ./test/demo-content /tmp
```

4. Start server

S3 test needs server to be started with access key & secret as envs:

```
DIOGRAPH_SERVER_STARTUP=1 BUCKET_NAME=****** BUCKET_ACCESS_KEY=****** BUCKET_SECRET_KEY=****** yarn start:dev
```

4. Run tests

```
robot main.robot
```
