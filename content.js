const saveSettings = (widthValue) => {
  try {
    browser.storage.local.set({ width: widthValue }).then(() => {
      console.debug(`WideGPT: Settings saved - width: ${widthValue}%`);
    });
  } catch (error) {
    console.error("WideGPT: Error saving settings:", error);
  }
};

// Load settings from browser storage
const loadSettings = () => {
  try {
    const result = browser.storage.local.get("width").then((result) => {
      const widthValue = result.width || 95; // Default to 95% if not set
      console.debug(`WideGPT: Settings loaded - width: ${widthValue}%`);
      return widthValue;
    });
    return result;
  } catch (error) {
    console.error("WideGPT: Error loading settings:", error);
    return 95; // Default width in case of error
  }
};

// Function to attach or update a dynamic style rule
const attachOrUpdateStyleRule = (css, id = "dynamic-style") => {
  // Check if a style element with the given ID already exists
  let style = document.getElementById(id);
  if (!style) {
    // Create a new style element if it doesn't exist
    style = document.createElement("style");
    style.type = "text/css";
    style.id = id;
    document.head.appendChild(style);
  }

  // Update the CSS content
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.textContent = css;
  }
};

// Function to dynamically update the CSS rules
const adjustMaxWidth = (width = 100) => {
  console.debug(`WideGPT.adjustMaxWidth() called with width: ${width}%`);

  // Dynamically create CSS rules using the specified width
  const css = `
        @media (min-width: 1280px) {
            .xl\\:max-w-\\[48rem\\] {
                max-width: ${width}% !important;
            }
            .xl\\:px-5 {
                padding-left: 1.25rem;
                padding-right: 1.25rem;
                max-width: ${width}% !important;
            }
        }

        @media (min-width: 768px) {
            .md\\:max-w-3xl {
                max-width: ${width}% !important;
            }
        }

        @container (width >= 64rem) {
            .\\@\\[64rem\\]\\:\\[--thread-content-max-width\\:48rem\\] {
                --thread-content-max-width: ${width}% !important;
            }
        }

        @container (width >= 34rem) {
            .\\@\\[34rem\\]\\:\\[--thread-content-max-width\\:40rem\\] {
                --thread-content-max-width: ${width}% !important;
            }
        }

        /* Override table container margins added by ChatGPT */
        div[class^='_tableContainer'] {
            --thread-content-width: unset !important;
        }

        /* Ensure table wrapper matches selected width */
        div[class^='_tableWrapper'] {
            min-width: fit-content !important;
            max-width: ${width}% !important;
        }
    `;
  attachOrUpdateStyleRule(css);
};

// Initial call with default width
loadSettings().then((widthValue) => {
  const widthInput = document.getElementById("widthinput");
  if (widthInput) {
    widthInput.value = widthValue; // Set the input field to the loaded value
  }
  adjustMaxWidth(widthValue);
});

// Add an event listener to the width input field
const widthInput = document.getElementById("widthinput");
if (widthInput) {
  widthInput.addEventListener("input", () => {
    const widthValue = widthInput.value;
    console.debug(`WideGPT: Width input changed to: ${widthValue}%`);
    adjustMaxWidth(widthValue);
    saveSettings(widthValue);
  });
}
