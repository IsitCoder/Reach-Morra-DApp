import React from 'react';

const exports = {};

// Player views must be extended.
// It does not have its own Wrapper view.

exports.GetHand = class extends React.Component {
  render() {
    const {parent, playable, hand} = this.props;
    return (
      <div>
        Pick Hand With Fingers
        <br/>
        {hand ? 'It was a draw! Pick again.' : ''}
        <br />
        {!playable ? 'Please wait...' : ''}
        <br />
        <button
          disabled={!playable}
          onClick={() => parent.playHand('Zero')}
        >Zero</button>
         &nbsp;&nbsp;
        <button
          disabled={!playable}
          onClick={() => parent.playHand('One')}
        >One</button>
         &nbsp; &nbsp;
        <button
          disabled={!playable}
          onClick={() => parent.playHand('Two')}
        >Two</button>
         &nbsp; &nbsp;
        <button
          disabled={!playable}
          onClick={() => parent.playHand('Three')}
        >Three</button>
         &nbsp; &nbsp;
        <button
          disabled={!playable}
          onClick={() => parent.playHand('Four')}
        >Four</button>
         &nbsp; &nbsp;
        <button
        disabled={!playable}
        onClick={() => parent.playHand('Five')}
      >Five</button>
      </div>
    );
  }
}

exports.GetGuess = class extends React.Component{
  render(){
    const {parent, playable, guess} = this.props;
    return(
      <div>
        Pick A Guess for this Game (1 to 10)
        <br />
      {guess ? 'It was a draw! Pick again.' : ''}
      <br />
      {!playable ? 'Please wait...' : ''}
      <br />
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('zero')}
      >Zero</button>
       &nbsp;&nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('one')}
      >One</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('two')}
      >Two</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('three')}
      >Three</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('four')}
      >Four</button>
       &nbsp; &nbsp;
      <button
      disabled={!playable}
      onClick={() => parent.playGuess('five')}
    >Five</button>
    <br/>
    <button
        disabled={!playable}
        onClick={() => parent.playGuess('six')}
      >Six</button>
       &nbsp;&nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('seven')}
      >Seven</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('eight')}
      >Eight</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('nine')}
      >Nine</button>
       &nbsp; &nbsp;
      <button
        disabled={!playable}
        onClick={() => parent.playGuess('ten')}
      >Ten</button>
       &nbsp; &nbsp;
      
    </div>
    
    )
  }
}

exports.WaitingForResults = class extends React.Component {
  render() {
    return (
      <div>
        Waiting for results...
      </div>
    );
  }
}

exports.Done = class extends React.Component {
  render() {
    const {outcome} = this.props;
    return (
      <div>
        Thank you for playing. The outcome of this game was:
        <br />{outcome || 'Unknown'}
      </div>
    );
  }
}

exports.SeeResult = class extends React.Component {
  render() {
    const {result} = this.props;
    return (
      <div>
        The total finger of this game was:
        <br />{result || 'Unknown'}
      </div>
    );
  }
}

exports.Timeout = class extends React.Component {
  render() {
    return (
      <div>
        There's been a timeout. (Someone took too long.)
      </div>
    );
  }
}

export default exports;

