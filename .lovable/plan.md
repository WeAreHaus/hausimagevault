

# Plan: User Management section on Settings page

## What

Add a "User Management" card below the WordPress Integration card on the Settings page. It will be a dummy UI (no backend) that lets admins invite users and assign them to existing roles (`admin` / `supplier`).

## Changes

### `src/pages/Settings.tsx`
- Add a second `<Card>` section titled **"User Management"** with description *"Invite team members and manage their access levels."*
- Mock user list stored in `useState` with a few default entries (e.g. "Anna Lindgren — Admin", "Erik Holm — Supplier")
- Each user row shows: name, email, role badge, and a remove button
- **"Invite User" form** at the bottom: email input + role select (`admin` / `supplier`) + "Send Invite" button
- On invite: adds to the local list with a "Pending" badge, shows a toast
- On remove: removes from list, shows a toast
- Role descriptions shown as helper text:
  - **Admin**: Full access — manage images, buckets, shares, settings and users
  - **Supplier**: Can upload images and edit metadata, but cannot manage settings or users

