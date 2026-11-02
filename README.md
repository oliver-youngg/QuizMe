# QuizMe

QuizMe is a focused study app for creating study sets, reviewing flashcards, taking quick multiple-choice practice quizzes, and playing a question-powered flight game. It is built with plain HTML, CSS, and JavaScript so the files are easy to open and edit in Phoenix Code and can be hosted on GitHub Pages.

## Run it

Open `index.html` in a browser, or open the project folder in Phoenix Code and use its preview. No build step or package installation is needed.

## Use it

1. Choose **Create a study set** to open the full builder. Use **Back to home** or **Cancel** to return to the dashboard.
2. Add flashcards with a prompt and answer. Each set supports a 10-question practice quiz.
3. In **Study guide**, generate an editable guide from your cards, then save the set.
4. Open **Explore topics** or choose one of your sets to study with flashcards, a quiz, Sky Quiz, or its saved guide.
5. In a quiz, choose from four answers, use **Skip question** when needed, and select **Next** to continue. Use the small bird button in the bottom-left for untimed Free Flight.
6. Review your session feedback and retry anything that needs practice.

**Import notes** accepts `.txt` or `.md` files with one `prompt | answer` pair per line. Imported cards are loaded into the builder for review before saving.

The included sample sets cover 17 introductory subjects at high-school and first-year college level: cell biology, psychology, Roman history, anatomy and physiology, website development, U.S. history, chemistry, statistics, microeconomics, environmental science, sociology, philosophy, linear algebra, computer science, art history, algebra, and geometry/trigonometry. Starter decks vary from 10 to 12 cards by topic. Every quiz has exactly 10 questions, and its answer choices come from that study set's topic. Custom sets need at least 10 cards and enough distinct answers for four choices before quiz mode can start.

Every study set includes flashcards, a 10-question practice quiz, and Sky Quiz. Sky Quiz shuffles the set’s questions at the start of each game and asks each question once, after an obstacle is cleared. The game ends after the final question is answered. Hold Space, the Up Arrow, or the on-screen control to rise; release to descend. The small pencil wave tilts smoothly at about 45 degrees and leaves a brief white streak. Each set gives the course colors and obstacle panels a topic-matched style. Obstacle speed increases as you progress. The timer starts at 15 seconds and pauses during questions; each correct answer adds 5 seconds. After each answer, a 3–2–1 countdown gives you a moment before flight resumes. The small bird button in the bottom-left opens Free Flight, an untimed sandbox. Its obstacle count resets after a crash, and the game pauses to ask whether you want to continue after ten consecutive crashes. The death count stays hidden. A study guide appears when one is saved with the set.

The app saves study sets and session counts in the browser's local storage on that device. Clearing browser data will erase saved sets. Starter study sets are included so you can try the app immediately.

## Files

- `index.html` — page structure
- `styles.css` — layout, colors, and responsive styling
- `builder.css` — study-set builder layout
- `app.js` — study flows and local storage
- `starter-data.js` — introductory sample questions for the built-in study sets

## Project team

- Oliver Young
- Bryce Robbins
