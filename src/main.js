let axios = require('axios');

let body = ''

var config = {
    method: 'get',
    url: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/e82ecd52-3963-4cb9-8b7f-785c053f0143/v1/models?version=2022-04-07',
    headers: {
        'Authorization': 'Basic YXBpa2V5OnBQVkJ3NzUzcDRNMGVrNl93ZEJ0ZEt0aUg5bXdJZmQyOHM3eDZEVzBqd3dN'
    }
};

axios(config)
    .then(function (response) {
        var modelId = response.data.models[0].model_id
        console.log(modelId)
        ingestDescription(modelId)
    })
    .catch(function (error) {
        console.log(error);
    });

function ingestDescription(modelId) {
    let data = {
        "text": "experience with installation of openshift 4.x on ibm, aws, azure, and gcp public cloud technology as well as on-premise. deep knowledge red hat openshift platform on cloud platforms on kubernetes.",
        "features": {
            "entities": {
                "model": modelId
            },
            "keywords": {
                "emotion": true,
                "sentiment": true
            },
            "emotion": {
                "sentiment": true
            },
            "categories": {
                "sentiment": true
            },
            "relations": {
                "model": modelId
            },
            "sentiment": {}
        }
    };



    let config = {
        method: 'post',
        url: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/e82ecd52-3963-4cb9-8b7f-785c053f0143/v1/analyze?version=2021-08-01',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5OnBQVkJ3NzUzcDRNMGVrNl93ZEJ0ZEt0aUg5bXdJZmQyOHM3eDZEVzBqd3dN'
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            body = response.data
            console.log(body);
        })
        .catch(function (error) {
            console.log(error);
        });
}
