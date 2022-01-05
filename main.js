import './style.scss';
import * as levelsArr from './src/data/levels.json';
import Level from './src/scripts/level.js';

import ogen from './src/img/og-en.png';
import ogfr from './src/img/og-fr.png';

class Game {
  constructor() {
    this.levelsArr = levelsArr.content;
    this.level = 0;
    this.score = 0;
    this.supportedLanguages = ['en', 'fr']
    this.lang = navigator.language.substring(0,2).toLowerCase();
    this.lang = this.supportedLanguages.includes(this.lang) ? this.lang : 'en'; // Fallback en

    this.dom = {
      app: document.querySelector('#app'),
      level: {
        label: document.querySelector('.level__label'),
        current: document.querySelector('.level__current'),
        of: document.querySelector('.level__of'),
        total: document.querySelector('.level__total')
      },
      header: {
        el: document.querySelector('.header'),
        title: document.querySelector('.header__title'),
        intro: document.querySelector('.header__intro')
      },
      footer: {
        el: document.querySelector('.footer'),
        reset: document.querySelector('.reset'),
        credits: document.querySelector('.footer__credits')
      },
      score: {
        label: document.querySelector('.score__label'),
        value: document.querySelector('.score__value'),
        total: document.querySelector('.score__total'),
      },
      lang: document.querySelector('.lang'),
      popup: {
        el: document.querySelector('.popup'),
        main: document.querySelector('.popup__main'),
        congratulation: document.querySelector('.congratulation'),
        quizCompleted: document.querySelector('.popup__quiz-completed'),
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
    this.loadData();
    this.bindEvents();
  }

  loadGame() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang !== null) { this.lang = savedLang; }

    this.dom.lang.value = this.lang;

    const savedLevel = localStorage.getItem('level');
    if (savedLevel !== null) { this.level = parseInt(savedLevel); }

    const savedScore = localStorage.getItem('score');
    if (savedScore !== null) { this.score = parseInt(savedScore); }

    if (this.level >= this.levelsArr.length -1) {
      this.level = this.score = 0;
    }

    this.showLevel();
  }

  loadData() {
    fetch(`./src/data/${this.lang}.json`)
    .then(res => res.json())
    .then(data => {
      this.data = data;

      this.i18n();
      this.goToLevel(this.level);
      this.dom.app.classList.add('is-ready');
    }) 
  }

  changeLang() {
    this.lang = this.dom.lang.value;
    localStorage.setItem('lang', this.lang);
    this.dom.app.classList.remove('is-ready');
    this.loadData();
  }

  i18n() {
    document.documentElement.lang = this.lang;
    document.querySelector('meta[property="og:title"]').content = this.data.title;
    document.querySelector('meta[property="og:description"]').content = this.data.slogan;
    if(this.lang === 'fr') {
      document.querySelector('meta[property="og:image"]').content = ogfr;
    } else {
      document.querySelector('meta[property="og:image"]').content = ogen;
    }

    this.dom.level.label.innerText = this.data.level;
    this.dom.level.of.innerText = this.data.of;
    this.dom.header.title.innerText = document.title = this.data.title;
    this.dom.header.intro.innerHTML = this.data.intro;
    this.dom.score.label.innerText = this.data.score;
    this.dom.footer.reset.innerHTML = this.data.reset;
    this.dom.footer.credits.innerHTML = this.data.credits;
    this.dom.popup.congratulation.innerText = this.data.congratulation;
    this.dom.popup.quizCompleted.innerText = this.data['quiz-completed'];
    this.dom.popup.next.innerText = this.data['next-question'];
    this.dom.popup.showResult.innerText = this.data['show-result'];
    this.dom.popup.randomQuestions.innerText = this.data['questions-in-random-order'];
  }

  bindEvents() {
    document.body.addEventListener('success', () => this.successPopup(), false);
    document.body.addEventListener('fail', () => this.failPopup(), false);
    
    this.dom.footer.reset.addEventListener('click', () => this.reset(), false);
    this.dom.lang.addEventListener('change', () => this.changeLang(), false);
    this.dom.popup.next.addEventListener('click', () => this.nextLevel(), false);
    this.dom.popup.showResult.addEventListener('click', () => this.setPopupEnd(), false);
    this.dom.popup.randomQuestions.addEventListener('click', () => this.randomizeQuestions(), false);
  }

  goToLevel(level) {
    this.showScore();
    this.clearPopup();

    this.level = level;
    localStorage.setItem('level', this.level);

    history.pushState({}, "", `?level=${this.getLevelSlug(this.level)}`);

    let levelObj = this.levelsArr[this.level];

    new Level(levelObj, this.data.questions[levelObj.slug], this.dom.main, this.data);
  }
  
  nextLevel() {
    this.level++;

    if (this.level < this.levelsArr.length) {
      this.goToLevel(this.level);
    }
  }

  getLevelSlug(level) {
    return this.levelsArr[level].slug;
  }

  showLevel() {
    this.dom.level.current.innerText = this.level;
    this.dom.level.total.innerText = this.levelsArr.length;
  }

  showScore() {
    localStorage.setItem('score', this.score);
    this.dom.score.value.innerText = this.score;
    this.dom.score.total.innerText = this.level;
    this.dom.level.current.innerText = this.level + 1;
  }

  reset() {
    localStorage.clear();
    this.level = this.score = 0;
    this.goToLevel(this.level);
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
        ${this.data['final-score']}:
        <div class="final-score">${this.score} / ${this.levelsArr.length}</div>
      `;

      this.dom.popup.el.classList.add('popup--end');
    }, 500);
  }

  randomizeQuestions() {
    this.levelsArr = this.shuffleArray(this.levelsArr);
    this.reset();
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

new Game();