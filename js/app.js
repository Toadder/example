(function () {
  var proto = HTMLElement.prototype,
    addEventListener = proto.addEventListener,
    removeEventListener = proto.removeEventListener;

  proto.addEventListener = function (type, callback, useCapture) {
    if (!this._listeners) {
      this._listeners = {};
    }
    if (!(type in this._listeners)) {
      this._listeners[type] = [];
    }

    if (this._listeners[type].indexOf(callback) === -1) {
      this._listeners[type].push(callback);
    }

    addEventListener.call(this, type, callback, useCapture);
  };

  proto.removeEventListener = function (type, callback, useCapture) {
    var index =
      this._listeners && type in this._listeners
        ? this._listeners[type].indexOf(callback)
        : -1;

    if (index !== -1) {
      this._listeners[type].splice(index, 1);
    }

    removeEventListener.call(this, type, callback, useCapture);
  };

  proto.hasEventListener = function (type) {
    return !!(
      (this._listeners &&
        type in this._listeners &&
        this._listeners[type].length) ||
      typeof this["on" + type] === "function"
    );
  };
})();

function interactiveImage(selector, itemsArray) {
  const wrapper = document.querySelector(selector);
  const bg = wrapper.querySelector("img");
  const pinsArray = [];
  const cardsArray = [];

  wrapper.classList.add("_interactive");
  bg.classList.add("_interactive__bg");

  window.onload = initItems(wrapper, bg);

  if (window.innerWidth > 1200) {
    wrapper.addEventListener("mouseover", hoverMode);
  } else {
    for (let i = 0; i < pinsArray.length; i++) {
      const pin = pinsArray[i];
      pin.addEventListener("click", popupMode);
    }
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1200) {
      for (let i = 0; i < pinsArray.length; i++) {
        pinsArray[i].removeEventListener("click", popupMode);
      }

      if (!wrapper.hasEventListener("mouseover")) {
        wrapper.addEventListener("mouseover", hoverMode);
      }
    } else {
      wrapper.removeEventListener("mouseover", hoverMode);
      for (let i = 0; i < pinsArray.length; i++) {
        const pin = pinsArray[i];
        if (!pin.hasEventListener("click")) {
          pin.addEventListener("click", popupMode);
        }
      }
    }
  });

  // Создание кружка
  function createPin() {
    const pin = document.createElement("div");
    pin.className = "_interactive__pin";

    return pin;
  }

  // Создание карточки с контентом
  function createCard(itemObject) {
    const card = document.createElement("div");
    card.className = "_interactive__card";

    card.innerHTML = `
        <div class="_interactive__inner">
          <div class="_interactive__close"></div>
          <a class="_interactive__title" href="${itemObject.href}">
            ${itemObject.title}
          </a>
          <div class="_interactive__img">
            <img src="${itemObject.imgPath}">
          </div>
        </div>
    `;

    return card;
  }

  // Создание и вывод элементоgв на картинку
  function initItems(wrapper, bg) {
    const width = bg.naturalWidth;
    const height = bg.naturalHeight;

    // Sizes on desktop
    const pinSize = window.innerWidth > 767.98 ? 28 : 18;
    const cardWidth = 230;

    for (let i = 0; i < itemsArray.length; i++) {
      const itemObject = itemsArray[i];
      const xPos = itemObject.position[0];
      const yPos = itemObject.position[1];

      if (xPos + pinSize >= width || yPos + pinSize >= height) {
        continue;
      }

      const pin = createPin(itemObject, bg);
      const card = createCard(itemObject);

      pin.setAttribute("data-id", i);
      pin.style.top = `${(yPos / height) * 100}%`;
      pin.style.left = `${(xPos / width) * 100}%`;

      card.setAttribute("data-id", i);
      card.style.top = `${((yPos + pinSize) / height) * 100}%`;
      card.style.left = `${
        ((xPos - (cardWidth - pinSize) / 2) / width) * 100
      }%`;

      pinsArray.push(pin);
      cardsArray.push(card);
      console.log("Элемент создан");

      wrapper.append(pin, card);
    }
  }

  // Hover Мод (Режим наведения на pin)
  function hoverMode(event) {
    const target = event.target;

    if (
      target.classList.contains("_interactive__pin") ||
      target.closest("._interactive__card")
    ) {
      const el = target.closest("._interactive__card") || target;
      const { id } = el.dataset;

      const card = findCurrent(cardsArray, id);
      const pin = findCurrent(pinsArray, id);

      card.classList.add("_active");
      pin.classList.add("_active");
    } else {
      removeActive();
    }
  }

  // Popup Mode (Мод попапа)
  function popupMode() {
    const currentCard = findCurrent(cardsArray, this.dataset.id);

    currentCard.classList.add("_active");
    document.body.classList.add("_lock");

    currentCard.addEventListener("click", (e) => {
      if (
        !e.target.closest("._interactive__inner") ||
        e.target.classList.contains("_interactive__close")
      ) {
        currentCard.classList.remove("_active");
        document.body.classList.remove("_lock");
      }
    });
  }

  // Находит текущий элемент по id
  function findCurrent(array, id) {
    return array.filter((el) => el.dataset.id == id)[0];
  }

  // Убрать все активные элементы
  function removeActive() {
    for (let i = 0; i < pinsArray.length; i++) {
      pinsArray[i].classList.remove("_active");
      cardsArray[i].classList.remove("_active");
    }
  }
}

const items = [
  {
    title: "Привет, мир!",
    href: "https://google.com",
    imgPath: "img/2.jpg",
    position: [200, 300],
  },
  {
    title: "Держатель для полотенец",
    href: "https://google.com",
    imgPath: "img/2.jpg",
    position: [700, 500],
  },
  {
    title: "Держатель для полотенец",
    href: "https://google.com",
    imgPath: "img/2.jpg",
    position: [500, 200],
  },
];

interactiveImage("#example", items);
