async function fixGrammar() {
    const text = document.getElementById('userInput').value;
    const btn = document.getElementById('fixBtn');
    const resultArea = document.getElementById('resultArea');
    const suggestionsDiv = document.getElementById('suggestions');

    if (!text) {
        alert("Please enter some text first!");
        return;
    }

    // Change button text while "loading"
    btn.innerText = "Checking...";
    
    try {
        // This is the "API Call" to the back-end server
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${encodeURIComponent(text)}&language=en-US`
        });

        const data = await response.json();
        
        // Clear old results
        suggestionsDiv.innerHTML = "";
        resultArea.classList.remove('hidden');

        if (data.matches.length === 0) {
            suggestionsDiv.innerHTML = "<p>✅ Looks perfect! No mistakes found.</p>";
        } else {
            // Loop through each mistake found by the API
            data.matches.forEach(match => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.innerHTML = `
                    <strong>Mistake:</strong> "${text.substring(match.offset, match.offset + match.length)}"<br>
                    <strong>Message:</strong> ${match.message}<br>
                    <strong>Try:</strong> <span style="color:green">${match.replacements.slice(0, 3).map(r => r.value).join(', ')}</span>
                `;
                suggestionsDiv.appendChild(item);
            });
        }
    } catch (error) {
        console.error("Error connecting to API:", error);
        alert("Something went wrong. Check your internet!");
    } finally {
        btn.innerText = "Fix Grammar";
    }
}
