import React, { Component } from 'react'
import Navbar from './Navbar'
import './App.css'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Main from './main'
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      dappToken: {},
      tokenFarm: {}, 
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. Try using MetaMask!')
    }

  }

  async loadBlockchainData () {
    const web3 = window.web3

    const accounts = await web3.eth.requestAccounts()
    console.log('Accounts: ', accounts)
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    console.log('Network ID: ', networkId)

    this.loadTokens(networkId)
    this.setState({loading: false})
  }

  loadTokens(networkId){
    this.loadDaiToken(networkId)
    this.loadDappToken(networkId)
    this.loadTokenFarm(networkId)
  }

  async loadDaiToken(networkId) {
    const daiTokenData = DaiToken.networks[networkId]
    if (daiTokenData) {
      // Instantiate the smart contract
      const daiToken = new window.web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      // Invoke the balance of method of the contract
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiToken:daiToken, daiTokenBalance: daiTokenBalance.toString()})
      console.log('DaiToken Balance: ', daiTokenBalance)
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }
  }

  async loadDappToken(networkId) {
    const dappTokenData = DappToken.networks[networkId]
    if (dappTokenData) {
      // Instantiate the smart contract
      const dappToken = new window.web3.eth.Contract(DappToken.abi, dappTokenData.address)
      // Invoke the balance of method of the contract
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({dappToken: dappToken, dappTokenBalance: dappTokenBalance.toString()})
      console.log('DAPPToken Balance: ', dappTokenBalance)
    } else {
      window.alert('DAPPToken contract not deployed to detected network')
    }
  }


  async loadTokenFarm(networkId) {
    const tokenFarmData = TokenFarm.networks[networkId]
    if (tokenFarmData) {
      // Instantiate the smart contract
      const tokenFarm = new window.web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      // Invoke the balance of method of the contract
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      this.setState({tokenFarm: tokenFarm, stakingBalance: stakingBalance.toString()})
      console.log('TokenFarm Staking Balance: ', stakingBalance)
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }
  }

  stakeTokens = (amount) => {
    this.setState({loading: true})
    // First Approve transaction
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      // Once approved stake tokens to tokenfarm
      this.state.tokenFarm.methods.stakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({loading: true})

    // Unstake tokens. No need for approval
    this.state.tokenFarm.methods.unstakeTokens().send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }

  render() {
    let content = this.state.loading ? 
    <p id="loader" className="text-center">LOADING....</p> 
    : <Main 
        daiTokenBalance={this.state.daiTokenBalance} 
        dappTokenBalance={this.state.dappTokenBalance} 
        stakingBalance={this.state.stakingBalance} 
        stakeTokens={this.stakeTokens} 
        unstakeTokens={this.unstakeTokens}
    />

    


    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                
                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
