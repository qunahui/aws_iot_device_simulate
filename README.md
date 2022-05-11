## Environment

| VARIABLE             | Description                            |
| -------------------- | -------------------------------------- |
| AWS_PRIVATE_KEY_PATH | certs/{deviceType}/private.pem.key     |
| AWS_CERT_PATH        | certs/{deviceType}/certificate.pem.crt |
| AWS_CA_PATH          | certs/rootCA1.pem                      |
| CLIENT_ID            | thingName on AWS                       |
| AWS_HOST             | AWS Host                               |

```
# .env file
CLIENT_ID=CLIENT_ID
AWS_HOST=AWS_HOST
```

## Install packages

```
npm install
```

## Run

```
npm test
```
