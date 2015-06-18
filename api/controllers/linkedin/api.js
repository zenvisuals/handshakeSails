var api = {};
Object.defineProperties(api, {
  "basicProfile": {
    value: "https://api.linkedin.com/v1/people/~:(id,formatted-name,headline,industry,summary,num-connections,picture-url)?format=json&oauth2_access_token="
  }
})

module.exports = api;
