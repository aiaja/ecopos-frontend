import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
const NoteDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [note, setNote] = useState<string | null>(null);

  const handleSave = () => {
    console.log("Note saved:", note);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Notes</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Type your note here..."
            value={note || ""}
            onChange={(e) => setNote(e.target.value)}
            maxLength={255}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;