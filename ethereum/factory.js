import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  '0x09AFcfbc8d591F4C322FcCee38E1950FE17ab89d'
);

export default instance;
