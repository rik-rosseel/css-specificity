import * as palettes from '../data/palettes.json';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/vs2015.css';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('html', xml);
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('css', css);

class Level {
  constructor(data, desc, wrapper) {
    this.data = data;
    this.description = desc;
    this.options = this.data.options;
    if(this.data.shuffle !== false) {
      this.options = this.shuffleArray(this.data.options);
    }

    this.paletteIndex = Math.floor(Math.random() * palettes.content.length);
    this.palette = this.shuffleArray(palettes.content[this.paletteIndex]);

    this.dom = {
      wrapper: wrapper,
      popup: wrapper.querySelector('.popup'),
      popupMain: document.querySelector('.popup__main'),
      html: wrapper.querySelector('.snippet--html code'),
      css: wrapper.querySelector('.snippet--css code'),
      options: wrapper.querySelector('.options')
    };

    this.init();
  }

  init() {
    this.create();
    this.bindEvents();
  }

  create() {
    let specificity = '';
    let css = '';
    let options = '';
    this.data.options.forEach((option, index) => {
      specificity += this.setPopupSpecificity(option, index);
      options += this.setOption(option, index);
      css += this.setCSS(option, index);
    });

    this.setPopupMsg(specificity);

    this.dom.html.innerHTML = hljs.highlight(this.data.html, {language: 'html'}).value;
    this.dom.css.innerHTML = hljs.highlight(css, {language: 'css'}).value;
    this.dom.options.innerHTML = options;
    this.dom.btnsArr = this.dom.wrapper.querySelectorAll('.options__btn');
  }

  setPopupMsg(specificity) {
    this.dom.popupMain.innerHTML = `
      <strong>Spécificité</strong><br>
      <table class="popup__specificity">${specificity}</table>
      <div class="popup__explanations">${this.description}</div>
    `;
  }

  setPopupSpecificity(option, index) {
    let specificity = `<tr>
                        <td><pre>${option.selector}</pre></td>
                        <td class="nbr">${option.score}</td>
                      <tr>`;
    if (index < this.options.length - 1) {
      specificity += '\n';
    }

    return specificity;
  }

  setCSS(option, index) {
    let css = '';

    if(option.bg) {
      this.palette[index].bg = option.bg;
      this.palette[index].color = undefined;
    }

    if(option.selector === "style") {
      css += `${option.selector}="background-color: ${this.palette[index].bg};"`;
    } else {
      css += `${option.selector} {
  background-color: ${this.palette[index].bg};
}`;
    }

    if (index < this.options.length - 1) {
      css += '\n\n';
    }

    return css;
  }

  setOption(option, index) {
    let styles = `background-color: ${this.palette[index].bg};`;
    
    if (this.palette[index].color) {
      styles += `color: ${this.palette[index].color};`;
    }

    let answer = option.good ? "good" : "wrong";

    return `
      <li class="options__item">
        <button class="options__btn options__btn--${answer}" style="${styles}">${option.selector}</button>
      </li>
    `;
  }

  bindEvents() {
    this.dom.btnsArr.forEach(btn => {
      btn.addEventListener('click', () => {
        let event = new Event('fail');
        if(btn.classList.contains('options__btn--good')) {
          event = new Event('success');
        }
        document.body.dispatchEvent(event);
      });
    })
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}

export { Level as default }