Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.


# Usando Cookies:
No lado Node.js foi necessário rodar em https, foi necessário liberar cookies no cors, 

No lado Angular foi necessário rodar ng serve --ssl, passar withCredentials: true nas chamadas https

Com res.cookie() no Nodejs o Angular não vai conseguir visualizar o cookie, pois não é acessível via javascript, só o browser tem acesso.

