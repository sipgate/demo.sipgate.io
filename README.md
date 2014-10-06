# demo.sipgate.io

In diesem Repository findest Du alles, was Du für die Installation unserer [Demo-Seite](https://demo.sipgate.io) benötigst.

![Demo](https://raw.github.com/sipgate/demo.sipgate.io/master/public/img/animation.gif)

## Hosting bei Heroku

Das Demo-Repository ist überall lauffähig, mit [Heroku](https://www.heroku.com/) geht es aber [schnell und einfach](https://devcenter.heroku.com/articles/getting-started-with-nodejs):


```shell
# Heroku Toolbelt installieren (https://toolbelt.heroku.com/)
wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh

# Einloggen
heroku login

# Repository clonen
git clone https://github.com/sipgate/demo.sipgate.io.git
cd demo.sipgate.io/

# Hochladen
heroku create --region eu
git push heroku master

# Ansehen
heroku open # oder einfach die angegebene URL direkt öffnen
```

## Lokale Installation

Alles was Du brauchst ist [Node.js](http://nodejs.org/)

```shell
# Node.js installieren (Debian/Ubuntu)
sudo apt-get install node nodejs-legacy npm

# Repository clonen
git clone https://github.com/sipgate/demo.sipgate.io.git
cd demo.sipgate.io/

# Dependencies installieren
npm install

# Starten
node server.js

# localhost:3000 im Browser öffnen
```
