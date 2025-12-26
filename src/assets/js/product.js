import 'lite-youtube-embed';
import BasePage from './base-page';
import Fslightbox from 'fslightbox';
window.fslightbox = Fslightbox;
import { zoom } from './partials/image-zoom';

class Product extends BasePage {
    onReady() {
        app.watchElements({
            totalPrice: '.total-price',
            productWeight: '.product-weight',
            beforePrice: '.before-price',
            startingPriceTitle: '.starting-price-title',
        });

        this.initProductOptionValidations();

        if(imageZoom){
            // call the function when the page is ready
            this.initImagesZooming();
            // listen to screen resizing
            window.addEventListener('resize', () => this.initImagesZooming());
        }
        this.initproductdetailsFaqs()
        this.runningAfter5Seconds();
    }

     initproductdetailsFaqs() {
    document.addEventListener("DOMContentLoaded", () => {
    const metadata = document.querySelector("salla-metadata");
    if (!metadata) {
      console.error("❌ <salla-metadata> not found!");
      return;
    }

    function initFaqAccordion() {
      const rows = metadata.querySelectorAll(".s-metadata-row");
      if (!rows.length) {
        console.warn("⚠️ No FAQ rows inside <salla-metadata>");
        return;
      }

      rows.forEach((row) => {
        const title = row.querySelector(".s-metadata-row-name");
        const value = row.querySelector(".s-metadata-row-value");
        if (!title || !value) return;

        if (title.dataset.bound) return;
        title.dataset.bound = "true";

        title.addEventListener("click", () => {
          if (row.classList.contains("open")) {
            value.style.maxHeight = value.scrollHeight + "px";
                        requestAnimationFrame(() => {
              value.style.maxHeight = "0";
            });
            row.classList.remove("open");
            value.classList.remove("open");
          } else {
            value.style.maxHeight = value.scrollHeight + "px";
            row.classList.add("open");
            value.classList.add("open");

            value.addEventListener(
              "transitionend",
              () => {
                if (row.classList.contains("open")) {
                  value.style.maxHeight = "none";
                }
              },
              { once: true }
            );
          }
        });
      });
    }

    if (metadata.classList.contains("hydrated")) {
      initFaqAccordion();
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          metadata.classList.contains("hydrated")
        ) {
          initFaqAccordion();
          obs.disconnect();
        }
      });
    });
    observer.observe(metadata, { attributes: true });
  });
}

