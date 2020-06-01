var gameImgDir = "img/";
var gTexts = []; // Для многоязычности.

gTexts['win1'] = 'Win ';
gTexts['win2'] = '!';

var gField = []; // игровое поле

function createField(w, h) { // Задаёт размер игрового поля.
  gField = new Array(w); // создание нового массива.
  for (i = 0; i < w; i++) gField[i] = new Array(h); // теперь переделаем массив в матрицу.
  var hT = "<table cellpadding='0' cellspacing='0'>"; // заголовок тега таблицы.

  for (j = 0; j < h; j++) {
    hT += "<tr>"; // создание новой линии
    for (i = 0; i < w; i++) { // вставка ячеек в линию
      hT += "<td>";
      hT += "<img height='60px' id='c" + i + "_" + j + "' src='" + gameImgDir + "c_null.png' alt=' ' onclick='onCellClk(" + i + "," + j + ")'>";
      hT += "</td>";
    }
    hT += "</tr>"; // конец линии
  }
  console.log('create field')
  //document.querySelector('#game').innerHTML = hT + "</table>"; // вставка таблицы на страницу.
  document.getElementById("game").innerHTML = hT + "</table>"
  /*document.getElementById('gameinfo').innerText = gTexts['start']; // отобразить сообщение*/
}

function setCell(x, y, t) { // Поставить крестик или нолик
  gField[x][y] = t; // Запомнить t в массиве
  var imgsrc = gameImgDir + 'c_null.gif'; // изображение по умолчанию
  if (t === 'x') imgsrc = gameImgDir + 'x.png'; // картинка для крестика
  if (t === 'o') imgsrc = gameImgDir + 'o.png'; // картинка для нолика
  var oName = "c" + x + "_" + y; // составление имени картинки
  document.getElementById(oName).src = imgsrc; // замена изображения
  document.getElementById(oName).width = 60;
  document.getElementById(oName).height = 60;
  if (t != null) document.getElementById(oName).alt = t; // если картинки выключены, то игра будет в текстовом режиме

}

function isWin() { // Проверка победы.
  for (stX = 0; stX <= gField.length - 3; stX++)
    for (stY = 0; stY <= gField[0].length - 3; stY++) { // Если размер поля больше трёх.
      var lC = gField[stX][stY]; // проверка линии

      if (lC != null) {
        for (i = 0; i < 3; i++) {
          if (gField[i + stX][i + stY] !== lC) {
            lC = null; // если проверяемая клетка не содержит lC, то сбросить значение lC
          }
        }
      }
      if (lC != null) return lC; // если победа обнаружена.

      lC = gField[2 + stX][stY];
      if (lC != null)
        for (i = 0; i < 3; i++)
          if (gField[2 - i + stX][i + stY] !== lC) lC = null;
      if (lC != null) return lC;


      for (i = 0; i < 3; i++) { // проверка по вертикали
        lC = gField[stX + i][stY];
        if (lC != null)
          for (j = 0; j < 3; j++)
            if (gField[i + stX][j + stY] !== lC) lC = null;
        if (lC != null) return lC;
      }
      for (j = 0; j < 3; j++) { // проверка по горизонтали
        lC = gField[stX][stY + j];
        if (lC != null)
          for (i = 0; i < 3; i++)
            if (gField[i + stX][j + stY] !== lC) lC = null;
        if (lC != null) return lC;
      }
    }
  return false; // если никто не победил
}

function CompGame() { // ИИ

  var tx = null,
    ty = null,
    tp = 0; // tp - приоритет выбранной целевой клетки.

  var stX = 0,
    stY = 0;
  for (stX = 0; stX < gField.length; stX++)
    for (stY = 0; stY < gField[0].length; stY++) // для каждой клетки
    {
      var lC = gField[stX][stY];
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
            var mini = -1,
              maxi = 1,
              minj = -1,
              maxj = 1;
            if (stX >= gField.length - 1) maxi = 0;
            if (stY >= gField[0].length - 1) maxj = 0;
            if (stX < 1) mini = 0;
            if (stY < 1) minj = 0;      // найти ближайший нолик...

            for (i = mini; i <= maxi; i++)
              for (j = minj; j <= maxj; j++)
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

function onCellClk(x, y) { // Действия при клике по клетке
  if (gField[x][y] == null) { // если клетка пустая

    var win = isWin(); // проверка на победу.

    if (!win) setCell(x, y, 'x');
    win = isWin(); // проверка на победу
    if (!win) {
      CompGame(); // запуск компьютерного игрока
      win = isWin(); // проверка на победу
    }
    if (!win) {
      gameinfo.innerText = gTexts['playing'] // отображение сообщения
    } else {
      var mes = gTexts['win1'] + win + gTexts['win2'];
      alert(mes); // отображение сообщения о победе
      gameinfo.innerText = mes;
    }
  }
}


console.log('initGame')
let n = 4;
createField(n, n);
function initGame() { // инициализация игры
  console.log('initGame2')
  createField(n, n); // создание игрового поля
}