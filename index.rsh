'reach 0.1'

const [ isHand, ZERO, ONE, TWO, THREE, FOUR, FIVE ] = makeEnum(6);
const [ isGuess, zero, one, two, three, four, five, six, seven, eight, nine, ten ] = makeEnum(11);
const [ isOutcome, B_WINS, DRAW, A_WINS] = makeEnum(3);

const winner = (handAlice,guessAlice,handBob,guessBob) => {
 if( guessAlice == guessBob ){
   const outcome = DRAW;
   return outcome;
}
else{
    if((handAlice+handBob)==guessAlice){
        const outcome = A_WINS;
        return outcome;
    }
    else{
        if((handAlice+handBob)==guessBob){
            const outcome = B_WINS;
            return outcome;
        }
        else{
            const outcome = DRAW;
            return outcome;
        }
    }
}

};


forall(UInt, handAlice =>
    forall(UInt, guessAlice =>
        forall(UInt, handBob =>
            forall(UInt, guessBob =>
        assert(isOutcome(winner(handAlice,guessAlice,handBob,guessBob)))))));

forall(UInt, handAlice =>
    forall(UInt, handBob =>
        forall(UInt, (guess)=>
    assert(winner(handAlice,guess,handBob,guess)==DRAW))));

const Player = {
    ...hasRandom,
    getHand: Fun([],UInt),
    getGuess: Fun([],UInt),
    seeResult: Fun([UInt], Null),
    seeOutcome: Fun([UInt],Null),
    informTimeout: Fun([],Null),
}

export const main = Reach.App(()=>{
    const Alice = Participant('Alice',{
        //specify Alice's interact interface here
        ...Player,
        wager: UInt,
        deadline: UInt,
    })


    const Bob = Participant('Bob',{
        ...Player,
        acceptWager: Fun([UInt],Null),
    })

    init()

    const informTimeout = () =>{
        each([Alice, Bob],()=>{
            interact.informTimeout();
        });
    };
    //write program here

    Alice.only(()=>{
        const amount = declassify(interact.wager);
        const deadline = declassify(interact.deadline);
    })
    Alice.publish(amount,deadline)
        .pay(amount)
    commit()

    
    Bob.only(()=>{
        interact.acceptWager(amount);
    })
    Bob.publish()
        .pay(amount)
        .timeout(relativeTime(deadline),()=>closeTo(Alice, informTimeout));
    

    //loop must in consensus step
    var outcome = DRAW;
    invariant(balance()==amount * 2 && isOutcome(outcome))
    while(outcome==DRAW)
    {
        commit();

        Alice.only(()=>{
            const _handAlice = interact.getHand();
            const [_commitHandAlice, _saltHandAlice] =makeCommitment(interact,_handAlice); 
            const commitHandAlice = declassify(_commitHandAlice);

            const _guessAlice = interact.getGuess();
            const [_commitGuessAlice, _saltGuessAlice] =makeCommitment(interact,_guessAlice); 
            const commitGuessAlice = declassify(_commitGuessAlice);
        })

        Alice.publish(commitHandAlice,commitGuessAlice)
            .timeout(relativeTime(deadline),()=> closeTo(Bob, informTimeout));
        commit();

        unknowable(Bob, Alice(_handAlice,_saltHandAlice,_guessAlice,_saltGuessAlice));
        Bob.only(() => {
            const handBob = declassify(interact.getHand());
            const guessBob = declassify(interact.getGuess());
        })

        Bob.publish(handBob,guessBob)
            .timeout(relativeTime(deadline),()=> closeTo(Alice, informTimeout));
        commit();

        Alice.only(()=>{
            const saltHandAlice = declassify(_saltHandAlice);
            const handAlice = declassify(_handAlice);
            const saltGuessAlice = declassify(_saltGuessAlice);
            const guessAlice = declassify(_guessAlice);
        });
    
        Alice.publish(saltHandAlice,handAlice,saltGuessAlice,guessAlice)
            .timeout(relativeTime(deadline),()=>closeTo(Bob, informTimeout));
        checkCommitment(commitHandAlice, saltHandAlice, handAlice);
        checkCommitment(commitGuessAlice, saltGuessAlice, guessAlice);


        const result = handAlice + handBob;

        each([Alice,Bob],()=>{
           interact.seeResult(result)
        })



        outcome = winner(handAlice,guessAlice,handBob,guessBob);
        continue;

    }

    assert(outcome == A_WINS || outcome == B_WINS);
    transfer(2*amount).to(outcome == A_WINS ? Alice : Bob);
    commit();


    each([Alice,Bob],()=>{
        interact.seeOutcome(outcome)
    })
})