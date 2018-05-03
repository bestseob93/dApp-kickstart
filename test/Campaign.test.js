const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode})
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0], // manager should be an accounts[0] 
    gas: '1000000'
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
    );
});

describe('Campaign', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call(); // public variable in contract, 자동으로 get 메소드 생성됨
    assert.equal(accounts[0], manager);
  });

  it('allow people to contribute money and marks them as approvers', async () => {
    
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor); // false 면 fail
  });

  it('requires minimum contribuion', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (e) {
      assert(e);
    }
  });

  it('allows a manager to make a payment request', async () => {
    await campaign.methods
      .createRequest(
        'Buy Batteries',
        '100',
        accounts[1]
      )
      .send({
        from: accounts[0],
        gas: '1000000'
      });

    const request = await campaign.methods.requests(0).call();
    assert.equal('Buy Batteries', request.description);
  });
});
