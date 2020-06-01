let gameImgDir = "./src/img/";
let gTexts = []; // Для многоязычности.

gTexts['win1'] = 'Win ';
gTexts['win2'] = '!';

let gField = []; // игровое поле

const createField = (w, h) => { // Задаёт размер игрового поля.
  gField = new Array(w); // создание нового массива.
  for (let i = 0; i < w; i++) gField[i] = new Array(h); // теперь переделаем массив в матрицу.
  let hT = "<table cellpadding='0' cellspacing='0'>"; // заголовок тега таблицы.

  for (let j = 0; j < h; j++) {
    hT += "<tr>"; // создание новой линии
    for (let i = 0; i < w; i++) { // вставка ячеек в линию
      hT += "<td>";
      hT += "<img height='60px' id='c" + i + "_" + j + "' src='" + gameImgDir + "c_null.png' alt=' ' onclick='onCellClk(" + i + "," + j + ")'>";
      hT += "</td>";
    }
    hT += "</tr>"; // конец линии
  }

  document.getElementById("game").innerHTML = hT + "</table>"; // вставка таблицы на страницу.
}

const setCell = (x, y, t) => { // Поставить крестик или нолик
  gField[x][y] = t; // Запомнить t в массиве
  let imgSrc = gameImgDir + 'c_null.png'; // изображение по умолчанию
  if (t === 'x') imgSrc = gameImgDir + 'x.png'; // картинка для крестика
  if (t === 'o') imgSrc = gameImgDir + 'o.png'; // картинка для нолика
  let oName = "c" + x + "_" + y; // составление имени картинки
  document.getElementById(oName).src = imgSrc; // замена изображения
  document.getElementById(oName).width = 60;
  document.getElementById(oName).height = 60;
  if (t != null) document.getElementById(oName).alt = t; // если картинки выключены, то игра будет в текстовом режиме

}

const isWin = () => { // Проверка победы.
  for ( let stX = 0; stX <= gField.length - 3; stX++)
    for ( let stY = 0; stY <= gField[0].length - 3; stY++) { // Если размер поля больше трёх.
      let lC = gField[stX][stY]; // проверка линии

      if (lC != null) {
        for (let i = 0; i < 3; i++) {
          if (gField[i + stX][i + stY] !== lC) {
            lC = null; // если проверяемая клетка не содержит lC, то сбросить значение lC
          }
        }
      }
      if (lC != null) return lC; // если победа обнаружена.

      lC = gField[2 + stX][stY];
      if (lC != null)
        for ( let i = 0; i < 3; i++)
          if (gField[2 - i + stX][i + stY] !== lC) lC = null;
      if (lC != null) return lC;


      for ( let i = 0; i < 3; i++) { // проверка по вертикали
        lC = gField[stX + i][stY];
        if (lC != null)
          for (let j = 0; j < 3; j++)
            if (gField[i + stX][j + stY] !== lC) lC = null;
        if (lC != null) return lC;
      }
      for (let j = 0; j < 3; j++) { // проверка по горизонтали
        lC = gField[stX][stY + j];
        if (lC != null)
          for (let i = 0; i < 3; i++)
            if (gField[i + stX][j + stY] !== lC) lC = null;
        if (lC != null) return lC;
      }
    }
  return false; // если никто не победил
}

function CompGame() { // ИИ

  let tx = null,
    ty = null,
    tp = 0; // tp - приоритет выбранной целевой клетки.

  let stX = 0,
    stY = 0;
  for (stX = 0; stX < gField.length; stX++)
    for (stY = 0; stY < gField[0].length; stY++) // для каждой клетки
    {
      let lC = gField[stX][stY];
      if ((lC !== 'x') && (lC !== 'o')) { // только для пустых клеток

        gField[stX][stY] = 'x';
        if (isWin() === 'x') { // пробуем победить
          tx = stX;
          ty = stY;
          tp = 3;
        } else if (tp < 3) {
          gField[stX][stY] = 'o';
          if (isWin() === 'o') { // или помешать победить игроку.
            tx = stX;
            ty = stY;
            tp = 2;
          } else if (tp < 2) { // или...
            let mini = -1,
              maxi = 1,
              minj = -1,
              maxj = 1;
            if (stX >= gField.length - 1) maxi = 0;
            if (stY >= gField[0].length - 1) maxj = 0;
            if (stX < 1) mini = 0;
            if (stY < 1) minj = 0;      // найти ближайший нолик...

            for (let i = mini; i <= maxi; i++)
              for (let j = minj; j <= maxj; j++)
                if ((i !== 0) && (j !== 0)) { // если есть рядом своя занятая клетка - поближе к своим
                  if (gField[stX + i][stY + j] === 'o') {
                    tx = stX;
                    ty = stY;
                    tp = 1;
                  }
                }
            if (tp < 1) { // или хотя бы на свободную клетку поставить.
              tx = stX;
              ty = stY;
            }
          }
        }
        gField[stX][stY] = lC;
      }
    }
  if ((tx != null) && (ty != null)) { // если целевая клетка выбранна
    setCell(tx, ty, 'o'); // поставим нолик в клетку.
  }
}

const onCellClk = (x, y) => { // Действия при клике по клетке
  if (gField[x][y] == null) { // если клетка пустая

    let win = isWin(); // проверка на победу.

    if (!win) setCell(x, y, 'x');
    win = isWin(); // проверка на победу
    if (!win) {
      CompGame(); // запуск компьютерного игрока
      win = isWin(); // проверка на победу
    }
    if (win) {
      let mes = gTexts['win1'] + win + gTexts['win2'];
      alert(mes); // отображение сообщения о победе
    }
  }
}

//очищаем поле
const clearField = () => {
  document.getElementById("game").innerHTML = null;//стираем ранее нарисованое поле
  initGame();// рисуем новое
}

const initGame = () => { // инициализация игры
  console.log('initGame')
  let n = 4;
  createField(n, n); // создание игрового поля
}