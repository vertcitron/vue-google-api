# vue-google-api

This vue 2 plugin is a wrapper for the script needed to do client side operations with Google APIs and Google authentication.

The plugin loads the Google API client library script dynamically, and append it to the document's head, without need to manually edit `index.html` file. This makes the `gapi` object accessible at `window.gapi` and you can do with it all the operations described in the [Google client library for Javascript documentation](https://developers.google.com/api-client-library/javascript/).

But more than this, it also exposes the `$gapi` object through the Vue prototype, accessible from everywhere via `Vue.$gapi`, or via `this.$gapi` from within a component. `$gapi` encapsulate the `gapi` object and simplifies its operations by automatically doing loadings and initializations when needed, chaining the transitional results through a promises chain and always returns the expected result (or error) in a promise, to respect the asynchronous nature of the Google APIs and authentication processes.

The plugin also globally registers a `GoogleSigninBtn` component which is a 'Signin with Google' button in the respect of the Google's guidelines for it.

## Installation

```bash
yarn add vue-google-api
```

Then, in the file where you instantiate vue.js (generally `main.js`) :
```javascript
import Vue from 'vue'
import VueGoogleApi from 'vue-google-api'

const config = {
  apiKey: 'your_api_key',
  clientId: 'your_client_id.apps.googleusercontent.com',
  scope: 'space_separated_scopes',
  discoveryDocs: [ list_of_discoverydocs_urls ]
}
Vue.use(VueGoogleApi, config)
```
`config` is an object containing the API key, the client Id, the authorization scope and optionally the discovery docs as described in the [Google API Client reference](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientinitargs). You can learn how to obtain these parameters in the [Google API Guides / Get started page](https://developers.google.com/api-client-library/javascript/start/start-js#setup).

## Usage

In normal usage, `$gapi` cares, when a final method is requested, to do all the intermediate stuff that is needed, such as loading parts of the client (commonly `client` and `auth2`), initializing them and performing required checks. It then returns a fulfilled promise containing the requested result in cas eof success, or a rejected promise in case of error, eventually containing various explanations about what happened.

&nbsp;

---
> **Vue.$gapi.isSignedIn()**

Returns through an always resolved promise a boolean indicating if a user is actually signed in or not.
```javascript
this.$gapi.isSignedIn()
  .then(result => {
    console.log(result ? 'Signed in' : 'Signed out')
  })
```

&nbsp;

---
> **Vue.$gapi.currentUser()**

Returns through an always resolved promise the current user in a readable format if one is connected, or `null` if no user is connected.
```javascript
this.$gapi.currentUser()
  .then(user => {
    if (user) {
      console.log('Signed in as %s', user.name)
    } else {
      console.log('No user is connected.')
    }
  })
```
The user object corresponds to the [Google User Basic Profile](https://developers.google.com/api-client-library/javascript/reference/referencedocs#googleusergetbasicprofile) informations, but in a friendly format :
```javascript
{
  id: google_user_identifier,
  name: full_name,
  firstname: given_name,
  lastname: family_name,
  image: user_thumbnail_url,
  email: email_address
}
```

&nbsp;

---
> **Vue.$gapi.signIn()**

Starts an Oauth2 sign in process. It will open the Google authentification popup where the user will be prompted to identify, with a prefilled profile if the browser was already connected the the Google account. It could be followed by a password request and / or a captcha request, and then by another popup where the user has to authorize the application if it has never been done and depending on the application requested scope.

If the user completes the authentication procedure (generally by just clicking his profile), the method returns a fulfilled promise containing the signed in user, with the same format than from `$gapi.currentUser()`.

If anything goes wrong (for example if the user closes the authentication popup without signing in), the method returns a rejected Promise with an object containing an `error` property explaining what's wrong :

```javascript
this.$gapi.signIn()
  .then(user => {
    console.log('Signed in as %s', user.name)
  })
  .catch(err => {
    console.error('Not signed in: %s', err.error)
  })
```

&nbsp;

---
> **Vue.$gapi.signOut()**

Disconnects the signed in user from the application. Returns an empty resolved promise when it's done.
```javascript
this.$gapi.signOut()
  .then(() => {
    console.log('User disconnected.')
  })
```

&nbsp;

---
> **Vue.$gapi.request(args)**

Makes a generic request to one of the several Google's APIs endpoint, as specified in the [Google API Client Reference](https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiclientrequestargs). Only the `path` property is mandatory, all the other ones are optional. Depending of several things and the authorizations the user has granted to the application, the method responds by a resolved promise containing the response, or a reject one containing a structure where informations on why it has failed can be found.

```javascript
this.$gapi.request({
  path: 'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses',
  method: 'GET',
  params: {
    personFields: 'names,emailAddresses'
  }
}).then(response => {
  console.log(response)
})
```

To find and use Google's APIs endpoints, please refer to each API documentation, this is not the purpose of this Readme.

## Google Signin button component

The plugin registers globally a Google Sign In button, respecting the [Google's guidelines](https://developers.google.com/identity/branding-guidelines) for such an element :

![Google sign in button](https://developers.google.com/identity/images/btn_google_signin_light_normal_web.png)

The component re-emits its native click event as a vue click event to handle it the way you want. It also re-emits its keypress.enter as he same click event.

It optionally takes two attributes:
- `label`: Sets the text displayed in the button. Defaults to *"Signin in with Google"*
- `custom-class`: A class name which overrides the default rendering of the button. The default styling includes two additional nested classes: `span.icon` and `span.text`, that also can be redefined cascading the custom class.

```html
<google-signin-btn label="Sign In" customClass="my-button" @click="signin">
...
<style>
  .my-button {
    background-color: #eee;
  }
  .my-button span.text {
    color: red;
  }
</style>
```

&nbsp;

## Intermediate methods

The methods seen above automatically calls and wait for intermediate methods that loads the required parts of the client and initialize what is needed. The wrapper always check if the required object need to be loaded or is already present, and need to be initialized or not, and acts in consequence.

But if you need, for special purposes, to directly access these intermediate methods and their results, they are all exposed prefixed by an underscore: _

&nbsp;

---
> **Vue.$gapi._load()**

Loads the gapi global object and returns it through a promise. If it has already been loaded, directly resolves the promise without reloading it:
```javascript
this.$gapi._load()
  .then(gapi => {
    console.log('gapi object :', gapi)
  })
```
This object is exactly the base object where lives all the methods explained in the [Google API Client Javascript Library reference](https://developers.google.com/api-client-library/javascript/reference/referencedocs#top_of_page), and you can perform on it all the operations they describe.

&nbsp;

---
> **Vue.$gapi._libraryLoad('lib')**

Loads a gapi sub library by its name (for example `client` or `auth2`). It makes an internal call to `$gapi._load()` so `gapi` is previously loaded if it hasn't been done. It returns through a promise the sub library itself. If the sub library has already been loaded, it doesn't reload it and resolves immediately. If it hasn't already been done, the sub library have to be initialized.
```javascript
this.$gapi._libraryLoad('auth2')
  .then(auth2 => {
    return auth2.init(this.$gapi.config)
  })
```

&nbsp;

---
> **Vue.$gapi._libraryInit('lib', [ config ])**

Initializes the specified library with an application config. As usual, loads `gapi` if needed and loads the library if needed too by an internal call to `_libraryLoad`.

The config parameter is an object containing optional API key, Client Id, etc., as discussed in the plugin installation, but can be different here if you need a special config for a particular API call. If this optional parameter is omitted, the library will be initialized with the config passed down at the installation process (`Vue.use(VueGoogleApi, config)`). If one of its sub-properties is omitted, it wil be replaced by this base config same property value.

The method returns, through a promise, the initialized library, ready to be used for API calls for example.

One example of overriding the application API config is for example to grab in the client library particular methods to call one or more precise Google APIs by furnishing the DiscoveryDoc for that API:

```javascript
this.$gapi._libraryInit('client', { discoveryDocs: [ 'https://people.googleapis.com/$discovery/rest' ]})
  .then(client => {
    return client.people.people.get({
      'resourceName': 'people/me',
      'requestMask.includeField': 'person.names'
    }).then(response => {
      console.log(response.result)
    })
  })
```
Even if you didn't completed the discoveryDocs property at the plugin installation time, you'll get a client with the people API facility. You can also give for different APIs different clientIds and apiKeys if you want to track hits from different Google Cloud accounts or projects for example.

&nbsp;

## Development setup

Clone the project, cd into it and install dependencies:

*(if you don't use yarn, you can replace `yarn` commands by `npm run`...)*

```
git clone "https://github.com/vertcitron/vue-google-api.git"
cd vue-google-api
yarn install
```
Then create at the root of the project a .env.local file with your own Google application identifiers like this :
```
VUE_APP_CLIENTID=your_client_id.apps.googleusercontent.com
VUE_APP_APIKEY=your_api_key
VUE_APP_SCOPE=your_application_scope
```
You can also add a VUE_APP_DISCOVERYDOCS key / value if you need.

This file will not be versionned by git and will remain local in your computer.

Otherwise you can modify the `main.js` file to directly introduce these values if you don't want to use a .env file.

Then you can work with the project, with the following commands:
- Compiles and hot-reloads for development: `yarn serve`
- Compiles and minifies for production: `yarn build`
- Run tests: `yarn test`
- Lints and fixes files: `yarn lint`

`App.vue` and its children contains a basic Google authentication layout, with a component presenting the user if one is signed in or a signin button otherwise.

The plugin `index.js` file is at the project's root, and the gapi wrapper is located at `core/GAPI.js`
