import './style.scss';
import * as lang from './src/data/fr.json';
import * as levelsArr from './src/data/levels.json';
import Level from './src/scripts/level.js'

class Game {
  constructor() {
    this.levelsArr = levelsArr.content;
    this.level = 0;
    this.score = 0;
    this.lang = lang.content;

    this.dom = {
      popup: document.querySelector('.popup'),
      level: document.querySelector('.level'),
      next: document.querySelector('.popup__next'),
      score: document.querySelector('.score__value'),
      scoreTotal: document.querySelector('.score__total')
    };

    this.init();
  }

  init() {
    this.loadGame();
    this.bindEvents();
    this.goToLevel(this.level);
  }

  loadGame() {
    const savedLevel = localStorage.getItem('level');
    if (savedLevel !== null) { this.level = savedLevel; }

    const savedScore = localStorage.getItem('score');
    if (savedScore !== null) { this.score = savedScore; }
  }

  bindEvents() {
    document.body.addEventListener('success', () => this.successPopup(), false);
    document.body.addEventListener('fail', () => this.failPopup(), false);
    this.dom.next.addEventListener('click', () => this.nextLevel(), false);
  }

  goToLevel(level) {
    this.clearPopup();

    this.level = level;
    localStorage.setItem('level', this.level);

    let levelObj = this.levelsArr[this.level];

    new Level(levelObj, this.lang.questions[levelObj.slug], this.dom.level);
  }
  
  nextLevel() {
    this.level++;

    if (this.level < this.levelsArr.length) {
      this.goToLevel(this.level);
    } else {
      this.showEnd();
    }
  }

  showScore() {
    localStorage.setItem('score', this.score);
    this.dom.score.innerText = this.score;
    this.dom.scoreTotal.innerText = this.levelsArr.length;
  }

  successPopup() {
    this.score++;
    this.showScore();

    this.dom.popup.classList.add('popup--success');
  }

  failPopup() {
    this.dom.popup.classList.add('popup--fail');
  }

  clearPopup() {
    this.dom.popup.classList.remove('popup--success', 'popup--fail');
  }

  showEnd() {
    console.log('Félicitations! Vous avez fait le tour!')
  }
}

new Game();