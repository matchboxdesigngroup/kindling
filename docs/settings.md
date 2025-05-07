# Settings

`settings` is a top-level property in `theme.json` and has multiple nested properties.

```
{
	"version": 3,
	"settings": {
		"appearanceTools": true,
		"border": {},
		"color": {},
		"custom": {},
		"dimensions": {},
		"layout": {},
		"position": {},
		"shadow": {},
		"spacing": {},
		"typography": {},
		"useRootPaddingAwareAlignments": true,
		"blocks": {}
	}
}
```

## Layout settings

The `settings.layout` property is an object that stores settings to control the default widths for "content" and "wide" sizes.

The properties we define are:

- `allowCustomContentAndWideSize`: A boolean to show/hide the inputs for the content and wide widths in the layout settings of the Group block.
- `contentSize`: A valid CSS length value for defining the default width for prose style content.
- `wideSize`: A valid CSS length value for defining the default wide alignment width. Think of this as the container width from the Bootstrap days.

### Resources

- [Layout](https://developer.wordpress.org/themes/global-settings-and-styles/settings/layout/) (WordPress Theme Handbook)
- [Theme.json layout and spacing options](https://fullsiteediting.com/lessons/theme-json-layout-and-spacing-options/) (Full Site Editing)
