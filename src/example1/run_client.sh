# First run install_and_start.sh
# Initial setup
cd ~/singnet
export GOPATH=`pwd`
export SINGNET_REPOS=${GOPATH}/src/github.com/singnet
export PATH=${GOPATH}/bin:${PATH}
export PATH=~/.local/bin/:${PATH}

# check balance (all tokens belongs to this idenity)
snet account balance

# deposit tokens to MPE 
snet account deposit 42000.22 -y

# open channel with our service (organization=testo service_name=tests)
# channel with channel_id=0 should be created and initilized
snet channel open-init testo tests 42 +20days -y

# call the server using stateless logic
snet client call testo tests add '{"a":10,"b":32}' -y
snet client call testo tests mul '{"a":6,"b":7}'  -y
