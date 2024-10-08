<script>
// Função para definir um cookie
function setCookie(name, value, days) {
    const expires = days ? `; expires=${new Date(Date.now() + days * 86400000).toUTCString()}` : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/`;
}

// Função para obter um cookie
function getCookie(name) {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');
    for (let c of ca) {
        c = c.trim();
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
}

// Função para obter parâmetros da URL
function getUrlParameter(name) {
    const regex = new RegExp(`[?&]${name.replace(/[[\]]/g, '\\$&')}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(location.search);
    return results ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : '';
}

// Função para definir a origem
function setOrigin() {
    let origin = getCookie('leadOrigin');
    
    if (!origin) {
        const utmParams = ['source', 'medium', 'campaign', 'content', 'term'];
        const utmValues = utmParams.map(param => getUrlParameter(`utm_${param}`));
        
        if (utmValues[0]) {
            origin = `UTM - Fonte: ${utmValues[0]}`;
            for (let i = 1; i < utmParams.length; i++) {
                if (utmValues[i]) origin += ` | ${utmParams[i].charAt(0).toUpperCase() + utmParams[i].slice(1)}: ${utmValues[i]}`;
            }
        } else if (document.referrer) {
            const referrer = document.referrer.toLowerCase();
            const currentDomain = window.location.hostname;
            
            if (referrer.includes('google.com')) origin = 'Google - Via busca orgânica';
            else if (referrer.includes('bing.com')) origin = 'Bing - Via busca orgânica';
            else if (referrer.includes('yahoo.com')) origin = 'Yahoo - Via busca orgânica';
            else if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) origin = 'Meta - Via tráfego orgânico';
            else if (referrer.includes('linkedin.com')) origin = 'LinkedIn - Via tráfego orgânico';
            else if (referrer.includes('twitter.com')) origin = 'Twitter - Via tráfego orgânico';
            else if (referrer.includes('youtube.com')) origin = 'YouTube - Via tráfego orgânico';
            else if (!referrer.includes(currentDomain)) {
                const domain = new URL(referrer).hostname;
                origin = `Referral: ${domain}`;
            }
        }
        
        if (!origin) origin = 'Direto - Acesso direto ou fonte desconhecida';
        
        setCookie('leadOrigin', origin, 0.02083);
    }
    
    const forms = document.getElementsByTagName('form');
    for (let form of forms) {
        let field = form.querySelector('input[name="leadOrigin"]');
        if (!field) {
            field = document.createElement('input');
            field.type = 'hidden';
            field.name = 'leadOrigin';
            form.appendChild(field);
        }
        field.value = origin;
    }
}

// Adicionar uma função para limpar o cookie de origem
function clearOriginCookie() {
    document.cookie = "leadOrigin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Chamar a função quando a página carregar
window.addEventListener('load', setOrigin);
</script>