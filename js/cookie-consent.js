// cookie-consent.js
document.addEventListener('DOMContentLoaded', function() {
    const consentCookieName = 'vh_cookie_consent';

    function getConsent() {
        try {
            const consent = localStorage.getItem(consentCookieName);
            if (consent) return JSON.parse(consent);
        } catch (e) {}
        return null;
    }

    function setConsent(consent) {
        localStorage.setItem(consentCookieName, JSON.stringify(consent));
        updateGTM(consent);
    }

    function updateGTM(consent) {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'update', {
            'ad_storage': consent.marketing ? 'granted' : 'denied',
            'ad_user_data': consent.marketing ? 'granted' : 'denied',
            'ad_personalization': consent.marketing ? 'granted' : 'denied',
            'analytics_storage': consent.statistics ? 'granted' : 'denied',
            'personalization_storage': consent.preferences ? 'granted' : 'denied',
            'functionality_storage': 'granted'
        });
        
        // Push een event naar GTM voor custom triggers
        window.dataLayer.push({
            event: 'cookie_consent_update',
            consent: consent
        });
    }

    // Initialize state op basis van opgeslagen instellingen
    const savedConsent = getConsent();
    if (savedConsent) {
        // Indien al geaccepteerd/geweigerd -> push de opgeslagen waarden
        updateGTM(savedConsent);
    } else {
        // Indien nog geen keuze, toon de cookiebanner
        showBanner();
    }

    function showBanner() {
        // Voeg de HTML dynamisch toe zodat we dit niet in alle bestanden hoeven te plakken
        const bannerHTML = `
            <div id="cookie-banner" class="cookie-banner">
                <div class="cookie-content">
                    <h3>¡Hola! Even over cookies...</h3>
                    <p>Wij gebruiken cookies om uw ervaring op onze website te optimaliseren en ons webverkeer te analyseren. Door op accepteren te klikken, gaat u akkoord met ons gebruik van cookies. U kunt er ook voor kiezen om alleen de noodzakelijke cookies te accepteren.</p>
                    <div class="cookie-buttons">
                        <button id="cookie-reject" class="btn btn-outline">Alleen noodzakelijke</button>
                        <button id="cookie-accept" class="btn btn-primary">¡Sí! Alles accepteren</button>
                    </div>
                </div>
            </div>
            
            <div id="cookie-preferences" class="cookie-preferences" style="display: none;">
                <div class="cookie-content">
                    <h3>Cookie voorkeuren</h3>
                    <p>Beheer hieronder jouw voorkeuren voor verschillende soorten cookies.</p>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <label><input type="checkbox" checked disabled> Noodzakelijk</label>
                        </div>
                        <p class="category-desc">Deze cookies zijn nodig voor het functioneren van de website en kunnen niet worden uitgeschakeld.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <label><input type="checkbox" id="cb-statistics"> Statistieken</label>
                        </div>
                        <p class="category-desc">Helpt ons te begrijpen hoe bezoekers onze website gebruiken door anoniem gegevens te verzamelen.</p>
                    </div>

                    <div class="cookie-category">
                        <div class="category-header">
                            <label><input type="checkbox" id="cb-marketing"> Marketing</label>
                        </div>
                        <p class="category-desc">Worden gebruikt om bezoekers te volgen over websites. Het doel is om relevante en aantrekkelijke advertenties te tonen.</p>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="category-header">
                            <label><input type="checkbox" id="cb-preferences"> Voorkeuren</label>
                        </div>
                        <p class="category-desc">Staat de website toe om informatie te onthouden die de beleving aanpast, zoals je voorkeurstaal.</p>
                    </div>

                    <div class="cookie-buttons">
                        <button id="cookie-save-preferences" class="btn btn-primary">Voorkeuren opslaan</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        const banner = document.getElementById('cookie-banner');
        const prefs = document.getElementById('cookie-preferences');

        // Accepteer alles
        document.getElementById('cookie-accept').addEventListener('click', () => {
            const consentStates = {
                necessary: true,
                statistics: true,
                marketing: true,
                preferences: true
            };
            setConsent(consentStates);
            banner.style.display = 'none';
        });

        // Weiger alles (behalve noodzakelijk)
        document.getElementById('cookie-reject').addEventListener('click', () => {
            const consentStates = {
                necessary: true,
                statistics: false,
                marketing: false,
                preferences: false
            };
            setConsent(consentStates);
            banner.style.display = 'none';
        });

        // Open voorkeuren paneel
        const settingsBtn = document.getElementById('cookie-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                banner.style.display = 'none';
                prefs.style.display = 'flex';
            });
        }

        // Sla specifieke voorkeuren op
        document.getElementById('cookie-save-preferences').addEventListener('click', () => {
            const consentStates = {
                necessary: true,
                statistics: document.getElementById('cb-statistics').checked,
                marketing: document.getElementById('cb-marketing').checked,
                preferences: document.getElementById('cb-preferences').checked
            };
            setConsent(consentStates);
            prefs.style.display = 'none';
        });
    }
});
