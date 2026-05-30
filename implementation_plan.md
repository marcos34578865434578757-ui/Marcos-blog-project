# Implementation Plan

This plan details the implementation steps for the admin editor improvements.

## 1. Modify `MetaPanel.tsx`
* Replace the free-text input field for adding new categories with a clean and interactive `+ 新建分类` (Create Category) button UI.
* Clicking the button will open a custom text input field.
* A confirm (✓) and cancel (✗) button inline will allow the user to save or dismiss the action.
* Add validation:
  * Ensure the input is not empty.
  * Check against existing categories to prevent duplicates.
  * Call `props.onCategoryChange` with the new category.

## 2. Modify `MarkdownToolbar.tsx`
* Update the toolbar to accept an optional `orientation` prop (`"horizontal" | "vertical"`), defaulting to `"horizontal"`.
* Add tooltips to the buttons so the labels are shown clearly on hover, especially in the vertical orientation where labels can be hidden.
* Add an optional `previewMode` (boolean) and `onTogglePreview` handler to render a preview button (`eye` / `eye-off` icon or custom toggle).
* Clean up the UI buttons so they render compact/icon-only in vertical mode but still retain accessibility and hover tooltips.

## 3. Modify `PostEditor.tsx`
* Use `localCategories` state to hold all the available category options, initialized with `props.initialCategories` and dynamically appending new ones added via `MetaPanel`.
* Position the `MarkdownToolbar` on the left of the editor textarea.
* Use a grid layout and sticky positioning to keep the toolbar pinned to the left of the writing area as the user scrolls.
* Support toggle preview layout directly within the editor workspace if appropriate.

## 4. Modify `globals.css`
* Add layout styles for the left-aligned sticky toolbar.
* Add responsive fallback media queries to display the toolbar horizontally above the textarea on mobile devices/small viewports.
* Provide CSS variables or classes for styling the tooltips and vertical buttons.

## 5. Verification
* Run `npm run build` to verify there are no compilation errors.
