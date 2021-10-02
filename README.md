<h1 align="center">
  🐱‍💻
</h1>

<h3 align="center">
  Andromedia VideoMaker
</h3>

<p align="center">
  🕹️ Andromedia VideoMaker is an automated video and slideshow creator, inspired by Filipe Deschamps' VideoMaker. Still in its initial phase, this <a href="/README.md">README.md</a> should serve to create objectives based on issues and chexkboxes.
</p>

<p align="center">
  <code>Bebop bebop = new Bebop();</code>
</p>

<p align="center">
  <img width="240" height="auto" src="temp/bebop-eat.gif">
  <img width="240" height="auto" src="temp/bebop-work.gif">
</p>

<p align="center">
  <a href="https://github.com/juniorbotelho">
    With ❤️ by juniorbotelho
  </a>
<p>

## #1 Project Timeline
- [ ] create robots as services to be called by cli and api #2
- [X] text service and its dependencies #3
- [X] create the service to handle image processing #4
- [ ] add ideas for pull requests from the original project in Filipe's repo #5
- [ ] create a cache system to store all 'content.json' in cache folders #6

## #2 Getting Started

### 🔑 Credentials

- Sentry: https://sentry.io/
- Algorithmia: https://algorithmia.com/
- Watson NLU: https://cloud.ibm.com/catalog/services/natural-language-understanding
- Google API: https://console.cloud.google.com/apis/credentials
- Google Search: https://programmablesearchengine.google.com/controlpanel/all

### 📩 Environment

Add the credentials of the services used to the ```.env``` file, the content is similar to the one present in the ```.env.example``` file.

```shell
# Add sentry credentials to use dashboard from sentry and capture exceptions
# Add algorithmia support to use all deep learning from algorithmia
DSN_CONNECT=""
ALGO_APIKEY=""

# Add credentials to use IBM cloud features and watson IA
IBM_APIKEY=""
IBM_IAM_APIKEY_DESCRIPTION=""
IBM_IAM_APIKEY_NAME=""
IBM_IAM_ROLE_CRN=""
IBM_IAM_SERVICEID_CRN=""
IBM_URL=""

# Add url from unique feature to use with watson
IBM_NLU_URL=""

# Add credentials from google cloud to use all freemium services
GOOGLE_API_KEY=""
GOOGLE_SEARCH_ENGINE_ID=""
```

### 📦 Installation

Using in developer mode is very simple **(see: package.json)**:

```shell
yarn && yarn install
yarn dev:cli
```

## #3 Project Structure from Modules

**www/Blogs.ts**: The context of this module refers to any data returned by blog templates registered in the project. In the following example we use the 'geekhunter' as a request template, note that the return is a simple list structure containing the links and titles referring to the posts found.

**Attention**: This is just an example, the template can be created with **Cheerio** but this example will not work as long as a template called ```geekhunter.min.template``` is not inside **temp/templates**.

```typescript
Context.search('react', 'geekhunter', (response, nextPage) => {
  console.log(response)

  // Go to next page in selected website or blog
  nextPage()
})
```

or

```typescript
Context.request('front-end-developer', 'geekhunter', (response, nextPage) => {
  console.log(response)

  // Go to next page in selected website or blog
  nextPage()
})
```

Note that the response is a simple data structure from ```Context.search()```, this data can be iterated through an array of content. This response does not need a promise as this has already been done behind the scenes.

```typescript
response = {
  posts: [
    {
      index: 0,
      link: 'https://blog.geekhunter.com.br/como-aprender-react/',
      title: 'Como aprender React JS e dicas de carreira'
    },
    ...
  ]
}
```
