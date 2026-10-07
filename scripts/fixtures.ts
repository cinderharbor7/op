import {writeFileSync} from 'node:fs';
import {createMockRescueOrchestrator} from '../../xjy/src/integration/rescue';
import {DEMO_WALLET,DEMO_POLICY_CONFIG} from '../../xjy/src/mocks/scenarios';
import {getRiskLabSnapshot} from '../../xjy/src/modules/eth-risk/risk-lab';
async function main(){
 const session=await createMockRescueOrchestrator(DEMO_WALLET).runRescueSession(DEMO_WALLET);
 writeFileSync('native/fixtures/guardian.json',JSON.stringify({session,policy:{config:DEMO_POLICY_CONFIG,version:1},status:{mode:'MOCK',wallet:DEMO_WALLET,events:[],enabled:false,halted:false}},null,2));
 writeFileSync('native/fixtures/research.json',JSON.stringify(getRiskLabSnapshot(),null,2));
 console.log('In-memory mock fixtures saved. No persistence or RPC.');
}main();
