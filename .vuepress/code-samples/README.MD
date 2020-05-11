# CODE-SAMPLES

Code-sample is a MeiliSearch vuepress plugin that gathers sample files and add them to the documentation.

Each official MeiliSearch SDK should provide a filled sample file in their respective language. The files are fetched by the documentation on each build.
Each sample of the file is added to the right place in the documentation dependening on its `sampleId`.

## Sample files

Sample files are created based on the `sample-template.yaml` file. 

`sample-template` file:
```yaml
get_one_index_1: |-
list_all_indexes_1: |-
create_an_index_1: |-
...
```

This file is accessible publicly [here](docs.meilisearch.com/sample-template.yaml) or in the public directory : `.vuepress/public/sample-template.yaml`

Each official MeiliSearch SDK should have a sample file at its root with filled with samples in their respective language.
The name of the file should be `.code-samples.meilisearch.yaml`

Javascript example: 
```yaml
get_one_index_1: |-
  client.getIndex('movies').show()
list_all_indexes_1: |-
  client.listIndexes()
create_an_index_1: |-
  client.createIndex({ uid: 'movies' })
  ...
```

The complete `cURL` sample is available at the root of the documentation repository.
Every other SDK sample should be available at the root of their respective repository.

## Samples

By the name of the `sampleId` you should know where that code sample will be added to the documentation. Based on the `cURL` example or directly by going to the right place in the documentation you should see what is expected from that sample.

Each sample is expected to be **written in the respective SDK language**.

There is **one exception** to this rule. 
When the sampleId finishes with `_md` it means it is expected to be written in markdown format. 

### Example

JavaScript sample id:
```yaml
  get_one_index_1: |-
    client.getIndex('movies').show()
```
JavaScript sample id with _md extension:
![javascript sample file](../public/misc/yaml-js-example.png)
