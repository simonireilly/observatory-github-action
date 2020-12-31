# Observatory GitHub Action

Run the [Mozilla Observatory](https://observatory.mozilla.org/) in CI/CD for any website.

- [Observatory GitHub Action](#observatory-github-action)
  - [About](#about)
  - [Setup](#setup)
  - [Detailed Examples](#detailed-examples)
    - [Static URL on Pull Requests](#static-url-on-pull-requests)
    - [Deployment Status for PReview Environments](#deployment-status-for-preview-environments)
    - [Powered By](#powered-by)

## About

This action is a light wrapper around [mozilla/observatory-cli](https://github.com/mozilla/observatory-cli) that returns a markdown string.

It can be used in conjunction with other comment based actions to add PR comments
## Setup

Add the action as a step in your github actions:

>.github/workflows/example.yml
```
      - name: Observatory Github Action
        id: observatory
        uses: simonireilly/observatory-github-action@v0.0.1
        with:
          web_host: https://example.com
      - name: Create commit comment
        uses: peter-evans/commit-comment@v1
        with:
          body: ${{ steps.observatory.outputs.observatory-report }}
```

>## Observatory Results [example.com](https://example.com): _0 of 100_
>
>See the full report: https://observatory.mozilla.org/analyze/example.com
>
>### Highlights
>
>| Passed       | Score | Description                                                  |
>| ------------ | ----- | ------------------------------------------------------------ |
>| :red_circle: | -25   | Content Security Policy (CSP) header not implemented         |
>| :red_circle: | -20   | Does not redirect to an HTTPS site                           |
>| :red_circle: | -20   | HTTP Strict Transport Security (HSTS) header not implemented |
>| :red_circle: | -5    | X-Content-Type-Options header not implemented                |
>| :red_circle: | -20   | X-Frame-Options (XFO) header not implemented                 |
>| :red_circle: | -10   | X-XSS-Protection header not implemented                      |

## Detailed Examples

The github workflows folder contain detailed examples

### Static URL on Pull Requests

```yaml
# .github/workflows/static-url.yml

name: 'branch'
on:
  pull_request:

jobs:
  static-url:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Observatory
        uses: ./
        with:
          web_host: https://hungry-borg-990e06.netlify.app
        id: observatory
      - name: Create commit comment
        uses: peter-evans/commit-comment@v1
        with:
          body: '# Branch PR ${{ steps.observatory.outputs.observatory-report }}'
```

### Deployment Status for PReview Environments

This method will work for Preview deploys that use the GitHub deployments API. It supports [https://vercel.com/](https://vercel.com/) preview Urls.

```yaml
# .github/workflows/deployment_status.yml

name: 'deployment-status'
on:
  deployment_status:

jobs:
  deployment_status:
    runs-on: ubuntu-latest
    if: github.event.deployment_status.state == 'success'
    steps:
      - uses: actions/checkout@v2
      - name: Test Observatory
        uses: ./
        with:
          web_host: ${{ github.event.deployment_status['target_url'] }}
        id: observatory
      - name: Create commit comment
        uses: peter-evans/commit-comment@v1
        with:
          body: '# Deployment Status _${{ github.event.deployment_status.state }}_ ${{ steps.observatory.outputs.observatory-report }}'

```


### Powered By

- [HTTP Observatory](https://github.com/mozilla/http-observatory) by April King
- [HTTP Observatory CLI](https://github.com/mozilla/observatory-cli) by April King
