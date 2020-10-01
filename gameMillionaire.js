'use strict';

let mainGame = document.querySelector('.game-block'),
    gameWrapper = document.querySelector('.game-wrap'),
    startBtn = document.querySelector('.start-btn'),
    endBtn = document.querySelector('.end-btn'),
    btnAnswers = document.querySelectorAll('.answer'),
    blocksQuestion = document.querySelectorAll('.question'),
    helpBtns = document.querySelectorAll('.hints-help'),
    winBlock = document.querySelectorAll('.wins-block'),
    helpFifty = document.querySelector('.fifty-fifty'),
    helpHall = document.querySelector('.hall-help'),
    helpFriend = document.querySelector('.call-friend');

//Кнопка конец игры
endBtn.addEventListener('click', () => {
  mainGame.classList.remove('animate__backInUp');
  gameWrapper.classList.remove('animate__flipInX');
  mainGame.classList.add('animate__animated', 'animate__backOutDown');
  setTimeout(() => {
    mainGame.style.display = 'none';
    startBtn.style.display = 'block';
    startBtn.classList.remove('animate__backOutUp');
    startBtn.classList.add('animate__backInDown');
  }, 1000);
  setTimeout(() => {
    startBtn.classList.remove('animate__backInDown');
  }, 2000);
  
  // Находим блок с текстом выигрыша
  let userWin = document.querySelector('.user-win');
  // Если он есть, то удаляем его
  if(userWin) {
    userWin.remove();
  }

  // Убираем все активные классы с ответов
  getStartGame();
});


// Начало игры
startBtn.addEventListener('click', () => {
  startBtn.classList.add('animate__animated', 'animate__backOutUp');
  mainGame.classList.remove('animate__backOutDown');
  setTimeout(() => {
    mainGame.style.display = 'block';
    mainGame.classList.add('animate__animated', 'animate__backInUp');
    startBtn.style.display = 'none';
    setTimeout(() => {
      gameWrapper.classList.add('animate__animated', 'animate__flipInX');
      endBtn.style.left = (blocksQuestion[0].offsetWidth - endBtn.offsetWidth) / 2 + 'px';
    }, 1000);
  }, 500);
  setTimeout(() => {
    endBtn.style.opacity = '1';
  }, 1000);
});


// Метод forEach, который перебирает все блоки с ответами
btnAnswers.forEach((btnAnswer) => {
  // Слушатель событий на каждый блок(ответ)
  btnAnswer.addEventListener('click', (e) => {
    // numberQuestion - при клике отлавливаем имя блока с вопросом
    let numberQuestion = btnAnswer.parentElement.parentElement.classList[1];
    // userAnswer - при клике считываем текст(ответ) с блока
    let userAnswer = e.target.innerText;
    // blockAnswer - при клике получаем блок по которому кликнули
    let blockAnswer = e.target;

    // blockQuestionParentElement - блок, в котором лежат все ответы
    let blockQuestionParentElement = blockAnswer.parentElement;
    // После клика по блоку с ответом, делаем запрет на повторный клик
    blockQuestionParentElement.classList.add('block-event');

    // Передаем нужные параметры в функцию для проверки
    correctnessAnswer(numberQuestion, userAnswer, blockAnswer, blockQuestionParentElement);
  });
});

// Событие отслеживает, есть ли вложенный элемент при наведении мыши,
// если есть, скидывает ширину на ноль
btnAnswers.forEach((item) => {
  item.addEventListener('mouseover', () => {
    if(item.children[0]) {
      item.children[0].style.display = 'none';
      item.classList.remove('color-active');
    }
  });
});

// Подсказка 50/50
helpFifty.addEventListener('click', function removeTwoBlocks() {
  // Вызываем функцию для получения блока с вопросом
  // на котором находится пользователь
  let blockActiveQuestion = getActiveBlockQuestion();

  // numRandom - случайное число от 0 - 3
  let numRandom = Math.floor(Math.random() * blockActiveQuestion.children[1].children.length);

  // blockChildrenAnswer - объект с ответами
  let blockChildrenAnswer = blockActiveQuestion.children[1].children;

  // nameQuestion - имя вопроса(string)
  let nameQuestion = blockActiveQuestion.classList[1];

  // Вызываем функцию для получения блока с правильным ответом
  let blockCorrectAnswer = getBlockAnswer(blockChildrenAnswer, nameQuestion);
  blockCorrectAnswer.classList.add('fifty-active');

  // Вызываем функцию для получения случайного блока с ответом
  let blockRandom = getBlockRandom(blockChildrenAnswer, blockCorrectAnswer, numRandom);
  blockRandom.classList.add('fifty-active');

  // Вызываем функцию, которая отсеит не нужные блоки
  removeBlocks(blockChildrenAnswer);
  // Показываем запрет на блок и выключаем слушатель события
  helpFifty.classList.add('hints-help_spent', 'block-event');
});

