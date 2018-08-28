# Playground experiment - Alexa Skill
## Requirements 
- Amazon developer account
- AWS Account
- SwagOAuth plugin [TODO]

## Create a new Skill
- Login to Amazon developer Account
- Goto the Alexa console (https://developer.amazon.com/alexa/console/ask)
- Create a new Skill 
- Enter skill name, default language
- Goto the JSON-Editor `https://developer.amazon.com/alexa/console/ask/build/custom/{SKILLID}/development/{LANGUAGE}/json-editor`
- Paste model of you language 
- Configure Account Linking (see [SwagOAuth])

## Create lambda function
- Login to your AWS Account
- Goto Lambda functions (https://eu-west-1.console.aws.amazon.com/lambda/home)
- Create a new function
- Choose a name
- Choose as runtime **Node.js 8.10**
- Choose or create a role (the role must also have access to Amazon DynamoDB)
- Create function
- Add **Alexa Skill Kit** as trigger to the skill
- Add the App-Id of the Skill (https://developer.amazon.com/alexa/console/ask/build/custom/{SKILLID}/development/{language}/endpoint)
- Add the ARN of the lambda to the Skill (It starts with `arn:aws:lambda:`)
- install dependencies local `cd lambda; npm install`
- zip the content of the lambda folder `cd lambda; zip -X -r Skill.zip *`
- upload the zip 
- Save

## Configure constants.js
- Set the BASE_URL to your instance (e.g. `pg.shopware.com`)
