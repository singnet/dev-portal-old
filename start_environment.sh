#!/bin/sh

ipfs daemon >${LOG}/ipfs.log 2>&1 &
etcd --data-dir ${ETCD} >${LOG}/etcd.log 2>&1 &
ganache-cli --db ${GANACHE} --host 0.0.0.0 --networkId ${NETWORK_ID} --mnemonic 'gauge enact biology destroy normal tunnel slight slide wide sauce ladder produce' >${LOG}/ganache.log 2>&1 &
cd ${ROOT}/platform-contracts
truffle migrate --network local

cd ${ROOT}
bash
