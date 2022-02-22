window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', event => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });

    // Timer

    const deadLine = '2022-01-21';

    function getTimeRemaining(endtime) {
        const total = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(total / (1000 * 60 * 60 * 24)),
            hours = Math.floor(total / (1000 * 60 * 60) % 24),
            minutes = Math.floor((total / 1000 / 60) % 60),
            seconds = Math.floor((total / 1000) % 60);

        return {
            total,
            days,
            hours,
            minutes,
            seconds
        };
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function getTimeValue(time) {
            return (time >= 0 && time < 10) ? '0' + time : time;
        }

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getTimeValue(t.days);
            hours.innerHTML = getTimeValue(t.hours);
            minutes.innerHTML = getTimeValue(t.minutes);
            seconds.innerHTML = getTimeValue(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadLine);

    // Modal 

    const modalTriggers = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => openModal());
    });

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', key => {
        if (key.code === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Modal modifying

    const modalTimerId = setTimeout(() => {
        if (!modal.classList.contains('show')) {
            openModal();
        }
    }, 10000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);

    // Classes for cards

    class MenuCard {
        constructor(photoPath, photoAlt, title, descr, price, parentElement, ...classes) {
            this.photoPath = photoPath;
            this.photoAlt = photoAlt;
            this.title = title;
            this.descr = descr;
            this.price = +price;
            this.parentElement = document.querySelector(parentElement);
            this.classes = classes;
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        setCard(cardId) {
            this.cardId = cardId;

            const card = this.parentElement.querySelector(`.menu__item:nth-child(${this.cardId})`),
                photo = document.createElement('img');

            photo.src = this.photoPath;
            photo.alt = this.photoAlt;

            card.querySelector('img').replaceWith(photo);
            card.querySelector('.menu__item-subtitle').innerHTML = this.title;
            card.querySelector('.menu__item-descr').innerHTML = this.descr;
            card.querySelector('.menu__item-total span').innerHTML = this.price;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0) {
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src=${this.photoPath} alt=${this.photoAlt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;

            this.parentElement.append(element);
        }
    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //         });
    //     });

    axios.get('http://localhost:3000/menu')
        .then(data => {
            data.data.forEach(({ img, altimg, title, descr, price }) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    // Variant of cards genereator without class
    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));

    // function createCard(data) {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add('menu__item');

    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;

    //         document.querySelector('.menu .container').append(element);
    //     });
    // }

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так'
    };

    forms.forEach(form => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    // Slider

    const sliderCounter = document.querySelector('.offer__slider-counter'),
        currentSlides = sliderCounter.querySelector('#current'),
        slider = document.querySelector('.offer__slider'),
        slides = document.querySelectorAll('.offer__slide'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        width = parseInt(window.getComputedStyle(slidesWrapper).width),
        slidesField = document.querySelector('.offer__slider-inner');

    sliderCounter.querySelector('#total').innerHTML = ((slides.length < 10) ? '0' : '') + slides.length;

    // Version 2

    let offset = 0;
    let slideIndex = 1;

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '.7s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width + 'px';
    });

    const indicators = document.createElement('ol'),
        dots = [];

    indicators.classList.add('carousel-indicators');

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.classList.add('dot');

        if (i == 0) {
            dot.style.opacity = 1;
        }

        indicators.append(dot);
        dots.push(dot);
    }

    sliderCounter.addEventListener('click', event => {
        if (event.target.classList.contains('offer__slider-prev')) {
            if (offset == 0) {
                offset = width * (slides.length - 1);
                slideIndex = slides.length;
            } else {
                offset -= width;
                slideIndex--;
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            currentSlides.innerHTML = ((slideIndex < 10) ? '0' : '') + slideIndex;

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        }
        else if (event.target.classList.contains('offer__slider-next')) {
            if (offset == width * (slides.length - 1)) {
                offset = 0;
                slideIndex = 1;
            } else {
                offset += width;
                slideIndex++;
            }

            slidesField.style.transform = `translateX(-${offset}px)`;

            currentSlides.innerHTML = ((slideIndex < 10) ? '0' : '') + slideIndex;

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        }
    });

    // Version 1

    // let slideNumber = +currentSlides.innerHTML;

    // const slideChange = (pos) => {
    //     slides.forEach((slide, index) => {
    //         if (slide.classList.contains('show')) { slide.classList.remove('show'); }
    //         else {
    //             if (index == pos - 1) { slide.classList.add('show'); }
    //         }
    //     });
    //     slideNumber = pos;
    // };

    // sliderCounter.addEventListener('click', event => {
    //     if (event.target.classList.contains('offer__slider-prev')) {
    //         let nextSlideNumber = slideNumber - 1;

    //         nextSlideNumber = (nextSlideNumber != 0) ? nextSlideNumber : slides.length;
    //         currentSlides.innerHTML = ((nextSlideNumber < 10) ? '0' : '') + nextSlideNumber;

    //         slideChange(nextSlideNumber);
    //     }
    //     else if (event.target.classList.contains('offer__slider-next')) {
    //         let nextSlideNumber = slideNumber + 1;

    //         nextSlideNumber = (nextSlideNumber != slides.length + 1) ? nextSlideNumber : 1;
    //         currentSlides.innerHTML = ((nextSlideNumber < 10) ? '0' : '') + nextSlideNumber;

    //         slideChange(nextSlideNumber);
    //     }
    // });

    // Navigation

    dots.forEach(dot => {
        dot.addEventListener('click', event => {
            const slideTo = event.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = width * (slideIndex - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            currentSlides.innerHTML = ((slideIndex < 10) ? '0' : '') + slideIndex;

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[slideIndex - 1].style.opacity = 1;
        });
    });

    // Calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
        height, weight, age,
        ratio = 1.375;

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    function getStaticInfo(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(element => {
            element.addEventListener('click', event => {
                if (event.target.getAttribute('data-ratio')) {
                    ratio = +event.target.getAttribute('data-ratio');
                } else {
                    sex = event.target.getAttribute('id');
                }

                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });

                event.target.classList.add(activeClass);

                calcTotal();
            });
        });
    }

    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInfo(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            switch (input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            calcTotal();
        });
    }

    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');
});