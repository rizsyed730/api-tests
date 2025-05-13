Prerequisites:
Node.js v18 or later (tested with v22 LTS)


To install the depedencies run `npm install`

To run the tests run `npm test`

NOTE: If the tests are failing with the error message 'unable to get local issuer certificate' then run
the test with the command `NODE_TLS_REJECT_UNAUTHORIZED=0 npm test`. This disables SSL certificate validation - but is acceptable as long as you are not transmitting personal/private data. 
