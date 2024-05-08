/* Launches widget to search Crisp help */
(function() {

    function setup() {
        // Create an underlay
        var underlay = document.createElement('div');
        underlay.className = 'crisp-help-fullscreen-underlay';
        document.body.appendChild(underlay);

        var modal = document.createElement('div');
        modal.className = 'crisp-help-modal';

        // Create an iframe element
        var iframe = document.createElement('iframe');
        iframe.className = 'crisp-help-searchbox';
        iframe.frameBorder = 0;

        // Uncomment to test locally
        var url = 'https://search.instantreplay.io/?';
        // if (location.hostname === 'localhost') url = '/?';

        var scriptTag = document.querySelector('script[data-crisp-helpdesk]');
        if (scriptTag) {
            var helpdeskURL = scriptTag.getAttribute('data-crisp-helpdesk');
            url += '&baseURL=' + encodeURIComponent(helpdeskURL);
        }

        iframe.src = url;

        // Add event listener to the document inside the iframe
        iframe.onload = function() {
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.addEventListener('keydown', handleEscapeKeyPress);
        };

        // Close button
        var closeButton = document.createElement("div");
        closeButton.className = "crisp-help-close-button";

        var x = document.createElement("div");
        x.className = "crisp-help-x";
        x.innerHTML = "&#x2715;"; // "×" symbol

        modal.appendChild(iframe);
        closeButton.appendChild(x);
        modal.appendChild(closeButton);

        closeButton.addEventListener("click", function() {
            hideModal();
        });

        document.body.appendChild(modal);

        window.addEventListener('message', function (evt) {
            if (evt.data === 'escape') hideModal();
        }, false);


        var cssText = `
.crisp-help-fullscreen-underlay {
    position: fixed !important;        /* Fixed positioning to cover the whole screen */
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;           /* Full viewport width */
    height: 100vh !important;          /* Full viewport height */
    background-color: rgba(0, 0, 0, 0.8) !important; /* 80% transparent black */
    z-index: 100000 !important;          /* High z-index to ensure it covers other elements */
    transition: opacity 0.12s ease-in-out !important; /* Transition for smooth fade effect */
    opacity: 0 !important;
    display: none;
}

.crisp-help-modal {
    position: fixed !important;
    top: 40% !important;
    left: 50% !important;
    transform-origin: center center !important;
    transform: translate(-50%, -36%) scale(0.98) !important;
    transition: all 0.2s ease !important;
    z-index: 100001 !important;
    width: 540px !important;
    height: 400px !important;
    max-width: 100% !important;
    max-height: 100% !important;
    overflow: auto !important;
    border-radius: 10px !important;
    display: none;
}

@media screen and (max-width: 640px) {
    .crisp-help-modal {
        width: 100% !important;
    }
}

.crisp-help-searchbox {
    z-index: 100002 !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    height: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    max-height: 100% !important;
    overflow: auto !important;
    display: none;
}

.crisp-help-close-button {
    font-size: 16px !important;
    position: absolute !important;
    right: 0 !important;
    top: 0 !important;
    width: 44px !important;
    height: 44px !important;
    z-index: 100005 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
}
.crisp-help-x {
    text-align: center;
}

.crisp-help-fullscreen-underlay.crisp-help-in,
.crisp-help-searchbox.crisp-help-in,
.crisp-help-modal.crisp-help-in {
    display: block !important;
}
.crisp-help-fullscreen-underlay.crisp-help-fade-in {
    opacity: 1 !important;
}
.crisp-help-modal.crisp-help-fade-in {
    transform: translate(-50%, -40%) scale(1) !important;
}
        `;

        // Append reset
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/cleanslate';
        document.head.appendChild(link);

        // Create stylesheet
        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            // This is required for IE8 and below.
            style.styleSheet.cssText = cssText;
        } else {
            // This is for other browsers.
            style.appendChild(document.createTextNode(cssText));
        }
        document.head.appendChild(style);

        // Bind events

        // Event delegation for click event
        document.addEventListener('click', function(event) {
            // Check if the clicked element or any of its parents have the .launch-crisp-search class
            if (event.target.closest('.launch-crisp-search')) {
                handleAction();
            }
        });

        // Listening for keydown event for Cmd+K / Ctrl+K
        document.addEventListener('keydown', function(event) {
            // Check if either Cmd (on Mac) or Ctrl (on other platforms) is pressed along with the 'K' key
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();  // Prevent the default action to avoid any conflict with browser shortcuts
                handleAction();
            }
        });

        // Function to hide modal
        function hideModal() {
            var fullscreenUnderlay = document.querySelector('.crisp-help-fullscreen-underlay');
            var searchbox = document.querySelector('.crisp-help-searchbox');
            var modal = document.querySelector('.crisp-help-modal');

            // Hide modal by removing the 'crisp-help-in' class
            if (fullscreenUnderlay && modal) {
                fullscreenUnderlay.classList.remove('crisp-help-fade-in');
                fullscreenUnderlay.classList.remove('crisp-help-in');
                modal.classList.remove('crisp-help-fade-in');
                searchbox.classList.remove('crisp-help-in');
                modal.classList.remove('crisp-help-in');
            }

            // Reset focus
            document.body.focus();

            setTimeout(() => {
                document.body.focus();
            }, 100);
        }

        // Listen for keydown event on document
        document.addEventListener('keydown', function(event) {
            // Check if the pressed key is the escape key (key code 27)
            if (event.key === 'Escape') {
                hideModal(); // Hide the modal
            }
        });

        // Listen for click event on the fullscreen underlay
        var fullscreenUnderlay = document.querySelector('.crisp-help-fullscreen-underlay');
        if (fullscreenUnderlay) {
            fullscreenUnderlay.addEventListener('click', function(event) {
                if (event.target === fullscreenUnderlay) {
                    hideModal(); // Hide the modal if clicked outside of it
                }
            });
        }

        // Function to handle Escape key press inside the iframe
        function handleEscapeKeyPress(event) {
            if (event.key === 'Escape') {
                // Do something when Escape is pressed inside the iframe
                // console.log('Escape key pressed inside iframe');
                hideModal();
            }
        }
    }


    // Function to handle the action
    function handleAction() {
        // console.log('Action triggered');

        var fullscreenUnderlay = document.querySelector('.crisp-help-fullscreen-underlay');
        var searchbox = document.querySelector('.crisp-help-searchbox');
        var modal = document.querySelector('.crisp-help-modal');

        if (fullscreenUnderlay && modal) {
            fullscreenUnderlay.classList.toggle('crisp-help-in');
            searchbox.classList.toggle('crisp-help-in');
            modal.classList.toggle('crisp-help-in');

            setTimeout(function () {
                fullscreenUnderlay.classList.add('crisp-help-fade-in');
                modal.classList.toggle('crisp-help-fade-in');
            }, 10);
        }
    }

    if (document.readyState === 'loading') {  // Loading hasn't finished yet
        document.addEventListener('DOMContentLoaded', setup);
    } else {  // `DOMContentLoaded` has already fired
        setup();
    }
})();