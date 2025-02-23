
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { SendHorizonal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Here we'll store the message in Supabase (we'll implement this later)
      toast({
        title: "Message sent!",
        description: "Thank you for sharing how you feel.",
      });
      setMessage("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Share your thoughts and feelings..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
          />
          <Button 
            type="submit" 
            disabled={loading || !message.trim()}
            className="w-full"
          >
            <SendHorizonal className="mr-2 h-4 w-4" />
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
