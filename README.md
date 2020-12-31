# Observatory GitHub Action

Run the [Mozilla Observatory](https://observatory.mozilla.org/) in CI/CD for any website.

- [Observatory GitHub Action](#observatory-github-action)
  - [About](#about)
  - [Setup](#setup)
    - [Powered By:](#powered-by)

## About

This action is a light wrapper around [mozilla/observatory-cli](https://github.com/mozilla/observatory-cli) that returns a markdown string.

It can be used in conjunction with other comment based actions to add PR comments
## Setup

Add the action as a step in your github actions:

>.github/workflows/example.yml
```
      - name: Mozilla Observatory Github Action
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

### Powered By:

- [HTTP Observatory](https://github.com/mozilla/http-observatory) by April King
- [HTTP Observatory CLI](https://github.com/mozilla/observatory-cli) by April King
