const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Tabzy(selector) {
  this.container = $(selector);
  if (!this.container) {
    console.error(`Tabzy not found selector in container ${selector}`);
    return;
  }

  this.tab = Array.from(this.container.querySelectorAll("li a"));

  if (!this.tab.length) {
    console.error("Tabzy: not found inside the container");
  }

  this.panels = this.tab
    .map((tab) => {
      const panel = $(tab.getAttribute("href"));
      if (!panel) {
        hasError = true;
        console.error(
          `Tabzy: no panel found for selector ${tab.getAttribute("href")}`
        );
      }
      return panel;
    })
    .filter(Boolean);

  if (this.tab.length !== this.panels.length) return;

  this._init();
}

Tabzy.prototype._init = function () {
  const tabActive = this.tab[0];
  tabActive.closest("li").classList.add("tab-active");

  this.panels.forEach((panel) => {
    panel.hidden = true;
  });

  this.tab.forEach((tab) => {
    tab.onclick = (event) => this._handleTabClick(event, tab);
  });

  const panelActive = this.panels[0];
  panelActive.hidden = false;
};

Tabzy.prototype._handleTabClick = function (event, tab) {
  event.preventDefault();
  this.tab.forEach((tab) => tab.closest("li").classList.remove("tab-active"));
  tab.closest("li").classList.add("tab-active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = $(tab.getAttribute("href"));
  panelActive.hidden = false;
};
