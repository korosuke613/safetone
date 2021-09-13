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
            });

            // 非公開
            (<HTMLElement>node).querySelectorAll('.gaia-argoui-space-spacelayout-type').forEach((e) => {
              if ((<HTMLElement>e).innerText.includes('非公開')) {
                console.log('fire!')
                document.querySelectorAll('.gaia-header-toolbar-navigation').forEach((e) => {
                  (<HTMLElement>e).style.background = 'linear-gradient(-45deg, #000 25%, #fff920 25%, #fff920 50%, #000 50%, #000 75%, #fff920 75%, #fff920)';
                  (<HTMLElement>e).style.backgroundSize = '60px 60px';
                  (<HTMLElement>e).style.textAlign = 'center';
                  (<HTMLElement>e).style.verticalAlign = 'middle'

                  const p = document.createElement('p')
                  const warningMessage = document.createTextNode('This space is HIDDEN!!')
                  p.appendChild(warningMessage)
                  p.style.display = 'block'
                  p.style.marginBlockStart = '0em'
                  p.style.marginBlockEnd = '0em'
                  p.style.lineHeight = '48px'
                  p.style.fontSize = '28px'
                  p.style.fontWeight = 'bolder'
                  p.style.color = '#000'
                  p.style.textShadow = '1px 1px 0 #e4ff00, -1px 1px 0 #e4ff00, 1px -1px 0 #e4ff00, -1px -1px 0 #e4ff00';
                  (<HTMLElement>e).appendChild(p)

                  const sides = [
                    <HTMLElement>e.querySelector('.gaia-header-toolbar-left'),
                    <HTMLElement>e.querySelector('.gaia-header-toolbar-right'),
                  ]
                  sides.forEach((side) => {
                    side.style.background = '#333'
                  })
                })
              }
            })
          }
        }
      }
    }
  })

  observer.observe(targetNode, { attributes: false, childList: true, subtree: true })
})()
