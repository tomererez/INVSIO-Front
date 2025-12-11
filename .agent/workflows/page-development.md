---
description: How to safely develop, test, and deploy page-level changes without impacting production
---

# Page Development Workflow

This workflow ensures safe and isolated development of page changes by working on duplicated files before merging into the main codebase.

---

## Steps

### 1. Select the Page
- Identify the target page (e.g. `Home.jsx`, `Login.jsx`)
- Clearly define the scope of changes before starting

---

### 2. Duplicate the Page
- Create a working copy of the page:
  - `[PageName]Work.jsx`
  - Example: `Login.jsx` → `LoginWork.jsx`

- If the page uses section components:
  - Create a dedicated folder:
    - `components/sections/[pagename]-work/`
  - Duplicate all related section components into this folder

---

### 3. Add a Temporary Route
- Import the duplicated page into `App.jsx`
- Add a temporary test route (e.g. `/login-work`)
- **Do NOT modify the original route under any circumstance**

---

### 4. Develop on the Duplicated Files Only
- Make all changes **only** in the duplicated page and its components
- Test via the temporary route (`/login-work`)
- Iterate freely until the implementation is complete

> **CRITICAL RULE:**  
> Never touch the original page or components during this phase.

---

### 5. Review & Approval
- Compare the working version with the original
- Confirm functionality, layout, and behavior
- Document any non-trivial differences if needed

---

### 6. Merge Into Production
- Copy the approved changes into the original page and components
- Test the original route to ensure stability

---

### 7. Cleanup (Mandatory)
After successful deployment, remove all temporary files:

- ✅ Delete the duplicated page file (`[PageName]Work.jsx`)
- ✅ Remove the duplicated section folder (`[pagename]-work/`)
- ✅ Remove temporary imports and routes from `App.jsx`
- ✅ Run a quick search to ensure no leftover references exist

---

## Summary Flow
```
DECIDE → DUPLICATE → ADD ROUTE → WORK ON DUPLICATE → REVIEW → IMPLEMENT → CLEANUP
```

> [!IMPORTANT]  
> All experimentation happens on duplicated files.  
> Production files are only touched after approval.
