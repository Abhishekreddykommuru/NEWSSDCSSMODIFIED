(function() {
    const eventLog = [];

    function getTimestamp() {
        return new Date().toISOString();
    }

    function getElementDescriptor(element) {
        let descriptor = element.tagName.toLowerCase();
        if (element.id) descriptor += `#${element.id}`;
        if (element.classList.length > 0) descriptor += `.${element.classList[0]}`;
        if (element.type) descriptor += `[type="${element.type}"]`;
        return descriptor;
    }

    function getEventObjectType(element) {
        const tagName = element.tagName.toLowerCase();
        const typeMap = {
            'button': 'button',
            'a': 'link',
            'img': 'image',
            'input': element.type || 'input',
            'select': 'dropdown',
            'textarea': 'textarea',
            'video': 'video',
            'canvas': 'canvas',
            'div': 'div',
            'p': 'text',
            'h1': 'heading',
            'h2': 'heading',
            'h3': 'heading',
            'span': 'span',
            'li': 'list-item',
            'ul': 'list',
            'ol': 'list'
        };
        return typeMap[tagName] || tagName;
    }

    function logEvent(eventData) {
        eventLog.push(eventData);
        console.log(
            `[${eventData.timestamp}] ${eventData.type_of_event.toUpperCase()} | ` +
            `Object: ${eventData.event_object} | ` +
            `Element: ${eventData.element_descriptor}`
        );
    }

    function trackClicks() {
        document.addEventListener('click', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'click',
                event_object: getEventObjectType(event.target),
                element_descriptor: getElementDescriptor(event.target),
                page_url: window.location.href
            });
        }, true);
    }

    function trackPageView() {
        logEvent({
            timestamp: getTimestamp(),
            type_of_event: 'view',
            event_object: 'page',
            element_descriptor: 'document',
            page_url: window.location.href
        });
    }

    function trackInputChanges() {
        document.addEventListener('change', function(event) {
            const element = event.target;
            if (element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') {
                logEvent({
                    timestamp: getTimestamp(),
                    type_of_event: 'change',
                    event_object: getEventObjectType(element),
                    element_descriptor: getElementDescriptor(element),
                    page_url: window.location.href
                });
            }
        }, true);
    }

    function trackScroll() {
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                logEvent({
                    timestamp: getTimestamp(),
                    type_of_event: 'scroll',
                    event_object: 'window',
                    element_descriptor: 'window',
                    scroll_y: window.scrollY,
                    page_url: window.location.href
                });
            }, 300);
        });
    }

    function trackHover() {
        document.addEventListener('mouseover', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'hover',
                event_object: getEventObjectType(event.target),
                element_descriptor: getElementDescriptor(event.target),
                page_url: window.location.href
            });
        }, true);
    }

    function trackDoubleClick() {
        document.addEventListener('dblclick', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'double-click',
                event_object: getEventObjectType(event.target),
                element_descriptor: getElementDescriptor(event.target),
                page_url: window.location.href
            });
        }, true);
    }

    function trackKeyPress() {
        document.addEventListener('keydown', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'keypress',
                event_object: 'keyboard',
                element_descriptor: `key: ${event.key}`,
                page_url: window.location.href
            });
        });
    }

    function trackFocus() {
        document.addEventListener('focus', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'focus',
                event_object: getEventObjectType(event.target),
                element_descriptor: getElementDescriptor(event.target),
                page_url: window.location.href
            });
        }, true);
    }

    function trackSubmit() {
        document.addEventListener('submit', function(event) {
            logEvent({
                timestamp: getTimestamp(),
                type_of_event: 'submit',
                event_object: 'form',
                element_descriptor: getElementDescriptor(event.target),
                page_url: window.location.href
            });
        }, true);
    }

    window.getEventLog = function() {
        return eventLog;
    };

    window.clearEventLog = function() {
        eventLog.length = 0;
        console.log('Event log cleared');
    };

    window.downloadEventLog = function() {
        const dataStr = JSON.stringify(eventLog, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `event_log_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    function init() {
        console.log('Event Tracking Active');
        trackPageView();
        trackClicks();
        trackInputChanges();
        trackScroll();
        trackHover();
        trackDoubleClick();
        trackKeyPress();
        trackFocus();
        trackSubmit();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();