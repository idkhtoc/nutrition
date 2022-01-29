window.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent  = document.querySelectorAll('.tabcontent'),
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
              days  = timer.querySelector('#days'),
              hours  = timer.querySelector('#hours'),
              minutes  = timer.querySelector('#minutes'),
              seconds  = timer.querySelector('#seconds'),
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
          modal = document.querySelector('.modal'),
          modalClose = document.querySelector('[data-close]');

    function toggleModal(overflow) {
        modal.classList.toggle('show');
        document.body.style.overflow = (overflow == 'open') ? 'hidden' : '';
        clearInterval(modalTimerId);
    }

    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => toggleModal('open'));
    });

    modalClose.addEventListener('click', () => toggleModal('close'));
    
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            toggleModal('close');
        }
    });

    document.addEventListener('keydown', key => {
        if (key.code === 'Escape' && modal.classList.contains('show')) {
            toggleModal('close');
        }
    });

    // Modal modifying

    const modalTimerId = setTimeout(() => {
        if (!modal.classList.contains('show')) {
            toggleModal('open');
        }
    }, 10000);

    function showModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            toggleModal('open');
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

    new MenuCard(
        'img/tabs/vegy.jpg',
        'vegy',
        'Меню: "Фитнес"',
        `Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих
        овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной
        ценой и высоким качеством!`,
        9,
        '.menu .container'
    ).render();

    new MenuCard(
        'img/tabs/elite.jpg',
        'elite',
        'Меню: “Премиум”',
        `В меню “Премиум” мы используем не только красивый дизайн упаковки, но
        и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода
        в ресторан!`,
        14,
        '.menu .container'
    ).render();

    new MenuCard(
        'img/tabs/post.jpg',
        'post',
        'Меню: “Постное”',
        `Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие
        продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное
        количество белков за счет тофу и импортных вегетарианских стейков.`,
        7,
        '.menu .container'
    ).render();

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'Загрузка',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так' 
    };

    forms.forEach(form => {
        postData(form);
    });

    function postData(form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusMessage = document.createElement('div');
            statusMessage.classList.add('status');
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const request = new XMLHttpRequest();
            request.open('POST', 'server.php');

            request.setRequestHeader('Content-type', 'application/json');
            // Если formData - можно не указывать заголовок
            const formData = new FormData(form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            const json = JSON.stringify(object);

            request.send(json);

            request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);
                    statusMessage.textContent = message.success;
                    
                    form.reset();
                    
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 2000);
                } else {
                    statusMessage.textContent = message.failure;
                }
            });
        });
    }
});  