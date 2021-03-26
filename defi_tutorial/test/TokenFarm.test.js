const { assert } = require('chai');

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken;
    let dappToken;
    let tokenFarm;

    before(async () => {
        // Load Contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all Dapp tokens to farm (1MM)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor 
        await daiToken.transfer(investor, tokens('100'), {from: owner})
    })

    describe('Mock Dai deployment', async () => {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'DApp Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result

            // Check investor balance for staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor mock dai wallet ballance correct before staking')

            // Approve staking dai tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})

            // Stake mock dai tokens
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor mock dai wallet balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            // Issue Tokens
            await tokenFarm.issueTokens({from: owner})
            
            // Check balances after issuing tokens
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuing tokens')

            // Ensure that only the owner can issue tokens
            await tokenFarm.issueTokens({from: investor}).should.be.rejected;

            // Unstake tokens
            await tokenFarm.unstakeTokens({from: investor})

            // Check results after unstaking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock Dai wallet balance correct after unstaking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock Dai malance correct after unstaking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after unstaking')
        })
    })

});