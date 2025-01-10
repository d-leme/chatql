'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MessageInput() {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Sending message:', message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-800">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 mr-2 bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="bg-green-600 hover:bg-green-700 transition-colors duration-150"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}

