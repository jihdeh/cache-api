## Cache Api Challenge

### Requirements

- Node 14+
- Docker or Local Mongodb installation

## How to run locally

You can run this project locally by

- Copy the contents of .env.example to a .env file
- Run `yarn dev` or `yarn container` to run in docker mode

The project runs on port `4310` i.e `http://localhost:4310`

Note: When running in docker mode, check the mongo url.
`localhost` or `127.0.0.1` should be replaced with `mongo`

```
# DEV_DATABASE_URL=mongodb://mongo:27017/errandlr
```

### Test

RUN `yarn test`
Note: To run test outside of docker, make sure the mongo url isn't pointing to the docker mongo url.
