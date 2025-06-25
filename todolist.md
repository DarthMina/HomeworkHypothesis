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

### 🧪 TASK 1: Course Page Redesign (`CoursePage.jsx`)
> The course page should ONLY show user-created courses in a cute and compact card view.

- [ ] Create course cards styled with Tailwind:
  - Use chosen pastel color code as **border color** (e.g., `border-pink-300`)
  - Show selected **emoji icon** next to the course name (🧬🔬🧠🧪 etc.)
- [ ] Add "New Course" modal form with:
  - [ ] Course name (text)
  - [ ] Field of study selector (dropdown: physics, biology, chemistry, astronomy, computer science, math, medical science) — **10 curated emojis per field**
  - [ ] Color picker (pastel color values)
  - [ ] Dropdown: Exam type (`Written`, `Oral`, `Presentation`, `Take-home`, `None`, `Other`)
  - [ ] Optional: Exam date (`<input type="date" />`)
  - [ ] Optional: Course description (multiline text box)
  - [ ] Multi-select course type (Lecture, Seminar, Workshop, Lab, Practicum, Other)
- [ ] Save course data to `localStorage`
- [ ] Load + render courses from storage on each visit
- [ ] Support deleting a course with confirmation modal

---

### 📚 TASK 2: Homework/Study Page (`HomeworkPage.jsx`)
> This page handles all XP/point-based tasks, separate from the course page.

- [ ] Display list of active homework/study tasks
- [ ] Add "New Task" modal with:
  - [ ] Task type selector (dropdown): Study session, Homework, Essay, Lab report, Assignment, Thesis, Exam prep
  - [ ] Task title
  - [ ] Course it belongs to (dropdown populated from saved courses)
  - [ ] Deadline date picker
  - [ ] Description text box (optional)
- [ ] Tasks should show with deadline, course, and type
- [ ] Include a "Finish Task" button on each task:
  - When clicked:
    - [ ] Show modal: "Are you sure you're done? This decision is permanent!"
    - [ ] Options: "Yes, I am sure!" ✅ and "Oops, no wait!" ❌
    - [ ] If confirmed, move task to **hazardous waste bin**
    - [ ] Show animated modal: "🎉 Congratulations! Your task has been moved to the hazardous waste bin!" with floating ⚛️☢️ symbols
    - [ ] Award XP and Points (use `utils/xpSystem.js`)
    - [ ] Update profile's "Tasks Completed" counter in localStorage

---

### 🧼 TASK 3: Shared Components to Build
- [ ] `<EmojiSelector />` – 10 icons per subject field
- [ ] `<ColorBorderCard />` – accepts pastel color and renders card
- [ ] `<MultiSelectCheckbox />` – for choosing course types
- [ ] `<TaskRewardModal />` – for finishing tasks + showing XP/Points
- [ ] `<ConfirmModal />` – reusable for delete and "are you done?" confirmation

---

### 🧠 Storage & Logic
- Use `localStorage` via custom hooks:
  - `useCourses()`, `useTasks()`, `useProfileStats()`
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

### Phase 1: Course Management
- [ ] Create `useCourses` hook for localStorage management
- [ ] Build `EmojiSelector` component with field-specific emojis
- [ ] Create `ColorBorderCard` component
- [ ] Implement `MultiSelectCheckbox` component
- [ ] Build `ConfirmModal` component
- [ ] Redesign `CoursePage.jsx` with new components
- [ ] Test course creation, editing, and deletion

### Phase 2: Task Management
- [ ] Create `useTasks` hook for localStorage management
- [ ] Build `TaskRewardModal` component with animations
- [ ] Implement `HomeworkPage.jsx` with task list
- [ ] Add task creation modal with course integration
- [ ] Implement task completion flow with XP rewards
- [ ] Test task lifecycle from creation to completion

### Phase 3: Integration & Polish
- [ ] Update profile stats to reflect task completion
- [ ] Ensure all animations work smoothly
- [ ] Test responsive design on mobile and desktop
- [ ] Verify localStorage persistence
- [ ] Add error handling and validation
- [ ] Final testing and bug fixes

---

## 🎯 Success Criteria
- [ ] Users can create and manage courses with visual feedback
- [ ] Tasks are properly linked to courses
- [ ] XP and points are awarded correctly
- [ ] All modals and confirmations work smoothly
- [ ] Data persists across browser sessions
- [ ] UI is responsive and animated
- [ ] No console errors or warnings 