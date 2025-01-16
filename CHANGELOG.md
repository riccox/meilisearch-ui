# Changelog

## [0.11.1](https://github.com/riccox/meilisearch-ui/compare/v0.11.0...v0.11.1) (2025-01-16)


### Bug Fixes

* document editor remain previous value after close. ([4c2824f](https://github.com/riccox/meilisearch-ui/commit/4c2824f58bd0befb7174590ec7618c12b962118f))

## [0.11.0](https://github.com/riccox/meilisearch-ui/compare/v0.10.3...v0.11.0) (2025-01-16)


### Features

* support export and import instances (gh-187) ([8a7e9c1](https://github.com/riccox/meilisearch-ui/commit/8a7e9c1492a25335fd151cc8a24cce4080a61b33))

## [0.10.3](https://github.com/riccox/meilisearch-ui/compare/v0.10.2...v0.10.3) (2025-01-15)


### Bug Fixes

* resource load error cause by relative path. gh-185 ([c8700bd](https://github.com/riccox/meilisearch-ui/commit/c8700bdbfe0b210bfd2e3eb6acf8622e57f067c7))

## [0.10.2](https://github.com/riccox/meilisearch-ui/compare/v0.10.1...v0.10.2) (2025-01-13)


### Continuous Integration

* lite builder push latest tag unexpectedly. ([36f02ae](https://github.com/riccox/meilisearch-ui/commit/36f02ae0b37c75ef6f5615503d6f5a817aaf2b6c))

## [0.10.1](https://github.com/riccox/meilisearch-ui/compare/v0.10.0...v0.10.1) (2025-01-13)


### Bug Fixes

* BASE_PATH by build variant image tag "lite". ([21d2ce1](https://github.com/riccox/meilisearch-ui/commit/21d2ce1d1c44042d15aa3a3cbefccdbe1a9e2ca6))
* task list load more on scroll bottom. gh-181 ([c6e5641](https://github.com/riccox/meilisearch-ui/commit/c6e5641ea1b5b834fa0a0f205afbd6c54d7bb564))


### Performance Improvements

* add instance DB size to index sidebar. gh-180 ([86207b8](https://github.com/riccox/meilisearch-ui/commit/86207b84ee8157c0f59b6442bce335872ce382b3))

## [0.10.0](https://github.com/riccox/meilisearch-ui/compare/v0.9.6...v0.10.0) (2024-12-06)


### Features

* docs search form add showRankingScore switch. gh-176 ([f6bb8a1](https://github.com/riccox/meilisearch-ui/commit/f6bb8a14c42760ab1494a31e098eac0352e735dc))


### Bug Fixes

* add offset & limit number value limit in search docs filter. gh-173 gh-174 ([0032c63](https://github.com/riccox/meilisearch-ui/commit/0032c637819cdd1f754aa0222364346cc69d1cee))
* copyable component not work. gh-170 ([c20b6ee](https://github.com/riccox/meilisearch-ui/commit/c20b6eee015c9848e305004b08fa8bb31c6e1537))
* document image url value insensitive gh-169. ([63da243](https://github.com/riccox/meilisearch-ui/commit/63da2434c1c0acb152a3ac98103d1f705caf50ef))
* remove useless scrollbar in docs list. gh-175 ([9d903a1](https://github.com/riccox/meilisearch-ui/commit/9d903a1723f734ebb4f60d1f3258b7acafaabce8))


### Performance Improvements

* index setting json editor height use vh unit. gh-168 ([49efc50](https://github.com/riccox/meilisearch-ui/commit/49efc50b97e2038353bbad785f73726775f71fc0))
* maintain list type in docs list page gh-172. ([effbc9b](https://github.com/riccox/meilisearch-ui/commit/effbc9b9d5119bfccad25793a5147c3263fd3ed2))

## [0.9.6](https://github.com/riccox/meilisearch-ui/compare/v0.9.5...v0.9.6) (2024-11-04)


### Bug Fixes

* doc update not work gh-162. ([7879821](https://github.com/riccox/meilisearch-ui/commit/78798217f257dae1db727e169e7b3b7e12fcf688))
* SINGLETON_MODE usage approach. ([958205d](https://github.com/riccox/meilisearch-ui/commit/958205d0b33829abda4fc5d84c8e081b35c43c79))

## [0.9.5](https://github.com/riccox/meilisearch-ui/compare/v0.9.4...v0.9.5) (2024-11-04)


### Bug Fixes

* fatal error for enqueued/processing tasks when duration is null. ([#164](https://github.com/riccox/meilisearch-ui/issues/164)) ([26fdd6e](https://github.com/riccox/meilisearch-ui/commit/26fdd6e01d7e3621395ddd071bad9d2c52ea22d2))

## [0.9.4](https://github.com/riccox/meilisearch-ui/compare/v0.9.3...v0.9.4) (2024-10-24)


### Bug Fixes

* index setting danger zone button text (gh-158) ([74c6238](https://github.com/riccox/meilisearch-ui/commit/74c6238efe7bd58de87f59020876dc4da2b11e8a))

## [0.9.3](https://github.com/riccox/meilisearch-ui/compare/v0.9.2...v0.9.3) (2024-10-23)


### Bug Fixes

* should not render tanstack router devtool in production ([#155](https://github.com/riccox/meilisearch-ui/issues/155)) ([acac580](https://github.com/riccox/meilisearch-ui/commit/acac580191aeb5f59081b166282ba1a5de291080))

## [0.9.2](https://github.com/riccox/meilisearch-ui/compare/v0.9.1...v0.9.2) (2024-10-19)


### Bug Fixes

* gh-110 ERR_SSL_PROTOCOL_ERROR when using IP host. ([d1c9b19](https://github.com/riccox/meilisearch-ui/commit/d1c9b19b738d82dd755b39ff7a01f903cd842660))

## [0.9.1](https://github.com/riccox/meilisearch-ui/compare/v0.9.0...v0.9.1) (2024-10-18)


### Performance Improvements

* gh-149 index list item add createdAt & updatedAt time. ([9a3dca2](https://github.com/riccox/meilisearch-ui/commit/9a3dca2b501dbbd239f53402e6a7b7a68c075ae9))

## [0.9.0](https://github.com/riccox/meilisearch-ui/compare/v0.8.0...v0.9.0) (2024-10-18)


### Features

* gh-141 docs list item show special attributes badges. ([1adf33e](https://github.com/riccox/meilisearch-ui/commit/1adf33e62e415b4972aa63e7aea35600b7318f17))
* gh-143 task list index UID support link to index page. ([0957322](https://github.com/riccox/meilisearch-ui/commit/095732221fa9e51bfa29fcc76a2bb106fd6a1f4a))
* gh-145 index page side link to task page with index filter. ([674f4b0](https://github.com/riccox/meilisearch-ui/commit/674f4b0fcbc8e345715c0a88ebcba201df80315f))
* gh-148 docs search page support form state bidirectional bind with search params. ([0f23b04](https://github.com/riccox/meilisearch-ui/commit/0f23b04664070b47f059644a77e9a3d90f5bd254))
* gh-149 index list item add link buttons. ([6a79271](https://github.com/riccox/meilisearch-ui/commit/6a792712edffd856eefa323a533fce5de457a0ca))
* remove task EnqueuedAt filter for unknown error. ([674f4b0](https://github.com/riccox/meilisearch-ui/commit/674f4b0fcbc8e345715c0a88ebcba201df80315f))


### Bug Fixes

* index UID title overflow. ([bba187d](https://github.com/riccox/meilisearch-ui/commit/bba187db273c5a72b814c5f11eb4a1d4e78622a1))
* TimeAgo component valid date param. ([f601307](https://github.com/riccox/meilisearch-ui/commit/f601307bc07d54d2875013edace12708c8ae1688))


### Performance Improvements

* add meilisearch JS SDK version into footer. ([e4fcecd](https://github.com/riccox/meilisearch-ui/commit/e4fcecd36d48a4be9292894e77e4fd819e9fffd6))
* gh-140 gh-144 task time display. ([3f62816](https://github.com/riccox/meilisearch-ui/commit/3f62816f84b80eb60e62277aaf9ebf8f7e469090))
* tasks table layout width. ([3f62816](https://github.com/riccox/meilisearch-ui/commit/3f62816f84b80eb60e62277aaf9ebf8f7e469090))

## [0.8.0](https://github.com/riccox/meilisearch-ui/compare/v0.7.2...v0.8.0) (2024-10-14)


### Features

* gh-133 display meilisearch instance version. ([4defa10](https://github.com/riccox/meilisearch-ui/commit/4defa1015072bdcae46e6d8e46139c867038cafd))
* gh-134 add index list query filter. ([aad00fc](https://github.com/riccox/meilisearch-ui/commit/aad00fc9321c9f3709faf77c0336d141b7a41e4a))


### Bug Fixes

* gh-136 table nested json row content cause crush. ([05bb3ec](https://github.com/riccox/meilisearch-ui/commit/05bb3ec79533c29955fd184cb9e7c8adc523183c))


### Performance Improvements

* gh-135 field distribution chart only show top 10 fields. ([a05f970](https://github.com/riccox/meilisearch-ui/commit/a05f97008c9af0d5c5dec0dd942de4e4fbfd284a))
* gh-137 add time ago component. ([dd02bd5](https://github.com/riccox/meilisearch-ui/commit/dd02bd5217f4a414ba08832729115ae796f2c465))

## [0.7.2](https://github.com/riccox/meilisearch-ui/compare/v0.7.1...v0.7.2) (2024-10-11)


### Bug Fixes

* disable insecure-requests Content-Security-Policy. ([177ba14](https://github.com/riccox/meilisearch-ui/commit/177ba146e84ca79904d90bbe5caf02f5d993d4c0))

## [0.7.1](https://github.com/riccox/meilisearch-ui/compare/v0.7.0...v0.7.1) (2024-10-10)


### Continuous Integration

* docker builder use node:22 with git folder. ([1131b24](https://github.com/riccox/meilisearch-ui/commit/1131b24e8cf8e6f6e10a2dd913603917eb8ec0fb))

## [0.7.0](https://github.com/riccox/meilisearch-ui/compare/v0.6.16...v0.7.0) (2024-10-10)

### Design

This version rebuilt most parts of this panel into a brand new design.

### Features

* add auto refresh search switch. ([1a276aa](https://github.com/riccox/meilisearch-ui/commit/1a276aa14adc4a2a7240ff320f4890a42644ee7f))
* add search result download btn. ([4140c94](https://github.com/riccox/meilisearch-ui/commit/4140c94ba6377ebf8da6aac1d4be3de09bd905c6))
* add singleton mode support. ([eab7baf](https://github.com/riccox/meilisearch-ui/commit/eab7bafb192aeeb4687b6d42e593b2f2f4c2858b))
* add version component into footer. ([168c1e3](https://github.com/riccox/meilisearch-ui/commit/168c1e3ac6e645a4acb7d75c547446f87e55ff59))
* key form add uid option. ([53bc58c](https://github.com/riccox/meilisearch-ui/commit/53bc58cdf6b308343093e3a41c2d7da14016e7d3))
* rebuild index page layout. ([d818599](https://github.com/riccox/meilisearch-ui/commit/d818599cfb63174d47488b31fa22193b794ed65f))
* rebuilt instance form modal. ([bc0eb85](https://github.com/riccox/meilisearch-ui/commit/bc0eb85e31eb232cc7c61c4fe048bcaa6d883316))
* support multiple search docs list styles. ([444d496](https://github.com/riccox/meilisearch-ui/commit/444d496fe8c21215932c02fc7e2012695e22f2bd))
* task list add index UID & enqueuedAt filters. ([98f3878](https://github.com/riccox/meilisearch-ui/commit/98f38789fc360ef42afdf9775f9af650a52abece))

### Bug Fixes

* index overview numberOfDocuments stats. ([9611b24](https://github.com/riccox/meilisearch-ui/commit/9611b249b41a12a6374c71f2ef269bcfa22b1a65))


### Performance Improvements

* add footer app version. ([8824c0d](https://github.com/riccox/meilisearch-ui/commit/8824c0d14528076193f35244fcb1b211c479d15e))
* add nav breadcrumb ins name display. ([e071664](https://github.com/riccox/meilisearch-ui/commit/e071664c8c66748b3eea84c8de0b804e12b71682))
* disabled un-editable options in edit key form. ([53bc58c](https://github.com/riccox/meilisearch-ui/commit/53bc58cdf6b308343093e3a41c2d7da14016e7d3))
* improved index list card style. ([98d01cd](https://github.com/riccox/meilisearch-ui/commit/98d01cdb6a48c9818bd5e121ebc9f94977e17163))
* improved lang selector style. ([98d01cd](https://github.com/riccox/meilisearch-ui/commit/98d01cdb6a48c9818bd5e121ebc9f94977e17163))

## [0.6.16](https://github.com/riccox/meilisearch-ui/compare/v0.6.15...v0.6.16) (2024-06-14)


### Performance Improvements

* disable auto refresh. (gh-123) ([881f4db](https://github.com/riccox/meilisearch-ui/commit/881f4dbb066a89589515bfe26bbef547a77de2b4))

## [0.6.15](https://github.com/riccox/meilisearch-ui/compare/v0.6.14...v0.6.15) (2024-05-08)


### Bug Fixes

* add nginx config to prevent 404 on page refresh ([ae8b497](https://github.com/riccox/meilisearch-ui/commit/ae8b497c5f218a21d773719af501fb0c4a3f37fc))

## [0.6.14](https://github.com/riccox/meilisearch-ui/compare/v0.6.13...v0.6.14) (2024-05-08)


### Bug Fixes

* add nginx config to prevent 404 on page refresh ([ae8b497](https://github.com/riccox/meilisearch-ui/commit/ae8b497c5f218a21d773719af501fb0c4a3f37fc))

## [0.6.13](https://github.com/riccox/meilisearch-ui/compare/v0.6.12...v0.6.13) (2024-01-18)


### Bug Fixes

* gh-107 rename stroke-width to strokeWidth. ([d971f53](https://github.com/riccox/meilisearch-ui/commit/d971f531868b0c1dca18816057e16c06a6b9b470))


### Performance Improvements

* search loading experience. ([79d2661](https://github.com/riccox/meilisearch-ui/commit/79d2661e1140aaa7cc4af8d6276dda07ed46d7ba))

## [0.6.12](https://github.com/riccox/meilisearch-ui/compare/v0.6.11...v0.6.12) (2024-01-09)


### Bug Fixes

* set index list limit to 1000. ([f58e0d6](https://github.com/riccox/meilisearch-ui/commit/f58e0d6a0bc7989d7d4e3ff86b14ca6ee1f266cc))

## [0.6.11](https://github.com/riccox/meilisearch-ui/compare/v0.6.10...v0.6.11) (2024-01-08)


### Bug Fixes

* gh-103  _geoPoint sort expression. ([e78095d](https://github.com/riccox/meilisearch-ui/commit/e78095d5a3e5e0574e236bc9447b3cce7375cbf6))

## [0.6.10](https://github.com/riccox/meilisearch-ui/compare/v0.6.9...v0.6.10) (2023-12-25)


### Bug Fixes

* gh-100 locales not loaded when using base path. ([8c1b1cf](https://github.com/riccox/meilisearch-ui/commit/8c1b1cf7b4686baf78db62dcebd68b966287e812))

## [0.6.9](https://github.com/riccox/meilisearch-ui/compare/v0.6.8...v0.6.9) (2023-11-14)


### Bug Fixes

* error boundary app fallback alert. ([fa4b56d](https://github.com/riccox/meilisearch-ui/commit/fa4b56d1f4223a41f7a30729995165e77fe429d2))

## [0.6.8](https://github.com/riccox/meilisearch-ui/compare/v0.6.7...v0.6.8) (2023-11-04)


### Bug Fixes

* confirm btn is not visible in modals gh-93. ([8f30187](https://github.com/riccox/meilisearch-ui/commit/8f301872183fdb4cc8711750fac3907467a3f65b))
* document card btn translation text. ([8f30187](https://github.com/riccox/meilisearch-ui/commit/8f301872183fdb4cc8711750fac3907467a3f65b))


### Performance Improvements

* change document card font size. ([8f30187](https://github.com/riccox/meilisearch-ui/commit/8f301872183fdb4cc8711750fac3907467a3f65b))
* document card btn style. ([8f30187](https://github.com/riccox/meilisearch-ui/commit/8f301872183fdb4cc8711750fac3907467a3f65b))

## [0.6.7](https://github.com/riccox/meilisearch-ui/compare/v0.6.6...v0.6.7) (2023-11-03)


### Bug Fixes

* gh-82 delete confirm modal btn. ([1d61376](https://github.com/riccox/meilisearch-ui/commit/1d6137661db2ca7ed239abc025b1368503fa178e))
* instance i18n translation file. ([6fe7f50](https://github.com/riccox/meilisearch-ui/commit/6fe7f50687302e9ca80f33a7f4a732a9d8a40e63))


### Performance Improvements

* change header padding size & home btn radius. ([6fe7f50](https://github.com/riccox/meilisearch-ui/commit/6fe7f50687302e9ca80f33a7f4a732a9d8a40e63))
* request loader logic. ([1d61376](https://github.com/riccox/meilisearch-ui/commit/1d6137661db2ca7ed239abc025b1368503fa178e))

## [0.6.6](https://github.com/riccox/meilisearch-ui/compare/v0.6.5...v0.6.6) (2023-11-02)


### Continuous Integration

* remove docker build platform arm v6. ([7e425a0](https://github.com/riccox/meilisearch-ui/commit/7e425a098ee2ec995906c1c59d6e6efa1d17cb92))

## [0.6.5](https://github.com/riccox/meilisearch-ui/compare/v0.6.4...v0.6.5) (2023-11-02)


### Performance Improvements

* add config for netlify avoid refresh page become page 404. ([b528ed6](https://github.com/riccox/meilisearch-ui/commit/b528ed634d7c5acf0b4869d78ea686c3af0db5b7))
* use vite-react-swc. ([b528ed6](https://github.com/riccox/meilisearch-ui/commit/b528ed634d7c5acf0b4869d78ea686c3af0db5b7))


### Miscellaneous Chores

* merge gh-87. ([b528ed6](https://github.com/riccox/meilisearch-ui/commit/b528ed634d7c5acf0b4869d78ea686c3af0db5b7))

## [0.6.4](https://github.com/riccox/meilisearch-ui/compare/v0.6.3...v0.6.4) (2023-09-29)


### Continuous Integration

* add checkout step for docker description upload. ([bac19c9](https://github.com/riccox/meilisearch-ui/commit/bac19c9888dd945df4ec5928ed05881664449898))

## [0.6.3](https://github.com/riccox/meilisearch-ui/compare/v0.6.2...v0.6.3) (2023-09-29)


### Continuous Integration

* update release actions meta tags. ([cc4e105](https://github.com/riccox/meilisearch-ui/commit/cc4e105e7fa0a4160cae0c6e0d62e462423c374c))

## [0.6.2](https://github.com/riccox/meilisearch-ui/compare/v0.6.1...v0.6.2) (2023-09-29)


### Continuous Integration

* update release actions meta tags. ([5cfe996](https://github.com/riccox/meilisearch-ui/commit/5cfe99623e5feb978f5bb46fb25ed7f86a549038))

## [0.6.1](https://github.com/riccox/meilisearch-ui/compare/v0.6.0...v0.6.1) (2023-09-29)


### Bug Fixes

* gh-76 build docker image release actions for multi-platforms. ([470580e](https://github.com/riccox/meilisearch-ui/commit/470580e5f5104b512f17845296ff83e3c61a4bf6))

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
