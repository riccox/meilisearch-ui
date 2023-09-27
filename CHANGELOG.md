# Changelog

## [0.6.0](https://github.com/riccox/meilisearch-ui/compare/v0.5.0...v0.6.0) (2023-09-27)


### Features

* add i18n support for chinese gh-60. ([40f1926](https://github.com/riccox/meilisearch-ui/commit/40f1926c41bbee68533ab2b3546e1b6c8e0cbbe8))


### Bug Fixes

* test instance connection loader. ([40f1926](https://github.com/riccox/meilisearch-ui/commit/40f1926c41bbee68533ab2b3546e1b6c8e0cbbe8))

## [0.5.0](https://github.com/riccox/meilisearch-ui/compare/v0.4.1...v0.5.0) (2023-09-20)


### Features

* gh-62 larger pop-up task detail window. ([e310471](https://github.com/riccox/meilisearch-ui/commit/e310471f6573b0159b64d4c3c1c0943936951b8a))


### Performance Improvements

* add dash responsive width. ([e310471](https://github.com/riccox/meilisearch-ui/commit/e310471f6573b0159b64d4c3c1c0943936951b8a))

## [0.4.1](https://github.com/riccox/meilisearch-ui/compare/v0.4.0...v0.4.1) (2023-07-03)


### Bug Fixes

* gh-57 improve search form validation. ([5f1a271](https://github.com/riccox/meilisearch-ui/commit/5f1a2716d4f479e491d388dec65c9c3831d42f0a))

## [0.4.0](https://github.com/riccox/meilisearch-ui/compare/v0.3.1...v0.4.0) (2023-06-21)


### Features

* split upload page from search page. ([a6c9af2](https://github.com/riccox/meilisearch-ui/commit/a6c9af231e262328c982475a619087122aa29536))


### Bug Fixes

* downgrade typescript for build error. ([e7197f1](https://github.com/riccox/meilisearch-ui/commit/e7197f18081f23ec1edfccda298562e5791cf043))
* gh-46 search input error toast. ([f383bbc](https://github.com/riccox/meilisearch-ui/commit/f383bbc83a526e63ac4c998379755d3b5fbc79d5))
* instance key updatedAt display. ([833b7f6](https://github.com/riccox/meilisearch-ui/commit/833b7f6d0773feab2d25f27e7f101bf7b44658f2))
* website logo icon. ([f90a200](https://github.com/riccox/meilisearch-ui/commit/f90a200b8147e9c047d29b7f86354c6ce2637599))


### Performance Improvements

* gh-42 updated queries refetch config. ([47e1337](https://github.com/riccox/meilisearch-ui/commit/47e133721a53f6d0953bf595857902f92034351e))
* header item responsive. ([17db843](https://github.com/riccox/meilisearch-ui/commit/17db843b2bca4602f19bb59c32a69cd5c0b953b8))

## [0.3.1](https://github.com/riccox/meilisearch-ui/compare/v0.3.0...v0.3.1) (2023-05-18)


### Bug Fixes

* stopWords setting tab display name. ([39683ba](https://github.com/riccox/meilisearch-ui/commit/39683ba4add1f2c46239c062156aa3b836d1b4df))

## [0.3.0](https://github.com/riccox/meilisearch-ui/compare/v0.2.3...v0.3.0) (2023-05-12)


### Features

* add base path env config. ([08e7030](https://github.com/riccox/meilisearch-ui/commit/08e7030a1d3f4eb918a9c5ec149d82a44871e45c))
* select instance & index based on dynamic url param. ([8908329](https://github.com/riccox/meilisearch-ui/commit/8908329ceef9e2152f9ddc6a70af6cbca2f52829))

## [0.2.3](https://github.com/riccox/meilisearch-ui/compare/v0.2.2...v0.2.3) (2023-03-31)


### Bug Fixes

* search wrong params make react-query crash. ([19afc90](https://github.com/riccox/meilisearch-ui/commit/19afc90b455d264c982a8cbcf89f607c36c8f8a1))

## [0.2.2](https://github.com/riccox/meilisearch-ui/compare/v0.2.1...v0.2.2) (2023-03-15)


### Performance Improvements

* more friendly Json format in document editor ([2a2b8a8](https://github.com/riccox/meilisearch-ui/commit/2a2b8a8448458ab014c8c9809fceff6fad58ab95))

## [0.2.1](https://github.com/riccox/meilisearch-ui/compare/v0.2.0...v0.2.1) (2023-03-14)


### Build System

* **docker:** rollback to npm start server deploy. ([dca1d8e](https://github.com/riccox/meilisearch-ui/commit/dca1d8ed069d246e3eae992f98995a95a34111a6))

## [0.2.0](https://github.com/riccox/meilisearch-ui/compare/v0.1.6...v0.2.0) (2023-03-11)


### Features

* add Faceting & Pagination components. ([e7b9f6e](https://github.com/riccox/meilisearch-ui/commit/e7b9f6e4cdf2eac3fb257aeb6ee5651846a34da5))
* add RankingRules & StopWords components. ([ad27fd7](https://github.com/riccox/meilisearch-ui/commit/ad27fd7996b98e7ab7b69d507bb378656bde59f7))
* add Synonyms config component. ([fade71b](https://github.com/riccox/meilisearch-ui/commit/fade71b4fd5fc991bf27850a35c62f95b12ae9f7))
* add TypoTolerance config component. ([ca775f2](https://github.com/riccox/meilisearch-ui/commit/ca775f2df974855f7ad97f5df3d792cab18c6b3c))
* FilterableAttributes & ArrayStringInput components completed. ([f3b43a0](https://github.com/riccox/meilisearch-ui/commit/f3b43a084b6540133a05acb6b8a48f8ab8955582))
* multiple setting config component completed. ([99e21bc](https://github.com/riccox/meilisearch-ui/commit/99e21bc8e800f941168de577d23cdc426f7e5e28))


### Performance Improvements

* index setting config tabs style. ([77c8731](https://github.com/riccox/meilisearch-ui/commit/77c8731eeb4b8304bdf46a4f8441cc2ec4269706))
* task card font styles for accessible. ([9401662](https://github.com/riccox/meilisearch-ui/commit/9401662e420af1df8a8d2a0c9cd3e209edfc82ac))

## [0.1.6](https://github.com/riccox/meilisearch-ui/compare/v0.1.5...v0.1.6) (2023-03-06)


### Bug Fixes

* **docker:** docker cmd serve port. ([e37302b](https://github.com/riccox/meilisearch-ui/commit/e37302bc7a4440c8fea9a1d9977d63f883dab0ec))

## [0.1.5](https://github.com/riccox/meilisearch-ui/compare/v0.1.4...v0.1.5) (2023-03-06)


### Performance Improvements

* build chunk split more fine-grained. ([958c4fd](https://github.com/riccox/meilisearch-ui/commit/958c4fd14b6445e066a0d1d71fa20fa64a78f4bb))

## [0.1.4](https://github.com/riccox/meilisearch-ui/compare/v0.1.3...v0.1.4) (2023-03-06)


### Performance Improvements

* speed up init cold start load. ([a78086c](https://github.com/riccox/meilisearch-ui/commit/a78086c5e418117fbd5ad33ea3ef857e126ac450))

## [0.1.3](https://github.com/riccox/meilisearch-ui/compare/v0.1.2...v0.1.3) (2023-03-04)


### Bug Fixes

* index settings parse chaos after type. ([c130744](https://github.com/riccox/meilisearch-ui/commit/c1307441db31566bd720197a6e2703f4a58c569d))

## [0.1.2](https://github.com/riccox/meilisearch-ui/compare/v0.1.1...v0.1.2) (2023-03-04)


### Bug Fixes

* indexes list can not scrollable. ([0956552](https://github.com/riccox/meilisearch-ui/commit/09565524f11304247677c81e9da3447e54c4a82e))

## [0.1.1](https://github.com/riccox/meilisearch-ui/compare/v0.1.0...v0.1.1) (2023-02-13)


### Performance Improvements

* adjust header menu dropdown position. ([d8aa04c](https://github.com/riccox/meilisearch-ui/commit/d8aa04c976a05da7aeb6029a3d0e139e561893a2))
* reorganize global styles. ([44d9ec6](https://github.com/riccox/meilisearch-ui/commit/44d9ec6e102232fe93f252a0aa7314fef6c81f1c))

## [0.1.0](https://github.com/riccox/meilisearch-ui/compare/v0.0.5...v0.1.0) (2023-02-01)


### Features

* gh-2, support json file import way to add documents. ([0c92d89](https://github.com/riccox/meilisearch-ui/commit/0c92d89269afd519d4291403b3a73cc690a6a6f7))


### Performance Improvements

* add sira ui components, add riccox matrix in site footer. ([0c92d89](https://github.com/riccox/meilisearch-ui/commit/0c92d89269afd519d4291403b3a73cc690a6a6f7))
