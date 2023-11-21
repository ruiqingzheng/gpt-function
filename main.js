import OpenAI from 'openai'
import dotenv from 'dotenv'
dotenv.config()

function getWeather (city) {
  const weatherConfig = {
    shanghai: "ranning",
    beijing: 'sunny',
    guangzhou: 'cloudy',
    other: 'snow'
  }

  const founded = city && Object.keys(weatherConfig).map(k => k.toLocaleLowerCase()).includes(city.toLocaleLowerCase())
  return founded ? weatherConfig[city.toLocaleLowerCase()] : weatherConfig['other']
}

// console.log( "kunming weather:" , getWeather("kunming") )
// console.log( "shanghai weather:" , getWeather("shanghai") )

const messages = [
  { role: 'system', content: 'you give very short answers' },
  // { role: 'user', content: 'Is it raining in Stockholm?' },
  { role: 'user', content: 'whats the weather in Shanghai?' },
]

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

const response = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages,
  // deprecated
  functions: [weatherFunctionSpec]
  // new api: 
  // tools: [{
  //   type: 'function',
  //   function: weatherFunctionSpec
  // }]
})

// console.log('response.choices[0].message :>> ', response.choices[0].message)
const response_message = response.choices[0].message

messages.push(response_message)

const { function_call } = response_message

const is_weather_function_call = function_call && function_call.name === MY_CUSTUM_FUNCTION_NAME

if (is_weather_function_call) {
  const args = JSON.parse(function_call.arguments)
  const city = args.city
  const weather = await getWeather(city)
  messages.push({ role: 'function', name: 'getWeather', content: JSON.stringify(weather) })
  console.log("------------------- SECOND REQUEST ------------")
  console.log(messages)

  // 这个时候的 messages 已经是包含了 function 结果
  // 所以, 对于最初的问题已经可以回答了
  const response2 = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: messages,
    functions: [weatherFunctionSpec]
  })

  console.log(response2.choices[0].message)
}
