const quoteTextEl = document.querySelector("#quote--text");
const quoteTextContainerEl = document.querySelector(".quote--text");
const quoteAuthorEl = document.querySelector("#quote--outher");
const newQuoatBtnEl = document.querySelector("#quote--btn");
const copyBtnEl = document.querySelector("#copy--btn");
const saveBtnEl = document.querySelector("#save--btn");
const translateBtnEl = document.querySelector("#translate--btn");
const popupEl = document.querySelector("#custom-tooltip");
const captureEl = document.querySelector(".quote--container");
const authorLinkEl = document.querySelector("#auther--link");
const tooFastEl = document.querySelector(".too-fast");
// >>>>>>>>>>>>>>>>>>>>>>>> //

class App {
  #newquote = true;
  #currentQuote;
  #currentQuoteAr;
  #currentAuthor;
  #lang = "en";
  #timeOut = 1;
  constructor() {
    this._getNewQuote();
    newQuoatBtnEl.addEventListener("click", this._getNewQuote.bind(this));
    copyBtnEl.addEventListener("click", this._copyCurrentQuote.bind(this));
    saveBtnEl.addEventListener("click", this._saveCurrentQuote.bind(this));
    translateBtnEl.addEventListener("click", this._changeLang.bind(this));
  }
  async _getNewQuote() {
    try {
      if (!this.#newquote) {
        tooFastEl.style.opacity = 100;
        setTimeout(
          () => (tooFastEl.style.opacity = 0),
          (this.#timeOut - 0.3) * 1000
        );
        return;
      }
      this._timeOut(this.#timeOut);
      this._clear();
      this._displayspinner();
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();
      this.#currentQuote = data.content;
      this.#currentAuthor = data.author;
      this._displayNewQuote(this.#currentQuote, this.#currentAuthor);
      if (data.length > 200) throw new Error("too long quote");
    } catch (err) {
      throw err;
    }
  }
  async _timeOut(sec) {
    this.#newquote = false;
    setTimeout(() => {
      this.#newquote = true;
    }, sec * 1000);
  }
  _clear() {
    quoteAuthorEl.textContent = "";
    quoteTextEl.textContent = "";
  }
  _clearspinner() {
    document.querySelector(".spinner").remove();
  }
  _displayspinner() {
    const markup = `
    <div class="spinner">
                <img src="./icons/loading-spinner.svg" alt="" />
              </div>
    `;
    quoteTextContainerEl.insertAdjacentHTML("afterbegin", markup);
  }
  async _displayNewQuote(quote, author) {
    try {
      this._clearspinner();
      this.#lang = "en";
      quoteTextEl.style.fontFamily = "'Marck Script', serif";
      quoteTextEl.textContent = quote;
      quoteAuthorEl.textContent = author;
      authorLinkEl.href = `https://en.wikipedia.org/wiki/${author}`;
      await this._translateCurrentQuote(this.#currentQuote);
    } catch (err) {
      console.log(err);
    }
  }
  _changeLang() {
    if (this.#currentQuoteAr) {
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
console.log("what are you looking for :)");
