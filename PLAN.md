# Admin / Markdown Article Pipeline — Fix Plan

Analysis of the admin section (exhibition CRUD + markdown editor + article rendering).
Findings are tracked here; each fix is a separate commit.

## Verified empirically (against the live PocketBase)
- PB collections `exhibitions`, `exhibitionsFiles`, `galleries` are public for read.
- PB write rules only require *any* authenticated `users` record — the secondary user
  (`annamaria.plischka@uni-muenster.de`) can create/update/delete exhibitions via PB.
  => The app has no admin-role check; any logged-in user can use /admin and the mutation API.

## Status legend
- [x] done  [ ] todo

## Fixes (commit per item)

### Correctness
- [x] 1. Public article serves `live` (published) markdown; preview serves `preview` (draft).
       `src/routes/[locale]/[type]/[exhibitionId]/+page.server.ts` currently always reads `preview`.
- [x] 2. `addNewExhibition` reads missing template files (`.../markdown/{en,de}/new.md`).
       Inline a blank template; validate/trim title; guard null FormData.

### Security / authorization
- [x] 3. Enforce admin-only on /admin pages, preview route and mutating API ops.
       New `src/lib/auth.server.ts` (isAdmin via ADMIN_EMAIL, requireAdmin helper).
       Keep `getGallery` + `getExhibitionsList` public (used by public pages).
- [x] 4. Stop trusting client-supplied `collection`/`field` in `updateFile`; hardcode.
- [x] 5. Login: non-admin authenticated users get a clear rejection (no redirect loop).

### Editing / locking
- [x] 6. Server-side lock enforcement in `updateFile` + `changeEditingBy` (423 when locked by other).
- [x] 7. Editor: claim lock once on mount; autosave only on real edits; fix stale
       save/publish timestamps (use API response); init `activeLang` from file; remove
       `goto` from `$effect`; fix `bind:value` on read-only Markdown.
- [x] 8. Add "Revert to published" (copy `live` back into `preview`) — cheap undo without schema change.
- [x] 8b. Add "Take over editing" (admin force-unlock) for files locked by another user.

### Data safety / UX
- [x] 9. Delete exhibition: confirmation + await all file deletions; fix dead `if (!exhibition)`.
- [x] 10. Frontmatter parser: tolerate CRLF/trailing newline variants.
- [x] 11. Sanitize/escape gallery title+caption (`{@html}` XSS) and hero `img` style URL.

### Cleanup / quality
- [x] 12. Remove dead code: `deleteFile`, `getGalleryImgUrls` route; fix `:gloabl` typo.
- [x] 13. Button a11y: remove hardcoded "Open Popover"; aria-label only when icon-only.
- [x] 14. Fix `npm run check` errors in admin files (FormData types, bind:value).
- [x] 15. Fix cron stale-lock filter (`editingBy > 0` -> `editingBy != ''`).
- [x] 16. Localize admin UI (de/en) — admin list, editor, delete button, login form.

## Deferred (need PocketBase superuser / schema change — documented, not code)
- PB collection rules: restrict write to the admin user id/email. Recommended PocketBase
  rules (apply to `exhibitions` and `exhibitionsFiles`):
  - create/update/delete rule: `@request.auth.email = "francesco.bruno001@gmail.com"`
  - (or pin the id: `@request.auth.id = "9et6s29yi48l152"`)
  Keep list/view rules public so articles still render for visitors.
- Revision history (new collection or JSON field) — partially mitigated by #8 revert-to-live.
- Gallery management UI (needs galleries schema knowledge + upload flow).

## Verification
- [x] `npm run check` — 0 errors in `src/**` (5 remaining are pre-existing in the
      `databaseMusiconn` submodule, out of scope)
- [x] `npm run build`
- [x] agent-browser E2E (against a disposable exhibition, then deleted):
  - secondary user login rejected ("This account is not an administrator")
  - unauthenticated /admin redirects to /login
  - admin login -> list -> add exhibition (inline blank template) -> edit
  - autosave shows timestamp from the API response
  - publish -> public `/en/exhibitions/:id` shows published content while
    `/en/preview/:id` shows the newer draft (live vs preview split confirmed)
  - delete with confirm dialog removes the exhibition and its files (no orphans)
  - en/de language switch navigates to the correct file without redirect loops
  - locked file shows read-only view; "Take over editing" clears the lock and
    returns the editor to editable mode
  - i18n smoke test: login and admin list render localized strings (en verified)
