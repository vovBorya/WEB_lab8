const checkData = () => {

    // xxx@xxx.xxx
    const emailPattern = new RegExp('^[.\\-_A-Za-z0-9]+?@[.\\-A-Za-z0-9]+?\\.[A-Za-z0-9]{2,6}$');

    //+380XXXXXXXXX
    const phonePattern = new RegExp('^\\+380\\d{9}$');

    // Паттерн для проверки адреса в формате "Небесной Сотни, 234"
    const addressPattern = new RegExp('^\\D+, \\d{1,3}$');

    const form = document.getElementById('registration-form');

    const enteredEmail = form.elements.namedItem('email').value;
    const enteredPhone = form.elements.namedItem('phone').value;
    const enteredAddress = form.elements.namedItem('address').value;
    const enteredName = form.elements.namedItem('name').value;
    const enteredCompany = form.elements.namedItem('company').value;

    // Результат проверки правильности данных
    const isDataCorrect = emailPattern.test(enteredEmail) && phonePattern.test(enteredPhone)
        && addressPattern.test(enteredAddress) && enteredName.length > 0 && enteredCompany.length > 0;

    // Если данные введены верно
    if (isDataCorrect) {
        // Просим пользователя подтвердить отправку
        // Если пользователь согласится, из функции вернётся значение true, что приведёт к отправке формы
        // Если пользователь не согласится, из функции вернётся значение false, что не приведёт к отправке формы
        return confirm('Отправить данные?')
    } else {
        alert('Неверный формат данных'); // Предупреждаем пользователя об ошибке
        return false // Из функции вернётся значение false, что не приведёт к отправке формы
    }
}