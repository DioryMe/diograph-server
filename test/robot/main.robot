*** Settings ***
Library    Browser
Library    RequestsLibrary
Library    Collections
Suite Setup    New Browser    browser=${BROWSER}    headless=True
Test Setup    New Context    viewport={'width': 1920, 'height': 1080}
Test Teardown    Close Context
Suite Teardown    Close Browser

*** Variables ***
${BROWSER}    chromium
${ROOT}    http://localhost:3000

*** Test Cases ***
Error without CID
    ${resp}=    GET    ${ROOT}/    expected_status=400
    Status Should Be    400  ${resp}
    Should Be Equal As Strings    ${resp.text}    Missing "cid" parameter
Basic
    ${resp}=    GET    ${ROOT}/    params=cid=bafkreig6w4bromttln6hqnw3f3kqfhm7pcfbbtsgezaxvh7a2ipqbelrxy
    Status Should Be    200  ${resp}
    Dictionary Should Contain Value    ${resp.headers}  image/jpeg
Basic with another CID
    ${resp}=    GET    ${ROOT}/    params=cid=bafkreiffnhnovdvo7o5bm4n2bvh3dax2wjlvlja3axhakakvvjfmoqxbhq
    Status Should Be    200  ${resp}
    Dictionary Should Contain Value    ${resp.headers}  application/pdf
