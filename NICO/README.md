# NICO — website Nicoleta Amihăesi

Website static, responsive și ușor de publicat în cPanel pentru domeniul canonic `psiholognicoletaamihaesi.ro`.

## Publicare în cPanel

1. În **File Manager**, creează directorul `/public_html/NICO`.
2. Încarcă **conținutul** acestui director în `/public_html/NICO` și păstrează structura `assets/`, `css/`, `js/`.
3. În **Domains**, deschide **Manage** pentru `psiholognicoletaamihaesi.ro` și setează Document Root la `/public_html/NICO`. Pentru domeniul principal al contului, unele panouri nu permit schimbarea rădăcinii; în acel caz mută direct conținutul în `/public_html` sau cere furnizorului să schimbe document root-ul.
4. Dacă deții și `psihoterapeutnicoletaamihaesi.ro`, adaugă-l în **Domains** cu același Document Root. Fișierul `.htaccess` îl redirecționează 301 către domeniul canonic, evitând conținut duplicat.
5. În **Zone Editor**, verifică înregistrarea `A` pentru rădăcina domeniului și `CNAME` pentru `www`, conform IP-ului furnizat de hosting.
6. În **SSL/TLS Status**, rulează AutoSSL pentru domeniu și `www`, apoi verifică accesul prin HTTPS.
7. Confirmă public: `/robots.txt`, `/sitemap.xml`, `/llms.txt` și `/llms-full.txt`. Variantele `/ROBOTS.TXT`, `/Sitemap.xml` și `/LLMS.txt` sunt redirecționate către numele standard lowercase de `.htaccess`.
8. Trimite sitemap-ul în Google Search Console și Bing Webmaster Tools.

## Înainte de lansare

- Confirmă adresa exactă unde au loc ședințele.
- Confirmă toate tarifele, în special logopedia și deplasarea la domiciliu.
- Completează documentele juridice cu denumirea, adresa și datele fiscale oficiale ale cabinetului.
- Înlocuiește sau actualizează textele care nu mai corespund serviciilor curente.
- Testează butoanele WhatsApp, SMS și telefon de pe un dispozitiv mobil.

## Structură

- `index.html` — pagina principală
- `despre.html` — profil profesional
- `servicii.html` — servicii detaliate, inclusiv logopedie
- `tarife.html` — plan tarifar
- `articole.html` — conținut informațional
- `contact.html` — contact direct și generator local de mesaj WhatsApp
- `referinte.html` — surse externe și prezență profesională
- `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt` — crawl și răspunsuri AI

Nu este necesar un proces de build. Site-ul poate fi servit direct de Apache/cPanel.
