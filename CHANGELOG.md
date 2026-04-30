# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Released]

## [[1.1.0](https://github.com/McGRiMTV/link-shortener/releases/tag/v1.1.0)] - 2026-04-30

### Added
- Password Protection: Ability to set links to password protected which will route viewers to a page prompting them to insert a password to view the destination

## [[1.0.0](https://github.com/McGRiMTV/link-shortener/releases/tag/v1.0.0)] - 2026-04-23

### Added
- Express & PostgreSQL Backend: Core routing and database integration for storing, querying, and redirecting custom short links.
- Admin Authentication: Session-based login panel using environment variables for secure, database-free credential management.
- Dashboard Interface: EJS-rendered frontend featuring a dark, Discord-inspired UI for creating, viewing, and deleting active links.
- Click Tracking: Automatic incrementing of a clicks counter every time a shortlink is successfully resolved.
- Reserved Word Protection: Built-in blocklist to prevent custom names from overriding essential application routes (e.g. `/dashboard`, `/login`, `/logout`).
- Railway Ready: Pre-configured to utilize Railway's internal reverse proxy (`trust proxy`) and native PostgreSQL connection strings out of the box.