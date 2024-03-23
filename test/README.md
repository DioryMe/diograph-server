## Robot framework tests

1. Install robotframework and python with instructions from https://docs.robotframework.org/docs/getting_started/testing

2. Install required libraries/dependencies

```
pip install robotframework-requests
pip install robotframework-browser
```

3. Start server

S3 test needs server to be started with access key & secret as envs:

```
DCLI_S3_CLIENT_ACCESS_KEY_ID=****** DCLI_S3_CLIENT_SECRET_ACCESS_KEY=****** yarn start:dev
```

4. Run tests

```
robot main.robot
```