// Подсказка помощь зала
helpHall.addEventListener('click', function getHelpHall() {

  // Вызываем функцию, которая вернет активный блок с вопросом на котором находится пользователь
  let blockActiveQuestion = getActiveBlockQuestion();
  // blockActiveQuestionChild - объект с ответами
  let blockActiveQuestionChild = blockActiveQuestion.children[1];
  checkBlockChild(blockActiveQuestionChild);

  // Вызываем цикл, который вставляет в блоки с ответами HTML разметку
  for(let i = 0; i < blockActiveQuestionChild.children.length; i++) {
    // percentageRandom - случайное число, которое даст блоку ширину
    let percentageRandom = Math.floor(Math.random() * 101);
    // вставляем разметку
    blockActiveQuestionChild.children[i].insertAdjacentHTML('afterbegin', '<div class="answer-active"></div>');
    // Вызываем функцию, которая закрасит ответы
    setTimeout(() => {
      blockActiveQuestionChild.children[i].children[0].style.width = percentageRandom + '%';
      blockActiveQuestionChild.children[i].classList.add('color-active');
    }, 1000);
  }

  // Показываем запрет на блок и выключаем слушатель события
  helpHall.classList.add('hints-help_spent', 'block-event');
});

// Подсказка звонок другу
helpFriend.addEventListener('click', function getHelpFrien() {
  // Вызываем функцию, которая вернет активный блок с вопросом на котором находится пользователь
  let blockActiveQuestion = getActiveBlockQuestion();
  // blockActiveQuestionChild - объект с ответами
  let blockActiveQuestionChild = blockActiveQuestion.children[1];
  // Вызываем функцию для проверки, наличия потомка в блоке с ответом
  checkBlockChild(blockActiveQuestionChild);

  // Функция возвращает случайное число от 0 - 3 и проверяет количество блоков(если они скрыты)
  let numRandom = getActiveBlockLength(blockActiveQuestionChild);
  
  // Случайное число от "мин" - 100
  let percentageRandom = getRandom(100, 100);

  // Добавляем разметку случайному блоку
  blockActiveQuestionChild.children[numRandom].insertAdjacentHTML('afterbegin', '<div class="answer-active"></div>');
  setTimeout(() => {
    blockActiveQuestionChild.children[numRandom].children[0].style.width = percentageRandom + '%';
    blockActiveQuestionChild.children[numRandom].classList.add('color-active');
  }, 1000);

  // Показываем запрет на блок и выключаем слушатель события
  helpFriend.classList.add('hints-help_spent', 'block-event');
});

// Функция обнуляет настройки игры и запускает игру сначала
function getStartGame() {
  getStartQuestions();
  getStartBlockAnswers();
  getStartBlockWins();
  getStartBlocksHelp();

}

// Обнулить блоки с вопросами
function getStartQuestions() {
  for(let i = 0; i < blocksQuestion.length; i++) {
    blocksQuestion[i].children[1].classList.remove('block-event');
    blocksQuestion[i].classList.remove('animate__fadeOut');
    if(blocksQuestion[i].classList.contains('question-active')) {
      blocksQuestion[i].classList.remove('question-active');
    }
    blocksQuestion[0].classList.add('question-active');
  }
}

// Обнулить блоки с ответами
function getStartBlockAnswers() {
  for(let i = 0; i < btnAnswers.length; i++) {
    if(btnAnswers[i].children[0]) {
      btnAnswers[i].children[0].remove();
    }
    btnAnswers[i].classList.remove('green-bg', 'error-answer', 'fifty-active', 'animate__zoomOut', 'color-active');
  }
}

