// Data
import { content } from '../data/levels';

class Nav {
  constructor() {
    this.url = {
      params: new URLSearchParams(window.location.search)
    };

    this.dom = {
      level: {
        current: document.querySelector('.level__current'),
        total: document.querySelector('.level__total')
      },
    }

    this.levelsArr = content;
    this.level = 0;

    this.init();
  }

  init() {
    this.dom.level.total.innerText = this.levelsArr.length;
    this.getLevel();
    this.setLevel();
  }

  getLevel() {
    const urlLevelParam = this.url.params.get('level');

    if (urlLevelParam !== null) { // URL Level
      this.level = parseInt(urlLevelParam);
    } else {
      const savedLevel = localStorage.getItem('level');
      if (savedLevel !== null) { // Saved level
        this.level = parseInt(savedLevel); 
      } else {
        this.level = 0; // Default level
      }
    }

    if (typeof this.level !== 'number' || this.level !== "NaN" ||  this.level > this.levelsArr.length - 1) { // Fallback
      this.level = 0;
    }
  }

  setLevel(level = this.level) {
    this.level = level;
    localStorage.setItem('level', level); // Save level in localStorage
    this.url.params.set('level', level); // Set URL param
    this.dom.level.current.innerText = level + 1;
  }

  prev() {
    let level = this.level - 1;

    if (level > 0) {
      this.setLevel(level);
    }
  }

  next() {
    let level = this.level + 1;

    if (level < this.levelsArr.length) {
      this.setLevel(level);
    }
  }

  reset() {
    this.setLevel(0);
  }

  bindEvents() {

  }
}

export { Nav as default }