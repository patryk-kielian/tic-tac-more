"use strict";

import _ from "lodash";

document.querySelector("#copyright-year").innerText = new Date().getFullYear();

const container = document.querySelector(".container");
const gameboard = document.querySelector(".gameboard");
const messageStart = document.querySelector("#start");
const messagePopup = document.querySelector("#popup");
const controls_p1 = document.querySelector("#p1");
const controls_p2 = document.querySelector("#p2");
const confettiDiv = document.querySelector("#tsparticles");

let activePlayer;
let chosenSize;
let p1fields = [];
let p2fields = [];
let fieldSizes = {};
let turnCount = 0;

const winningConditions = [
  ["0", "1", "2"],
  ["3", "4", "5"],
  ["6", "7", "8"],
  ["0", "3", "6"],
  ["1", "4", "7"],
  ["2", "5", "8"],
  ["0", "4", "8"],
  ["2", "4", "6"],
];

const drawBoard = function () {
  let field = [];
  let control_p1 = [];
  let control_p2 = [];
  if (activePlayer) return;
  messageStart.classList.add("hidden");
  messageStart.parentNode.classList.add("hidden");
  for (let i = 0; i <= 8; i++) {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="field" id="field${i}"></div>`
    );
    field[i] = document.querySelector(`#field${i}`);
    field[i].addEventListener("click", place);
  }

  for (let i = 1; i <= 6; i++) {
    controls_p1.insertAdjacentHTML(
      "beforeend",
      `<div class="size size${i} p1" id="p1_size${i}">${i}</div>`
    );
    controls_p2.insertAdjacentHTML(
      "beforeend",
      `<div class="size size${i} p2" id="p2_size${i}">${i}</div>`
    );
    control_p1[i] = document.querySelector(`#p1_size${i}`);
    control_p2[i] = document.querySelector(`#p2_size${i}`);
    control_p1[i].addEventListener("click", choose);
    control_p2[i].addEventListener("click", choose);
  }

  gameboard.classList.remove("hidden");
  activePlayer = 1;
  controls_p1.classList.add("active");
};

["mousedown", "keydown"].forEach((event) =>
  window.addEventListener(event, drawBoard)
);

const checkIfAvailable = function (e) {
  if (e.target.classList.contains("size")) {
    if (chosenSize > fieldSizes[Number(e.target.parentNode.id.slice(-1))]) {
      return true;
    } else {
      popup(`A higher or equal number has already been placed here`);
      return false;
    }
  }

  if (
    chosenSize > fieldSizes[Number(e.target.id.slice(-1))] ||
    !fieldSizes[Number(e.target.id.slice(-1))]
  ) {
    return true;
  } else {
    popup(`A higher or equal number has already been placed here`);
    return false;
  }
};

const choose = function (e) {
  if (activePlayer === Number(e.target.className.slice(-1))) {
    chosenSize = Number(e.target.innerHTML);
  } else {
    popup(`Player ${e.target.className.slice(-1)} is not the active player!`);
  }
};

const place = function (e) {
  if (!chosenSize) {
    console.log(`First select a size`);
    return;
  }

  if (activePlayer === 1 && checkIfAvailable(e)) {
    e.target.innerHTML = `<div class="size nonclick size${chosenSize} p1" id="p1_size${chosenSize}">${chosenSize}</div>`;
    p1fields.push(e.target.id.slice(-1));
    fieldSizes[Number(e.target.id.slice(-1))] = chosenSize;
    document
      .querySelector(`.controls #p${activePlayer}_size${chosenSize}`)
      .classList.add("hidden");
    if (p2fields.includes(e.target.id.slice(-1))) {
      let index = p2fields.indexOf(e.target.id.slice(-1));
      p2fields.splice(index, 1);
    }
    turnCount++;
    if (p1fields.length >= 3) checkIfWon(1, p1fields);
    checkIfDraw();
    activePlayer = 2;
    controls_p1.classList.remove("active");
    controls_p2.classList.add("active");
    chosenSize = null;
  } else if (activePlayer === 2 && checkIfAvailable(e)) {
    e.target.innerHTML = `<div class="size nonclick size${chosenSize} p2" id="p2_size${chosenSize}">${chosenSize}</div>`;
    p2fields.push(e.target.id.slice(-1));
    fieldSizes[Number(e.target.id.slice(-1))] = chosenSize;
    document
      .querySelector(`.controls #p${activePlayer}_size${chosenSize}`)
      .classList.add("hidden");
    if (p1fields.includes(e.target.id.slice(-1))) {
      console.log(p1fields);
      let index = p1fields.indexOf(e.target.id.slice(-1));
      p1fields.splice(index, 1);
    }
    turnCount++;
    if (p2fields.length >= 3) checkIfWon(2, p2fields);
    checkIfDraw();
    activePlayer = 1;
    controls_p2.classList.remove("active");
    controls_p1.classList.add("active");
    chosenSize = null;
  }
};

const checkIfWon = function (playerNr, playerFields) {
  for (let i = 0; i < winningConditions.length; i++) {
    if (winningConditions[i].every((nr) => playerFields.includes(nr))) {
      confettiDiv.classList.remove("hidden");
      confetti();
      popup(`Congratulations! Player ${playerNr} has won!`, 5000);
      gameboard.classList.add("hidden");
      setTimeout(clearBoard, 5000);
    }
  }
};

const checkIfDraw = function () {
  console.log(turnCount);
  if (turnCount >= 12) {
    popup(`The game is a draw. No moves possible!`, 5000);
    gameboard.classList.add("hidden");
    setTimeout(clearBoard, 5000);
  }
};

const popup = function (text, timeout = 2500) {
  messagePopup.parentNode.classList.remove("hidden");
  messagePopup.classList.remove("hidden");
  messagePopup.innerHTML = `${text}`;
  setTimeout(() => {
    messagePopup.parentNode.classList.add("hidden");
    messagePopup.classList.add("hidden");
  }, timeout);
};

const confetti = function () {
  tsParticles.load("tsparticles", {
    particles: {
      color: {
        value: ["#c9232e", "#908fcd", "#fdb827"],
      },
    },
    emitters: [
      {
        startCount: 200,
        rate: {
          delay: 0.1,
          quantity: 10,
        },
        life: {
          duration: 5,
          count: 1,
        },
        position: {
          x: 25,
          y: 20,
        },
        particles: {
          move: {
            direction: "top-right",
          },
        },
      },
      {
        startCount: 200,
        rate: {
          delay: 0.1,
          quantity: 10,
        },
        life: {
          duration: 5,
          count: 1,
        },
        position: {
          x: 75,
          y: 20,
        },
        particles: {
          move: {
            direction: "top-left",
          },
        },
      },
    ],
    preset: "confetti",
  });
};

const clearBoard = function () {
  container.innerHTML = "";
  controls_p1.innerHTML = "";
  controls_p2.innerHTML = "";
  activePlayer = "";
  chosenSize = null;
  p1fields = [];
  p2fields = [];
  fieldSizes = {};
  controls_p2.classList.remove("active");
  controls_p1.classList.add("active");
  messageStart.classList.remove("hidden");
  messageStart.parentNode.classList.remove("hidden");
  confettiDiv.classList.add("hidden");
};
