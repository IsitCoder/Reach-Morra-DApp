import { loadStdlib } from "@reach-sh/stdlib";
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);
const accAlice = await stdlib.newTestAccount(startingBalance);
const accBob = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x,4);
const getBalance =async (who) => fmt(await stdlib.balanceOf(who));
const beforeAlice = await getBalance(accAlice);
const beforeBob = await getBalance(accBob);

const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend,ctcAlice.getInfo());

const HAND = ['ZERO','ONE','TWO','THREE','FOUR','FIVE'];
const GUESS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const OUTCOME = ['Bob wins', 'Draw','Alice wins'];
const Player = (Who) => ({
    ...stdlib.hasRandom,
    getHand: async ()=>{
        const hand =Math.floor(Math.random()*6);
        console.log(`${Who} played hand with fingers ${HAND[hand]}`);
        return hand;
    },

    getGuess: async ()=>{
      const guess =Math.floor(Math.random()*11);
      console.log(`${Who} guess for ${GUESS[guess]}`);
      return guess;
  },
    seeOutcome: (outcome)=>{
        console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
    },
    seeResult: (result)=>{
      console.log(`${Who} saw Total finger is ${GUESS[result]}`);
    },
    informTimeout: ()=>{
        console.log(`${Who} observed a timeout`);
    }
})

await Promise.all([
    ctcAlice.p.Alice({
        //Alice interact object here
        ...Player('Alice'),
        wager: stdlib.parseCurrency(5),
        deadline: 10,
    }),
    ctcBob.p.Bob({
        //Bob interact object here
        ...Player('Bob'),
        acceptWager: (amt)=> {
            console.log(`Bob accepts the wager of ${fmt(amt)}.`);
    },
    }),
])

const afterAlice = await getBalance(accAlice);
const afterBob = await getBalance(accBob);

console.log(`Alice went from ${beforeAlice} to ${afterAlice}`);
console.log(`Bob went from  ${beforeBob} to ${afterBob}`);