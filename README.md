# Gnosis Safe App for Idle Finance

## How to start the app localy

Set env variables, you will need Infura Project Id

```
cp .env.examples .env
```

Install dependencies and start local dev server

```
yarn install
yarn start
```

Then:

- Go to Rinkeby version of Gnosis Safe [https://rinkeby.gnosis-safe.io/app](https://rinkeby.gnosis-safe.io/app)
- Create your test safe
- Go to Apps -> Manage Apps -> Add Custom App
- Paste your localhost url, default is http://localhost:3003/
- Enjoy Idle Safe App

## License

Built by Kris Urbas ([@krzysu](https://twitter.com/krzysu)).

The code in this repository is available under the MIT License.
