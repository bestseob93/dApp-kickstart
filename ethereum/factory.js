import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x50dB6842e0F019077A4164D17072C3db4F3Ce9C9'
);

export default instance;
