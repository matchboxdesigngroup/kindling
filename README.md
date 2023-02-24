## Overview

Repository for the Kindling WordPress theme by the Matchbox Design Group.

A block theme for WordPress that supports the Full Site Editing features.

## Instructions

<details>
  <summary>Requirements</summary>

* [Composer](https://getcomposer.org/download/) >= 2
* [Node.js](http://nodejs.org/) = 16
* [npm](https://www.npmjs.com/) = 8, this is what the current package-lock.json file is built from. Use `npm ci` instead of `npm install` to preserve dependency lock.
* [PHP](https://secure.php.net/manual/en/install.php) >= 8.1 (with [`php-mbstring`](https://secure.php.net/manual/en/book.mbstring.php) enabled)
* [WordPress](https://wordpress.org/) >= 6.1
* [Yarn](https://yarnpkg.com/en/docs/install)

</details>

<details>
  <summary>Installation</summary>

### Create a Local Environment

*Our recommended method for all Matchbox team members is to clone the repository*

  ```sh
  git clone git@github.com:matchboxdesigngroup/kindling.git
  ```

### Build the Theme

  ```sh
  # @ wp-content/themes/kindling/
  $ cd wp-content/themes/kindling/
  $ composer install
  $ nvm use 16
  $ npm ci
  $ npm dev or npm prod
  ```

</details>

#### Build Commands

From within the `/wp-content/themes/kindling` folder:

* `npm run dev` or `yarn dev` — Compile assets when file changes are made, start Browsersync session
* `npm run build` or `yarn build` — Compile and optimize the files in your assets directory

</details>

## Helpful Links

* [Full Site Editing](https://fullsiteediting.com/)
