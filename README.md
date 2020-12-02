## LittleGuys

Table of content:
- [LittleGuys](#littleguys)
- [Authors](#authors)
- [Description](#description)
- [Technologies](#technologies)
- [Project Hiearchy](#project-hiearchy)

***

## Authors
Lam Long Vu - [GitHub](https://github.com/longvulam "It's not much please don't judge.") - : - Connor Johns - [GitHub](https://github.com/apocalypticcow)

## Description
LittleGuys is a browser based web application for finding local shops and businesses. It simplicity charmed us into starting this project.

***

## Technologies
Base techs used for this project:
* HTML, CSS
* JavaScript
* [jQuery](https://jquery.com/)
* [Bootstrap autocomplete](https://bootstrap-autocomplete.readthedocs.io/en/latest/)
* 

Styles and layout:
* [Bootstrap](https://getbootstrap.com/)
* [FontAwesome 5](https://fontawesome.com/)
* [Firebase UI](https://firebase.google.com/docs/auth/web/firebaseui)

Database:
* [Cloud FireStore](https://firebase.google.com/docs/firestore)

***

## Project Hiearchy
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── README.md

It has the following subfolders and files:
├── .git                            # Folder for git repo
Standalone html files for each page:
├── business-add.html               # 
├── details.html                    # 
├── home.html                       # 
├── login.html                      # 
├── profile.html                    # 
├── pwChanges.html                  # 

Navigation bar shared in every page:
├── top_bar.html                    # 

Folder for core functionalities shared in every page:
├── core                            # 
    /app.css                        # 
    /app.js                         # 
    /autocomplete.js                # 
    /pageLoader.js                  # 

Folder for scripts:
├── page_scripts                    # 
    /business-add.js                # 
    /details.js                     # 
    /firebase_api_littleguys.js     # 
    /home.js                        # 
    /login.js                       # 
    /profile.js                     # 
    /pwChanges.js                   # 
    /startPage.js                   # 

Folder for styles:
├── page_styles                     # 
    /business-add.css               # 
    /details.css                    # 
    /home.css                       # 
    /profile.css                    # 
    /pwChanges.css                  # 
    /startPage.css                  # 

Firebase hosting files: 
├── .firebaserc...

```

