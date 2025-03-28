# Typologický Kvíz

Jednoduchá webová aplikace pro vyplnění typologického kvízu s ukládáním výsledků do Firebase databáze.

## Funkce

- Interaktivní kvíz s více otázkami
- Ukládání odpovědí do Firebase
- Responzivní design
- Moderní UI s Tailwind CSS

## Instalace

1. Klonujte repozitář:
```bash
git clone [URL VAŠEHO REPOZITÁŘE]
```

2. Nainstalujte závislosti:
```bash
npm install
```

3. Vytvořte projekt na Firebase a získejte konfigurační údaje

4. Vytvořte soubor `.env.local` v kořenovém adresáři a přidejte Firebase konfiguraci:
```
REACT_APP_FIREBASE_API_KEY=vaše_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=vaše_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=vaše_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=vaše_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=vaše_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=vaše_app_id
```

5. Spusťte aplikaci:
```bash
npm start
```

## Nasazení

Tato aplikace je připravena pro nasazení na Vercel. Stačí propojit GitHub repozitář s Vercel a nastavit environment proměnné v nastavení projektu na Vercelu.

## Technologie

- React
- Firebase
- Tailwind CSS
- React Router 