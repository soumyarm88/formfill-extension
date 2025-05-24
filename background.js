// Background script for Chrome extension
// This handles any background tasks and communication between components

chrome.runtime.onInstalled.addListener(() => {
    console.log('Form Auto-Filler extension installed');
});

// Handle any background messaging if needed in the future
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Future functionality can be added here
    return true;
});
