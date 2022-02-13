// Data
import * as translations from '../data/en';
import ogImageURLen from '../img/og-en.png';
import ogImageURLfr from '../img/og-fr.png';

class Lang {
  constructor() {
    this.supportedLanguages = ['en', 'fr']; // 0 = fallback language
    this.translations = translations; // Default en

    this.url = {
      params: new URLSearchParams(window.location.search)
    };

    this.dom = {
      languageSelect: document.querySelector('.lang')
    }

    this.init();
  }

  init() {
    this.getLanguage();
    this.setLanguage();
    this.bindEvents();
  }

  getLanguage() {
    const urlLangParam = this.url.params.get('lang');

    if (urlLangParam !== null) { // URL Language
      this.language = urlLangParam;
    } else {
      const savedLang = localStorage.getItem('language');

      if (savedLang !== null) { // Saved language
        this.language = savedLang; 
      } else { // Browser language
        this.language = navigator.language.substring(0,2).toLowerCase();
      }
    }

    // Make sure the language is supported, if not fallback to the first language supported
    this.language = this.supportedLanguages.includes(this.language) ? this.language : this.supportedLanguages[0];
  }

  setLanguage(language = this.language) {
    this.language = language;
    localStorage.setItem('language', language); // Save language in localStorage
    this.url.params.set('lang', language); // Set URL param
    document.documentElement.lang = language; // Set HTML attribute

    if (this.dom.languageSelect) { // Set languages dropdown
      this.dom.languageSelect.value = language;
    }

    const event = new Event('translationnotsready');
    document.body.dispatchEvent(event);

    if(this.language === 'en') {
      this.translations = translations;
      this.populate();
    } else {
      this.loadTranslations();
    }
  }

  loadTranslations() {
    fetch(`./src/data/${this.language}.json`)
    .then(res => res.json())
    .then(translations => {
      this.translations = translations;
      this.populate();
    });
  }

  populate() {
    this.setOpenGraph();
    this.setTranslations();

    const translations = this.translations;

    const event = new CustomEvent('translationsready', {
      detail: translations
    });
    document.body.dispatchEvent(event);
  }
  
  setOpenGraph() {
    document.querySelector('meta[property="og:title"]').content = this.translations.title;
    document.querySelector('meta[property="og:description"]').content = this.translations.slogan;

    document.querySelector('meta[property="og:image"]').content = this.language === 'en' ? new URL(ogImageURLen, import.meta.url).href : new URL(ogImageURLfr, import.meta.url).href;
  }

  setTranslations() {
    this.texts = {
      level: {
        label: document.querySelector('.level__label'),
        of: document.querySelector('.level__of'),
      },
      header: {
        title: document.querySelector('.header__title'),
        intro: document.querySelector('.header__intro')
      },
      footer: {
        reset: document.querySelector('.reset'),
        credits: document.querySelector('.footer__credits')
      },
      score: {
        label: document.querySelector('.score__label'),
      },
      popup: {
        congratulation: document.querySelector('.congratulation'),
        quizCompleted: document.querySelector('.popup__quiz-completed'),
        next: document.querySelector('.popup__next'),
        showResult:document.querySelector('.popup__show-result'),
        randomQuestions: document.querySelector('.popup__random-questions')
      },
    };

    this.texts.level.label.innerText = this.translations.level;
    this.texts.level.of.innerText = this.translations.of;
    this.texts.header.title.innerText = document.title = this.translations.title;
    this.texts.header.intro.innerHTML = this.translations.intro;
    this.texts.score.label.innerText = this.translations.score;
    this.texts.footer.reset.innerHTML = this.translations.reset;
    this.texts.footer.credits.innerHTML = this.translations.credits;
    this.texts.popup.congratulation.innerText = this.translations.congratulation;
    this.texts.popup.quizCompleted.innerText = this.translations['quiz-completed'];
    this.texts.popup.next.innerText = this.translations['next-question'];
    this.texts.popup.showResult.innerText = this.translations['show-result'];
    this.texts.popup.randomQuestions.innerText = this.translations['questions-in-random-order'];
  }

  bindEvents() {
     if (this.dom.languageSelect) {
      this.dom.languageSelect.addEventListener('change', () => {
        this.setLanguage(this.dom.languageSelect.value);
      }, false);
    }
  }
}

export { Lang as default }