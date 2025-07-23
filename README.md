# Task Management App

A simple web application for managing employees and their tasks.  
Built with modern technologies including:

- **Next.js** – React framework for fast and scalable frontend development  
- **Zustand** – Lightweight state management  
- **Tailwind CSS** – Utility-first CSS framework for styling  
- **Shadcn UI** – Beautifully designed UI components

---
Directory structure:
└── thongj23-project-skipli/
    ├── README.md
    ├── components.json
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── tsconfig.json
    ├── public/
    └── src/
        ├── app/
        │   ├── globals.css
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── api/
        │   │   └── set-password/
        │   │       └── route.tsx
        │   ├── employee-dashboard/
        │   │   ├── page.tsx
        │   │   └── tasks/
        │   │       └── page.tsx
        │   ├── login/
        │   │   └── page.tsx
        │   ├── owner-dashboard/
        │   │   ├── page.tsx
        │   │   └── task/
        │   │       └── page.tsx
        │   └── setup-password/
        │       └── page.tsx
        ├── components/
        │   ├── Chat.tsx
        │   ├── EmployeeList.tsx
        │   ├── LoginForm.tsx
        │   ├── TaskList.tsx
        │   ├── Employee/
        │   │   ├── EmployeeManagement.tsx
        │   │   ├── EmployeeTable.tsx
        │   │   ├── ModalEmployeeForm.tsx
        │   │   └── Toolbar.tsx
        │   ├── layout/
        │   │   ├── Header.tsx
        │   │   └── Nav.tsx
        │   ├── Login/
        │   │   ├── LoginSelector.tsx
        │   │   ├── Employee/
        │   │   │   └── EmployeeLoginForm.tsx
        │   │   └── Owner/
        │   │       └── OwnerLoginForm.tsx
        │   ├── Task/
        │   │   ├── Employee/
        │   │   │   ├── TaskManagement.tsx
        │   │   │   └── TaskTable.tsx
        │   │   └── Owner/
        │   │       ├── ModalTaskForm.tsx
        │   │       ├── TaskManagement.tsx
        │   │       └── TaskTable.tsx
        │   └── ui/
        │       ├── alert.tsx
        │       ├── button.tsx
        │       ├── dialog.tsx
        │       ├── input.tsx
        │       ├── select.tsx
        │       ├── skeleton.tsx
        │       └── table.tsx
        ├── context/
        │   └── AuthContext.tsx
        ├── hooks/
        │   └── useLogin.ts
        ├── lib/
        │   ├── utils.ts
        │   └── api/
        │       ├── authApi.ts
        │       ├── axiosInstance.ts
        │       ├── employeeApi.ts
        │       └── taskApi.ts
        ├── services/
        │   ├── email.ts
        │   ├── firebase.ts
        │   ├── seedMail.ts
        │   └── socket.ts
        ├── stores/
        │   └── userStore.ts
        └── types/
            ├── employee.ts
            ├── task.ts
            └── user.ts
## Getting Started

1. Install dependencies:
```bash
yarn install
# or
npm install

The following screenshots are stored in the public/screenshots/ folder and displayed