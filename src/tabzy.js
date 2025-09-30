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

  this._originalHTML = this.container.innerHTML;
  // console.log(this._originalHTML);

  this._init();
}

Tabzy.prototype._init = function () {
  this._activeTab(this.tab[0]);

  this.tab.forEach((tab) => {
    tab.onclick = (event) => this._handleTabClick(event, tab);
  });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
  event.preventDefault();
  this._activeTab(tab);
};

Tabzy.prototype._activeTab = function (tab) {
  this.tab.forEach((tab) => tab.closest("li").classList.remove("tab-active"));
  tab.closest("li").classList.add("tab-active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = $(tab.getAttribute("href"));
  panelActive.hidden = false;
};

// ? tabs.switch("#tab3")
// ? const tab2 = $("a[href='#tab2']")

Tabzy.prototype.switch = function (input) {
  let tabToActive = null;

  if (typeof input === "string") {
    tabToActive = this.tab.find((tab) => tab.getAttribute("href") === input);
    if (!tabToActive) {
      console.error(`Tabzy: No panel found with id ${input}`);
      return;
    }
  } else if (this.tab.includes(input)) {
    tabToActive = input;
  }

  if (!tabToActive) {
    console.error(`Tabzy: Invalid input   ${input}`);
    return;
  }
  this._activeTab(tabToActive);
};

Tabzy.prototype.destroy = function () {
  this.container.innerHTML = this._originalHTML;
  this.panels.forEach((panel) => (panel.hidden = false));
  this.container = null;
  this.tab = null;
  this.panels = null;
};
