import {
  useEffect,
  useState,
} from 'react';

import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

import { MeshGradient } from '@paper-design/shaders-react';

import { COLORS } from './App';
import { Button } from './Button';
import { TextInput } from './TextInput';

const PASSWORD = "manatee15";

export default function Memo() {
  const [content, setContent] = useState("");
  const [opened, setOpened] = useLocalStorage("opened", false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch("/memo.md")
      .then((res) => res.text())
      .then((text) => setContent(text));

    // Check URL parameters for password
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get("password");
    if (urlPassword === PASSWORD) {
      setOpened(true);
    }
  }, [setOpened]);

  return (
    <div className="w-screen h-screen overflow-y-auto relative md:p-16 hind">
      <div className="absolute top-0 left-0 right-0 bottom-0 z-0 pointer-events-none">
        <MeshGradient
          color1={COLORS[0]}
          color2={COLORS[1]}
          color3={COLORS[2]}
          speed={0.05}
          seed={0}
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
        />
      </div>

      {content && opened && (
        <motion.div
          className="z-10 text-left p-8 md:p-16 md:pt-8 w-fit mx-auto h-fit md:rounded-lg bg-white relative"
          style={{
            boxShadow:
              "12px 12px 24px rgba(0, 0, 0, 0.2), -12px -12px 24px rgba(255, 255, 255, 0.2)",
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Markdown
            className="max-w-3xl mx-auto markdown-body"
            rehypePlugins={[rehypeRaw]}
            components={{
              ol: ({ ...props }) => (
                <ol
                  className="ml-6 mb-4 mt-4 [ol:has(ol)>&]:mt-0"
                  style={{ listStyle: "revert" }}
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="ml-6 my-4 [ul:has(ul)>&]:mt-0"
                  style={{ listStyle: "revert" }}
                  {...props}
                />
              ),
            }}
          >
            {content}
          </Markdown>
        </motion.div>
      )}

      {!opened && (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-10 flex flex-col items-center justify-center">
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@") && password === PASSWORD) {
                setOpened(true);
                fetch("https://api.office.learnwithorin.com/api/memo/", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    email: email,
                  }),
                })
                  .then((response) => response.json())
                  .then((response) => console.log(response))
                  .catch((err) => console.error(err));
              } else {
                toast.error("Invalid email or password");
              }
            }}
          >
            <p className="text-sm text-gray-700">
              Enter your email and password to unlock the memo.
            </p>
            <TextInput
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(value) => setEmail(value)}
            />
            <TextInput
              placeholder="Password"
              type="password"
              value={password}
              onChange={(value) => setPassword(value)}
            />
            <Button
              shadow="neu"
              disabled={!email.includes("@") || password.length === 0}
              type="submit"
            >
              Unlock
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