// Обнулить блоки с выигрышем
function getStartBlockWins() {
  for(let i = 0; i < winBlock.length; i++) {
    winBlock[i].classList.remove('wins-active', 'animate__animated', 'animate__pulse', 'win-guaranteed', 'animate__tada', 'animate__heartBeat');
  }
}

// Обнулить блоки подсказок
function getStartBlocksHelp() {
  for(let i = 0; i < helpBtns.length; i++) {
    helpBtns[i].classList.remove('block-event', 'hints-help_spent');
  }
}


// функция получает нужные параметры и проверяет правильность ответа
function correctnessAnswer(numberQuestion, userAnswer, blockAnswer, blockQuestionParentElement) {
  // Если ответ правильный, красим блок в зеленый цвет
  if(answers[numberQuestion] === userAnswer) {
    setTimeout(() => {
      blockAnswer.classList.add('green-bg');
    }, 500);
    // Если не правильный - в красный
  } else {
    setTimeout(() => {
      blockAnswer.classList.add('error-answer');
      setTimeout(() => {
        // Вызываем функцию для закрашивания правильного блока
        let blockAnswer = getBlockAnswer(blockQuestionParentElement.children, numberQuestion);
        blockAnswer.classList.add('green-bg');
      }, 1000);
    }, 500);
    // Вызываем функцию для скрытия блока с ответами и показываем выигрышь
    setTimeout(() => {
      getRemoveClassName();
    }, 3500);
    return;
  }
  // Вызываем функцию для показа нового вопроса
  setTimeout(() => {
    getBlockQuestion();
  }, 2000);
}


// Функция скрывает блок с вопросом
function getRemoveClassName() {
  for(let i = 0; i < blocksQuestion.length; i++) {
    if(blocksQuestion[i].classList.contains('question-active')) {
      blocksQuestion[i].classList.add('animate__animated', 'animate__fadeOut');
      blocksQuestion[i].classList.remove('question-active');

      getBlockBefore(blocksQuestion[i]);
    }
  }
}

// Функция вставляет блок с выигрышем в разметку
function getBlockBefore(block) {
  block.insertAdjacentHTML('beforebegin', `<div class="user-win animate__animated animate__fadeIn"><p>Ваш выигрыш</p><p>"${getGarantWin()}"</p></div>`);
}

// Функция проверяет гарантированный выигрыш и выводит результат
function getGarantWin() {
  for(let i = 0; i < winBlock.length; i++) {
    if(winBlock[i].classList.contains('win-guaranteed')) {
      let getUserWin = winBlock[i].innerText;
      for(let symbol of getUserWin) {
        if(symbol === '.') {
          getUserWin = '';
          continue;
        }
        getUserWin += symbol;
      }
      return getUserWin + ' ₽';
    }
  }
  return 0;
}

// Функция находит блок с правильным ответом и красит его в зеленый цвет
function getBlockAnswer(blockChildrenElem, numberQuestion) {
  for(let i = 0; i < blockChildrenElem.length; i++) {
    if(blockChildrenElem[i].innerText === answers[numberQuestion]) {
      return blockChildrenElem[i];
    }
  }
}

// Функция скрывает блок с вопросами и показывает новый блок
function getBlockQuestion() {
  for(let i = 0; i <= blocksQuestion.length; i++) {
    if(i ===  blocksQuestion.length - 1) {
      getWinBlock(i + 1);
      return;
    }
    if(blocksQuestion[i].classList.contains('question-active')) {
      blocksQuestion[i].classList.add('animate__fadeOut');
      blocksQuestion[i].classList.remove('question-active', 'animate__animated', 'animate__pulse');
      
      setTimeout(() => {
          blocksQuestion[++i].classList.add('question-active', 'animate__animated', 'animate__pulse');
          getWinBlock(i);
      }, 200);
      return;
    }
  }
}

// Функция добавляет класс к блоку с выигрышем
function getWinBlock(num) {
  let numBlock = (winBlock.length) - num;
  if(numBlock === 10 || numBlock === 5) {
    winBlock[numBlock + 1].classList.remove('wins-active');
    winGuaranteed(numBlock);
  } 
  else if(numBlock === 14) {
    winBlock[numBlock].classList.add('wins-active', 'animate__animated', 'animate__pulse');
  }
  else if(numBlock === 0) {
    winBlock[numBlock + 1].classList.remove('wins-active');
    winBlock[numBlock].classList.add('animate__animated', 'animate__heartBeat', 'win-guaranteed');
    winGuaranteed(numBlock);
    setTimeout(() => {
      getRemoveClassName();
    }, 200);
  }
  else {
    winBlock[numBlock + 1].classList.remove('wins-active');
    winBlock[numBlock].classList.add('wins-active', 'animate__animated', 'animate__pulse');
  }
}


