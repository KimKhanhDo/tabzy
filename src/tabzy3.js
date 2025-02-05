/**
// todo: 1. Chuẩn bị các selectors cho tab-items & tab-contents
    1.1 tabContainer: Tìm phần tử cha ul container được truyền bằng selector param
    1.2 tabItems: Từ phần tử ul cha -> query tất cả thẻ li bên trong
    1.3 tabContents: Từ document -> query tất cả thẻ chứa content
    1.4 firstTabItem: lấy ra Node li đầu tiên từ tabItems
    1.5 Active tab by default:
        . Add class "tabzy--active" vào phần tử tab-item của firstTabItem
        . Add class "tabzy--active" vào phần tử tab-content của firstTabItem
    
// todo: 2. _resetTabs() -> reset tất cả tabs & content về trạng thái ban đầu theo logic:
    . Remove class "tabzy--active" khỏi tabItems
    . Remove class "tabzy--active" khỏi tabContents

// todo: 3. _activateTab(link) -> tham số là 1 <a> element -> extracts the id from that link
    3.1 Extract href attribute lấy value -> Có value, dùng để query lấy element content -> remove class "hide".
    3.2 Đứng từ link tìm closest "li" -> Có "li" -> add class "tabzy--active"

// todo: 4. toggle(id) -> tham số là id của 1 content -> uses the id to find the link.
    4.1 _resetTabs()
    4.2 Đứng từ tabContainer, tìm phần tử a có href trùng với id được truyền vào
    4.3 Nếu có a element, trigger function  _activateTab(link)
 */

function Tabzy(selector, options = {}) {
    this.tabContainer = document.querySelector(selector);
    if (!this.tabContainer) return;

    const tabItemsSelector = options.tabItemsSelector
        ? options.tabItemsSelector
        : null;

    const tabContentsSelector = options.tabContentsSelector
        ? options.tabContentsSelector
        : null;

    const lineSelector = options.lineSelector ? options.lineSelector : '.line';

    this.tabItems = tabItemsSelector
        ? this.tabContainer.querySelectorAll(tabItemsSelector)
        : [];

    this.tabContents = tabContentsSelector
        ? document.querySelectorAll(tabContentsSelector)
        : [];
    this.line = this.tabContainer.querySelector(lineSelector);

    if (!this.tabItems.length || !this.tabContents.length) {
        return console.error('tabItems & tabContents can not be empty');
    }

    this._initDefaultSetting();

    this._handleClickBind = this._handleClick.bind(this);
    this.tabContainer.addEventListener('click', this._handleClickBind);
}

Tabzy.prototype._initDefaultSetting = function () {
    const tabActive = this.tabItems[0];
    const contentActive = this.tabContents[0];
    this._activateTabs(tabActive, contentActive);

    // add index for each tab
    this.tabItems.forEach((tab, index) => {
        tab.dataset.index = index;
    });

    // set id for each content
    this.tabContents.forEach((content, id) => {
        content.setAttribute('id', `content${id + 1}`);
    });
};

Tabzy.prototype._resetTabs = function () {
    this.tabItems.forEach((tab) => {
        tab.classList.remove('tabzy--active');
    });

    this.tabContents.forEach((content) => {
        content.classList.remove('tabzy--active');
    });

    this.line.style.left = 0;
    this.line.style.width = 0;
};

Tabzy.prototype._isTabActive = function (element) {
    return element.classList.contains('tabzy--active');
};

Tabzy.prototype._handleClick = function (e) {
    const tabItem = e.target.closest('.tab-item');
    if (!tabItem) return;

    if (this._isTabActive(tabItem)) return;

    this._resetTabs();

    const index = +tabItem.dataset.index;
    const contentItem = this.tabContents[index];

    this._activateTabs(tabItem, contentItem);
};

Tabzy.prototype._activateTabs = function (tabElement, contentElement) {
    tabElement.classList.add('tabzy--active');
    contentElement.classList.add('tabzy--active');

    this.line.style.left = tabElement.offsetLeft + 'px';
    this.line.style.width = tabElement.offsetWidth + 'px';
};

Tabzy.prototype.toggle = function (id) {
    const contentItem = document.querySelector(id);
    if (!contentItem) return;

    if (this._isTabActive(contentItem)) return;

    // find index of contentItem in tabContents list based on their id
    const index = Array.from(this.tabContents).findIndex((content) => {
        return content.getAttribute('id') === id.slice(1);
    });

    // use that index to get tabItem
    if (index < 0) return;
    const tabItem = this.tabItems[index];

    // reset & add active class for contentItem & tabItem
    this._resetTabs();
    this._activateTabs(tabItem, contentItem);
};

Tabzy.prototype.destroy = function () {
    this.tabItems.forEach((tab) => {
        tab.classList.remove('tabzy--active');
    });

    this.tabContents.forEach((content) => {
        content.style.display = 'block';
    });

    this.line.style.left = 0;
    this.line.style.width = 0;

    this.tabContainer.removeEventListener('click', this._handleClickBind);
};

// const tabs = new Tabzy('#tabs', {
//     tabItemsSelector: '.tab-item',
// });

const tabs = new Tabzy('#tabs', {
    tabItemsSelector: '.tab-item',
    tabContentsSelector: '.tab-pane',
});
tabs.toggle('#content2');
