# crisp-help-overlay

Search your Crisp helpdesk from your website. 
Use Ctrl/Cmd+k to launch a search box (or the selector `.launch-crisp-search`).

## Adding to your website

Add the following script tag:

```html
<script src="https://search.instantreplay.io/search-help.js" data-crisp-helpdesk="help.crisp.chat/en"></script>
```

Make sure `data-crisp-helpdesk` is the value of your helpdesk!

## Launching from a button

You can optionally launch the search box from a button on your website. Just add the class `launch-crisp-search`.

Example:

```html
<button class="launch-crisp-search">Search Documentation</button>
```


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
