import MobileMenu from 'mmenu-light';
import Swal from 'sweetalert2';
import Anime from './partials/anime';
import initTootTip from './partials/tooltip';
import AppHelpers from "./app-helpers";

class App extends AppHelpers {
  constructor() {
    super();
    window.app = this;
    global.openEyeModel = (id) => {
      import("./partials/eye-model")
        .then((eye) => {
          eye.eyeModel(id);
        })
        .catch((error) => {
          console.error("Failed to load eye model:", error);
        });
    };
  }

  loadTheApp() {
    this.commonThings();
    this.initiateNotifier();
    this.initiateMobileMenu();
    if (header_is_sticky) {
      this.initiateStickyMenu();
    }
    this.initAddToCart();
    this.initiateDropdowns();
    this.initiateModals();
    this.initiateCollapse();
    this.initAttachWishlistListeners();
    this.changeMenuDirection()
    initTootTip();
    this.loadModalImgOnclick();
    this.initSizeOptionSingle();
    this.observeSizeOptionSingle();
    this.initHideEndedCountDown();
    this.init_SideCart();
    salla.comment.event.onAdded(() => window.location.reload());

    this.status = 'ready';
    document.dispatchEvent(new CustomEvent('theme::ready'));
    this.log('Theme Loaded 🎉');
  }

  log(message) {
    salla.log(`ThemeApp(Raed)::${message}`);
    return this;
  }

    // fix Menu Direction at the third level >> The menu at the third level was popping off the page
    changeMenuDirection(){
      app.all('.root-level.has-children',item=>{
        if(item.classList.contains('change-menu-dir')) return;
        app.on('mouseover',item,()=>{
          let submenu = item.querySelector('.sub-menu .sub-menu');
          if(submenu){
            let rect = submenu.getBoundingClientRect();
            (rect.left < 10 || rect.right > window.innerWidth - 10) && app.addClass(item,'change-menu-dir')
          }      
        })
      })
    }

  loadModalImgOnclick(){
    document.querySelectorAll('.load-img-onclick').forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let modal = document.querySelector('#' + link.dataset.modalId),
          img = modal.querySelector('img'),
          imgSrc = img.dataset.src;
        modal.open();

        if (img.classList.contains('loaded')) return;

        img.src = imgSrc;
        img.classList.add('loaded');
      })
    })
  }

  commonThings() {
    this.cleanContentArticles('.content-entry');
  }

  cleanContentArticles(elementsSelector) {
    let articleElements = document.querySelectorAll(elementsSelector);

    if (articleElements.length) {
      articleElements.forEach(article => {
        article.innerHTML = article.innerHTML.replace(/\&nbsp;/g, ' ')
      })
    }
  }

