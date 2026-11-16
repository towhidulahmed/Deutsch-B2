# Deutsch B2 Lernseite

A study site for the German B2 course. Each course day has a summary, grammar notes, vocabulary, flashcards, exercises that check your answers, and personal notes. It is plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Use it

- **Online:** enable GitHub Pages (Settings → Pages → Branch: `main`, folder `/ (root)`). The site will be at `https://towhidulahmed.github.io/Deutsch-B2/`.
- **Offline:** open `index.html` in any browser.

### Install as an app

- **iPhone / iPad (Safari):** open the site, tap **Share**, then **Add to Home Screen**.
- **Android (Chrome):** open the site and tap **Install** on the home page banner, or use the menu → **Install app**.

Once installed it opens full screen and works without internet. Speaker buttons use saved German pronunciation clips when available, with your device's German voice as a fallback.

### Saved German pronunciation

The site can play saved MP3 pronunciation clips in both the main site and the separate flashcard site. A clip is generated once, then reused on every play without another Text-to-Speech request. If a clip has not been generated or cannot load, the speaker button uses the device's voice. Saved clips can be used offline when cached by the installed app; otherwise playback falls back to the device voice.

The generator uses the free German `de_DE-thorsten-medium` Piper voice. It reads the German words, example sentences, dialogue phrases and speaking patterns from `classes/*.js`. No API key or Cloud account is needed. Install `piper-tts` and `lameenc` in a Python environment, then download the voice:

```sh
python3 -m pip install piper-tts lameenc
python3 -m piper.download_voices --download-dir tools/models de_DE-thorsten-medium
python3 tools/generate-audio.py
```

Generate a few clips first and listen to them:

```sh
python3 tools/generate-audio.py --generate --limit 10
```

Then run the same command without `--limit` to finish. Existing MP3s are skipped, so interrupted runs can resume. The voice model stays in the ignored `tools/models/` folder; only the generated MP3 files and index are published. The [Thorsten voice model](https://huggingface.co/rhasspy/piper-voices/blob/main/de/de_DE/thorsten/medium/MODEL_CARD) uses a CC0 dataset.

Notes, flashcard progress and exercise answers are saved only on your own device. Classmates who use the same link each have their own.

## Karteikarten site

`flashcards/` is a separate site just for vocabulary flashcards: one big card at a time, tap to flip, swipe right for *gewusst* and left for *nochmal*, and a speaker button that reads the word and the example sentence aloud. Online it is at `https://towhidulahmed.github.io/Deutsch-B2/flashcards/` and can be installed as its own app.

It reads the words straight from `classes/*.js`, so a new day shows up there too once its script line is added to `flashcards/index.html` (and to `SHELL` in `flashcards/sw.js` for offline use). Its progress is saved separately from the main site's Karten tab.

## 100 Sprechmuster

`classes/muster-100.js` holds the 100 speaking patterns from the *100 Spoken German Patterns* workbook (A1–B1). They are speaking help, not a course day, so they have their own page (`#muster`, **Muster** in the navigation) instead of a Tag number. Each pattern shows the formula, a grammar note and an example you can listen to, plus three boxes for your own sentences. **Üben** hides the German example until you tap it, and **Laut geübt** ticks the pattern off. Your sentences and ticks are saved on your device and included in the backup file.

## Add a new day

1. Copy `classes/tag-01.js` to `classes/tag-02.js`.
2. In the new file, set `id` to `"s02"` (letters and digits only) and `nr` to `2`, then fill in:
   - `title`, `date`, `topic`, `tags`
   - `summary`: HTML paragraphs
   - `keyPoints`: list of short HTML strings
   - `grammar`: list of `{ title, html }` sections
   - `vocab`: list of `{ de, gram, en, ex }` (`gram` is optional, for example `"+ Dativ"`)
   - `exercises`: list of `{ title, intro, items: [{ q }] }`. In `q`, write each gap as `[[answer]]`. Separate accepted answers with `|`. Use `[[-]]` where nothing belongs.
   - `homework`: optional text
3. In `index.html`, add this line under the existing day line:

   ```html
   <script src="classes/tag-02.js"></script>
   ```

Optional fields:

- `drills`: quick tap quizzes, `{ title, intro, options: [...], items: [{ q, hint, a, ex }] }`. `a` is one option or a list of accepted options.
- In an exercise item, `note` is a hint that appears after checking.

Installed apps pick up new classes automatically the next time they open with internet.
