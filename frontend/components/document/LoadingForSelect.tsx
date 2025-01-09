"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function LoadingForSelect() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <motion.div
        animate={{ scale: 1, opacity: 1 }}
        initial={{ scale: 0.5, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <MessageSquare className="w-16 h-16 mb-4 text-primary/80" />
        </motion.div>
      </motion.div>
      <motion.h2
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl font-semibold mb-2 text-primary"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.2 }}
      >
        No Conversation Selected
      </motion.h2>
      <motion.p
        animate={{ y: 0, opacity: 1 }}
        className="text-muted-foreground max-w-md"
        initial={{ y: 20, opacity: 0 }}
        transition={{ delay: 0.4 }}
      >
        Please <span className="font-bold">select or create</span> a
        conversation from the sidebar to start chatting.
      </motion.p>
    </div>
  );
}
