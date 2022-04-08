const quoteTextEl = document.querySelector("#quote--text");
const quoteAuthorEl = document.querySelector("#quote--outher");
const newQuoatBtnEl = document.querySelector("#quote--btn");
const copyBtnEl = document.querySelector("#copy--btn");
const saveBtnEl = document.querySelector("#save--btn");
const popupEl = document.querySelector("#custom-tooltip");
const captureEl = document.querySelector(".quote--container");
const authorLinkEl = document.querySelector("#auther--link");
// >>>>>>>>>>>>>>>>>>>>>>>> //

class App {
  #currentQuote;
  #currentAuthor;
  constructor() {
    this._getNewQuote();
    newQuoatBtnEl.addEventListener("click", this._getNewQuote.bind(this));
    copyBtnEl.addEventListener("click", this._copyCurrentQuote.bind(this));
    saveBtnEl.addEventListener("click", this._saveCurrentQuote.bind(this));
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
  _displayNewQuote(quote, author) {
    quoteTextEl.textContent = quote;
    quoteAuthorEl.textContent = author;
    authorLinkEl.href = `https://en.wikipedia.org/wiki/${author}`;
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
}
const app = new App();
