/** 
 * todo
Request:
* todo 1: Dùng hàm tạo Tabzy -> param là 1 selector
      const tabs = new Tabzy('#tabs', {
      ...options
      });

* todo 2: Kì vọng: 
    2.1 Trong 1 thời điểm chỉ có 1 tab được active & show nội dung tương ứng, nội dung các tabs còn lại phải bị ẩn đi.
    VD: Khi tab1 active -> Tab1 content sẽ show ra, các div với nội dung của các tabs còn lại sẽ bị ẩn đi.
    2.2 Khi 1 tab active thì class "tabzy--active" sẽ được thêm vào thẻ li.
    2.3 Tương tự, khi 1 tab khác được kích hoạt thì  các div với nội dung tương ứng các tabs còn lại sẽ bị ẩn đi.

* todo 3: tabs.toggle("#tab3")
    Đối tượng trả về từ hàm tạo sẽ có thêm phương thức toggle, param nhận vào là 1 id của content
   
    Khi phương thức được gọi, nội dung của id tương ứng sẽ được hiển thị đồng thời với thẻ li
    VD: tabs.toggle nhận #tab3 thì Tab3 content sẽ được hiển thị, song song với thẻ li Tab 3 & các tabs với nội dung khác sẽ bị ẩn đi.

* todo 4: tabs.destroy();
    Khi ph.thức destroy dc gọi, phần tabs sẽ được trả về nguyên bản như ban đầu.
    Tất cả các tabs với nội dung tương ứng đều hiển thị, ko thẻ nào dc active
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function Tabzy(selector) {
    const tabContainer = document.querySelector(selector);
    if (!tabContainer) return;

    const tabItems = tabContainer.querySelectorAll('li');
    const tabContents = document.querySelectorAll('div[id^="tab"]');

    this._resetTabs = () => {
        tabItems.forEach((tab) => {
            tab.classList.remove('tabzy--active');
        });

        tabContents.forEach((content) => {
            content.classList.add('hidden');
        });
    };

    if (tabItems.length) {
        this._resetTabs();
        tabItems[0].classList.add('tabzy--active');

        const targetLink = tabItems[0].querySelector('a');
        if (targetLink) {
            const targetId = targetLink.getAttribute('href');
            if (!targetId) return;
            const targetContent = document.querySelector(targetId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
            }
        }
    }

    tabContainer.onclick = (e) => {
        this._resetTabs();
        const targetId = e.target.getAttribute('href');
        this.toggle(targetId);
    };

    this.toggle = (id) => {
        this._resetTabs();
        if (typeof id !== 'string') return;

        const targetLink = document.querySelector(`a[href="${id}"]`);
        if (!targetLink) return;

        const targetParent = targetLink.parentElement;
        const targetContent = document.querySelector(id);

        if (targetParent && targetContent) {
            targetParent.classList.add('tabzy--active');
            targetContent.classList.remove('hidden');
        }
    };

    this.destroy = () => {
        tabItems.forEach((tab) => {
            tab.classList.remove('tabzy--active');
        });

        tabContents.forEach((content) => {
            content.classList.remove('hidden');
        });
    };
}

const tabs = new Tabzy('#tabs');
// tabs.toggle('#tab3');
