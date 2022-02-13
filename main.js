// Styles
import './style.scss';

// Helpers
import shuffleArray from './src/scripts/helpers/shuffleArray';

// Data
import { content } from './src/data/levels';

// Classes
import Lang from './src/scripts/lang';
import Nav from './src/scripts/nav';
import Level from './src/scripts/level';

class Game {
  constructor() {
    this.levelsArr = content;
    this.level = 0;
    this.score = 0;

    this.dom = {
      app: document.querySelector('#app'),
      level: {
        current: document.querySelector('.level__current'),
        total: document.querySelector('.level__total')
      },
      header: {
        el: document.querySelector('.header')
      },
      footer: {
        el: document.querySelector('.footer'),
        reset: document.querySelector('.reset')
      },
      score: {
        value: document.querySelector('.score__value'),
        total: document.querySelector('.score__total'),
      },
      popup: {
        el: document.querySelector('.popup'),
        main: document.querySelector('.popup__main'),
        next: document.querySelector('.popup__next'),
        showResult:document.querySelector('.popup__show-result'),
        randomQuestions: document.querySelector('.popup__random-questions')
      },
      main: document.querySelector('.main'),
    };

    this.init();
  }

  init() {
    this.loadGame();
    this.bindEvents();

    this.lang = new Lang();
    this.nav = new Nav();
  }

  loadGame() {
    const savedScore = localStorage.getItem('score');
    if (savedScore !== null) { this.score = parseInt(savedScore); }
  }

  bindEvents() {
    document.body.addEventListener('translationsnotready', () => {
      this.dom.app.classList.remove('is-ready');
    }, false);

    document.body.addEventListener('translationsready', e => {
      this.translations = e.detail;
      this.goToLevel();
      this.dom.app.classList.add('is-ready');
    }, false);

    document.body.addEventListener('success', () => this.successPopup(), false);
    document.body.addEventListener('fail', () => this.failPopup(), false);
    
    this.dom.footer.reset.addEventListener('click', () => this.reset(), false);
    this.dom.popup.next.addEventListener('click', () => {
      this.nav.next();
      this.goToLevel();
    }, false);
    this.dom.popup.showResult.addEventListener('click', () => this.setPopupEnd(), false);
    this.dom.popup.randomQuestions.addEventListener('click', () => this.randomizeQuestions(), false);
  }

  goToLevel() {
    this.showScore();
    this.clearPopup();

    let levelObj = this.levelsArr[0];

    let t = this.translations.questions[levelObj.slug];

    new Level(levelObj, t, this.dom.main);
  }

  getLevelSlug(level) {
    return this.levelsArr[level].slug;
  }

  showScore() {
    localStorage.setItem('score', this.score);
    this.dom.score.value.innerText = this.score;
    this.dom.score.total.innerText = this.level;
    this.dom.level.current.innerText = this.level + 1;
  }

  reset() {
    this.nav.reset();
    this.score = 0;
    this.goToLevel();
  }

  successPopup() {
    this.score++;

    if(this.level == this.levelsArr.length - 1) {
      this.dom.popup.el.classList.add('popup--no-more-question');
    } else {
      this.dom.popup.el.classList.remove('popup--no-more-question');
    }

    this.dom.popup.el.classList.add('popup--success');
  }

  failPopup() {
    if(this.level == this.levelsArr.length - 1) {
      this.dom.popup.el.classList.add('popup--no-more-question');
    } else {
      this.dom.popup.el.classList.remove('popup--no-more-question');
    }

    this.dom.popup.el.classList.add('popup--fail');
  }

  clearPopup() {
    this.dom.popup.el.classList.remove('popup--success', 'popup--fail', 'popup--end', 'popup--no-more-question');
  }

  setPopupEnd() {
    this.level = this.levelsArr.length;

    this.showScore();
    this.clearPopup();

    setTimeout(() => {
      this.dom.popup.main.innerHTML = `
        ${this.translations['final-score']}:
        <div class="final-score">${this.score} / ${this.levelsArr.length}</div>
      `;

      this.dom.popup.el.classList.add('popup--end');
    }, 500);
  }

  randomizeQuestions() {
    this.levelsArr = shuffleArray(this.levelsArr);
    this.reset();
  }
}

new Game();