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
    ${resp}=    GET    ${ROOT}/room-1/content/    params=mime=image/jpeg    expected_status=400
    Should Be Equal As Strings    ${resp.text}    Missing "cid" query parameter

Error without mime
    ${resp}=    GET    ${ROOT}/room-1/content/    params=cid=123abc    expected_status=400
    Should Be Equal As Strings    ${resp.text}    Missing "mime" query parameter

Basic
    ${resp}=    GET    ${ROOT}/room-1/content/    params=cid=bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona&mime=image/jpeg
    Dictionary Should Contain Value    ${resp.headers}  image/jpeg

Basic with another CID
    ${resp}=    GET    ${ROOT}/room-1/content/   params=cid=bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona&mime=application/pdf
    Dictionary Should Contain Value    ${resp.headers}  application/pdf

Error 404 when content not found
    ${resp}=    GET    ${ROOT}/room-1/content/   params=cid=this-aint-no-cid&mime=application/pdf    expected_status=404
    Should Be Equal As Strings    ${resp.text}    {"statusCode":404,"message":"Content not found"}

# S3
#     ${resp}=    GET    ${ROOT}/s3    params=cid=bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona&mime=image/jpeg
#     Dictionary Should Contain Value    ${resp.headers}  image/jpeg

Thumbnail
    ${resp}=    GET    ${ROOT}/room-1/thumbnail/    params=dioryId=bafkreihkqxpj4iwdw32vshr47qjme3fm3alwnar6ltngwscypf4jtpff6q
    Dictionary Should Contain Value    ${resp.headers}  text/html; charset=utf-8

Error 404 when thumbnail not found
    ${resp}=    GET    ${ROOT}/room-1/thumbnail/    params=dioryId=this-doesnt-exist    expected_status=404
    Should Be Equal As Strings    ${resp.text}    {"statusCode":404,"message":"Diory not found"}
