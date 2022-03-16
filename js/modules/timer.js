function timer() {
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
}

module.exports = timer;