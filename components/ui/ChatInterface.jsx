import { FileText, Loader2, Send } from "lucide-react"
import { Card } from "./card"
import { Button } from "@/components/ui/button"
import { Input } from "./input"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { useRef, useState } from "react"
import Link from "next/link"

export function ChatInterface({ onSendMessage, loading, currentDocument }) {
    const [message, setMessages] = useState([])
    const [input, setInput] = useState("")
    const scrollRef = useRef(null)

    const handleSend = async () => {
        if (!input.trim() || loading || !currentDocument) return

        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: input,
            timestamp: new Date(),
            documentId: currentDocument.id,
        }

        setMessages((prev) => [...prev, userMessage])
        setInput("")

        const aiResponse = await onSendMessage(input, currentDocument.id)
        console.log(aiResponse)

        const aiMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
            documentId: currentDocument.id,
        }

        setMessages((prev) => [...prev, aiMessage])
    }

    return (
        <Card className="p-4 space-y-4">
            {currentDocument ? (
                <div className="p-3 border-b bg-muted/50 rounded-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4 text-primary" />
                            <span>
                                <strong>Current Document:</strong> {currentDocument.filename}
                            </span>
                        </div>
                        {message.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setMessages([])}
                            >
                                Clear History
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="p-3 border-b bg-yellow-500/10 text-yellow-700 dark:text-yellow-200 text-sm rounded-md">
                    Upload or select a document
                </div>
            )}

            <ScrollArea className="h-96 overflow-y-auto px-1">
                <div className="space-y-4">
                    {message.map((msg) => (

                        <div key={msg.id} className="text-sm space-y-1">
                            <div className={`font-semibold ${msg.role === "user" ? "text-blue-600" : "text-green-600"}`}>
                                {msg.role === "user" ? "You" : "AI"}
                            </div>
                            <div
                                className="bg-muted rounded-lg p-4 text-sm leading-relaxed text-foreground border"
                                dangerouslySetInnerHTML={{ __html: msg.content }}
                            />

                            <div className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && !e.shiftKey && handleSend()
                        }
                        disabled={loading || !currentDocument}
                        placeholder={
                            currentDocument
                                ? "Type a message..."
                                : "Please select or upload a document to start..."
                        }
                    />
                    <Button onClick={handleSend} disabled={loading || !currentDocument}>
                        {loading ? <Loader2 className="animate-spin" /> : <Send />}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
