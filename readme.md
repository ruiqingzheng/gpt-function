# gpt function

## refer <https://youtu.be/i-oHvHejdsc>

> 注意: 在远程调用, openai 禁用了很多地区

在会话中可以告诉 gpt 这是一个 function call , 只需要指定 role 为 function

ppm install openai



main.js

request once ,    只是调用一次 自定义方法

callGpt.js

需要 while 循环, 判断是否会话完成