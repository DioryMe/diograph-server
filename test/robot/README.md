## Robot framework tests

1. Install robotframework and python with instructions from https://docs.robotframework.org/docs/getting_started/testing

2. Install required libraries/dependencies

```
pip install robotframework-requests
pip install robotframework-browser
```

3. Run tests

```
robot main.robot
```

NOTE: S3 test needs server to be started with `aws-vault exec [username] -- yarn start:dev`
