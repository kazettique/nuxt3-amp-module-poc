import { defineNuxtPlugin } from "#app";
import { useRuntimeConfig } from "#imports";
import { createResolver, defineNuxtModule, addServerPlugin } from "@nuxt/kit";
import { defineNitroPlugin } from "nitropack/dist/runtime/plugin";

// export default defineNuxtPlugin((nuxtApp) => {
//   console.log("Plugin injected by my-module!");
// });

// export default defineNitroPlugin((nuxtApp) => {
//   console.log("Plugin injected by server nitro plugin!");
// });

const JS_HINT_RE = /<[^>]+(\.m?js"|as="script")[^>]*>/g;

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook("render:html", (htmlContext, { event }) => {
    // console.log('htmlContext', htmlContext)

    const hasAMPPrefix: boolean =
      event.path === "/amp" || event.path.indexOf("/amp/") === 0;

    htmlContext.htmlAttrs = ["amp"];
    htmlContext.head = [
      '<meta charset="utf-8">',
      "<title>Document123</title>",
      '<script async src="https://cdn.ampproject.org/v0.js"></script>',
      '<link rel="canonical" href="https://amp.dev/documentation/examples/introduction/hello_world/index.html">',
      '<meta name="viewport" content="width=device-width">',
      /* html */ `
      <style amp-custom>
        h1 {
          color: red;
        }
      </style>
      `,
      /* html */ `
        <style amp-boilerplate>
          body {
            -webkit-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -moz-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            -ms-animation: -amp-start 8s steps(1, end) 0s 1 normal both;
            animation: -amp-start 8s steps(1, end) 0s 1 normal both;
          }

          @-webkit-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-moz-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-ms-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @-o-keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
          @keyframes -amp-start {
            from {
              visibility: hidden;
            }
            to {
              visibility: visible;
            }
          }
        </style>
        <noscript>
          <style amp-boilerplate>
            body {
              -webkit-animation: none;
              -moz-animation: none;
              -ms-animation: none;
              animation: none;
            }
          </style>
        </noscript>
      `,
    ];
    htmlContext.body = ['<h1>hacked by plugin!!</h1>'];

    // filter nuxt script

    const $config = useRuntimeConfig();
    const ASSET_RE = new RegExp(
      `<script[^>]*src="${$config.app.buildAssetsDir}[^>]+><\\/script>`
    );

    htmlContext.bodyAppend = htmlContext.bodyAppend.filter(
      (b) => !b.includes("window.__NUXT__") && !ASSET_RE.test(b)
    );
    const i = htmlContext.head.findIndex((i) =>
      i.includes('<link rel="modulepreload" as="script"')
    );
    if (i !== -1) {
      htmlContext.head[i] = htmlContext.head[i].replace(JS_HINT_RE, "");
    }
  });

  // nitroApp.hooks.hook('render:response', (response, { event }) => {
  //   console.log('render:response', response);
  // });
});
