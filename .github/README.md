# I-Project
![](https://img.shields.io/github/repo-size/NicholasBortz/meme-site)
![](https://img.shields.io/github/contributors/NicholasBortz/meme-site)
![](https://img.shields.io/github/last-commit/NicholasBortz/meme-site)
<br>Simple ratings web page, built with MySQL and Node.js.

## Prerequisites
* [**MySQL**](https://www.mysql.com/downloads/) and [**Workbench**](https://www.linuxhelp.com/how-to-install-mysql-workbench-on-linux-mint-18-03)
* [**Node.js**](https://nodejs.org/en/download/package-manager/)
* [**NPM**](https://www.npmjs.com/get-npm) (Installed automatically with Node.js)

## Checkout this project
```bash
$ git clone https://github.com/NicholasBortz/meme-site.git
```

## Install Node.js and NPM
```bash
sudo snap install node --classic --channel=12
```

## Setup your database
Open MySQL Workbench from your start menu, or run the MySQL CLI with:
```bash
$ sudo mysql
``` 
Create a new database schema:
```sql
create database meme; 
use meme;
```
Grant your existing sqluser permissions on that schema:
```sql
ALTER USER 'sqluser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sqluserpw';
GRANT USAGE ON *.* TO sqluser@localhost;
GRANT ALL PRIVILEGES ON meme.* TO sqluser@localhost;
```

## Project dependencies
Open this project in Visual Studio Code. Open a new Terminal from the menu, or use Ctrl+Shift+`  
Install dependencies:
```bash
> cd server
> npm install
```
Run the web server with 
```
> npm run start
```
Open a web browser, and navigate to [localhost:3000](http://localhost:3000/).
