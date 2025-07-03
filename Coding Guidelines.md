## Project

BangClean is a web app for cleaning community.

---

## Tech Spec

* Frontend: TypeScript, React
* Backend: FastAPI
* DB: MySQL
* Server: AWS
* Container: Docker

---

## Frontend Directory

```
Bangcl/
  public/                static assets like png, jpg, svg
  src/
    app/
      [pageName]/
        _features/
          ui/                   page UI component [pageName]PageView.tsx
          lib/
            assets/             svg components with index.ts barrel
            hooks/              custom hooks for the page
        _entities/
          model/
            types.ts            interfaces and DTOs
          api/
            axios.ts            axios functions
            queries.ts          react-query functions
        page.tsx                exports PageView component as NextPage
    shared/
      components/               shared components across pages
      hooks/                    shared hooks across pages
```

---

## Backend Directory

```

```

---

## Implement

* Each page lives under src/app/\[pageName].
* Before building a page, define necessary models and APIs.
* Use shared/ for reusable components like buttons, inputs.
* Export named modules only. Do not use export default.
* Avoid any type. Declare types in types.ts.
* Avoid margin or padding. Prefer gap or h divs.
* Split files larger than 150 lines into smaller components or hooks.
* Do not use React. prefix syntax. Import modules directly.
* Do not use inline functions in JSX. Create handlers like handleButtonClick.
* Do not use inline style attributes.
* Copy SVG from Figma and convert to component. Do not draw manually.
* Avoid position relative, absolute. Prefer flex or grid.

