"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useSocket } from "@/providers/SocketProvider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ImageIcon, Link, FileText, Globe, Scissors, Send, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import SettingsDialog from "../SettingsDialog"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Conversation {
  id: number
  title: string
  messages: Message[]
}

const mockConversations: Conversation[] = [
  {
    id: 1,
    title: "About Artificial Intelligence",
    messages: [
      { role: "user", content: "What is artificial intelligence?" },
      {
        role: "assistant",
        content:
          "Artificial intelligence refers to intelligence demonstrated by machines, as opposed to natural intelligence displayed by humans.",
      },
      { role: "user", content: "What are some common AI applications?" },
      {
        role: "assistant",
        content:
          "Common AI applications include voice assistants, image recognition, autonomous driving, recommendation systems, etc.",
      },
    ],
  },
  {
    id: 2,
    title: "About Machine Learning",
    messages: [
      { role: "user", content: "What is machine learning?" },
      {
        role: "assistant",
        content:
          "Machine learning is a branch of artificial intelligence that uses statistical techniques to enable computer systems to 'learn'.",
      },
      { role: "user", content: "What are some common machine learning algorithms?" },
      {
        role: "assistant",
        content:
          "Common machine learning algorithms include linear regression, decision trees, random forests, support vector machines, neural networks, etc.",
      },
    ],
  },
]

export default function Chat() {
  const { socket, isConnected } = useSocket()
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [currentConversationId, setCurrentConversationId] = useState<number>(1)
  const [input, setInput] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentConversation = conversations.find((conv) => conv.id === currentConversationId) || conversations[0]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      console.log("Selected image:", files[0])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      console.log("Selected file:", files[0])
    }
  }

  const handleCut = () => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      if (start !== end) {
        navigator.clipboard.writeText(input.slice(start!, end!))
        const newText = input.slice(0, start!) + input.slice(end!)
        setInput(newText)
      }
    }
  }

  useEffect(() => {
    if (!socket) return

    // Lắng nghe tin nhắn mới từ server
    socket.on('message', (message: Message) => {
      const updatedConversations = conversations.map((conv) =>
        conv.id === currentConversationId 
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
      setConversations(updatedConversations)
    })

    return () => {
      socket.off('message')
    }
  }, [socket, currentConversationId, conversations])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !socket) return

    const newMessage: Message = { role: "user", content: input.trim() }
    
    // Gửi tin nhắn đến server
    socket.emit('message', {
      conversationId: currentConversationId,
      message: newMessage
    })

    const updatedConversations = conversations.map((conv) =>
      conv.id === currentConversationId 
        ? { ...conv, messages: [...conv.messages, newMessage] }
        : conv
    )
    setConversations(updatedConversations)
    setInput("")
  }

  const handleLinkInsert = () => {
    if (linkUrl) {
      const newText = input + ` [Link](${linkUrl})`
      setInput(newText)
      setLinkUrl("")
      setIsLinkDialogOpen(false)
    }
  }

  const handleConversationChange = (id: number) => {
    setCurrentConversationId(id)
  }

  return (
    <div className="flex h-screen">
      <div className="w-64 border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Conversations</h2>
        {conversations.map((conv) => (
          <Button
            key={conv.id}
            variant={conv.id === currentConversationId ? "secondary" : "ghost"}
            className="w-full justify-start mb-2"
            onClick={() => handleConversationChange(conv.id)}
          >
            {conv.title}
          </Button>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <span>{currentConversation.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {currentConversation.messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
              <Card className={`p-4 max-w-[80%] ${message.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}>
                <div className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${message.role === "user" ? "bg-blue-500" : "bg-green-500"}`}
                  >
                    {message.role === "user" ? "U" : "A"}
                  </div>
                  <div className="flex-1">{message.content}</div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="flex flex-col gap-2">
              <Input
                ref={inputRef}
                className="w-full"
                placeholder="Type your question here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setIsLinkDialogOpen(true)}>
                    <Link className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon">
                    <Globe className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" onClick={handleCut}>
                    <Scissors className="h-4 w-4" />
                  </Button>
                </div>
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
          accept=".txt,.pdf,.doc,.docx"
        />

        <input type="file" ref={imageInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />

        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="url">Link URL</Label>
                <Input
                  id="url"
                  placeholder="Enter link URL"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleLinkInsert}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </div>
    </div>
  )
}
