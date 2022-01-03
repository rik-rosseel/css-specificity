import './style.scss';
import * as levelsArr from './src/data/levels.json';
import Level from './src/scripts/level.js';

class Game {
  constructor() {
    this.levelsArr = levelsArr.content;
    this.level = 0;
    this.score = 0;
    this.lang = navigator.language.substring(0,2).toLowerCase();

    this.dom = {
      app: document.querySelector('#app'),
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
        next: document.querySelector('.popup__next'),
      },
      level: document.querySelector('.level'),
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
    if (savedLevel !== null) { this.level = savedLevel; }

    const savedScore = localStorage.getItem('score');
    if (savedScore !== null) { this.score = savedScore; }
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
    this.dom.header.title.innerText = document.title = this.data.title;
    this.dom.header.intro.innerHTML = this.data.intro;
    this.dom.score.label.innerText = this.data.score;
    this.dom.footer.reset.innerHTML = this.data.reset;
    this.dom.footer.credits.innerHTML = this.data.credits;
  }

  bindEvents() {
    document.body.addEventListener('success', () => this.successPopup(), false);
    document.body.addEventListener('fail', () => this.failPopup(), false);
    this.dom.popup.next.addEventListener('click', () => this.nextLevel(), false);
    this.dom.footer.reset.addEventListener('click', () => this.reset(), false);
    this.dom.lang.addEventListener('change', () => this.changeLang(), false);
  }

  goToLevel(level) {
    this.showScore();
    this.clearPopup();

    this.level = level;
    localStorage.setItem('level', this.level);

    history.pushState({}, "", `?level=${this.getLevelSlug(this.level)}`);

    let levelObj = this.levelsArr[this.level];

    new Level(levelObj, this.data.questions[levelObj.slug], this.dom.level);
  }
  
  nextLevel() {
    this.level++;

    if (this.level < this.levelsArr.length) {
      this.goToLevel(this.level);
    } else {
      this.showEnd();
    }
  }

  getLevelSlug(level) {
    return this.levelsArr[level].slug;
  }

  showScore() {
    localStorage.setItem('score', this.score);
    this.dom.score.value.innerText = this.score;
    this.dom.score.total.innerText = this.levelsArr.length;
  }

  reset() {
    localStorage.clear();
    this.level = this.score = 0;
    this.goToLevel(this.level);
  }

  successPopup() {
    this.score++;
    this.showScore();

    this.dom.popup.el.classList.add('popup--success');
  }

  failPopup() {
    this.dom.popup.el.classList.add('popup--fail');
  }

  clearPopup() {
    this.dom.popup.el.classList.remove('popup--success', 'popup--fail');
  }

  showEnd() {
    console.log('Félicitations! Vous avez fait le tour!')
  }
}

new Game();