# First run install_and_start.sh
# Initial setup
cd ~/singnet
export GOPATH=`pwd`
export SINGNET_REPOS=${GOPATH}/src/github.com/singnet
export PATH=${GOPATH}/bin:${PATH}

# Download example service and compile it
cd $SINGNET_REPOS
git clone https://github.com/singnet/example-service
cd example-service/
pip3 install -r requirements.txt
ln -s $SINGNET_REPOS/snet-daemon/build/snetd-linux-amd64 ./snetd-linux-amd64

# Prepare metadata (payment address is the second ganache identity 0x3b2b3C2e2E7C93db335E69D827F3CC4bC2A2A2cB)

snet service metadata_init service_spec Example1 0x3b2b3C2e2E7C93db335E69D827F3CC4bC2A2A2cB --service_type jsonrpc --encoding json
snet service metadata_set_fixed_price 0.1
snet service metadata_add_endpoints localhost:8080

# Create organization test1
snet organization  create testo2 -y 

# Register our service
snet service publish testo2 tests -y



# Start service 
#!!!! you might want to run it in the separate terminal without &
python run_basic_service.py > log_service.txt & 

# Configure daemon
cat > snetd.config.json << EOF
{
   "ETHEREUM_JSON_RPC_ENDPOINT": "http://localhost:8545",
   "PASSTHROUGH_ENABLED": true,
   "PASSTHROUGH_ENDPOINT": "http://localhost:5001",
   "REGISTRY_ADDRESS_KEY": "0x4e74fefa82e83e0964f0d9f53c68e03f7298a8b2",
   "DAEMON_END_POINT": "localhost:8080",
   "IPFS_END_POINT": "http://localhost:5002",
   "ORGANIZATION_NAME": "testo2",
   "SERVICE_NAME": "tests",
   "log": {
   "level": "debug",
   "output": {
   "type": "stdout"
      }
   }
}
EOF

# Start service
./scripts/run-snet-service
