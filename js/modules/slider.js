function slider({container, slide, wrapper, totalCounter, field, currentCounter, slidesCounter, nextArrow, prevArrow}) {
    // Slider

    const sliderCounter = document.querySelector(currentCounter),
        currentSlides = sliderCounter.querySelector(slidesCounter),
        slider = document.querySelector(container),
        slides = document.querySelectorAll(slide),
        slidesWrapper = document.querySelector(wrapper),
        width = parseInt(window.getComputedStyle(slidesWrapper).width),
        slidesField = document.querySelector(field);

    sliderCounter.querySelector(totalCounter).innerHTML = ((slides.length < 10) ? '0' : '') + slides.length;

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
        if (event.target.classList.contains(prevArrow.slice(1))) {
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
        else if (event.target.classList.contains(nextArrow.slice(1))) {
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
}

export default slider;