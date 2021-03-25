// test/STCERC20.sol
// Load dependencies
const { expect } = require('chai');
const STC = artifacts.require('STCERC20');

contract('STC', accounts => {
  const hextab = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  beforeEach(async function () {
    this.token = await STC.new();
  });

  it('Settings', async function () {
    expect((await this.token.decimals()).toString()).to.equal('18');
    expect((await this.token.totalSupply()).toString()).to.equal('10000000000000000000000000000');
    expect(await this.token.name()).to.equal('Student Coin');
    expect(await this.token.symbol()).to.equal('STC');
    // All STC ends up in the account of the creator
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('10000000000000000000000000000');
  });

  it('Can do a normal transfer to 2 accounts', async function () {
    const v = '5000000000000000000000000000';
    const {receipt: {cumulativeGasUsed: g1}} = await this.token.transfer(accounts[1], v)
    const {receipt: {cumulativeGasUsed: g2}} = await this.token.transfer(accounts[2], v)
    console.log("Normal transfer to 2 accounts used " + (g1+g2) + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
  });

  it('Can do a normal transfer to 10 accounts', async function () {
    const v = '1000000000000000000000000000';
    let r = 0;
    for (let i = 0; i < 10; i++) {
        const {receipt: {cumulativeGasUsed: g}} = await this.token.transfer("0xf00000000000000000000000000000000000000" + hextab[i], v)
        r += g
    }
    console.log("Normal transfer to 10 accounts used " + r + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
  });

  it('Can do a normal transfer to 100 accounts', async function () {
    const v = '100000000000000000000000000';
    let r = 0;
    for (let i = 0; i < 100; i++) {
        const {receipt: {cumulativeGasUsed: g}} = await this.token.transfer("0xf0000000000000000000000000000000000000" + hextab[i/10 | 0] + hextab[i%10], v)
        r += g
    }
    console.log("Normal transfer to 100 accounts used " + r + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
  });

  it('Can batch transfer to 2 accounts', async function () {
    const v = '5000000000000000000000000000';
    const {receipt: receipt} = await this.token.batchTransfer([accounts[1], accounts[2]], [v, v])
    console.log("Batch transfer to 2 accounts used " + receipt.cumulativeGasUsed + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
    expect((await this.token.balanceOf(accounts[1])).toString()).to.equal(v);
    expect((await this.token.balanceOf(accounts[2])).toString()).to.equal(v);
  });

    it('Can batch transfer to 10 accounts', async function () {
    const v = '1000000000000000000000000000';
    const a = [];
    const vals = [];
    for (let i = 0; i < 10; i++) {
        a.push("0xf00000000000000000000000000000000000000" + hextab[i]);
        vals.push(v);
    }
    const {receipt: receipt} = await this.token.batchTransfer(a, vals)
    console.log("Batch transfer to 10 accounts used " + receipt.cumulativeGasUsed + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
  });

    it('Can batch transfer to 100 accounts', async function () {
    const v = '100000000000000000000000000';
    const a = [];
    const vals = [];
    for (let i = 0; i < 100; i++) {
        a.push("0xf0000000000000000000000000000000000000" + hextab[i/10 | 0] + hextab[i%10]);
        vals.push(v);
    }
    const {receipt: receipt} = await this.token.batchTransfer(a, vals)
    console.log("Batch transfer to 100 accounts used " + receipt.cumulativeGasUsed + " gas")
    expect((await this.token.balanceOf(accounts[0])).toString()).to.equal('0');
  });

});
