
const attachStyleRule = (css) => {
    // Create a style element
    const style = document.createElement('style');
    style.type = 'text/css';

    // Check if the style element can be used with textContent
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    // Append the style element to the head of the document
    document.head.appendChild(style);
};

// This function will be executed when the page loads
const adjustMaxWidth = () => {
    console.debug('WideGPT.adjustMaxWidth() called');

    // Define the CSS rule to override max-width within the media query
    const css = `
        @media (min-width: 1280px) {
            .xl\\:max-w-\\[48rem\\] {
                max-width: 100% !important;
            }
            .xl\\:px-5 {
                padding-left: 1.25rem;
                padding-right: 1.25rem;
                max-width: 100% !important;
            }
        }
    `;
    attachStyleRule(css);

    const css_no_bar = `
        @media (min-width: 768px) {
            .md\\:max-w-3xl {
                max-width: 100% !important;
            }
        }
    `;

    attachStyleRule(css_no_bar);
};
adjustMaxWidth();