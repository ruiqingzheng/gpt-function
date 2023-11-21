import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()
import { getWeather } from './main.js'


const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY })
const MY_CUSTUM_FUNCTION_NAME = 'weather'
const weatherFunctionSpec = {
  "name": MY_CUSTUM_FUNCTION_NAME,
  "description": "Get the current weather for a city",
  "parameters": {
    "type": "object",
    'properties': {
      "city": {
        "type": "string",
        "description": "the city",
      },
    },
    "required": ["city"],
  },
}

async function callGpt (model, systemPrompt, userPrompt) {
  let messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]

  while (true) {
    console.log("--------------REQUEST------------")
    console.log(messages)
    const response = await openai.chat.completions.create({
      model: model ,
      messages,
      functions: [weatherFunctionSpec]
    })

    let responseMessage = response.choices[0].message

    console.log("Got response: ", responseMessage)
    messages.push(responseMessage)


    const { function_call } = responseMessage

    const is_weather_function_call = function_call && function_call.name === MY_CUSTUM_FUNCTION_NAME

    if (is_weather_function_call) {
      const args = JSON.parse(function_call.arguments)
      const city = args.city
      const weather = await getWeather(city)
      messages.push({ role: 'function', name: 'getWeather', content: JSON.stringify(weather) })
    } else if (response.choices[0].finish_reason === 'stop') {
      return responseMessage
    }

  }
}

const finalMesage = await callGpt('gpt-3.5-turbo', 'you give very short answers', 'whats the weather in Shanghai?')

console.log("final message:", finalMesage)