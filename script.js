const quoteTextEl = document.querySelector("#quote--text");
const quoteAuthorEl = document.querySelector("#quote--outher");
const newQuoatBtnEl = document.querySelector("#quote--btn");
const copyBtnEl = document.querySelector("#copy--btn");
const saveBtnEl = document.querySelector("#save--btn");
// >>>>>>>>>>>>>>>>>>>>>>>> //

class App {
  #currentQuote;
  #currentAuthor;
  constructor() {
    this._getNewQuote();
    newQuoatBtnEl.addEventListener("click", this._getNewQuote.bind(this));
  }
  async _getNewQuote() {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    this.#currentQuote = data.content;
    this.#currentAuthor = data.author;
    this._displayNewQuote(this.#currentQuote, this.#currentAuthor);
  }
  _displayNewQuote(quote, author) {
    quoteTextEl.textContent = quote;
    quoteAuthorEl.textContent = author;
  }
  _copyCurrentQuote() {}
  _saveCurrentQuote() {}
}
const app = new App();
