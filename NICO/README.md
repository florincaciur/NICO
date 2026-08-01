# NICO — website Nicoleta Amihăesi

Website static și responsive publicat prin GitHub Pages pentru domeniul canonic `psihoterapeutnicoletaamihaesi.ro`.

## Publicare prin GitHub Pages

Workflow-ul `.github/workflows/pages.yml` publică automat conținutul directorului `NICO` la fiecare push în `main`.

- URL temporar: `https://florincaciur.github.io/NICO/`
- Domeniu canonic: `https://psihoterapeutnicoletaamihaesi.ro/`
- Repository: `https://github.com/florincaciur/NICO`

Custom domain-ul se configurează în `Settings → Pages`. Pentru că publicarea folosește GitHub Actions, GitHub gestionează domeniul din setările repository-ului și nu are nevoie de un fișier `CNAME` în artifact.

## DNS în cPanel

cPanel este folosit numai pentru administrarea zonei DNS. Pentru domeniul apex trebuie eliminate înregistrările `A` vechi și adăugate cele patru adrese GitHub Pages:

```text
A  @  185.199.108.153
A  @  185.199.109.153
A  @  185.199.110.153
A  @  185.199.111.153
```

Pentru `www`:

```text
CNAME  www  florincaciur.github.io
```

Înregistrările MX și TXT folosite pentru e-mail nu trebuie eliminate. GitHub Pages nu interpretează fișierul `.htaccess`; acesta este păstrat numai pentru compatibilitate cu o eventuală găzduire Apache.

## Înainte de lansare

- Confirmă adresa exactă unde au loc ședințele.
- Confirmă toate tarifele, în special logopedia și deplasarea la domiciliu.
- Completează documentele juridice cu denumirea, adresa și datele fiscale oficiale ale cabinetului.
- Testează butoanele WhatsApp, SMS și telefon de pe un dispozitiv mobil.
- După propagarea DNS, activează `Enforce HTTPS` în GitHub Pages.

## Structură

- `index.html` — pagina principală
- `despre.html` — profil profesional
- `servicii.html` — servicii detaliate, inclusiv logopedie
- `tarife.html` — plan tarifar
- `articole.html` — conținut informațional
- `contact.html` — contact direct și generator local de mesaj WhatsApp
- `referinte.html` — surse externe și prezență profesională
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` — crawl și răspunsuri AI

Site-ul nu necesită un proces local de build.
