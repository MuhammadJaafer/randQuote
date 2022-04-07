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
  }
  async _getNewQuote() {
    const res = await fetch("https://api.fisenko.net/v1/quotes/en/random");
    const slip = await res.json();
    console.log(slip);
  }
  _displayNewQuote() {}
  _copyCurrentQuote() {}
  _saveCurrentQuote() {}
}
const app = new App();
