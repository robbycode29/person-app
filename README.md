# person-app
## *Prerequisites*
* Make sure you have NodeJS globally installed, if not go to https://nodejs.org/en/download/ and download the latest version
* Install WINDOWS REDIS
  * Open this github link - https://github.com/dmajkic/redis/downloads
  * Download and install the latest version of redis (currently redis-2.4.5)
  * Follow the default installation steps
* Install PostgreSQL on local machine
  * Go to https://www.postgresql.org/download/windows/
  * Click on download the installer
  * Follow the default installation steps
  * Make sure to remember / note the master password
  * Leave the default 5432 port
* Install PGAdmin on local machine
  * Go to https://www.pgadmin.org/download/pgadmin-4-windows/
  * Download and install the lastest version of PGAdmin 4
  * Make sure to remember / note the credentials asked for authentication

## * Server setup *
* Install globally nodemon
  * npm install nodemon@2.0.7 -g
* In .env file make sure to replace POSTGRESQL_PASS with the password you set up on PostgreSQL installation
* In the root folder
  * Execute the command npm install (all server dependencies should install successfully)
* Navigate to /server
  * Execute the command nodemon
  * If everything is ok, you should see in the console the following message:
  ```javascript
    λ nodemon
    [nodemon] 2.0.4
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,json
    [nodemon] starting `node ./server/app.js`
    Database connection successfully.
    Listening on port: 8080, env: dev
  ```

## *Client setup *
* Install angular cli globally
  * npm install -g @angular/cli
* Navigate to project/client
  * Execute the command npm install (all client dependencies should install successfully)
  * In the same client folder, execute the command npm start
  * If everything is ok, you should see in the console the following message:
  ```javascript
    λ npm start

    > person-app@0.0.0 start C:\Proiecte\person-app\client
    > ng serve

    √ Browser application bundle generation complete.

    Initial Chunk Files   | Names         |      Size
    vendor.js             | vendor        |   4.93 MB
    styles.css, styles.js | styles        | 401.44 kB
    polyfills.js          | polyfills     | 339.13 kB
    main.js               | main          |  63.41 kB
    runtime.js            | runtime       |   7.07 kB

                          | Initial Total |   5.72 MB

    Build at: 2021-11-05T12:55:50.984Z - Hash: 5286c543f6d25b2c - Time: 5989ms

    ** Angular Live Development Server is listening on localhost:3000, open your browser on http://localhost:3000/ **


    √ Compiled successfully.
  ```

### Cerintele temei
#### *FRONT END*
1. Acceași funcționalitate ca în aplicația creată
1. Se vor crea in header 2 taguri html - Persoane, Mașini
1. Se vor crea 2 componente în folderul components Persoane, Mașini
1. Fiecare link trebuie să folosească routerLink pentru a ajunge la componenta respectivă
1. Fiecare componentă va conține următoarele
  * Titlul componentei
  * Tabelul cu informații
  * Butonul de adaugă
  * Modalul pentru adăugare / modificare
### Componenta persoane
1. Un tabel ce va conține următoarele coloane
  * Număr curent
  * Nume / prenume
  * CNP
  * Vârsta
  * Lista mașinilor aflate în proprietate
    * Denumire marcă / denumire model
    * Anul fabricației
    * Capacitatea cilindrică
    * Taxa de impozit
  * 2 iconițe pe tabel pentru modificare / ștergere
  * Modificarea persoanei se va realiza pe același modal
  * După ce persoana a fost ștearsă din baza de data, tabelul trebuie reîmprospătat
2. La apăsarea butonului adaugă se va deschide modalul ce va conține următoarele
  * Câmpuri
    * Nume* - string, maxlength 255
    * Prenume* - string, maxlength 255
    * CNP* - string, maxlength 13
    * Vârsta* - integer, maxlength 3
    * Select multiplu (ng-select multiple) pentru mașini
  * Funcționalitate
    * Vârsta va fi calculată automat din CNP
    * Câmpurile sunt obligatorii
    * Validare și afișare mesaj cu denumirea câmpului ce nu a fost completat
    * La apăsarea butonului adaugă, persoana va fi salvată în baza de date
    * La apăsarea butonului renunță, modalul se va inchide fără a fi făcută salvarea
    * După ce persoana a fost salvată, tabelul trebuie să conțină noua persoană

### Componenta mașini
1. Un tabel ce va conține următoarele coloane
  * Număr curent
  * Denumire marcă
  * Denumire model
  * Anul fabricației
  * Capacitatea cilindrică
  * Taxa de impozit
  * 2 iconițe pe tabel pentru modificare / ștergere
  * Modificarea mașinii se va realiza pe același modal
  * După ce mașina a fost ștearsă din baza de data, tabelul trebuie reîmprospătat
2. La apăsarea butonului adaugă se va deschide modalul ce va conține următoarele
  * Câmpuri
    * Denumire marcă - string, maxlength 255
    * Denumire model - string, maxlength 255
    * Anul fabricației - integer, maxlength 4
    * Capacitatea cilindrică - integer, maxlength 4
    * Taxa de impozit - integer, maxlength 4
  * Funcționalitate
    * Taxa de impozit va fi calculată conform calcului
      * capacitatea cilindrică < 1500 = 50 lei
      * capacitatea cilindrică > 1500 < 2000 = 100 lei
      * capacitatea cilindrică > 2000 = 200 lei
    * Câmpurile sunt obligatorii
    * Validare și afișare mesaj cu denumirea câmpului ce nu a fost completat
    * La apăsarea butonului adaugă, mașina va fi salvată în baza de date
    * La apăsarea butonului renunță, modalul se va inchide fără a fi făcută salvarea
    * După ce mașina a fost salvată, tabelul trebuie să conțină noua mașină

#### *BACK END*
1. Create / update / find / findAll / destroy în tabelul Person
1. Create / update / find / findAll / destroy în tabelul Car
1. Creare tabel de joncțiune "Junction" cu următoarele coloane
  * id_person, id_car
4. La ștergerea unei persoane, se vor șterge toate liniile din tabelul de joncțiune aferente persoanei șterse
5. La ștergerea unei mașini, se vor șterge toate liniile din tabelul de joncțiune aferente mașinii șterse
6. La ștergerea unei mașini din modalul de persoană, se va șterge doar lini din joncțiune aferentă persoanei