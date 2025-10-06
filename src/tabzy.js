const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Tabzy(selector, opction = {}) {
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

  this.opt = Object.assign(
    {
      remember: false,
      onChange: null,
    },
    opction
  );

  this._originalHTML = this.container.innerHTML;
  // console.log(this._originalHTML);
  this._paramKey = selector.replace(/[^a-zA-Z0-9]/g, "");
  this._init();
}

Tabzy.prototype._init = function () {
  const searchParam = new URLSearchParams(location.search);
  const tabSelecter = searchParam.get(this._paramKey);

  const tabToActivate =
    (this.opt.remember &&
      tabSelecter &&
      this.tab.find(
        (tab) =>
          tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "") === tabSelecter
      )) ||
    this.tab[0];
  this.currentTab = tabToActivate;

  this._activeTab(tabToActivate, false);

  this.tab.forEach((tab) => {
    tab.onclick = (event) => this._handleTabClick(event, tab);
  });
};

Tabzy.prototype._handleTabClick = function (event, tab) {
  event.preventDefault();

  this._tryToActiveTab(tab);
};

Tabzy.prototype._activeTab = function (tab, triggerOnChage = true) {
  this.tab.forEach((tab) => tab.closest("li").classList.remove("tab-active"));
  tab.closest("li").classList.add("tab-active");

  this.panels.forEach((panel) => (panel.hidden = true));

  const panelActive = $(tab.getAttribute("href"));
  panelActive.hidden = false;

  if (this.opt.remember) {
    const param = new URLSearchParams(location.search);
    const paramValue = tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "");
    param.set(this._paramKey, paramValue);
    history.replaceState(null, null, `?${param}`);
  }

  if (triggerOnChage && typeof this.opt.onChange === "function") {
    this.opt.onChange({
      tab,
      panel: panelActive,
    });
  }
};

Tabzy.prototype._tryToActiveTab = function (tab) {
  if (this.currentTab !== tab) {
    this._activeTab(tab);
    this.currentTab = tab;
  }
};

// ? tabs.switch("#tab3")
// ? const tab2 = $("a[href='#tab2']")

Tabzy.prototype.switch = function (input) {
  let tabToActivate = null;

  if (typeof input === "string") {
    tabToActivate = this.tab.find((tab) => tab.getAttribute("href") === input);
    if (!tabToActivate) {
      console.error(`Tabzy: No panel found with id ${input}`);
      return;
    }
  } else if (this.tab.includes(input)) {
    tabToActivate = input;
  }

  if (!tabToActivate) {
    console.error(`Tabzy: Invalid input   ${input}`);
    return;
  }
  this._tryToActiveTab(tabToActivate);
};

Tabzy.prototype.destroy = function () {
  this.container.innerHTML = this._originalHTML;
  this.panels.forEach((panel) => (panel.hidden = false));
  this.container = null;
  this.tab = null;
  this.panels = null;
  this.currentTab = null;
};