isElementLoaded(selector){
  return new Promise((resolve=>{
    const interval=setInterval(()=>{
    if(document.querySelector(selector)){
      clearInterval(interval)
      return resolve(document.querySelector(selector))
    }
   },160)
}))

  
  };

  copyToClipboard(event) {
    event.preventDefault();
    let aux = document.createElement("input"),
    btn = event.currentTarget;
    aux.setAttribute("value", btn.dataset.content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    this.toggleElementClassIf(btn, 'copied', 'code-to-copy', () => true);
    setTimeout(() => {
      this.toggleElementClassIf(btn, 'code-to-copy', 'copied', () => true)
    }, 1000);
  }

  initiateNotifier() {
    salla.notify.setNotifier(function (message, type, data) {
      if (typeof message == 'object') {
        return Swal.fire(message).then(type);
      }

      return Swal.mixin({
        toast: true,
        position: salla.config.get('theme.is_rtl') ? 'top-start' : 'top-end',
        showConfirmButton: false,
        timer: 2000,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      }).fire({
        icon: type,
        title: message,
        showCloseButton: true,
        timerProgressBar: true
      })
    });
  }


  initiateMobileMenu() {

  this.isElementLoaded('#mobile-menu').then((menu) => {

 
  const mobileMenu = new MobileMenu(menu, "(max-width: 1024px)", "( slidingSubmenus: false)");

  salla.lang.onLoaded(() => {
    mobileMenu.navigation({ title: salla.lang.get('blocks.header.main_menu') });
  });
  const drawer = mobileMenu.offcanvas({ position: salla.config.get('theme.is_rtl') ? "right" : 'left' });

  this.onClick("a[href='#mobile-menu']", event => {
    document.body.classList.add('menu-opened');
    event.preventDefault() || drawer.close() || drawer.open()
    
  });
  this.onClick(".close-mobile-menu", event => {
    document.body.classList.remove('menu-opened');
    event.preventDefault() || drawer.close()
  });
  });

  }
 initAttachWishlistListeners() {
    let isListenerAttached = false;
  
    function toggleFavoriteIcon(id, isAdded = true) {
      document.querySelectorAll('.s-product-card-wishlist-btn[data-id="' + id + '"]').forEach(btn => {
        app.toggleElementClassIf(btn, 's-product-card-wishlist-added', 'not-added', () => isAdded);
        app.toggleElementClassIf(btn, 'pulse-anime', 'un-favorited', () => isAdded);
      });
    }
  
    if (!isListenerAttached) {
      salla.wishlist.event.onAdded((event, id) => toggleFavoriteIcon(id));
      salla.wishlist.event.onRemoved((event, id) => toggleFavoriteIcon(id, false));
      isListenerAttached = true; // Mark the listener as attached
    }
  }

  initiateStickyMenu() {
    let header = this.element('#mainnav'),
      height = this.element('#mainnav .inner')?.clientHeight;
    //when it's landing page, there is no header
    if (!header) {
      return;
    }

    window.addEventListener('load', () => setTimeout(() => this.setHeaderHeight(), 500))
    window.addEventListener('resize', () => this.setHeaderHeight())

    window.addEventListener('scroll', () => {
      window.scrollY >= header.offsetTop + height ? header.classList.add('fixed-pinned', 'animated') : header.classList.remove('fixed-pinned');
      window.scrollY >= 200 ? header.classList.add('fixed-header') : header.classList.remove('fixed-header', 'animated');
    }, { passive: true });
  }

  setHeaderHeight() {
    let height = this.element('#mainnav .inner').clientHeight,
      header = this.element('#mainnav');
    header.style.height = height + 'px';
  }

  initiateDropdowns() {
    this.onClick('.dropdown__trigger', ({ target: btn }) => {
      btn.parentElement.classList.toggle('is-opened');
      document.body.classList.toggle('dropdown--is-opened');
      // Click Outside || Click on close btn
      window.addEventListener('click', ({ target: element }) => {
        if (!element.closest('.dropdown__menu') && element !== btn || element.classList.contains('dropdown__close')) {
          btn.parentElement.classList.remove('is-opened');
          document.body.classList.remove('dropdown--is-opened');
        }
      });
    });
  }
  async init_SideCart() {
    const cartBtn = document.querySelector("#sidecart-button");
    const cartPanel = document.querySelector("#sidecart-panel");
    const overlay = document.querySelector("#sidecart-overlay");
    const closeBtns = cartPanel.querySelectorAll(
      ".menu-close, .close-side-panel"
    );
    const content = cartPanel.querySelector(".side-panel__content");
    const itemsWrap = cartPanel.querySelector("#sidecart-items");
    const total = cartPanel.querySelector("#sidecart-total");
    const subTotal = cartPanel.querySelector("#sidecart-subtotal");
    const totalDiscount = cartPanel.querySelector("#sidecart-total-discount");
    const count = cartPanel.querySelector(".sidecart-products-count");
    const totalItemsEl = document.querySelectorAll(".cart-total-items");
    const isRtl =
      document.documentElement.dir === "rtl" || document.body.dir === "rtl";
    const offscreenX = isRtl ? "100%" : "-100%";
    cartPanel.style.transform = `translateX(${offscreenX})`;
    cartPanel.style.visibility = "hidden";
    cartPanel.style.pointerEvents = "none";
    content.style.opacity = "0";

    // ⚙️ عرض وإخفاء السايد كارت
    const toggleCart = (show) => {
      if (show) {
        cartPanel.style.visibility = "visible";
        cartPanel.style.pointerEvents = "auto";
        overlay.classList.remove("hidden");
        requestAnimationFrame(() => overlay.classList.add("opacity-100"));

        requestAnimationFrame(() => {
          cartPanel.style.transform = "translateX(0)";
          content.style.opacity = "1";
          content.style.transform = "translateX(0)";
        });
      } else {
        overlay.classList.remove("opacity-100");
        setTimeout(() => overlay.classList.add("hidden"), 300);
        const outX = isRtl ? "100%" : "-100%";
        cartPanel.style.transform = `translateX(${outX})`;
        content.style.opacity = "0";
        cartPanel.style.pointerEvents = "none";
        setTimeout(() => (cartPanel.style.visibility = "hidden"), 300);
      }
    };

    // 📦 تحميل السلة
    async function loadCart() {
      function getLocalizedMessageinner(key) {
        const lang = document.documentElement.lang || "ar";
        const messages = {
          ar: {
            remove: "إزالة",
            quantity: "الكمية",
            tax_included: "الضريبة مشمولة",
          },
          en: {
            remove: "Remove",
            quantity: "Quantity",
            tax_included: "Tax Included",
          },
        };
        return messages[lang]?.[key] || messages["ar"][key] || key;
      }
      try {
        const res = await salla.api.cart.details();
        const cart = res.data.cart || {
          items: [],
          count: 0,
          total: 0,
          sub_total: 0,
        };
const items = cart.items;

        
        const totalItems = items.length;
        totalItemsEl.forEach(totalel=>{
          totalel.textContent=`${totalItems}`;
        })
        if (cart.items && cart.items.length) {
          count.textContent = `(${cart.count} منتج)`;
          itemsWrap.innerHTML = cart.items
            .map((item) => {
              console.log(item,"itemitems🥳🥳🥳🥳🥳🥳🥳🥳items🥳🥳🥳🥳🥳🥳🥳🥳items🥳🥳🥳🥳🥳🥳🥳🥳");
              
              const item_url =
                item.product_url || salla.url.get("*/p" + item.product_id);
              const img =
                item.product_image ||
                "https://cdn.salla.sa/form-builder/l48OVh1I5UsWqxsN8cNwutoWTK8OS4r1iUVjYD3B.webp";
              return `
              <form onchange="salla.form.onChange('cart.updateItem', event)" id="item-${item.id}">
              <input type="hidden" name="id" value="${item.id}">
                      <section class="cart-item bg-bg-light dark:bg-bg-dark p-3 md:p-5 rounded border border-gray-100 mb-4 relative" data-id="${
                        item.id
                      }">
                        <div class="md:flex items-start justify-between gap-4">
                          <div class="flex flex-1 gap-4 rtl:space-x-reverse items-center">
                            <a href="${item_url}" class="w-24  h-20">
                              <img src="${img}" alt="${
                item.product_name
              }" class="w-full h-full rounded object-contain" loading="lazy" />
                            </a>
                            <div class="space-y-1">
                              ${
                                !item.is_taxable
                                  ? `<small class="color-grey">${getLocalizedMessageinner(
                                      "tax_included"
                                    )}</small>`
                                  : ""
                              }
                              <h2 class="text- text-base font-medium">
                                <a href="${item_url}">${item.product_name}</a>
                              </h2>
                              <div class="flex items-center gap-1.5">
                                <span class="text-sm text-gray-500 line-through ${
                                  item.offer ? "" : "hidden"
                                }">
                                  ${salla.money(item.product_price)}
                                </span>
                                <span class="item-price font-medium">${salla.money(
                                  item.price
                                )}</span>
                              </div>
                              ${
                                item.offer
                                  ? `
                                <div class="flex items-center gap-1.5 text-sm text-gray-500">
                                  <i class="sicon-discount-calculator"></i>
                                  <span>${item.offer.names}</span>
                                </div>`
                                  : ""
                              }
                    <p class="text-primary font-bold text-sm ">
                    <span>${getLocalizedMessageinner("quantity")}:</span>
                    <span class="inline-block item-quantity">
                      ${item.quantity}
                    </span>
                    </p>
                              
                    <div class="flex-1 border-t border-gray-100 pt-3 md:border-none mt-5 md:mt-0 flex justify-between items-center md:items-start">
                          
                        <salla-quantity-input cart-item-id="${item.id}" max="${ item.max_quantity }"
                            class="transtion transition-color duration-300" aria-label="Quantity"
                            value="${item.quantity}" name="quantity">
                        </salla-quantity-input>
                          
                      </div>
                            </div>
                          </div>
                          <button type="button"
                            class="delete-btn text-red-500 hover:text-red-600 transition text-sm mt-2"
                            data-item-id="${item.id}">
                            <i class="sicon-trash-2"></i>
                          </button>
                        </div>
                      </section>
                      </form>
                      `;
            })
            .join("");
          total.innerHTML = salla.money(cart.total);
          subTotal.innerHTML = cart.sub_total
            ? salla.money(cart.sub_total)
            : "";
          totalDiscount.innerHTML = cart.total_discount
            ? salla.money(cart.total_discount)
            : salla.money(0);

          // 🗑️ زر الحذف
          itemsWrap.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async () => {
              const id = btn.dataset.itemId;
              await salla.cart.deleteItem(id);
              await loadCart(); // تحديث المحتوى
            });
          });
        } else {
          itemsWrap.innerHTML = `
                  <div class="text-center py-10 text-gray-500">
                    <i class="sicon-shopping-bag text-3xl mb-2 block"></i>
                    <p>${salla.lang.get("pages.cart.empty_cart")}</p>
                  </div>`;
          total.innerHTML = "";
          subTotal.innerHTML = "";
          totalDiscount.innerHTML = "";
          count.textContent = "";
           totalItemsEl.forEach(totalel=>{
          totalel.textContent=`0`;
        })
        }
      } catch (err) {
        console.error("❌ Cart fetch error:", err);
        itemsWrap.innerHTML = `<div class="p-4 text-sm text-red-500">حدث خطأ في تحميل السلة</div>`;
      }
    }

    // 📢 ربط الأحداث
    salla.event.cart.onUpdated(loadCart);
    salla.event.cart.onItemAdded(loadCart);
    salla.event.cart.onItemDeleted(loadCart);
    document.addEventListener("salla:cart:updated", loadCart);

    // تحميل أول مرة
    await loadCart();

    // فتح / غلق السايد كارت
    cartBtn?.addEventListener("click", () => {
      console.log("testttttttt");

      const isVisible = cartPanel.style.visibility === "visible";
      toggleCart(!isVisible);
    });
    closeBtns.forEach((btn) =>
      btn.addEventListener("click", () => toggleCart(false))
    );
    overlay?.addEventListener("click", () => toggleCart(false));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleCart(false);
    });
  }
  initiateModals() {
    this.onClick('[data-modal-trigger]', e => {
      let id = '#' + e.target.dataset.modalTrigger;
      this.removeClass(id, 'hidden');
      setTimeout(() => this.toggleModal(id, true)); //small amont of time to running toggle After adding hidden
    });
    salla.event.document.onClick("[data-close-modal]", e => this.toggleModal('#' + e.target.dataset.closeModal, false));
  }

  toggleModal(id, isOpen) {
    this.toggleClassIf(`${id} .s-salla-modal-overlay`, 'ease-out duration-300 opacity-100', 'opacity-0', () => isOpen)
      .toggleClassIf(`${id} .s-salla-modal-body`,
        'ease-out duration-300 opacity-100 translate-y-0 sm:scale-100', //add these classes
        'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95', //remove these classes
        () => isOpen)
      .toggleElementClassIf(document.body, 'modal-is-open', 'modal-is-closed', () => isOpen);
    if (!isOpen) {
      setTimeout(() => this.addClass(id, 'hidden'), 350);
    }
  }

  initiateCollapse() {
    document.querySelectorAll('.btn--collapse')
      .forEach((trigger) => {
        const content = document.querySelector('#' + trigger.dataset.show);
        const state = { isOpen: false }

        const onOpen = () => anime({
          targets: content,
          duration: 225,
          height: content.scrollHeight,
          opacity: [0, 1],
          easing: 'easeOutQuart',
        });

        const onClose = () => anime({
          targets: content,
          duration: 225,
          height: 0,
          opacity: [1, 0],
          easing: 'easeOutQuart',
        })

        const toggleState = (isOpen) => {
          state.isOpen = !isOpen
          this.toggleElementClassIf([content, trigger], 'is-closed', 'is-opened', () => isOpen);
        }

        trigger.addEventListener('click', () => {
          const { isOpen } = state
          toggleState(isOpen)
          isOpen ? onClose() : onOpen();
        })
      });
  }
 initSizeOptionSingle() {
    // Find all containers with the exact data-option-type we want
    const containers = document.querySelectorAll(
      '.product-single .s-product-options-wrapper [data-option-type="single-option"]'
    );

    if (!containers.length) {
      console.warn("No container with data-option-type='single-option' found.");
      return;
    }

    containers.forEach(container => {
      const select = container.querySelector("select");

      if (!select) {
        console.warn("No <select> found inside single-option container.");
        return;
      }

      const options = Array.from(select.options).filter(opt => opt.value.trim() !== "");
      const radioContainer = document.createElement("div");
      radioContainer.classList.add("custom-radio-options");

      const radioButtons = [];

      options.forEach(option => {
        const id = `option_${option.value}`;

        const label = document.createElement("label");
        label.setAttribute("for", id);
        label.classList.add("radio-label");
        label.style.display = "block";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = select.name;
        radio.value = option.value;
        radio.id = id;
        radio.required = select.required;
        radio.classList.add("sr-only");

        label.appendChild(radio);
        label.append(` ${option.text}`);
        radioContainer.appendChild(label);

        radioButtons.push({ radio, label });

        radio.addEventListener("change", () => {
          radioButtons.forEach(({ label: lbl }) => lbl.classList.remove("label_active"));
          label.classList.add("label_active");
        });
      });

      select.parentNode.replaceChild(radioContainer, select);
    });
  }
    observeSizeOptionSingle() {
    const target = document.querySelector("salla-product-options");
    if (!target) {
      console.warn("No <salla-product-options> element found.");
      return;
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          if (target.classList.contains("hydrated")) {
            observer.disconnect(); // stop observing
            this.initSizeOptionSingle(); // run after hydration
          }
        }
      }
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ["class"]
    });

    // If already hydrated, trigger immediately
    if (target.classList.contains("hydrated")) {
      this.initSizeOptionSingle();
      observer.disconnect();
    }
  }
    initHideEndedCountDown() {
    customElements.whenDefined("salla-count-down").then(() => {
      requestAnimationFrame(() => {
        const countDowns = document.querySelectorAll("section");

        countDowns.forEach((countDown) => {
          const observer = new MutationObserver(() => {
            const item = countDown.querySelector("salla-count-down");
            const endedText = item?.querySelector(".s-count-down-end-text");

            if (endedText) {
              item.style.display = "none";
              observer.disconnect();
            }
          });

          observer.observe(countDown, { childList: true, subtree: true });
        });
      });
    });
  }


  /**
   * Workaround for seeking to simplify & clean, There are three ways to use this method:
   * 1- direct call: `this.anime('.my-selector')` - will use default values
   * 2- direct call with overriding defaults: `this.anime('.my-selector', {duration:3000})`
   * 3- return object to play it letter: `this.anime('.my-selector', false).duration(3000).play()` - will not play animation unless calling play method.
   * @param {string|HTMLElement} selector
   * @param {object|undefined|null|null} options - in case there is need to set attributes one by one set it `false`;
   * @return {Anime|*}
   */
  anime(selector, options = null) {
    let anime = new Anime(selector, options);
    return options === false ? anime : anime.play();
  }

  /**
   * These actions are responsible for pressing "add to cart" button,
   * they can be from any page, especially when mega-menu is enabled
   */
  initAddToCart() {
    salla.cart.event.onUpdated(summary => {
      document.querySelectorAll('[data-cart-total]').forEach(el => el.innerHTML = salla.money(summary.total));
      document.querySelectorAll('[data-cart-count]').forEach(el => el.innerText = salla.helpers.number(summary.count));
    });

    salla.cart.event.onItemAdded((response, prodId) => {
      app.element('salla-cart-summary').animateToCart(app.element(`#product-${prodId} img`));
    });
  }
}

salla.onReady(() => (new App).loadTheApp());
