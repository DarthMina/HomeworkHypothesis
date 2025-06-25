# 🧪 The Homework Hypothesis - Development Todo List

You are an expert AI programming assistant working in a React + Tailwind CSS environment. Your goal is to redesign the `CoursePage.jsx` and implement a new `HomeworkPage.jsx` with modular, animated, and responsive UI. Follow atomic component design. Keep all logic split into clean files. Use vanilla JavaScript for utility logic.

## 💡 Cursor Context Rules Recap
- Clear, modern, and bug-free React + TailwindCSS components
- Components must be mobile and desktop friendly
- Use localStorage to persist user data
- Use fully functional dropdowns, modals, and confirmation boxes
- Keep CSS animations via Tailwind classes (no third-party animation libs)
- Use minimal prose in code, no TODOs or placeholders

---

### ✅ TASK 1: Course Page Redesign (`CoursePage.jsx`) - COMPLETED
> The course page should ONLY show user-created courses in a cute and compact card view.

- [x] Create course cards styled with Tailwind:
  - Use chosen pastel color code as **border color** (e.g., `border-pink-300`)
  - Show selected **emoji icon** next to the course name (🧬🔬🧠🧪 etc.)
- [x] Add "New Course" modal form with:
  - [x] Course name (text)
  - [x] Field of study selector (dropdown: physics, biology, chemistry, astronomy, computer science, math, medical science) — **10 curated emojis per field**
  - [x] Color picker (pastel color values)
  - [x] Dropdown: Exam type (`Written`, `Oral`, `Presentation`, `Take-home`, `None`, `Other`)
  - [x] Optional: Exam date (`<input type="date" />`)
  - [x] Optional: Course description (multiline text box)
  - [x] Multi-select course type (Lecture, Seminar, Workshop, Lab, Practicum, Other)
- [x] Save course data to `localStorage`
- [x] Load + render courses from storage on each visit
- [x] Support deleting a course with confirmation modal

---

### 📚 TASK 2: Homework/Study Page (`HomeworkPage.jsx`) - COMPLETED
> This page handles all XP/point-based tasks, separate from the course page.

- [x] Display list of active homework/study tasks
- [x] Add "New Task" modal with:
  - [x] Task type selector (dropdown): Study session, Homework, Essay, Lab report, Assignment, Thesis, Exam prep
  - [x] Task title
  - [x] Course it belongs to (dropdown populated from saved courses)
  - [x] Deadline date picker
  - [x] Description text box (optional)
- [x] Tasks should show with deadline, course, and type
- [x] Include a "Finish Task" button on each task:
  - When clicked:
    - [x] Show modal: "Are you sure you're done? This decision is permanent!"
    - [x] Options: "Yes, I am sure!" ✅ and "Oops, no wait!" ❌
    - [x] If confirmed, move task to **hazardous waste bin**
    - [x] Show animated modal: "🎉 Congratulations! Your task has been moved to the hazardous waste bin!" with floating ⚛️☢️ symbols
    - [x] Award XP and Points (use `utils/xpSystem.js`)
    - [x] Update profile's "Tasks Completed" counter in localStorage

---

### ✅ TASK 3: Shared Components to Build - COMPLETED
- [x] `<EmojiSelector />` – 10 icons per subject field
- [x] `<ColorBorderCard />` – accepts pastel color and renders card
- [x] `<MultiSelectCheckbox />` – for choosing course types
- [x] `<TaskRewardModal />` – for finishing tasks + showing XP/Points
- [x] `<ConfirmModal />` – reusable for delete and "are you done?" confirmation

---

### 🧠 Storage & Logic
- Use `localStorage` via custom hooks:
  - [x] `useCourses()`, [x] `useTasks()`, [x] `useProfileStats()`
- XP and Points logic:
  - Task type defines reward multiplier (Essay = more than Study Session)
  - Store levels, XP, task count via `profile.json` in localStorage

---

### 🪄 Styling Notes
- Border colors = user-picked pastels
- Buttons animate: `hover:bg-indigo-800`, `hover:shadow-glow`, `transition-all duration-300`
- Use emoji as icons. No image icons.
- Profile should show tasks completed counter live from `HomeworkPage.jsx` events

Begin building with the CoursePage redesign. Once that's functional, continue to HomeworkPage.

---

## 📋 Implementation Checklist

### ✅ Phase 1: Course Management - COMPLETED
- [x] Create `useCourses` hook for localStorage management
- [x] Build `EmojiSelector` component with field-specific emojis
- [x] Create `ColorBorderCard` component
- [x] Implement `MultiSelectCheckbox` component
- [x] Build `ConfirmModal` component
- [x] Redesign `CoursePage.jsx` with new components
- [x] Test course creation, editing, and deletion

### ✅ Phase 2: Task Management - COMPLETED
- [x] Create `useTasks` hook for localStorage management
- [x] Build `TaskRewardModal` component with animations
- [x] Implement `HomeworkPage.jsx` with task list
- [x] Add task creation modal with course integration
- [x] Implement task completion flow with XP rewards
- [x] Test task lifecycle from creation to completion

### Phase 3: Integration & Polish
- [x] Update profile stats to reflect task completion
- [ ] Ensure all animations work smoothly
- [ ] Test responsive design on mobile and desktop
- [ ] Verify localStorage persistence
- [ ] Add error handling and validation
- [ ] Final testing and bug fixes

---

## 🎯 Success Criteria
- [x] Users can create and manage courses with visual feedback
- [x] Tasks are properly linked to courses
- [x] XP and points are awarded correctly
- [x] All modals and confirmations work smoothly
- [x] Data persists across browser sessions
- [ ] UI is responsive and animated
- [ ] No console errors or warnings 