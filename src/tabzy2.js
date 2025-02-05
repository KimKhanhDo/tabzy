/**
// todo: 1. Xử lí logic active first tab by default:
    1.1 tabContainer: Tìm phần tử cha ul container được truyền bằng selector param
    1.2 tabItems: Từ phần tử ul cha -> query tất cả thẻ li bên trong
    1.3 tabContents: Từ document -> query tất cả thẻ chứa content
    1.4 firstTabItem: lấy ra Node li đầu tiên từ tabItems
    1.5 Reset:
        . Remove class "tabzy--active" khỏi tabItems
        . Add class "hide" vào tabContents
    1.6 Active tab by default:
        . Add class "tabzy--active" vào thẻ li của firstTabItem
        . Remove class "hide" tại content tương ứng dựa vào id của firstTabItem

// todo: 2. _resetTabs() -> reset tất cả tabs & content về trạng thái ban đầu theo logic:
    . Remove class "tabzy--active" khỏi tabItems
    . Add class "hide" vào tabContents

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

    const tabItemsSelector = options.tabItemsSelector || 'li';
    const tabContentsSelector =
        options.tabContentsSelector || '[id^="tab"]:not(#tabs)';

    this.tabItems = this.tabContainer.querySelectorAll(tabItemsSelector);
    this.firstTab = this.tabItems[0].querySelector('a');
    this.tabContents = document.querySelectorAll(tabContentsSelector);

    this._handleClickBind = this._handleClick.bind(this);
    this.tabContainer.addEventListener('click', this._handleClickBind);

    // Activate the first tab by default
    if (this.tabItems.length) {
        this._resetTabs();
        this._activateTab(this.firstTab);
    }
}

Tabzy.prototype._resetTabs = function () {
    this.tabItems.forEach((tab) => {
        tab.classList.remove('tabzy--active');
    });

    this.tabContents.forEach((content) => {
        content.classList.add('hidden');
    });
};

Tabzy.prototype._activateTab = function (link) {
    if (!link) return;

    // extracts the id from that link to find coresponding content
    const targetId = link.getAttribute('href');
    if (!targetId) return;
    const targetContent = document.querySelector(targetId);
    if (targetContent) {
        targetContent.classList.remove('hidden');
    }

    // find parent li
    const tabItem = link.closest('li');
    if (!tabItem) return;
    tabItem.classList.add('tabzy--active');
};

Tabzy.prototype.toggle = function (id) {
    const link = document.querySelector(`a[href="${id}"]`);
    if (!link) return;

    if (this._isTabActive(link)) return;

    this._resetTabs();
    this._activateTab(link);
};

Tabzy.prototype._isTabActive = function (link) {
    const tabItem = link.closest('li');
    return tabItem ? tabItem.classList.contains('tabzy--active') : false;
};

Tabzy.prototype._handleClick = function (e) {
    const link = e.target.closest('a');
    if (!link) return;

    if (this._isTabActive(link)) return;

    const id = link.getAttribute('href');
    this.toggle(id);
};

Tabzy.prototype.destroy = function () {
    this.tabItems.forEach((tab) => {
        tab.classList.remove('tabzy--active');
    });

    this.tabContents.forEach((content) => {
        content.classList.remove('hidden');
    });

    this.tabContainer.removeEventListener('click', this._handleClickBind);
};

const tabs = new Tabzy('#tabs');
// tabs.toggle('#tab3');
