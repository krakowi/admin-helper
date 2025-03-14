document.addEventListener("DOMContentLoaded", function () {
    const daysInput = document.getElementById("days");
    const commandSelect = document.getElementById("command");
    const usernamesTextarea = document.getElementById("usernames");
    const reasonInput = document.getElementById("reason");
    const clearButton = document.getElementById("clear-button");
    const clearNicksButton = document.getElementById("clear-nicks-button");
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    const generateFormLink = document.getElementById("generate-form-link");
    const getNicksLink = document.getElementById("get-nicks-link");
    const generateFormSection = document.getElementById("generate-form");
    const getNicksSection = document.getElementById("get-nicks");
    const nicksForm = document.getElementById("nicks-form");
    const nicksResult = document.getElementById("nicks-result");

    // Обработчик изменения выбора команды
    commandSelect.addEventListener("change", function () {
        if (this.value === "/unjailoff" || this.value === "/unban") {
            daysInput.disabled = true; // Блокируем поле "Дни"
            daysInput.value = ""; // Очищаем поле
        } else {
            daysInput.disabled = false; // Разблокируем поле "Дни"
        }
    });

    // Обработчик очистки формы генерации
    clearButton.addEventListener("click", function () {
        commandSelect.value = ""; // Сбрасываем выбор команды
        usernamesTextarea.value = ""; // Очищаем список ников
        daysInput.value = ""; // Очищаем поле "Дни"
        daysInput.disabled = true; // Блокируем поле "Дни"
        reasonInput.value = ""; // Очищаем поле "Причина"
    });

    // Обработчик очистки формы получения ников
    clearNicksButton.addEventListener("click", function () {
        document.getElementById("pattern").value = ""; // Очищаем поле с регулярным выражением
        document.getElementById("log-text").value = ""; // Очищаем поле с логом
        nicksResult.textContent = ""; // Очищаем результат
    });

    // Валидация поля "Дни": разрешаем ввод только чисел
    daysInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, ""); // Удаляем всё, кроме цифр
    });

    // Обработчик отправки формы генерации
    document.getElementById("form-generator").addEventListener("submit", function (event) {
        event.preventDefault();

        // Получаем данные из формы
        const command = commandSelect.value;
        const usernames = usernamesTextarea.value.trim().split("\n");
        const days = daysInput.value.trim();
        const reason = reasonInput.value.trim();

        // Проверяем, заполнены ли все поля
        if (!command || !usernames.length || !reason) {
            alert("Пожалуйста, заполните все обязательные поля.");
            return;
        }

        // Проверяем, нужно ли поле "Дни"
        if (command !== "/unjailoff" && command !== "/unban" && !days) {
            alert("Пожалуйста, заполните поле 'Дни'.");
            return;
        }

        // Генерируем текст
        const now = new Date();
        const timestamp = now.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).replace(/[/:, ]/g, "-");

        let result = `Сгенерированные формы за ${timestamp}\n`;
        result += `Количество сгенерированных форм: ${usernames.length}\n\n`;

        usernames.forEach(username => {
            if (command === "/unjailoff" || command === "/unban") {
                result += `${command} ${username} ${reason}\n`;
            } else {
                result += `${command} ${username} ${days} ${reason}\n`;
            }
        });

        // Показываем результат в модальном окне
        const modal = document.getElementById("result-modal");
        const resultText = document.getElementById("result-text");
        resultText.textContent = result;
        modal.style.display = "block";

        // Закрытие модального окна
        document.querySelector(".close").addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Копирование текста
        document.getElementById("copy-button").addEventListener("click", () => {
            navigator.clipboard.writeText(result).then(() => {
                alert("Текст скопирован в буфер обмена!");
            });
        });
    });

    // Обработчик для бургер-меню
    menuToggle.addEventListener("click", function () {
        navbar.classList.toggle("open");
    });

    // Переключение между разделами
    generateFormLink.addEventListener("click", function (e) {
        e.preventDefault();
        generateFormSection.style.display = "block";
        getNicksSection.style.display = "none";
        setActiveLink(this);
    });

    getNicksLink.addEventListener("click", function (e) {
        e.preventDefault();
        generateFormSection.style.display = "none";
        getNicksSection.style.display = "block";
        setActiveLink(this);
    });

    // Обработчик отправки формы для извлечения ников
    // Обработчик отправки формы для извлечения ников
    // Обработчик отправки формы для извлечения ников
    nicksForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const pattern = document.getElementById("pattern").value.trim();
        const logText = document.getElementById("log-text").value.trim();

        if (!pattern || !logText) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        try {
            // Преобразуем пользовательский шаблон в регулярное выражение
            const regexPattern = pattern.replace(/{name}/g, "(\\S+)"); // Заменяем {name} на группу захвата
            const regex = new RegExp(regexPattern, "g");

            // Ищем совпадения в тексте
            const matches = logText.match(regex) || [];
            const nicks = matches.map(match => {
                const groups = new RegExp(regexPattern).exec(match);
                return groups ? groups[1] : null; // Возвращаем первую группу захвата (name)
            }).filter(Boolean);

            // Убираем дубликаты с помощью Set
            const uniqueNicks = [...new Set(nicks)];

            if (uniqueNicks.length > 0) {
                nicksResult.textContent = uniqueNicks.join("\n");
            } else {
                nicksResult.textContent = "Ники не найдены.";
            }
        } catch (error) {
            alert("Ошибка в регулярном выражении: " + error.message);
        }
    });

    // Установка активной ссылки в навбаре
    function setActiveLink(activeLink) {
        const links = document.querySelectorAll(".navbar-menu a");
        links.forEach(link => link.classList.remove("active"));
        activeLink.classList.add("active");
    }
});