# QuizMe Product Specification

**Status:** Draft for future project work  
**Product:** QuizMe  
**Audience:** College students, with high school students as a possible secondary audience

## 1. Product summary

QuizMe is a focused study app that helps students understand and remember material through flashcards, practice quizzes, and feedback about topics that need more review. Its interface should feel calm, clear, and academic, with minimal distractions and no advertising.

> The user needs better ways to study; the app provides a focused study environment so they can improve their understanding of the subject they choose.

## 2. Goals

- Help students turn course material into useful study sessions.
- Make it easy to start studying, resume recent work, and see what needs attention.
- Support more than one study method while keeping navigation straightforward.
- Provide feedback that helps students choose what to review next.

## 3. Audience and use context

The primary audience is college students. High school students may also use the app. They may have limited time, upcoming quizzes or exams, and study material in notes or topic form. The app should support short, self-directed sessions and avoid social or competitive pressure.

## 4. Product principles and visual direction

- **Focused:** Keep study screens free from unrelated content and interruptions.
- **Simple:** Make core actions easy to find and understand.
- **Encouraging:** Give useful progress feedback without shaming students.
- **Academic and modern:** Use a clean, contemporary visual style informed by IC colors. Exact colors, typography, and brand assets remain to be selected.
- **Ad-free:** Do not include advertisements.

## 5. Must-have features

### 5.1 Flashcards

Students can study a set of flashcards, reveal the other side of a card, and move through the set. The precise card creation, editing, and rating interactions need to be defined during design.

### 5.2 Practice quizzes

Students can answer practice questions in a quiz flow. The supplied wireframe suggests a question with multiple-choice answers, a way to skip, and a Next action. The initial question types and scoring rules remain to be decided.

### 5.3 Review feedback

After study or a quiz, show students what they answered well and which topics or questions need more time. Feedback should lead to a clear next action, such as reviewing a related flashcard set or retrying questions.

## 6. Nice-to-have features

These are candidates for a later phase, not requirements for the first version:

- A daily study streak.
- Reminders when a student has a quiz or exam later in the week.
- Additional ways to study beyond flashcards and quizzes.

Reminder timing, notification controls, and the additional study formats have not been specified.

## 7. Explicit exclusions

- No user-to-user chat.
- No leaderboard.
- Do not copy Quizlet's product or interface; QuizMe should have its own visual identity and interaction design.
- No advertisements.

## 8. Wireframe interpretation

The attached whiteboard photo contains two rough screen concepts. These are directional sketches, not final requirements or pixel-level designs.

### Home / dashboard concept

The sketch appears to include:

- A top navigation bar with several sections and a profile control.
- QuizMe branding and a personalized greeting.
- A short motivational statement.
- A prominent **Create a study set** action.
- **Upload notes** and **Explore topics** actions.
- A **Recents** list of study materials or sets.

The number and names of navigation sections, note-import behavior, and topic discovery model are not yet defined. Treat upload and explore as wireframe ideas to validate, not confirmed must-haves.

### Quiz concept

The sketch appears to include:

- A back control and quiz heading.
- A question, likely multiple choice.
- Four answer options labeled A–D.
- **Skip** and **Next** controls.

The sketch does not establish whether selecting an answer immediately reveals correctness, how progress is shown, or what happens after the final question. Define these behaviors in a later interaction-design pass.

## 9. Key user journeys

### Start studying

1. Student opens the home screen.
2. Student creates or chooses a study set, or explores a topic.
3. Student chooses flashcards or a practice quiz.
4. Student completes a session and receives feedback on what to review.

### Resume recent study

1. Student opens the home screen.
2. Student selects an item from Recents.
3. Student continues studying and sees relevant review feedback afterward.

These journeys are based on the provided notes and wireframes; account setup, saving, and data-management details are undecided.

## 10. Initial scope guidance

For an initial usable version, prioritize:

1. A focused home screen with clear entry points to study.
2. Study sets that can be used for flashcards and quizzes.
3. A basic quiz flow with multiple-choice questions, skip, and next actions.
4. A results/review screen that identifies material needing more practice.

Treat streaks, reminders, and extra study modes as later enhancements unless project planning changes their priority. Importing notes and exploring a catalog require further definition before they can be scoped reliably.

## 11. Open product decisions

- How are study sets created: manually, from notes, from topics, or some combination?
- What file types and extraction behavior would note upload support?
- Does QuizMe provide prepared topic content, or only help students study their own material?
- Which study formats belong in the first version?
- How should students mark flashcards as known or needing review?
- What question types, answer feedback, scoring, and retry behavior should quizzes support?
- How is topic-level performance calculated and presented?
- Are accounts and cross-device sync needed?
- What are the exact IC colors and any usage/branding constraints?
- Should reminders be opt-in, and how should students set dates and frequency?
- What accessibility requirements and target platforms should guide implementation?

## 12. Success measures to define

No numeric targets were provided. The project team should choose measures before launch. Useful candidates include:

- Students can start a study session without confusion.
- Students complete flashcard and quiz sessions.
- Students return to items flagged for review.
- Students report that feedback helps them decide what to study next.

Avoid treating streak length or time spent in the app as the main measure of learning.
