"use strict";

import _ from "lodash";

const container = document.querySelector(".container");
const message = document.querySelector(".message");
const controls_p1 = document.querySelector("section#p1");
const controls_p2 = document.querySelector("section#p2");

let activePlayer;
let chosenSize;
let p1fields = [];
let p2fields = [];
let fieldSizes = {};

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
  message.classList.add("hidden");
  for (let i = 0; i <= 8; i++) {
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="field" id="field${i}"></div>`
    );
    field[i] = document.querySelector(`#field${i}`);
    field[i].addEventListener("click", place);
    // i % 3 == 0 ? container.insertAdjacentHTML("beforeend", `<br>`) : "";
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

  activePlayer = 1;
  console.log(field);
  container.classList.remove("transparent");
  controls_p1.classList.remove("transparent");
  controls_p2.classList.remove("transparent");
};

["mousedown", "keydown"].forEach((event) =>
  window.addEventListener(event, drawBoard)
);

const checkIfAvailable = function (e) {
  // console.log(Number(e.target.id.slice(-1)));
  // console.log(e);
  // console.log(fieldSizes[Number(e.target.id.slice(-1))]);
  if (e.target.classList.contains("size")) {
    if (chosenSize > fieldSizes[Number(e.target.parentNode.id.slice(-1))]) {
      return true;
    } else console.log(`A higher number has already been placed here`);
    return false;
  }

  if (
    chosenSize > fieldSizes[Number(e.target.id.slice(-1))] ||
    !fieldSizes[Number(e.target.id.slice(-1))]
  ) {
    return true;
  } else console.log(`A higher number has already been placed here`);
  return false;
};

const choose = function (e) {
  if (activePlayer === Number(e.target.className.slice(-1))) {
    chosenSize = Number(e.target.innerHTML);
  } else {
    console.log(
      `Player ${e.target.className.slice(-1)} is not the active player!`
    );
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
    console.log("p1", p1fields);
    // console.log(fieldSizes);
    document
      .querySelector(`.controls #p${activePlayer}_size${chosenSize}`)
      .classList.add("hidden");
    if (p2fields.includes(e.target.id.slice(-1))) {
      let index = p2fields.indexOf(e.target.id.slice(-1));
      p2fields.splice(index, 1);
    }
    if (p1fields.length >= 3) checkIfWon(1, p1fields);
    activePlayer = 2;
    chosenSize = null;
  } else if (activePlayer === 2 && checkIfAvailable(e)) {
    e.target.innerHTML = `<div class="size nonclick size${chosenSize} p2" id="p2_size${chosenSize}">${chosenSize}</div>`;
    p2fields.push(e.target.id.slice(-1));
    fieldSizes[Number(e.target.id.slice(-1))] = chosenSize;
    console.log("p2", p2fields);
    // console.log(fieldSizes);
    document
      .querySelector(`.controls #p${activePlayer}_size${chosenSize}`)
      .classList.add("hidden");
    if (p1fields.includes(e.target.id.slice(-1))) {
      console.log(p1fields);
      let index = p1fields.indexOf(e.target.id.slice(-1));
      p1fields.splice(index, 1);
    }
    if (p2fields.length >= 3) checkIfWon(2, p2fields);
    activePlayer = 1;
    chosenSize = null;
  }
};

const checkIfWon = function (playerNr, playerFields) {
  console.log(playerFields);
  for (let i = 0; i < winningConditions.length; i++) {
    if (winningConditions[i].every((nr) => playerFields.includes(nr))) {
      console.log(`Congratulations. Player ${playerNr} has won!`);
      container.classList.add("transparent");
      setTimeout(clearBoard, 2000);
    }
  }
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
};
