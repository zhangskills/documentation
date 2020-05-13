# Integrate a relevant search bar to your documentation

You might have noticed the search bar in this documentation.

![MeiliSearch docs search bar demo](/tuto-searchbar-for-docs/vuepress-searchbar-demo.gif)

And you are probably wanting the same for your own documentation!

This tutorial aims to explain in detail the required steps to set up a relevant and powerful search bar in your documentation with MeiliSearch 🚀

1. [Run a MeiliSearch Instance](#run-a-meilisearch-instance)
2. [Scrap your content](#scrap-your-content)
3. [Integrate the Search Bar](#integrate-the-search-bar)

## Run a MeiliSearch Instance

First of all, you need your documentation content to be scraped and pushed into a MeiliSearch instance.

This can be done in a few steps. MeiliSearch is open-source and can run on your own server!

Check out this well-explained tutorial about [how to run MeiliSearch in production](/resources/tutorials/running_production.md).
If you get used to the DigitalOcean droplets, you can easily [create one](https://marketplace.digitalocean.com/apps/meilisearch?action=deploy&refcode=7c67bd97e101).

::: note

The host URL and the API key you will provide in the next steps correspond to the credentials of this MeiliSearch instance.

:::

## Scrap your Content

The Meili team provides and maintains a [scraper tool](https://github.com/meilisearch/docs-scraper) to scrap your website content and automatically index it into MeiliSearch.

### Configuration File

The scraper needs a configuration file to know the content to be scraped thanks to the selectors (e.g. the HTML tag).

Here is a basic configuration file:

```json
{
  "index_uid": "docs",
  "start_urls": ["https://www.example.com/doc/"],
  "sitemap_urls": ["https://www.example.com/sitemap.xml"],
  "stop_urls": [],
  "selectors": {
    "lvl0": {
      "selector": ".docs-lvl0",
      "global": true,
      "default_value": "Documentation"
    },
    "lvl1": {
      "selector": ".docs-lvl1",
      "global": true,
      "default_value": "Chapter"
    },
    "lvl2": ".docs-content .docs-lvl2",
    "lvl3": ".docs-content .docs-lvl3",
    "lvl4": ".docs-content .docs-lvl4",
    "lvl5": ".docs-content .docs-lvl5",
    "lvl6": ".docs-content .docs-lvl6",
    "text": ".docs-content p, .docs-content li"
  }
}
```

The `index_uid` field is the index identifier in your MeiliSearch instance in which your website content is stored. The scraping tool will create a new index if it does not exist.

The `docs-content` class is the main container of your textual content. Most of the time, this tag is a `<main>` or an `<article>` HTML element.

`lvlX` selectors should use the standard title tags like `h1`, `h2`, `h3`, etc. You can also use static classes. Set a unique id or name attribute to these elements.

Every searchable `lvl` elements outside this main documentation container (for instance, in a sidebar) must be `global` selectors. They will be globally picked up and injected to every record built from your page.

If you use Vuepress for your documentation, you can check out the [configuration file](https://github.com/meilisearch/documentation/blob/master/.vuepress/scraper/config.json) we use in production.
In our case, the main container is `theme-default-content` and the selector the titles and sub-titles are `h1`, `h2`...

### Run the Scraper

You can run the scraper with Docker:

```bash
$ docker run -t --rm \
    -e MEILISEARCH_HOST_URL=<your-meilisearch-host-url> \
    -e MEILISEARCH_API_KEY=<your-meilisearch-api-key> \
    -v <absolute-path-to-your-config-file>:/docs-scraper/config.json \
    getmeili/docs-scraper:v0.9.0 pipenv run ./docs_scraper config.json
```

::: note

If you don't want to use Docker, here are [other ways to run the scraper](https://github.com/meilisearch/docs-scraper#installation-and-usage).

:::

`<your-meilisearch-host-url>` and `<your-meilisearch-api-key>` should be replaced by the credentials of the MeiliSearch instance you set up at [the first step](./search_bar_for_docs.md#run-a-meilisearch-instance).
`<absolute-path-to-your-config-file>` should be the **absolute** path of your configuration file defined at [the previous step](./search_bar_for_docs.md#configuration-file).

The API key you must provide should have the permissions to add documents into your MeiliSearch instance. Thus, you need to provide the private key or the master key.
_More about [MeiliSearch authentication](/guides/advanced_guides/authentication.md)._

::: tip

We recommend running the scraper at each new deployment of your documentation, [as we do for the MeiliSearch's one](https://github.com/meilisearch/documentation/blob/master/.github/workflows/gh-pages-scraping.yml).

:::

## Integrate the Search Bar

If your documentation is not a Vuepress application, you can directly go to [this section](#for-all-kinds-of-documentation).

### For a Vuepress Documentation

If you use Vuepress for your documentation, we provide a [Vuepress plugin](https://github.com/meilisearch/vuepress-plugin-meilisearch). This plugin is used in production in the MeiliSearch documentation.

![Vuepress plugin example](/tuto-searchbar-for-docs/vuepress-plugin-example.png)

In your Vuepress project:

```bash
$ yarn add vuepress-plugin-meilisearch
# or
$ npm install vuepress-plugin-meilisearch
```

In your `config.js` file:

```js
module.exports = {
  plugins: [
    [
      "vuepress-plugin-meilisearch",
      {
        "hostUrl": "https://mymeilisearch.com",
        "apiKey": "XXX",
        "indexUid": "docs"
      }
    ],
  ],
}
```

The `hostUrl` and the `apiKey` fields are the credentials of the MeiliSearch instance you set up at [the first step](./search_bar_for_docs.md#run-a-meilisearch-instance).
`indexUid` is the index identifier in your MeiliSearch instance in which your website content is stored. It has been defined in the [config file](./search_bar_for_docs.md#configuration-file).

These three fields are mandatory, but more [optional fields are available](https://github.com/meilisearch/vuepress-plugin-meilisearch#customization) to customize your search bar.

::: warning

Since the configuration file is public, we recommend providing the MeiliSearch public key, which is enough to perform search requests.
Read more about [MeiliSearch authentication](/guides/advanced_guides/authentication.md).

:::

### For All Kinds of Documentation

If you don't use Vuepress for your documentation, we provide a [JS and CSS library](https://github.com/meilisearch/docs-searchbar.js) to integrate a powerful and relevant search bar to any documentation website.

![docs-searchbar.js example](/tuto-searchbar-for-docs/docs-searchbar-example.png)

```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docs-searchbar.js@{version}/dist/cdn/docs-searchbar.min.css" />
  </head>

  <body>
    <input type="search" id="search-bar-input">
    <script src="https://cdn.jsdelivr.net/npm/docs-searchbar.js@{version}/dist/cdn/docs-searchbar.min.js"></script>
    <script>
      docsSearchBar({
        hostUrl: 'https://mymeilisearch.com',
        apiKey: 'XXX',
        indexUid: 'docs',
        inputSelector: '#search-bar-input',
        debug: true // Set debug to true if you want to inspect the dropdown
      });
    </script>
  </body>
</html>
```

The `hostUrl` and the `apiKey` are the credentials of the MeiliSearch instance you set up at [the first step](./search_bar_for_docs.md#run-a-meilisearch-instance).
`indexUid` is the index identifier in your MeiliSearch instance in which your website content is stored. It has been defined in the [config file](./search_bar_for_docs.md#configuration-file).
`inputSelector` is the `id` attribute of the HTML search input tag.

::: warning

We recommend providing the MeiliSearch public key, which is enough to perform search requests.
Read more about [MeiliSearch authentication](/guides/advanced_guides/authentication.md).

:::

The default behavior of this library fits perfectly for a documentation search bar, but you might need [some customizations](https://github.com/meilisearch/docs-searchbar.js#customization).

::: note

For more concrete examples, you can check out this [basic HTML file](https://github.com/meilisearch/docs-searchbar.js/blob/master/scripts/playground.html) or [this more advanced Vue file](https://github.com/meilisearch/vuepress-plugin-meilisearch/blob/master/MeiliSearchBox.vue).

:::
