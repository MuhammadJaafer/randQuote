const quoteTextEl = document.querySelector("#quote--text");
const quoteAuthorEl = document.querySelector("#quote--outher");
const newQuoatBtnEl = document.querySelector("#quote--btn");
const copyBtnEl = document.querySelector("#copy--btn");
const saveBtnEl = document.querySelector("#save--btn");
const translateBtnEl = document.querySelector("#translate--btn");
const popupEl = document.querySelector("#custom-tooltip");
const captureEl = document.querySelector(".quote--container");
const authorLinkEl = document.querySelector("#auther--link");

// >>>>>>>>>>>>>>>>>>>>>>>> //

class App {
  
  #currentQuote;
  #currentQuoteAr;
  #currentAuthor;
  #lang = "en";
  constructor() {
    this._getNewQuote();
    newQuoatBtnEl.addEventListener("click", this._getNewQuote.bind(this));
    copyBtnEl.addEventListener("click", this._copyCurrentQuote.bind(this));
    saveBtnEl.addEventListener("click", this._saveCurrentQuote.bind(this));
    translateBtnEl.addEventListener("click", this._changeLang.bind(this));
  }
  async _getNewQuote() {
    try {
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();
      if (data.length > 200) throw new Error("too long quote");
      this.#currentQuote = data.content;
      this.#currentAuthor = data.author;
      this._displayNewQuote(this.#currentQuote, this.#currentAuthor);
    } catch (err) {
      if ((err = "too long quote")) this._getNewQuote();
    }
  }
  async _displayNewQuote(quote, author) {
    this.#lang = "en";
    quoteTextEl.style.fontFamily = "'Marck Script', serif";
    quoteTextEl.textContent = quote;
    quoteAuthorEl.textContent = author;
    await this._translateCurrentQuote(this.#currentQuote);
    authorLinkEl.href = `https://en.wikipedia.org/wiki/${author}`;
  }
  _changeLang() {
    if (this.#lang === "ar") {
      quoteTextEl.style.fontFamily = "'Marck Script', serif";
      quoteTextEl.textContent = this.#currentQuote;
      this.#lang = "en";
    } else if (this.#lang === "en") {
      quoteTextEl.style.fontFamily = "'Aref Ruqaa', serif";
      quoteTextEl.textContent = this.#currentQuoteAr;
      this.#lang = "ar";
    }
  }
  _copyCurrentQuote() {
    const el = document.createElement("textarea");
    el.value = this.#currentQuote;
    el.setAttribute("readonly", "");
    el.style.opacity = 0;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    popupEl.textContent = "copied!";
    popupEl.style.opacity = 100;
    setTimeout(() => {
      popupEl.style.opacity = 0;
    }, 1500);
  }
  async _saveCurrentQuote() {
    popupEl.textContent = "saving...";
    popupEl.style.opacity = 100;
    setTimeout(() => {
      popupEl.style.opacity = 0;
    }, 1500);
    const canvas = await html2canvas(captureEl, {
      backgroundColor: "#FFD43A",
    });
    const img = canvas.toDataURL("image/wpeg", 1);
    const image = await fetch(img);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement("a");
    link.href = imageURL;
    link.download = this.#currentAuthor;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  async _translateCurrentQuote(quotText) {
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: quotText,
        source: "en",
        target: "ar",
        format: "text",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    this.#currentQuoteAr = data.translatedText;
  }
}
const app = new App();
