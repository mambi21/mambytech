# Before launch: information needed from the owner

Run `npm run content:check` for the full, line-by-line list.

## Content
- [ ] **Glomaf:** what it is, who it's for, the technology, your role, its status, and any public links or screenshots.
- [ ] **AWS infrastructure project:** a specific title, the services used, the architecture, implementation steps, how it was verified, real outcomes, and status. A diagram if you have one.
- [ ] **Linux administration/automation project:** the same details, and whether its category is Linux or DevOps.
- [ ] **About page:** a short personal introduction, confirmed interests, the engineering principles you actually follow, and your current learning focus.
- [ ] **Skills:** mark the tools you can demonstrate as `confirmed: true` and delete the rest. The Python, Java, C#, SQL and data-structures suggestions are unverified guesses.
- [ ] **Public profiles (optional):** GitHub and LinkedIn URLs, if you want them shown.

## Services and accounts
- [x] **Domain:** mambytech.com is registered and active on Cloudflare.
- [ ] **Site URL:** set `NEXT_PUBLIC_SITE_URL=https://mambytech.com` in the Worker's build variables.
- [ ] **Email delivery:** create a Resend account, verify the sending domain, and provide the inbox address that should receive messages.
- [ ] **Hosting:** Cloudflare Workers is chosen and configured in the repository. Still to do: connect the repository in Cloudflare, add the custom domain, and optionally add Upstash Redis for shared rate limiting. See the README's deployment section.
- [ ] **Privacy:** confirm the retention wording ("kept only as long as needed to respond and follow up") matches how you handle messages.
