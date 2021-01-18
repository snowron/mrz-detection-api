# mrz-detection-api

The package is image-js/mrz-detection package's web service edition.

## About

You can look at original repo at here [image-js/mrz-detection](https://github.com/image-js/mrz-detection/) 


## Install

```bash
npm i 
node app
```

```
Available localhost:3000
```

## Usage

```

POST locahost:3000/GetMrzSingle 
    multipart/form-data
       field photo

POST locahost:3000/GetMrzMulti 
    multipart/form-data
       field photos
```

## Response

```
POST locahost:3000/GetMrzSingle 
POST locahost:3000/GetMrzMulti 
  200:  { status: true, message: [] }
  400:  { status: false, message: 'No Image found' }
```

## Contributing
Pull requests are welcome.
