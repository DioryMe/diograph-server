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
    ${resp}=    GET    ${ROOT}/content/    params=mime=image/jpeg    expected_status=400
    Status Should Be    400  ${resp}
    Should Be Equal As Strings    ${resp.text}    Missing "cid" query parameter

Error without mime
    ${resp}=    GET    ${ROOT}/content/    params=cid=123abc    expected_status=400
    Status Should Be    400  ${resp}
    Should Be Equal As Strings    ${resp.text}    Missing "mime" query parameter

# Basic
#     ${resp}=    GET    ${ROOT}/content/    params=cid=bafkreig6w4bromttln6hqnw3f3kqfhm7pcfbbtsgezaxvh7a2ipqbelrxy&mime=image/jpeg
#     Status Should Be    200  ${resp}
#     Dictionary Should Contain Value    ${resp.headers}  image/jpeg

# Basic with another CID
#     ${resp}=    GET    ${ROOT}/content/   params=cid=bafkreiffnhnovdvo7o5bm4n2bvh3dax2wjlvlja3axhakakvvjfmoqxbhq&mime=application/pdf
#     Status Should Be    200  ${resp}
#     Dictionary Should Contain Value    ${resp.headers}  application/pdf

S3
    ${resp}=    GET    ${ROOT}/s3    params=cid=bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona&mime=image/jpeg
    Status Should Be    200  ${resp}
    Dictionary Should Contain Value    ${resp.headers}  image/jpeg

Thumbnail
    ${resp}=    GET    ${ROOT}/thumbnail/    params=dioryId=bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona
    Status Should Be    200  ${resp}
    Dictionary Should Contain Value    ${resp.headers}  text/html; charset=utf-8
