import {loadStdlib, ask } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const isAlice = await ask.ask(
    `Are you Alice?`,
    ask.yesno
);

const who = isAlice ? 'Alice' : 'Bob';

console.log(`Starting Morra as ${who}`);

let acc = null;

const createAcc = await ask.ask(
    `Would you like create an account? (only possible on devenet)`,
    ask.yesno
);

if(createAcc){
    acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
} else {
    const secret = await ask.ask(
        `What is you account secret?`,
        (x => x)
    );
    acc = await stdlib.newAccountFromSecret(secret);
}

let ctc = null;
if(isAlice){
    ctc = acc.contract(backend);
    ctc.getInfo().then((info)=>{
        console.log(`The contract is deployed as = ${JSON.stringify(info)}`);
    });
}else{
    const info = await ask.ask(
        `Please paste the contract information: `,
        JSON.parse 
    );
    ctc = acc.contract(backend , info)
}

const fmt = (x) => stdlib.formatCurrency(x,4);
const getBalance = async () => fmt(await stdlib.balanceOf(acc));

const before = await getBalance();
console.log(`Your balance is ${before}`);


const interact = { ...stdlib.hasRandom };

interact.informTimeout = () =>{
    console.log(`There was a timeout.`);
    process.exit(1);
}

if(isAlice) {
    const amt = await ask.ask(
        `How much do you want to wager`,
        stdlib.parseCurrency
    );
    interact.wager = amt;
    interact.deadline = {ETH: 100 , ALGO: 100 , CFX: 1000}[stdlib.connector];
}else{
    interact.acceptWager  = async (amt) => {
        const accepted = await ask.ask(
            `Do you accept the wager of ${fmt(amt)}?`,
            ask.yesno
        );
        if(!accepted){
            process.exit(0);
        }
    };
}

const HAND = ['ZERO','ONE','TWO','THREE','FOUR','FIVE'];
const GUESS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten'];
const OUTCOME = ['Bob wins', 'Draw','Alice wins'];



interact.getHand = async () => {
    const hand = await ask.ask(
        `What Hand will you play? 0 to 5`, (x) => {
        
            const hand = x;

            if(hand === undefined){
                throw Error(`Not a valid hand ${hand}`);
            }
            return hand;
        });
        console.log(`You played with  ${HAND[hand]} fingers`);
        return hand;
};

interact.getGuess = async () => {
    const guess = await ask.ask(
        `How many will you Guess? 0 to 10`, (x) => {
        
            const guess = x;

            if(guess === undefined){
                throw Error(`Not a valid guess input ${guess}`);
            }
            return guess;
        });
        console.log(`You guess for: ${GUESS[guess]}`);
        return guess;
};


interact.seeOutcome = async (outcome) => {
    console.log(`The outcome is : ${OUTCOME[outcome]}`);
};

interact.seeResult = (result)=>{
    console.log(`Total finger is ${GUESS[result]}`);
};

const part = isAlice ? ctc.p.Alice : ctc.p.Bob;
await part(interact);

const after = await getBalance();
console.log(`Your balance is now ${after}`);

ask.done();