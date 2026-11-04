# QuizMe

QuizMe is a browser-based study app for flashcards, multiple-choice practice quizzes, study guides, and a
question-powered flight game. It uses plain HTML, CSS, and JavaScript, so you can edit it in Phoenix Code and host it on
GitHub Pages.

## Run it

Open `index.html` in a browser, or open the project folder in Phoenix Code and use its preview. No build step or package
installation is needed.

## Use it

1. Choose **Create a study set**.
2. Add flashcards, a standalone quiz, or both. Flashcards are optional when you create a quiz: add at least 10 complete
   questions, each with four different choices and one marked correct answer.
3. To make flashcards, add at least two prompt and answer pairs. You can also write a study guide; generating one from
   flashcards is optional.
4. Save the set, open it, and choose the study mode you created.
5. Practice quizzes use 10 questions. Sky Quiz can use a set's standalone question bank without flashcards.
6. Use the bird button at bottom-left for untimed Free Flight.

**Import notes** accepts `.txt` or `.md` files with one `prompt | answer` pair per line. Imported cards are loaded into
the builder for review before saving.

## Starter content and sources

The built-in decks cover 17 introductory subjects with 20–22 flashcards each. The cards are concise paraphrases and
practice items based on the cited open educational references; they are not copied wholesale from the linked books. Each
set keeps quiz questions in a separate bank from its flashcards, so either mode works independently. Source links appear
in each starter set's study view. Quizlet study sets are user-created and do not carry a blanket reuse license, so this
project does not copy cards from other users' Quizlet sets.

| Subject                 | Reference                                                                                                                                         | License shown by source |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| Cell biology            | [OpenStax Biology 2e, chapter review](https://openstax.org/books/biology/pages/4-review-questions)                                                | CC BY-NC-SA 4.0         |
| Psychology              | [OpenStax Psychology 2e, chapter review](https://openstax.org/books/psychology-2e/pages/5-review-questions)                                       | CC BY-NC-SA 4.0         |
| Roman history           | [OpenStax World History, Roman Republic](https://openstax.org/books/world-history-volume-1/pages/6-4-the-roman-republic)                          | CC BY-NC-SA 4.0         |
| Anatomy & physiology    | [OpenStax Anatomy & Physiology 2e, chapter review](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-chapter-review)                   | CC BY-NC-SA 4.0         |
| Website development     | [MDN Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)                                                       | CC BY-SA 2.5 (prose)    |
| U.S. history            | [OpenStax U.S. History, chapter review](https://openstax.org/books/us-history/pages/8-review-questions)                                           | CC BY-NC-SA 4.0         |
| Chemistry               | [OpenStax Chemistry 2e, exercises](https://openstax.org/books/chemistry-2e/pages/18-exercises)                                                    | CC BY-NC-SA 4.0         |
| Statistics              | [OpenStax Introductory Statistics, chapter review](https://openstax.org/books/introductory-statistics/pages/1-chapter-review)                     | CC BY-NC-SA 4.0         |
| Microeconomics          | [OpenStax Principles of Microeconomics 3e, review questions](https://openstax.org/books/principles-microeconomics-3e/pages/3-review-questions)    | CC BY-NC-SA 4.0         |
| Environmental science   | [Introduction to Environmental Sciences and Sustainability](https://openfl.pressbooks.pub/enviroscience/front-matter/introduction/)               | CC BY 4.0               |
| Sociology               | [OpenStax Introduction to Sociology 2e, section quiz](https://openstax.org/books/introduction-sociology-2e/pages/1-section-quiz)                  | CC BY-NC-SA 4.0         |
| Philosophy              | [OpenStax Introduction to Philosophy, review questions](https://openstax.org/books/introduction-philosophy/pages/1-review-questions)              | CC BY-NC-SA 4.0         |
| Linear algebra          | [A First Course in Linear Algebra, 10th ed.](https://open.umn.edu/opentextbooks/textbooks/213)                                                    | CC BY                   |
| Computer science        | [OpenStax Introduction to Computer Science, review questions](https://openstax.org/books/introduction-computer-science/pages/11-review-questions) | CC BY-NC-SA 4.0         |
| Art history             | [Introduction to Art: Design, Context, and Meaning](https://open.umn.edu/opentextbooks/textbooks/374)                                             | CC BY-SA                |
| Algebra                 | [OpenStax College Algebra 2e, practice test](https://openstax.org/books/college-algebra-2e/pages/4-practice-test)                                 | CC BY-NC-SA 4.0         |
| Geometry & trigonometry | [OpenStax Algebra and Trigonometry 2e, review exercises](https://openstax.org/books/algebra-and-trigonometry-2e/pages/1-review-exercises)         | CC BY-NC-SA 4.0         |

OpenStax allows noncommercial reuse and adaptation with attribution and requires adaptations to be shared under CC
BY-NC-SA 4.0. See its
[licensing terms](https://help.openstax.org/s/article/Licensing-information-of-OpenStax-textbooks). The MDN,
environmental science, and Open Textbook Library materials have their own licenses; check the linked source before
redistributing or adapting their material. The source material remains under its respective license; QuizMe's original
application code is separate.

Each starter deck has at least 20 cards; the quiz mode presents 10 questions. In flashcard mode, mark each card **Know
it** or **Needs more work**. Known cards are saved on this device and skipped next time; cards needing more work return
in a later session. Use **Reset known cards** to review the full set again. Math decks use numerical answers. Sky Quiz
shuffles a set's questions at the start and ends after all have been answered. The timer starts at 15 seconds, pauses
while a question is open, and gains five seconds for a correct answer. A 3–2–1 countdown precedes resumed flight. Free
Flight has no questions or timer, and its best score lasts until the page is closed. Its horizontal and vertical speeds
ramp up gradually; regular obstacles have wider gaps and slightly more space, with spikes at the gap edges. Random
tunnels appear between them in eight angled up-and-down corridor patterns with flat and 45-degree wall segments. Press
Escape to pause; resume starts after a three-second countdown.

The app saves study sets and session counts in the browser's local storage on that device. Clearing browser data will
erase saved sets.

## Files

-   `index.html` — page structure
-   `styles.css` — layout, colors, and responsive styling
-   `builder.css` — study-set builder layout
-   `app.js` — study flows, starter source references, and local storage
-   `starter-data.js` — original built-in study prompts and answers
-   `starter-extras.js` — additional open-reference study cards

## Project team

-   Oliver Young
-   Bryce Robbins
