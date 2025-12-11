
const apiKey = "AIzaSyApnoNTD58tRsN3nICUQCaEYMeV-rh_mGM";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function checkModels() {
    try {
        console.log(`Querying: ${url.replace(apiKey, 'HIDDEN_KEY')}`);
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
            return;
        }

        console.log("\n--- Available Models ---");
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name} (Display: ${m.displayName})`);
                }
            });
        } else {
            console.log("No models returned.");
        }
        console.log("------------------------\n");

    } catch (error) {
        console.error("Network/Fetch Error:", error);
    }
}

checkModels();
