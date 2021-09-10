/* eslint-disable no-console */
import { onMessage } from 'webext-bridge'
import { createApp } from 'vue'
import App from './views/App.vue'

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  console.info('[vitesse-webext] Hello world from content script')

  // communication example: send previous tab title from background page
  onMessage('tab-prev', ({ data }) => {
    console.log(`[vitesse-webext] Navigate from page "${data.title}"`)
  })

  // mount component to context window
  const container = document.createElement('div')
  const root = document.createElement('div')
  const styleEl = document.createElement('link')
  const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
  styleEl.setAttribute('rel', 'stylesheet')
  styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
  shadowDOM.appendChild(styleEl)
  shadowDOM.appendChild(root)
  document.body.appendChild(container)
  createApp(App).mount(root)

  const targetNode = document.body
  const observer = new MutationObserver((mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.addedNodes.length > 0) {
        for (const node of Array.from(mutation.addedNodes)) {
          if ('querySelectorAll' in node) {
            // for Thread and People
            (<HTMLElement>node).querySelectorAll('.ocean-ui-comments-commentbase-delete').forEach((e) => {
              if (e.parentElement === null) return
              e.parentElement.style.visibility = 'hidden'
            });

            // for Record Comment
            (<HTMLElement>node).querySelectorAll('.commentlist-footer-delete-gaia').forEach((e) => {
              (<HTMLElement>e).style.visibility = 'hidden'
            })
          }
        }
      }
    }
  })

  observer.observe(targetNode, { attributes: false, childList: true, subtree: true })
})()
