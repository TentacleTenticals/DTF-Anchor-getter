// ==UserScript==
// @name        DTF Anchor getter
// @namespace   https://github.com/TentacleTenticals/
// @match       https://dtf.ru/*
// @grant       Tentacle Tenticals
// @version     1.0
// @author      Tentacle Tenticals
// @description Скрипт для получения якоре (anchor)
// @homepage    https://github.com/TentacleTenticals/DTF-Anchor-getter
// @updateURL   https://github.com/TentacleTenticals/DTF-Anchor-getter/raw/master/main.user.js
// @downloadURL https://github.com/TentacleTenticals/DTF-Anchor-getter/raw/master/main.user.js
//
// @require     https://github.com/TentacleTenticals/dtf-libs-2.0/raw/main/libs/splitCls/div_btn_css.js
// @license MIT
// ==/UserScript==
/* jshint esversion:8 */

(() => {

class AnchorGetter{
  Group({path, text, anchor, link, editor}){
    let group = new El().Div({
      path: path,
      cName: 'group',
      rtn: []
    });
    let header=new El().Div({
      path: group,
      cName: 'head',
      rtn: []
    });
    new El().Div({
      path: header,
      cName: 'label',
      text: text
    });

    let btns = new El().Div({
      path: header,
      cName: 'container',
      rtn: []
    });

    if(editor){
      new El().Button({
        path: btns,
        cName: 'btn',
        text: '📛',
        onclick: () => {
          navigator.clipboard.writeText(text);
        }
      });
      new El().Button({
        path: btns,
        cName: 'btn',
        text: '🔗',
        onclick: () => {
          navigator.clipboard.writeText(`#${anchor}`);
        }
      });
    }
    new El().Button({
      path: btns,
      cName: 'btn',
      text: '↪️',
      onclick: () => {
        link.scrollIntoView();
      }
    });
  }
  anchorSearch(editor){
    const sites = ['ce-paragraph', 'cdx-tool', 'quote-tool', 'incut-tool', 'code-tool', 'andropov-tool__input', 'embed-block', 'gallery', 'audio-tool', 'quiz-tool', 'number-tool', 'person-tool', 'ce-header'];
    const cut = 70;
    for (let i = 0, arr = document.querySelectorAll(`.ce-block--anchor`), len = arr.length; i < len; i++) {
      let res;
      res = (() => {
        switch (arr[i].children[2].children[0].classList.value.match(new RegExp(`${sites.join('|')}`))?.[0]) {
          case 'ce-header':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0]
          }
          case 'ce-paragraph':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0]
          }
          case 'cdx-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].children[0].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0].children[0]
          }
          case 'incut-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].children[0].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0].children[0]
          }
          case 'quote-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].children[1].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0].children[1]
          }
          case 'code-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Блок кода',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'andropov-tool__input':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Ссылка на вложение',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'embed-block':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Эмбед блок',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'gallery':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Галерея',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'audio-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Аудио',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'quiz-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: arr[i].children[2].children[0].children[0].textContent?.trim()?.slice(0, cut),
            link: arr[i].children[2].children[0].children[0]
          }
          case 'number-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Цифра',
            link: arr[i].children[2].children[0].children[0]
          }
          case 'person-tool':
          return {
            anchor: arr[i].getAttribute('data-anchor'),
            text: 'Персона',
            link: arr[i].children[2].children[0]
          }
        }
      })();
      this.Group({
        path: this.list,
        text: res.text,
        anchor: res.anchor,
        link: res.link,
        editor: editor
      })
    }
  }
  linksSearch(){
    for(let i = 0, arr = document.querySelectorAll(`.content--full a`), len = arr.length; i < len; i++){
      if(arr[i].className && arr[i].classList.value.match(/content__anchor/)){
        this.Group({
          path: this.list,
          text: arr[i].nextElementSibling && arr[i].nextElementSibling.children[0].nodeName === 'P' ? arr[i].nextElementSibling.textContent.trim().slice(0, 70) : arr[i].getAttribute('name'),
          link: arr[i]
        });
      }
    }
  }
  constructor(editor){
    if(document.getElementById('dtf-anchorGetter')) return;
    /* Настройка для включения/отключение свёрнутого состояния по-дефолту. */
    this.isHidden=true;
    this.main=new El().Div({
      path: document.body,
      cName: `dtf-window anchor${this.isHidden ? ' hidden' : ''}`,
      id: 'dtf-anchorGetter',
      rtn: []
    });
    this.header=new El().Div({
      path: this.main,
      cName: 'header',
      rtn: [],
      onclick: () => {
        this.main.classList.toggle('hidden');
      }
    });
    new El().Div({
      path: this.header,
      cName: 'label',
      text: 'ANCHOR GETTER'
    });
    this.mainCont=new El().Div({
      path: this.main,
      cName: 'hiderCont',
      rtn: []
    });

    if(editor){
      new El().Button({
        path: this.mainCont,
        cName: 'getter',
        text: 'Получить список ⚓',
        onclick: () => {
          if(this.list.children.length > 0) this.list.replaceChildren();
          this.anchorSearch(editor);
        }
      })
    }
    this.list=new El().Div({
      path: this.mainCont,
      cName: 'list',
      rtn: []
    });
    if(!editor) this.linksSearch();
  }
};

  let dtfCore = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500&display=swap');

