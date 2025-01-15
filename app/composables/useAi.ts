import axios from 'axios'
import type { ChatMessages } from '~/types'

const url = '/api/ai/openai'

export const useAI = () => {
  const openAiGenerate = async (
    config: any,
    { messages: messages }: { messages: ChatMessages },
    { onText = () => {}, onComplete = () => {} }
  ) => {
    const textArr = []
    const bodySend = {
      ...config,
      max_tokens: 256,
      stream: true,
      messages: messages.slice(0, -1)
    }
    const payload = JSON.stringify(bodySend)
    // console.log('🟢 openAiGenerate', payload);
    const { body, status } = await fetch('/api/ai/openai', {
      method: 'POST',
      body: payload
    })
    const reader = body?.getReader()
    // console.log('🟢 openAiGenerate reader', reader);
    const decoder = new TextDecoder()
    let finished = false,
      completion: string | undefined | object

    if (status === 200) {
      while (!finished) {
        const { value, done } = (await reader?.read()) ?? {
          value: null,
          done: true
        }
        finished = done
        const chunkValue = decoder.decode(value!) // Add type assertion here
        textArr.push(chunkValue)
        completion = textArr.join('')
        console.log('🟢 openAiGenerate completion', completion)
        onText(completion)
      }
      onComplete({ status, completion })
    } else {
      while (!finished) {
        const { value, done } = (await reader?.read()) ?? {
          value: null,
          done: true
        }
        finished = done
        const chunkValue = decoder.decode(value!) // Add type assertion here
        textArr.push(chunkValue)
        completion = textArr.join('')
        console.log('🔴 openAiGenerate error', completion)
        // onText(completion);
      }
      onComplete({ status, completion })
    }
  }
  const complete = async (
    { messages },
    {
      onText = (completion: string) => {},
      onComplete = (completion: string | undefined) => {}
    }
  ) => {
    const textArr = []
    const payload = JSON.stringify({
      model: 'gpt-3.5-turbo', // 'gpt-4', // 'gpt-4-0613',
      temperature: 1,
      max_tokens: 256,
      stream: true,
      messages
    })

    // console.log('Run completion', config);
    const { body } = await fetch(url, {
      method: 'POST',
      body: payload
    })

    const reader = body.getReader()
    const decoder = new TextDecoder()
    let finished = false,
      completion

    while (!finished) {
      const { value, done } = await reader.read()
      finished = done
      const chunkValue = decoder.decode(value)
      textArr.push(chunkValue)
      completion = textArr.join('')
      onText(completion)
    }
    onComplete(completion)
  }
  const completeUrl = async (
    endpoint: string,
    temperature: number,
    { messages },
    { onText = () => {}, onComplete = () => {} }
  ) => {
    const textArr = []
    const bodyInfo = {
      temperature: temperature,
      messages: messages.slice(0, -1),
      model: 'gpt-3.5-turbo'
    }
    const payload = JSON.stringify(bodyInfo)

    console.log('Run completion', endpoint, payload)
    const { body } = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: payload
    })

    const reader = body?.getReader()
    const decoder = new TextDecoder()
    let finished = false,
      completion

    while (!finished) {
      const { value, done } = await reader.read()
      finished = done
      const chunkValue = decoder.decode(value)
      textArr.push(chunkValue)
      completion = textArr.join('')
      onText(completion)
    }
    onComplete(completion)
  }
  const completeUrlAssistant = async (
    endpoint: string,
    model_id: string,
    threadId: string | null,
    { messages },
    { onComplete = () => {} }
  ) => {
    const response = await axios.post(
      endpoint,
      {
        model_id: model_id,
        messages: messages.slice(0, -1),
        threadId: threadId ? threadId : ''
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    onComplete(response.data)
  }
  return { completeUrl, complete, completeUrlAssistant, openAiGenerate }
}
