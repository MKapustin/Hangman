import React, { Component } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./Hangman.css";
import img0 from "./0.jpg";
import img1 from "./1.jpg";
import img2 from "./2.jpg";
import img3 from "./3.jpg";
import img4 from "./4.jpg";
import img5 from "./5.jpg";
import img6 from "./6.jpg";
import {randomWord} from "./words"

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);

    let random_word_to_guess = randomWord()

    this.state = { nWrong: 0, guessed: new Set(), answer: random_word_to_guess, cur_answer: "_".repeat(random_word_to_guess.length)};
    this.handleGuess = this.handleGuess.bind(this);
    this.handleRestartClick = this.handleRestartClick.bind(this);
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  guessedWord() {
    if (this.state.nWrong === this.props.maxWrong){
      return this.state.answer
    }
    else{
      return this.state.cur_answer
    }
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
  */
  handleGuess(evt) {
    let ltr = evt.target.value;

    let new_guessed = new Set([...this.state.guessed, ltr])
    let new_cur_answer = ""
    for (let answer_ltr of this.state.answer){
      new_cur_answer += (new_guessed.has(answer_ltr) ? answer_ltr : "_")
    } 

    this.setState(st => ({
      guessed: new_guessed,
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1),
      cur_answer:new_cur_answer
    }));
  }

  handleRestartClick(){
    let random_word_to_guess = randomWord()

    this.setState(
      { nWrong: 0, guessed: new Set(), answer: random_word_to_guess, cur_answer: "_".repeat(random_word_to_guess.length)}
    )
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    if (this.state.nWrong === this.props.maxWrong){
      return <div className='Hangman-restart-panel'>
                <p>You Lose!</p>
                <button onClick={this.handleRestartClick}>Restart!</button>
              </div>
    }
    else if (this.state.cur_answer === this.state.answer){
      return <div className='Hangman-restart-panel'>
                <p>You Win!</p>
                <button onClick={this.handleRestartClick}>Restart!</button>
              </div>
    }
    else{
      return "abcdefghijklmnopqrstuvwxyz".split("").map(ltr => (
        <button
          className='Hangman-ltr-btns'
          key={uuidv4()}
          value={ltr}
          onClick={this.handleGuess}
          disabled={this.state.guessed.has(ltr)}
        >
          {ltr}
        </button>
      ));
    }
  }

  /** render: render game */
  render() {
    return (
      <div className='Hangman'>
        <h1>Hangman</h1>
        <img src={this.props.images[this.state.nWrong]} alt={`${this.state.nWrong} wrong guesses out of ${this.props.maxWrong}`}/>
        <p className='Hangman-wrong-amount'>Number wrong: {this.state.nWrong}</p>
        <p className='Hangman-word'>{this.guessedWord()}</p>
        <p className='Hangman-btns'>{this.generateButtons()}</p>
      </div>
    );
  }
}

export default Hangman;
