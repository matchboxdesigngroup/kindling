# Kindling — A WordPress Block Theme

Kindling is a modern, responsive, and accessible WordPress block theme created by [Matchbox Design Group](https://matchboxdesigngroup.com).

It’s built to take full advantage of **Full Site Editing (FSE)**, offering flexible templates, patterns, and design controls through `theme.json`.

---

## Overview

Kindling can be used as a **starter theme** for custom projects or as a **parent theme** for Matchbox-built sites.
It includes foundational design tokens, block styles, and a growing library of patterns designed for scalability and maintainability.

---

## Getting Started

1. **Install the theme**

   * Upload the `kindling` folder to your `/wp-content/themes/` directory.
   * Activate it from your WordPress dashboard under **Appearance → Themes**.

2. **Edit with the Site Editor**

   * Customize templates, template parts, and styles directly in **Appearance → Editor**.
   * Use the provided block patterns to build pages quickly and maintain design consistency.

3. **Customize Design Tokens**

   * Adjust typography, color palettes, gradients, and spacing via `theme.json`.
   * Add new patterns or block variations as needed.

---

## Features

* WordPress 6.6+ **Full Site Editing** support
* Configurable design tokens via `theme.json`
* Predefined global color palette and gradients
* Custom block styles and pattern library
* Accessibility-conscious markup and contrast
* Lightweight, performant structure with minimal dependencies

---

## Internationalization

* All strings are fully translatable
* Text domain: `kindling`
* Language files located in `/languages/`
* Load with:

  ```php
  load_theme_textdomain( 'kindling', get_template_directory() . '/languages' );
  ```

---

## License

Kindling is distributed under the **GNU General Public License v2 or later**.
See the [LICENSE](./LICENSE) file for details.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and release notes.

---

## Support & Contributions

This theme is maintained by the Matchbox Design Group team.
Bug reports, feature requests, and contributions are welcome via the repository’s issue tracker.
