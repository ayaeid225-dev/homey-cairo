import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { View } from "lucide-react";

export const ARPreview = ({ photo }: { photo?: string }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="gap-2">
        <View className="h-4 w-4" /> AR Room Preview
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-3xl">
      <div className="aspect-video bg-gradient-hero rounded-2xl flex flex-col items-center justify-center text-primary-foreground relative overflow-hidden">
        {photo && <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />}
        <div className="relative text-center p-8 z-10">
          <View className="h-16 w-16 mx-auto mb-4 animate-float" />
          <h3 className="text-2xl font-bold mb-2">AR Room Preview</h3>
          <p className="text-primary-foreground/80 max-w-md">
            Open this listing on the Homey mobile app to view the room in augmented reality and walk through it before booking.
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);
