import React, {Component} from 'react'
import dai from '../dai.png'
class Main extends Component {

    weiToEth(amount) {
        if (amount)
            return window.web3.utils.fromWei(amount, 'Ether')
        return '0'
    }
    
    ethToWei(amount) {
        if (amount)
            return window.web3.utils.toWei(amount, 'Ether')
        return '0'
    }

    stake(event) {
        event.preventDefault()
        let amount = this.ethToWei(this.input.value.toString())
        console.log('Staking Amount: ', amount)
        this.props.stakeTokens(amount)
    }

    unstake(event) {
        event.preventDefault()
        this.props.unstakeTokens()
    }

    render () {
        return (
            <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                    <thead>
                        <tr>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{this.weiToEth(this.props.stakingBalance)} mDAI</td>
                            <td>{this.weiToEth(this.props.dappTokenBalance)} DAPP</td>

                        </tr>
                    </tbody>
                </table>

                <div className="card mb-4">
                    <div className="card-body">
                        <form className="mb-3" onSubmit={(event) => this.stake(event)}>
                            <div>
                                <label className="float-left"><b>Stake Tokens</b></label>
                                <span className="float-right text-muted">
                                    Balance: {this.weiToEth(this.props.daiTokenBalance)}
                                </span>
                            </div>
                            <div className="input-group mb-4">
                                <input 
                                    type="text"
                                    ref={(input) => {this.input = input}}
                                    className="form-control form-control-lg"
                                    placeholder="0"
                                    required/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <img src={dai} height="32" alt=""/>&nbsp;&nbsp;&nbsp; mDAI
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block btn-lg">Stake!</button>
                        </form>
                        <button 
                            type="submit"
                            className="btn btn-link btn-block btn-sm"
                            onClick={(event) => this.unstake(event)}>{'Un-stake 💸'}</button>
                    </div>
                </div>
            </div>
        );
        
    }
}

export default Main