.dtf-window {
  display: flex;
  position: absolute;
  flex-direction: column;
  width: max-content;
  background-color: black;
  top: 100%;
  padding: 3px;
  margin: 5px 0 0 0;
  border-radius: 2px;
  box-shadow: 0px 0px 3px 0px rgb(0 0 0);
  z-index: 15;
}
.dtf-window .header {
  text-align: center;
  color: rgb(255, 255, 255);
  background-color: rgb(54 43 43);
  border-radius: 2px;
  margin: 0 0 5px 0;
  box-shadow: inset 0px 0px 2px 0px rgb(173 171 171);
  cursor: pointer;
}
.dtf-window .header .label {
  font-size: 13px;
  font-family: 'Chakra Petch', sans-serif;
  letter-spacing: 0.5px;
}
.dtf-window .header .label::before {
  display: inline-block;
  content: '';
  color: black;
  top: -4px;
  left: -10px;
  width: 20%;
  height: 1px;
  position: relative;
  box-shadow: 0px 0px 1px 1px rgb(185 0 87);
}
.dtf-window .header .label::after {
  display: inline-block;
  content: '';
  color: black;
  top: -4px;
  right: -10px;
  width: 20%;
  height: 1px;
  position: relative;
  box-shadow: 0px 0px 1px 1px rgb(185 0 87);
}
`;

let css = `
.anchor {
  position: fixed;
  width: 250px;
  top: 50px;
  left: 5px;
  z-index: 100;
}
.anchor .hiderCont {
  display: flex;
  flex-direction: column;
}
.anchor.hidden .hiderCont {
  display: none;
}

.anchor .getter {
  background: repeating-linear-gradient(180deg, rgb(243 243 243), transparent 100px);
  margin: 3px 0 2px 0;
  border-radius: 2px;
  cursor: pointer;
}
.anchor .getter:hover {
  filter: brightness(1.1);
}

.anchor .list {
  display: flex;
  margin: 5px 0 5px 0;
  padding: 2px;
  flex-direction: column;
  gap: 7px 0;
}

.anchor .group {
  background-color: rgb(44 44 44);
}

.anchor .group .head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0 5px;
}
.anchor .group .head .label {
  color: rgb(255 255 255);
  font-size: 14px;
  max-width: 170px;
  overflow: hidden;
  white-space: nowrap;
}

.anchor .group .container {
  display: flex;
  gap: 0 3px;
}
.anchor .btn {
  background-color: rgb(255 255 255);
  border: unset;
  padding: 0 3px 0 2px;
  font-size: 14px;
  border-radius: 4px;
  box-shadow: 0 0 5px 0px rgb(193 193 193);
  cursor: pointer;
}
.anchor .btn:hover {
  filter: brightness(0.8);
}
`;

  function getPageType(url){
    if(!url) return;
    if(url.match(/\?writing=\d+/)) return 'editor';
    else
    return url.replace(/https:\/\/dtf\.ru\/([^]+)/, (d, text) => {
      let arr = text.split('/');

      if(arr[0] && arr[0].match(/^popular$/)){
        if(!arr[1]) {
          return 'popular';
        }
      }else
      if(arr[0] && arr[0].match(/^new$/)){
        if(!arr[1]) {
          return 'new';
        }
      }else
      if(arr[0] && arr[0].match(/^my$/)){
        if(arr[1] && arr[1].match(/^new$/)) {
          return 'my new';
        }
      }else

      if(arr[0] && arr[0].match(/^u$/)){
        if(arr[1] && !arr[2]) {
          return 'user pages';
        }
        if(arr[1] && arr[2]) {
          return 'topics';
        }
      }else
      if(arr[0] && arr[0].match(/^s$/)){
        if(arr[1] && !arr[2]) {
          return 'subsites';
        }
        if(arr[1] && arr[2]) {
          return 'topics';
        }
      }else
      if(arr[0] && !arr[0].match(/^(u|s)$/)){
        if(arr[0] && !arr[1]) {
          return 'subsites';
        }
        if(arr[0] && arr[1]) {
          return 'topics';
        }
      }
    })
  }
  function onPageLoad(run){
    {
    const log = console.log.bind(console)
    console.log = (...args) => {
      if(Array.isArray(args)){
        if(args[0]){
          if(typeof args[0] === 'string'){
            if(args[0].match(/\[ Air \] Ready.*/)){
              run();
            }else
            if(args[0].match(/\[Editor in popup\] Ready/)){
              run();
            }else
            if(args[0].match(/\[Editor in popup\] Closed/)){
              run();
            }
          }
        }
      }
      log(...args);
    }}
  };

  new El().Css('DTF-core', dtfCore, true);
  new El().Css('DTF-anchor', css);

  onPageLoad(() => {
    if(document.getElementById('dtf-anchorGetter')) document.getElementById('dtf-anchorGetter').remove();
    if(getPageType(document.location.href) === 'editor'){
      new AnchorGetter(true);
    }else
    if(getPageType(document.location.href) === 'topics'){
      for(let i = 0, arr = document.querySelectorAll(`.content--full a`); i < arr.length; i++){
        if(arr[i].className && arr[i].classList.value.match(/content__anchor/)){
          new AnchorGetter();
        }
      }
    }
  });
})();
