import { useEffect, useState } from 'react'
import { Copy, Settings2, BookMarked, X, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { translateText } from '@/service/projectApi'

interface TranslationPopupProps {
  text: string;
  onClose: () => void;
  onSaveNote: (text: string) => void;
  position: { x: number; y: number }
}

export function TranslationPopup({ text, onClose, onSaveNote, position }: TranslationPopupProps) {
  const [sourceLanguage, setSourceLanguage] = useState('en')
  const [targetLanguage, setTargetLanguage] = useState('vi')
  const [showSettings, setShowSettings] = useState(false)
  const [result, setResult] = useState<string>('')

  useEffect(() => {
    if(text !== undefined) {
        handleTranslate('en', 'vi')
    }
  },[text])

  const handleTranslate = async (sourceLanguage: string, targetLanguage: string) => {
    setResult('')
    try {
        const data = await translateText(text as string, sourceLanguage, targetLanguage)
        setResult(data.data.result)
    } catch (e) {
        console.log(e)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
  }

  const handleSourceLanguageChange = (value: string) => {
    setSourceLanguage(value)
    handleTranslate(value, targetLanguage)  
  }

  const handleTargetLanguageChange = (value: string) => {
    setTargetLanguage(value)
    handleTranslate(sourceLanguage, value)  
  }

  return (
    <Card 
    style={{
        left: `${position?.x}px`,
        top: `${position?.y}px`,
    }}
    className="max-w-80 fixed bg-zinc-100 dark:bg-zinc-900 rounded-lg shadow-lg p-2 min-w-[200px]">
      <div className="flex flex-col gap-2">
            {result === '' ? (
                    <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                    </div>
                ) : (
                    result
                )}
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => setShowSettings(!showSettings)}>
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={() => onSaveNote(text)}>
            <BookMarked className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {showSettings && (
          <div className="px-2 py-1 space-y-2">
            <div className="space-y-1">
              <Label htmlFor="source-language" className="text-xs text-zinc-400">Source Language</Label>
              <Select value={sourceLanguage} onValueChange={handleSourceLanguageChange}>
                <SelectTrigger id="source-language" className="w-full">
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="target-language" className="text-xs text-zinc-400">Target Language</Label>
              <Select value={targetLanguage} onValueChange={handleTargetLanguageChange}>
                <SelectTrigger id="target-language" className="w-full">
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
