# Tutorial on developing a calculator web app

This is an example of how to use SingularityNET Web JS SDK to using a calculator service.

### Description

It is assumed that there is an application provider (developer), who pays for all the
transactions and service calls.

### Development

#### Install package

Before the beginning you need to install `snet-sdk-web` package:

```sh
npm install snet-sdk-web
```

And additional packages
```sh
npm install google-protobuf @improbable-eng/grpc-web snet-sdk-web web3
npm install --save-dev react-app-rewired buffer process os-browserify url
```

Make sure that you have Node.js version >= 18 and `react-scripts` version >= 5.0.1

Create **config-overrides.js** in the root of your project with the content:

```javascript
const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        os: require.resolve('os-browserify'),t
        url: require.resolve('url'),
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);
    config.ignoreWarnings = [/Failed to parse source map/];
    config.module.rules.push({
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        loader: require.resolve('source-map-loader'),
        resolve: {
            fullySpecified: false,
        },
    });
    return config;
};
```

Update your **package.json** scripts to use **react-app-rewired** instead of **react-scripts**.

```json
{
    "scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-app-rewired test",
        "eject": "react-scripts eject"
    }
}
```

#### Configuration

Firstly, we need to configure sdk and service client. So we create a config dict and then an sdk instance with
that config.

```js
// sdkConfig.js file
import SnetSDK from 'snet-sdk-web';

const config = {
    web3Provider: window.ethereum,
    networkId: '11155111',
    defaultGasPrice: '4700000',
    defaultGasLimit: '210000',
};

const initSDK = async () => {
    try {
        const web3Provider = window.ethereum;
        sdk = new SnetSDK(config);
        await sdk.setupAccount();
        return sdk;
    } catch (error) {
        throw error;
    }
};
```

| Variable Name   | Description                                                                              |
| --------------- | ---------------------------------------------------------------------------------------- |
| web3Provider    | A URL or one of the Web3 provider classes.                                               |
| networkId       | Ethereum network ID.                                                                     |
| defaultGasPrice | The gas price to be used in case of fetching the gas price form the blockchain fails.    |
| defaultGasLimit | The gas limit to be used in case of fetching the gas estimate from the blockchain fails. |
| ipfsEndpoint    | A URL for fetching service related metadata.                                             |
| rpcEndpoint     | RPC endpoints serve as gateways for Web3 applications to connect with blockchain nodes   |

**Note:** `rpcEndpoint` is optional, you should provide this if you are getting block size limit exceeded error. This is usually happens when you are using any web social auth providers.

Calculator service is deployed on the sepolia network. To create a client of this service we need to pass `orgId`,
`serviceId` and not required `groupName`, `paymentChannelManagementStrategy`, `options`

```js
const sdk = await initSdk();
const calculatorClient = sdk.createServiceСlient(
    '26072b8b6a0e448180f8c0e702ab6d2f',
    'Exampleservice'
);
```

#### User input

Secondly, we need to write a functionality for user input. On input: two numbers and action with it. The values entered by the user must be validated before sending.

```js
import React, { useState } from "react";

const ACTIONS = [
    { value: 'add', title: '+' },
    { value: 'sub', title: '-' },
    { value: 'mul', title: '*' },
    { value: 'div', title: ':' },
];

const ExampleService = () => {
    const [firstValue, setFirstValue] = useState('');
    const [secondValue, setSecondValue] = useState('');
    const [selectedAction, setSelectedAction] = useState(ACTIONS[0]);
    const [response, setResponse] = useState();

    return (
        <div className='service-container'>
            <input onChange={(event) => setFirstValue(event.target.value)} />
            <select onChange={(event) => setSelectedAction(event.target.value)}>
                {ACTIONS.map((action) => (
                    <option value={action.value} key={action.value}>
                        {action.title}
                    </option>
                ))}
            </select>
            <input onChange={(event) => setSecondValue(event.target.value)} />
            <button>Submit</button>
            <div>{response}</div>
        </div>
    );
};
```
#### Interaction with the service

For submitting results you need generate stubs files from `proto file` of your service.

Calculator service proto:

```proto
syntax = "proto3";

package example_service;

message Numbers {
    float a = 1;
    float b = 2;
}

message Result {
    float value = 1;
}

service Calculator {
    rpc add(Numbers) returns (Result) {}
    rpc sub(Numbers) returns (Result) {}
    rpc mul(Numbers) returns (Result) {}
    rpc div(Numbers) returns (Result) {}
}
```
Apart from the steps mentioned at the official [documentation](https://github.com/improbable-eng/grpc-web/blob/master/client/grpc-web/docs/code-generation.md) to generate `js` stubs from `.proto` definitions, you also need to provide the namespace_prefix flag to the generator. Here is an example which illustrates the usage:

For Linux

```bash
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--js_out=import_style=commonjs,binary,namespace_prefix=\
[package name]_[org id]_[service]:. --ts_out=service=grpc-web:. \
[proto file name].proto
```

For Windows CMD

```bash
protoc ^
--plugin=protoc-gen-ts=%cd%/node_modules/.bin/protoc-gen-ts.cmd ^ --js_out=import_style=commonjs,binary,namespace_prefix=^
[package name]_[org id]_[service]:. --ts_out=service=grpc-web:. ^
[proto file name].proto
```
After that comands you will get four files. Transfer the js files to your project. In our example, this is the `stubs` folder. Now we can use the functions of our service

```js
import { Calculator } from "./stubs/example_pb_service";
import { initSDK } from "./sdkConfig";
<...>
const SUCCESS_CODE = 0;

const ExampleService = () => {
    <...>
    const getServiceClient = async () => {
        const sdk = await initSDK();
        const client = await sdk.createServiceClient(
            serviceConfig.orgID,
            serviceConfig.serviceID
        );
        return client;
    };

    const submitAction = async () => {
        const methodDescriptor = Calculator[selectedAction];
        const request = new methodDescriptor.requestType();

        request.setA(firstValue);
        request.setB(secondValue);

        const props = {
        request,
        preventCloseServiceOnEnd: false,
        onEnd: onActionEnd,
        };

        const serviceClient = await getServiceClient();
        serviceClient.unary(methodDescriptor, props);
    }

    const onActionEnd = (response) => {
        const { message, status, statusMessage } = response;
        if (status !== SUCCESS_CODE) {
            throw new Error(statusMessage);
        }

        setResponse(message.getValue())
    }
    <...>
}
```
Functions for input and output (in our case `setA`, `setB`, `getValue`) you can find in the `example_pb.js` file.

The entire application code can be viewed at the
[link](https://github.com/singnet/snet-sdk-js/tree/master/packages/web/examples/calculator) to GitHub.