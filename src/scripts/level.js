import * as palettes from '../data/palettes.json';
import hljs from 'highlight.js/lib/core';
import 'highlight.js/styles/vs2015.css';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('html', xml);
import css from 'highlight.js/lib/languages/css';
hljs.registerLanguage('css', css);

class Level {
  constructor(data, desc, wrapper, translations) {
    this.data = data;
    this.translations = translations;
    this.description = desc;
    this.answers = this.data.answers;
    if(this.data.shuffle !== false) {
      this.answers = this.shuffleArray(this.data.answers);
    }

    this.paletteIndex = Math.floor(Math.random() * palettes.content.length);
    this.palette = this.shuffleArray(palettes.content[this.paletteIndex]);
    this.theme = [
      {
        bg: "MediumSpringGreen",
        color: "black"
      },
      {
        bg: "Beige",
        color: "black"
      },
    ];

    this.dom = {
      wrapper: wrapper,
      popup: {
        el: wrapper.querySelector('.popup'),
        main: document.querySelector('.popup__main')
      },
      html: wrapper.querySelector('.snippet--html code'),
      css: wrapper.querySelector('.snippet--css code'),
      answers: wrapper.querySelector('.answers')
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
    let answers = '';
    this.data.answers.forEach((answer, index) => {
      this.setTheme(answer, index);
      specificity += this.setPopupSpecificity(answer, index);
      answers += this.setAnswer(answer, index);
      css += this.setCSS(answer, index);
    });

    this.dom.html.innerHTML = hljs.highlight(this.data.html, {language: 'html'}).value;
    this.dom.css.innerHTML = hljs.highlight(css, {language: 'css'}).value;
    this.setSwatches(this.dom.css);
    this.dom.answers.innerHTML = answers;
    this.dom.btnsArr = this.dom.wrapper.querySelectorAll('.answers__btn');

    setTimeout(() => this.setPopupMsg(specificity), 750);
  }

  bindEvents() {
    this.dom.btnsArr.forEach(btn => {
      btn.addEventListener('click', () => {
        let event = new Event('fail');
        if(btn.classList.contains('answers__btn--good')) {
          event = new Event('success');
        }
        document.body.dispatchEvent(event);
      });
    })
  }

  setTheme(answer, index) {
    this.theme[index].bg = this.palette[index].bg
    if (this.palette[index].color) this.theme[index].color = this.palette[index].color;

    if (answer.bg) {
      this.theme[index].bg = answer.bg;
      this.theme[index].color = "black";
    }
    if (answer.color) this.theme[index].color = answer.color;
  }

  setPopupMsg(specificity) {
    this.dom.popup.main.innerHTML = `
      <table class="popup__specificity">
        <tr>
          <th>${this.translations.selector}</th>
          <th>${this.translations.specificity}</th>
        </tr>
        ${specificity}
      </table>
      <div class="popup__explanations">${this.description}</div>
    `;
  }

  setPopupSpecificity(answer, index) {
    let specificity = `
                      <tr>
                        <td><pre>${answer.selector}</pre></td>
                        <td class="nbr">${answer.specificity}</td>
                      <tr>`;
    if (index < this.answers.length - 1) {
      specificity += '\n';
    }

    return specificity;
  }

  setCSS(answer, index) {
    let css = '';

    if (answer.selector === "style") {
      css += `${answer.selector}="background-color: ${this.theme[index].bg};"`;
    } else {
      css += `${answer.selector} {
  background-color: ${this.theme[index].bg};
}`;
    }

    if (index < this.answers.length - 1) {
      css += '\n\n';
    }

    return css;
  }

  setSwatches(dom) {
    let html = dom.innerHTML;

    this.theme.forEach(theme => {
      const swatch = `<span class="swatch" style="background:${theme.bg};"></span>`;
      html = html.replace(` ${theme.bg}`, ` ${swatch}${theme.bg}`);
    })
    dom.innerHTML = html;
  }

  setAnswer(answer, index) {
    let styles = `background-color: ${this.theme[index].bg};`;
    
    if (this.theme[index].color) {
      styles += `color: ${this.theme[index].color};`;
    }

    let status = answer.good ? "good" : "wrong";

    return `
      <li class="answers__item">
        <button class="answers__btn answers__btn--${status}" style="${styles}">${answer.selector}</button>
      </li>
    `;
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