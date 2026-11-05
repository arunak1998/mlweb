# ML Interview Revision Notes

A fast, static notes site for ML interview revision. Built with Next.js, TypeScript and Tailwind CSS.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm run dev` compiles pages as you open them, so clicks feel slower than the live site. To check real speed, run `npm run build`, then `npm run preview`.

## Add a new concept

Everything is in `content/concepts.ts`. You don't need to touch any UI code.

1. Copy an existing concept object inside the `CONCEPTS` array and fill in every field.
2. Place it where you want it. The array order sets the order in the tree and the Prev/Next buttons.
3. Run `npm run build`. A typo in a `related` slug makes the build fail with the slug's name.

The page, tree entry, search and link preview are all created automatically.

- **Place it in the tree:** set `parent` to the slug of the concept it branches from, in the same category. Leave it out to branch directly from the category.
- **Add a new category:** add the name to `CATEGORIES`.
- **Add a diagram:** set `diagram` to one of the `DiagramId` values. New diagrams go in `components/Diagram.tsx`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On [vercel.com/new](https://vercel.com/new), import the repo and click **Deploy**. No settings are needed.
3. In the Vercel project, open **Analytics** and click **Enable**. Visits and the most-opened concepts then show up under Pages.

Link previews use your production domain automatically, including a custom domain.
