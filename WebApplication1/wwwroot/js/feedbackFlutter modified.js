document.addEventListener('DOMContentLoaded', function () {
    // Inject CSS dynamically
    const css = `
    .feedback-container {
      position: relative;
    }

    .feedback-toggle {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background-color: #F57C00; /* Colors.yellow.shade700 */
      color: white;
      width: 60px;
      height: 60px;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      z-index: 1001;
      transition: background-color 0.3s;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .feedback-toggle:hover {
      background-color: #e69500;
    }

    .feedback-popup {
      position: fixed;
      bottom: 80px;
      right: 10px;
      width: 370px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      overflow: hidden;
      z-index: 1000;
      display: none; /* Ensure the popup is hidden by default */
    }

    .feedback-header {
      background-color: #F57C00; /* Colors.yellow.shade700 */
      color: white;
      padding: 16px;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Roboto', sans-serif;
    }

    .feedback-header h2 {
      margin: 0;
      font-size: 18px;
      text-transform: capitalize;
    }

    .feedback-header .close-popup {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 24px;
    }

    .feedback-body {
      padding: 16px;
    }

    input, textarea {
      width: 100%;
      border: 2px solid #F57C00;
      font-family: 'Roboto', sans-serif;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 10px;
    }

    input:focus, textarea:focus {
      border-color: #F57C00;
      outline: none;
    }

    .feedback-actions {
      display: flex;
      justify-content: flex-end;
      padding: 15px;
      background-color: #f9f9f9;
    }

    .back-btn {
      background-color: #f44336;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin-right: auto;
      font-family: 'Roboto', sans-serif;
    }

    .submit-btn {
      background-color: #F57C00;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-family: 'Roboto', sans-serif;
    }

    .loading-spinner {
      border: 2px solid #fff;
      border-radius: 50%;
      border-top: 2px solid rgba(255, 255, 255, 0.5);
      width: 20px;
      height: 20px;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `;
    const style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // Ensure unique IDs for elements to avoid conflict
    const uniqueId = `feedback_${Date.now()}`;
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback-container');
    feedbackContainer.innerHTML = `
        <button class="feedback-toggle" id="feedback-toggle-${uniqueId}">
            🗨️
        </button>
        <div class="feedback-popup" id="feedback-popup-${uniqueId}">
            <div class="feedback-header">
                <h2 id="feedback-header-text-${uniqueId}">Feedback</h2>
                <button class="close-popup" id="close-popup-${uniqueId}">✖</button>
            </div>
            <div class="feedback-body">
                <input id="feedback-name-${uniqueId}" placeholder="Your Name" />
                <input id="feedback-country-${uniqueId}" placeholder="Your Country" />
                <textarea id="feedback-message-${uniqueId}" placeholder="Your Message"></textarea>
                <div class="feedback-actions">
                    <button class="back-btn" id="back-btn-${uniqueId}">Back</button>
                    <button class="submit-btn" id="submit-btn-${uniqueId}">
                        <span id="submit-text-${uniqueId}">Submit</span>
                        <div id="loading-spinner-${uniqueId}" class="loading-spinner" style="display: none;"></div>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(feedbackContainer);

    const feedbackToggle = document.getElementById(`feedback-toggle-${uniqueId}`);
    const feedbackPopup = document.getElementById(`feedback-popup-${uniqueId}`);
    const closePopup = document.getElementById(`close-popup-${uniqueId}`);
    const backBtn = document.getElementById(`back-btn-${uniqueId}`);
    const submitBtn = document.getElementById(`submit-btn-${uniqueId}`);
    const feedbackForm = document.getElementById(`feedback-form-${uniqueId}`);
    const feedbackMessage = document.getElementById(`feedback-message-${uniqueId}`);
    const feedbackName = document.getElementById(`feedback-name-${uniqueId}`);
    const feedbackCountry = document.getElementById(`feedback-country-${uniqueId}`);
    const loadingSpinner = document.getElementById(`loading-spinner-${uniqueId}`);
    const submitText = document.getElementById(`submit-text-${uniqueId}`);

    let isPopupOpen = false;

    feedbackToggle.addEventListener('click', function () {
        isPopupOpen = !isPopupOpen;
        if (isPopupOpen) {
            feedbackPopup.style.display = 'block';
            feedbackToggle.innerHTML = `&times;`;
        } else {
            feedbackPopup.style.display = 'none';
            feedbackToggle.innerHTML = `🗨️`;
        }
    });

    closePopup.addEventListener('click', function () {
        feedbackPopup.style.display = 'none';
        feedbackToggle.innerHTML = `🗨️`;
        isPopupOpen = false;
    });

    backBtn.addEventListener('click', function () {
        feedbackPopup.style.display = 'none';
    });

    submitBtn.addEventListener('click', function () {
        if (!feedbackName.value.trim() || !feedbackCountry.value.trim() || !feedbackMessage.value.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        submitText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;

        setTimeout(function () {
            const feedbackData = {
                type: "Feedback",
                name: feedbackName.value,
                country: feedbackCountry.value,
                message: feedbackMessage.value
            };

            // Dispatch custom event
            const feedbackEvent = new CustomEvent('feedbackSubmitted', { detail: feedbackData });
            document.dispatchEvent(feedbackEvent);

            feedbackPopup.style.display = 'none';
            feedbackToggle.innerHTML = `🗨️`;
            isPopupOpen = false;

            feedbackName.value = '';
            feedbackCountry.value = '';
            feedbackMessage.value = '';
            submitText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }, 2000);
    });
});