runningAfter5Seconds() {
   


    if (!window.newsletter_view_modal) {
      return;
    }
    setTimeout(() => {
      // show modal after delay

      const modal = document.createElement("div");
      modal.id = "newsletter-modal";
      modal.className = `
      fixed inset-0 z-[99] flex items-center justify-center 
      bg-black/40 backdrop-blur-sm opacity-0 
      transition-all duration-500
    `;

      modal.innerHTML = `
      <div class="bg-background  rounded-2xl p-8 w-[90%] max-w-[961px] relative transform scale-90 transition-transform duration-500 shadow-xl">
      <div class="w-[224px] h-auto mx-auto">
        <img src="${add_image}" class="w-full h-auto"/>
      </div>
        <button id="close-modal" 
          class="absolute top-3 flex items-center justify-center right-3 border-2 border-primary font-bold w-[31px] h-[31px]  text-primary transition">
          <i class="sicon-cancel text-[16px] font-bold"></i>
        </button>

        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-primary mb-3">${newslatter_block_title}</h2>
          <p class="text-gray-600 ">${newslatter_sub_title}</p>
        </div>

        <form 
          action="${newsletter_url}" 
          method="post"
          id="mc-embedded-subscribe-form-1"
          class="flex items-center justify-center gap-2 rounded-[10px] p-1 w-full max-w-md mx-auto"
          target="_blank"
          novalidate
        >
          <input
            type="email"
            name="EMAIL"
            id="mce-EMAIL-1"
            placeholder="${this.getLocalizedMessage("placeholder")}"
            class="flex-1 bg-gray-100 px-4 py-3 border-none text-gray-700 placeholder-gray-400 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary/40"
            required
          />
          <button 
            type="submit"
            id="mc-embedded-subscribe-1"
            class="bg-primary w-11 h-11 flex items-center justify-center rounded-[10px] hover:scale-105 active:scale-95 transition-transform"
          >
            <i class="sicon-send-mail text-lg text-font  rotate-180 ltr:rotate-0"></i>
          </button>
        </form>
      </div>
    `;

      document.body.appendChild(modal);

      requestAnimationFrame(() => {
        modal.classList.remove("opacity-0");
        modal.querySelector("div").classList.remove("scale-90");
        modal.querySelector("div").classList.add("scale-100");
      });

      const closeModal = () => {
        modal.classList.add("opacity-0");
        modal.querySelector("div").classList.add("scale-90");
        setTimeout(() => modal.remove(), 400);
      };

      document
        .getElementById("close-modal")
        .addEventListener("click", closeModal);

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      const form = document.getElementById("mc-embedded-subscribe-form-1");
      const emailInput = document.getElementById("mce-EMAIL-1");
      const submitBtn = document.getElementById("mc-embedded-subscribe-1");

      const isRTL = document.documentElement.dir === "rtl";
      const messages = {
        required: isRTL
          ? "الرجاء إدخال بريد إلكتروني صحيح"
          : "Please enter a valid email",
        invalid: isRTL
          ? "صيغة البريد الإلكتروني غير صحيحة"
          : "Invalid email format",
        success: isRTL
          ? "تم الاشتراك بنجاح! شكراً لك"
          : "Subscription successful! Thank you",
        sending: isRTL ? "جاري الإرسال..." : "Sending...",
      };

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(emailValue)) {
          salla.notify.error(messages.invalid);
          return;
        }

        submitBtn.disabled = true;

        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          mode: "no-cors",
        })
          .then(() => {
            salla.notify.success(messages.success);
            form.reset();
            closeModal();
          })
          .finally(() => {
            submitBtn.disabled = false;
          });
      });

      sessionStorage.setItem(storeKey, "true");
    }, 2000);
  }

    initProductOptionValidations() {
      document.querySelector('.product-form')?.addEventListener('change', function(){
        this.reportValidity() && salla.product.getPrice(new FormData(this));
      });
    }

    initImagesZooming() {
      // skip if the screen is not desktop or if glass magnifier
      // is already crated for the image before
      const imageZoom = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active .img-magnifier-glass');
      if (window.innerWidth  < 1024 || imageZoom) return;
      setTimeout(() => {
          // set delay after the resizing is done, start creating the glass
          // to create the glass in the proper position
          const image = document.querySelector('.image-slider .swiper-slide-active img');
          zoom(image?.id, 2);
      }, 250);
  

      document.querySelector('salla-slider.details-slider').addEventListener('slideChange', (e) => {
          // set delay till the active class is ready
          setTimeout(() => {
              const imageZoom = document.querySelector('.image-slider .swiper-slide-active .img-magnifier-glass');
    
              // if the zoom glass is already created skip
              if (window.innerWidth  < 1024 || imageZoom) return;
              const image = document.querySelector('.image-slider .magnify-wrapper.swiper-slide-active img');
              zoom(image?.id, 2);
          }, 250)
      })
    }

    registerEvents() {
      salla.event.on('product::price.updated.failed',()=>{
        app.element('.price-wrapper').classList.add('hidden');
        app.element('.out-of-stock').classList.remove('hidden')
        app.anime('.out-of-stock', { scale: [0.88, 1] });
      })
      salla.product.event.onPriceUpdated((res) => {

        app.element('.out-of-stock').classList.add('hidden')
        app.element('.price-wrapper').classList.remove('hidden')

        let data = res.data,
            is_on_sale = data.has_sale_price && data.regular_price > data.price;

        app.startingPriceTitle?.classList.add('hidden');

        app.productWeight.forEach((el) => {el.innerHTML = data.weight || ''});
        app.totalPrice.forEach((el) => {el.innerHTML = salla.money(data.price)});
        app.beforePrice.forEach((el) => {el.innerHTML = salla.money(data.regular_price)});

        app.toggleClassIf('.price_is_on_sale','showed','hidden', ()=> is_on_sale)
        app.toggleClassIf('.starting-or-normal-price','hidden','showed', ()=> is_on_sale)

        app.anime('.total-price, .product-weight', { scale: [0.88, 1] });
      });

      app.onClick('#btn-show-more', e => app.all('#more-content', div => {
        e.target.classList.add('is-expanded');
        div.style = `max-height:${div.scrollHeight}px`;
      }) || e.target.remove());
    }
}

Product.initiateWhenReady(['product.single']);
