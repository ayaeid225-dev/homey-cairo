import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { FileText, Download } from "lucide-react";

type Template = { id: string; title: string; category: string; description: string; content: string };

const Contracts = () => {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    supabase.from("contract_templates").select("*").then(({ data }) => setTemplates((data as Template[]) ?? []));
  }, []);

  const download = (t: Template) => {
    const blob = new Blob([t.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${t.title}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Contract Templates</h1>
          <p className="text-sm text-muted-foreground">Ready-to-use lease and roommate agreements</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {templates.map((t) => (
            <div key={t.id} className="bg-card rounded-3xl shadow-soft p-6 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.description}</p>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline" size="sm">Preview</Button></DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                    <DialogHeader><DialogTitle>{t.title}</DialogTitle></DialogHeader>
                    <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-2xl">{t.content}</pre>
                  </DialogContent>
                </Dialog>
                <Button size="sm" className="bg-gradient-primary gap-2" onClick={() => download(t)}>
                  <Download className="h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Contracts;
