import React, { useState } from "react";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { Select, SelectItem } from "@nextui-org/select";


interface FeedbackProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (issueType: string, details: string) => void;
}

const Feedback: React.FC<FeedbackProps> = ({ open, onClose, onSubmit }) => {
  const [issueType, setIssueType] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (details.trim()) {
      onSubmit(issueType, details);
      setIssueType("");
      setDetails("");
      onClose();
    }
  };

  return (
    <Modal isOpen={open} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Feedback</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Select
              className="w-full"
              label="What type of issue do you wish to report?"
              placeholder="Select an issue type"
              onChange={(e) => setIssueType(e.target.value)}
            >
              <SelectItem key="ui-bug" value="UI Bug">
                UI Bug
              </SelectItem>
              <SelectItem key="data-error" value="Data Error">
                Data Error
              </SelectItem>
              <SelectItem key="chatbot-bug" value="Chatbot Bug">
                Chatbot Bug
              </SelectItem>
              <SelectItem key="other" value="Other">
                Other
              </SelectItem>
            </Select>
            <Textarea
              className="mt-4"
              label="Please provide details: (optional)"
              placeholder="What was unsatisfying about this response?"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Feedback;
