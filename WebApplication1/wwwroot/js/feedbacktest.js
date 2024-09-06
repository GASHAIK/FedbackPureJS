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
      background-color: #4caf50;
      color: white;
      padding: 12px 39px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s, box-shadow 0.3s;
      font-family: 'Roboto', sans-serif;
      z-index: 1001;
    }

    .feedback-toggle.active {
      background-color: gainsboro;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      color: black;
      font-size: 24px;
    }

    .feedback-popup {
      position: fixed;
      bottom: 60px;
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
      background-color: #4caf50;
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

    .radio-group {
      display: flex;
      flex-direction: column;
      margin-bottom: 16px;
    }

    .feedback-type {
      background: #ffffff;
      border: 2px solid #4caf50;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: background-color 0.3s, color 0.3s;
    }

    .feedback-type:hover {
      background-color: #4caf50;
      color: white;
    }

    textarea {
      width: 100%;
      border-color: #4caf50 !important;
      font-family: 'Roboto', sans-serif;
      resize: none;
      padding: 12px;
      border-radius: 6px;
      transition: border-color 0.3s;
    }

    textarea:focus {
      border-color: #45a049;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 128, 0, 0.3);
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
      font-size: 16px;
      margin-right: auto;
      font-family: 'Roboto', sans-serif;
      transition: background-color 0.3s, box-shadow 0.3s;
    }

    .back-btn:hover {
      background-color: #d32f2f;
    }

    .submit-btn {
      background-color: #4caf50;
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Roboto', sans-serif;
      transition: background-color 0.3s, box-shadow 0.3s;
    }

    .submit-btn:hover {
      background-color: #45a049;
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

    // Inject HTML dynamically
    const feedbackContainer = document.createElement('div');
    feedbackContainer.classList.add('feedback-container');
    feedbackContainer.innerHTML = `
        <button class="feedback-toggle" id="feedback-toggle">
            <span id="feedback-icon">Feedback</span>
        </button>
        <div class="feedback-popup" id="feedback-popup">
            <div class="feedback-header">
                <h2 id="feedback-header-text">Feedback</h2>
                <button class="close-popup" id="close-popup">✖</button>
            </div>
            <div class="feedback-body">
                <div id="feedback-options">
                    <div class="radio-group">
                        <button class="feedback-type" data-type="General Suggestion">😁 General Suggestion</button>
                        <button class="feedback-type" data-type="Problem">💡 Problem</button>
                        <button class="feedback-type" data-type="Report a Bug">🐞 Report a Bug</button>
                    </div>
                </div>
                <div id="feedback-form" style="display: none;">
                    <textarea id="feedback-message" placeholder="Your feedback goes here!"></textarea>
                    <div class="feedback-actions">
                        <button class="back-btn" id="back-btn">Back</button>
                        <button class="submit-btn" id="submit-btn">
                            <span id="submit-text">Submit</span>
                            <div id="loading-spinner" class="loading-spinner" style="display: none;"></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(feedbackContainer);

    // JavaScript functionality
    const feedbackToggle = document.getElementById('feedback-toggle');
    const feedbackPopup = document.getElementById('feedback-popup');
    const closePopup = document.getElementById('close-popup');
    const backBtn = document.getElementById('back-btn');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackOptions = document.getElementById('feedback-options');
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackHeaderText = document.getElementById('feedback-header-text');
    const feedbackMessage = document.getElementById('feedback-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const submitText = document.getElementById('submit-text');

    // Ensure all elements are defined before using them
    if (!feedbackForm || !feedbackOptions || !feedbackMessage) {
        console.error("Form elements are not found!");
        return;
    }

    let isPopupOpen = false;
    let feedbackTypeSelected = false;

    feedbackToggle.addEventListener('click', function () {
        isPopupOpen = !isPopupOpen;
        if (isPopupOpen) {
            feedbackPopup.style.display = 'block';
            feedbackToggle.classList.add('active');
            feedbackToggle.innerHTML = `<span style="color: black;">&times;</span>`;

            // Reset feedback form state when the popup is opened
            feedbackForm.style.display = 'none';
            feedbackOptions.style.display = 'block';
            feedbackHeaderText.innerText = "Feedback"; // Reset to default header
            feedbackMessage.value = ''; // Clear the message if any was left

        } else {
            feedbackPopup.style.display = 'none';
            feedbackToggle.classList.remove('active');
            feedbackToggle.innerHTML = `<span id="feedback-icon">Feedback</span>`;
        }
    });

    closePopup.addEventListener('click', function () {
        feedbackPopup.style.display = 'none';
        feedbackToggle.classList.remove('active');
        feedbackToggle.innerHTML = `<span id="feedback-icon">Feedback</span>`;
        isPopupOpen = false;
    });

    document.querySelectorAll('.feedback-type').forEach(function (button) {
        button.addEventListener('click', function () {
            feedbackTypeSelected = true;
            feedbackHeaderText.innerText = button.dataset.type;
            feedbackOptions.style.display = 'none';
            feedbackForm.style.display = 'block';
        });
    });

    backBtn.addEventListener('click', function () {
        feedbackTypeSelected = false;
        feedbackHeaderText.innerText = 'Feedback';
        feedbackForm.style.display = 'none';
        feedbackOptions.style.display = 'block';
    });

    submitBtn.addEventListener('click', function () {
        if (!feedbackMessage.value.trim()) {
            alert('Please provide your feedback.');
            return;
        }

        submitText.style.display = 'none';
        loadingSpinner.style.display = 'block';
        submitBtn.disabled = true;

        setTimeout(function () {
            const feedbackData = {
                type: feedbackHeaderText.innerText,
                message: feedbackMessage.value
            };

            // Dispatch the custom event with the feedback data
            const feedbackEvent = new CustomEvent('feedbackSubmitted', { detail: feedbackData });
            document.dispatchEvent(feedbackEvent); // Trigger the event

            // Reset the form and UI
            feedbackPopup.style.display = 'none';
            feedbackToggle.classList.remove('active');
            feedbackToggle.innerHTML = `<span id="feedback-icon">Feedback</span>`;
            isPopupOpen = false;

            // Reset feedback form state
            feedbackForm.style.display = 'none';
            feedbackOptions.style.display = 'block';
            feedbackHeaderText.innerText = "Feedback"; // Reset to default header

            // Reset feedback form elements
            feedbackMessage.value = ''; // Clear the message
            submitText.style.display = 'block';
            loadingSpinner.style.display = 'none';
            submitBtn.disabled = false;
        }, 2000);
    });
});
