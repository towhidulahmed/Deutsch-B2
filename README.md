# Deutsch B2 Lernseite

A study site for the German B2 course. Each class has a summary, grammar notes, vocabulary, flashcards, exercises that check your answers, and personal notes. It is plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Use it

- **Online:** enable GitHub Pages (Settings → Pages → Branch: `main`, folder `/ (root)`). The site will be at `https://towhidulahmed.github.io/Deutsch-B2/`.
- **Offline:** open `index.html` in any browser.

### Install as an app

- **iPhone / iPad (Safari):** open the site, tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** open the site and tap **Install** on the home page banner, or use the menu → **Install app**.

Once installed it opens full screen and works without internet. The speaker buttons read German words aloud with your device's German voice.

Notes, flashcard progress and exercise answers are saved only on your own device. Classmates who use the same link each have their own.

## Add a new class

1. Copy `classes/stunde-01.js` to `classes/stunde-02.js`.
2. In the new file, set `id` to `"s02"` (letters and digits only) and `nr` to `2`, then fill in:
   - `title`, `date`, `topic`, `tags`
   - `summary`: HTML paragraphs
   - `keyPoints`: list of short HTML strings
   - `grammar`: list of `{ title, html }` sections
   - `vocab`: list of `{ de, gram, en, ex }` (`gram` is optional, for example `"+ Dativ"`)
   - `exercises`: list of `{ title, intro, items: [{ q }] }`. In `q`, write each gap as `[[answer]]`. Separate accepted answers with `|`. Use `[[-]]` where nothing belongs.
   - `homework`: optional text
3. In `index.html`, add this line under the existing class line:

   ```html
   <script src="classes/stunde-02.js"></script>
   ```

Optional fields:

- `drills`: quick tap quizzes, `{ title, intro, options: [...], items: [{ q, hint, a, ex }] }`. `a` is one option or a list of accepted options.
- In an exercise item, `note` is a hint that appears after checking.

Installed apps pick up new classes automatically the next time they open with internet.
