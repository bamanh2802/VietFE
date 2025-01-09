"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewUserPrompt() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate a delay before showing the prompt
    const timer = setTimeout(() => setIsVisible(true), 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 right-56 z-50"
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-72">
        <CardContent className="p-4">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <h3 className="text-lg font-semibold mb-2">
              Welcome to our platform!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              To get started, create your first project by clicking the button
              in the top right corner.
            </p>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setIsVisible(false)}
            >
              Got it!
            </Button>
          </motion.div>
        </CardContent>
      </Card>
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        className="absolute -top-12 -right-8"
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <ArrowUpRight className="text-primary w-12 h-12" />
      </motion.div>
    </motion.div>
  );
}
