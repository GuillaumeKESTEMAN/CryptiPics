# cryptipics

> 

## About

This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/cryptipics
    npm install
    ```

3. Start your app

    ```
    npm start
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).


## Our API
(*) for necessary and (+) for optional

### key :
find :
```
(+) name : name of the json file to find
```

create :
```
(+) width : width of the key or 500 as default
(+) height : height of the key or 500 as default

(+) saveKey : boolean to know if dev want to save the key
(+) name : name of the json file to save (if saveKey is true)
```
### crypt :
create : (password or key is necessary)
```
(*) picture : picture to encrypt

(+) useKey : key to use for the encryption
(+) useStorageKey : boolean to know if use key in storage
(+) saveKey : boolean to know if the key will be save
(+) keyName : key file name in storage for useStorageKey or saveKey

(+) password : password to encrypt the picture
(+) creator : name of the creator (used as salt for the password hash)
(+) timeToEncrypt : time wanted to encrypt the picture
```
### decrypt :
create : (password or key is necessary)
```
(*) picture : picture to decrypt

(+) key : key to use for the decryption
(+) useStorageKey : boolean to know if use key in storage
(+) keyName : key file name in storage for useStorageKey

(+) password : password to decrypt the picture
(+) creator : name of the creator (used as salt for the password hash)
(+) timeToDecrypt : time wanted to decrypt the picture
```
