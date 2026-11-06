# Paste Up

A card editor for board game translators. Write each card's translation into an HTML template, print the pieces on A4 paper, cut them out, and lay each piece over a card's text. The translation covers only the text, so the rest of the card's artwork stays visible.

Projects are saved in the browser. The project menu in the header switches between them and starts new ones, Export downloads the current project as a JSON file, and Import adds a JSON file as a new project.

The interface is available in 繁體中文 (zh-TW), 简体中文 (zh-CN), 日本語 (ja-JP), 한국어 (ko-KR) and English (en-US). It follows the browser language until a language is picked from the header menu. Translations run on i18next. The messages live in `src/i18n/locales/`, one flat JSON file per language with the same keys as `en-US.json`. In the messages, `{{count}}` is an i18next variable, and tags such as `<size/>` mark where the instructions place a code sample. `pnpm build` fails when a language is missing a key or the code uses a key that does not exist.

## Examples

The `examples` folder holds translation projects for three invented board games, each translated from English into Traditional Chinese. Add one with the buttons at the bottom of the Instructions dialog, or load its file with the Import button. A browser with no saved project opens `ember-harbor.json`, and the first edit saves it as that browser's own project. Each piece shows the English card name and a card code, so the pieces can be matched to their cards after cutting.

- **ember-harbor.json** - 餘燼港, a deck-building game - rules-box overlays, starter and market folders, several copies per card, a hidden promo card
- **clockwork-orchard.json** - 發條果園, an engine-building game - narrow ability strips for tableau cards and a second template for objective cards
- **starward-couriers.json** - 星際快遞, a pick-up-and-deliver game - event-card overlays and full-card player aids, spaced apart with a page class name

## Links

https://elantris.github.io/paste-up