// Функция закрашивает не сгораемую сумму
function winGuaranteed(numBlock) {
  if(numBlock === 10) {
    winBlock[10].classList.add('animate__animated', 'animate__tada', 'win-guaranteed');
  }
  if(numBlock === 5) {
    winBlock[10].classList.remove('animate__animated', 'animate__tada', 'win-guaranteed');
    winBlock[5].classList.add('animate__animated', 'animate__tada', 'win-guaranteed');
  }
  if(numBlock === 0) {
    winBlock[5].classList.remove('animate__animated', 'animate__tada', 'win-guaranteed');
  }
}

// Функция находит блок с вопросом на котором находится пользователь
function getActiveBlockQuestion() {
  for(let i = 0; i <= blocksQuestion.length; i++) {
    if(blocksQuestion[i].classList.contains('question-active')) {
      return blocksQuestion[i];
    }
  }
}

// Функция возвращает случайный блок с ответом
function getBlockRandom(blockChildrenAnswer, blockCorrectAnswer, numRandom) {
  for(let i = 0; i < blockChildrenAnswer.length; i++) {
    // Проверяем если случайный блок совпал с блоком правильный ответ,
    // то меняем его на другой
    if(blockChildrenAnswer[numRandom] === blockCorrectAnswer) {
      if(numRandom === blockChildrenAnswer.length - 1) {
        numRandom -= 1;
      } else if (numRandom === 0) {
        numRandom += 1;
      } else {
        numRandom += 1;
      }
    }
    // Возвращаем случайный блок с ответом
    return blockChildrenAnswer[numRandom];
  }
}

// Функция убирает не нужные блоки
function removeBlocks(blockChildrenAnswer) {
  for(let i = 0; i < blockChildrenAnswer.length; i++) {
    if(!blockChildrenAnswer[i].classList.contains('fifty-active')) {
      blockChildrenAnswer[i].classList.add('animate__animated', 'animate__zoomOut');
    }
  }
}

// Функция возвращает случайное число от мин до макс
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Функция проверяет, есть ли потомок в блоке с ответом
function checkBlockChild(parentBlock) {
  for(let i = 0; i < parentBlock.children.length; i++) {
    if(parentBlock.children[i].children[0]) {
      parentBlock.children[i].children[0].style.width = 0;
      parentBlock.children[i].classList.remove('color-active');
      setTimeout(() => {
        parentBlock.children[i].children[0].remove();
      }, 1000);
    }
  }
}

// Функция проверяет количество ответов, которые активны
function getActiveBlockLength(parentChild) {
  // массив с индексом блоков, которые содержат класс "fifty-active"
  let arrActiveAnswer = [];
  // Цикл проверяет наличие класса в каждом блоке
  for(let i = 0; i < parentChild.children.length; i++) {
    if(parentChild.children[i].classList.contains('fifty-active')) {
      arrActiveAnswer.push(i);
    }
  }
  if(arrActiveAnswer.length > 0) {
    // Возвращаем случайное число из массива
    let numIndexRandom = Math.floor(Math.random() * arrActiveAnswer.length);
    return arrActiveAnswer[numIndexRandom];
  }
  // Возвращаем случайное число от 0 - 3
  return Math.floor(Math.random() * parentChild.children.length);
}

// Объект с ответами
const answers = {
  question_1: 'Елка',
  question_2: 'Олень',
  question_3: 'Огурец',
  question_4: 'Бабочка',
  question_5: 'Крот',
  question_6: 'Парикмахер',
  question_7: 'Волк на псарне',
  question_8: 'Извозчику',
  question_9: 'Бомбардир',
  question_10: 'Кормить пассажиров',
  question_11: 'Вырезанием из бумаги',
  question_12: 'Наивных девушек',
  question_13: 'С лопатами',
  question_14: 'Регби',
  question_15: 'Жнейка',
};