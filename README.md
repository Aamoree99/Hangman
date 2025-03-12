# 💀 Hangman Deluxe

**Hangman Deluxe** — это стильная, интерактивная версия классической игры «Виселица» с поддержкой локализации, неоновой темой и встроенным помощником.  
Разработано с вниманием к эстетике — визуально чисто, современно и удобно.

▶️ <strong>Попробовать вживую:</strong> <a href="https://aamoree99.github.io/Hangman/" target="_blank" rel="noopener noreferrer">Hangman Deluxe на GitHub Pages</a>


## 🚀 Особенности

- 🎮 **Игровой режим** — угадывай случайные слова и спасай человечка!
- 🧠 **Помощник** — подсказывает вероятные буквы и слова.
- 🌐 **Локализация** — поддержка нескольких языков через JSON-файлы.
- 🎨 **Современный UI** — адаптивный дизайн с неон-глоу стилем.
- 📊 **Аналитика букв** — умные подсказки по частоте.
- ✨ **Анимации** — плавность, подсветка и «встряска» при ошибке.

## 🌍 Поддерживаемые языки

- Русский `ru`
- Английский `en`
- Украинский `ua`
- Чешский `cz`  
(Можно выбрать в футере страницы)

## 📦 Структура проекта

```
📁 public/
   └─ locales/
       ├─ ru.json
       ├─ en.json
       ├─ ua.json
       ├─ cz.json
       └─ index.json
📄 index.html
📄 styles.css
📄 script.js
```

## 🔧 Установка и запуск

Открой `index.html` в браузере — игра работает без серверной части.  
Или запусти локальный сервер для теста:

```bash
npx serve
# или
python3 -m http.server
```

## 🌐 Добавление нового языка

1. Создай файл в `public/locales/`, например: `es.json`
2. Добавь его в `index.json`
3. Укажи переводы всех ключей (`title`, `startGame`, `errors` и т.д.)

## 📖 Используемые API

- [Datamuse API](https://www.datamuse.com/api/) — генерация и фильтрация слов.
- Vanilla JS + Canvas API.

## 👨‍💻 Автор

Made with ❤️ by **Aamoree99**

- GitHub: [@Aamoree99](https://github.com/Aamoree99)
- Telegram: [@aamoree](https://t.me/aamoree)

---

## 🪪 License

MIT License. Свободно используй, кастомизируй, дополняй. Если понравилось — оставь ⭐️


---

# 💀 Hangman Deluxe (English)

**Hangman Deluxe** is a stylish and interactive version of the classic Hangman game — complete with localization, neon-glow visuals, and a built-in helper.

▶️ **Try it live**: [Hangman Deluxe on GitHub Pages](https://aamoree99.github.io/Hangman/)

## 🚀 Features

- 🎮 **Game mode** — guess random words and save the stickman!
- 🧠 **Helper mode** — provides word and letter suggestions based on your input.
- 🌐 **Localization** — supports multiple languages via JSON.
- 🎨 **Modern UI** — responsive design with sleek neon aesthetics.
- 📊 **Letter frequency analytics** — smart letter hints.
- ✨ **Animations** — smooth transitions, highlights, and shake effect.

## 🌍 Supported Languages

- Russian `ru`
- English `en`
- Ukrainian `ua`
- Czech `cz`  
(Selectable in the footer)

## 📦 Project Structure

```
📁 public/
   └─ locales/
       ├─ ru.json
       ├─ en.json
       ├─ ua.json
       ├─ cz.json
       └─ index.json
📄 index.html
📄 styles.css
📄 script.js
```

## 🔧 Run locally

Just open `index.html` in your browser.  
Or launch a local server for testing:

```bash
npx serve
# or
python3 -m http.server
```

## 🌐 Adding a new language

1. Create a new file in `public/locales/`, e.g. `es.json`
2. Add it to `index.json`
3. Provide translations for all keys (`title`, `startGame`, `errors`, etc.)

## 📖 Powered by

- [Datamuse API](https://www.datamuse.com/api/) — for word generation and filtering.
- Vanilla JS + Canvas API.

## 👨‍💻 Author

Made with ❤️ by **Aamoree99**

- GitHub: [@Aamoree99](https://github.com/Aamoree99)
- Telegram: [@aamoree](https://t.me/aamoree)

---

## 🪪 License

MIT License. Use it, customize it, improve it — and don’t forget to leave a ⭐️