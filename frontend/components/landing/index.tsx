'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { AlertCircle, Search, Settings, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Brain, FileText, Image, Share2, Users, Moon, Sun } from 'lucide-react'
import Link from 'next/link'
import SignInForm from '@/components/global/SignInForm';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [isOpenSignIn, setIsOpenSign] = useState<boolean>(false)
  const [isAuth, setIsAuth] = useState<boolean>(false)
  const handleToggleSignIn = () => setIsOpenSign(!isOpenSignIn)
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

useEffect(() => {
  setIsClient(true);
}, []);
const handleStart = () => {
  router.push('/home')
}

useEffect(() => {
  if (isClient) {
    const savedDarkMode = localStorage.getItem('dark-mode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    const isAccess = localStorage.getItem('access_token')
    if(isAccess) {
      setIsAuth(true)
    }
  }
}, [isClient]);

useEffect(() => {
  if (isClient) {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}, [darkMode, isClient]);

const toggleDarkMode = () => {
  setDarkMode((prevDarkMode) => {
    const newDarkMode = !prevDarkMode;
    if (isClient) {
      localStorage.setItem('dark-mode', JSON.stringify(newDarkMode));
    }
    return newDarkMode;
  });
};

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Head>
        <title>Viet</title>
      </Head>
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="#">
          <span className="ml-2 text-2xl font-bold">Viet</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#community">
            Community
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="ml-4"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>
      <main className="flex-1">
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your AI Assistant for Knowledge Management and Research
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Organize, analyze, and collaborate on your knowledge with the power of AI.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                  <Button onClick={() => {
                    if(isAuth) {
                      handleStart()
                    } else {
                      handleToggleSignIn()
                    }
                  }}>Get Started</Button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-zinc-100 dark:bg-zinc-800">
          <div className="container px-4 md:px-6 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Product Showcase</h2>
            <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="overflow-hidden dark:bg-zinc-900">
                <img src="/placeholder.svg?height=300&width=400" alt="Viet Dashboard" className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>Intuitive Dashboard</CardTitle>
                  <CardDescription>Manage your projects and knowledge base with ease</CardDescription>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden dark:bg-zinc-900">
                <img src="/placeholder.svg?height=300&width=400" alt="AI-Powered Insights" className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>Get intelligent summaries and recommendations</CardDescription>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden dark:bg-zinc-900">
                <img src="/placeholder.svg?height=300&width=400" alt="Collaborative Workspace" className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>Collaborative Workspace</CardTitle>
                  <CardDescription>Work together seamlessly with your team</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section> */}
        <section id="features" className=" bg-zinc-100 dark:bg-zinc-800 flex justify-center w-full py-12 md:py-24 lg:py-32">
          <div className='mx-5'>
          <div className="space-y-4 flex justify-center items-center flex-col">
            <h1 className="text-5xl font-bold">Get a brain boost.</h1>
            <p className="text-xl text-muted-foreground">
              Built right into your workspace, Viet is ready to brainstorm, summarize, help you write, and find what you&apos;re looking for.
            </p>

            <Button className="text-primary-foreground bg-blue-600 hover:bg-blue-700">
              Try Viet →
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-14">
            <div className="space-y-2 flex justify-center items-center flex-col">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold">Knowledge Management</h3>
              <p className="text-sm text-muted-foreground">
              Create projects with documents, images, tables, and notes.
              </p>
            </div>
            <div className="space-y-2 flex justify-center items-center flex-col">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">LLM Interaction</h3>
              <p className="text-sm text-muted-foreground">
              Generate summaries, mind maps, and comparisons.
              </p>
            </div>
            <div className="space-y-2 flex justify-center items-center flex-col">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">Advanced Search</h3>
              <p className="text-sm text-muted-foreground">
              Search within projects, documents, or entire knowledge base.
              </p>
            </div>
          </div>
          </div>
        </section>
        <section id="community" className="flex justify-center w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Join Our Community</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Card className='dark:bg-zinc-800'>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2" />
                  <CardTitle>Collaborative Projects</CardTitle>
                  <CardDescription>Work together with your team on shared projects.</CardDescription>
                </CardHeader>
              </Card>
              <Card className='dark:bg-zinc-800'>
                <CardHeader>
                  <Share2 className="h-8 w-8 mb-2" />
                  <CardTitle>Easy Sharing</CardTitle>
                  <CardDescription>Share your work with others using simple links.</CardDescription>
                </CardHeader>
              </Card>
              <Card className='dark:bg-zinc-800'>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2" />
                  <CardTitle>Knowledge Exchange</CardTitle>
                  <CardDescription>Learn from others and contribute your expertise.</CardDescription>
                </CardHeader>
              </Card>
              <Card className='dark:bg-zinc-800'>
                <CardHeader>
                  <Brain className="h-8 w-8 mb-2" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>Leverage collective intelligence with AI assistance.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="flex justify-center w-full py-12 md:py-24 lg:py-32 bg-zinc-100 dark:bg-zinc-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Pricing Plans</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
              <Card className='dark:bg-zinc-900'>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>For individual researchers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$9.99</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">per month</div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      5 Projects
                    </li>
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited Documents
                    </li>
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Basic LLM Features
                    </li>
                  </ul>
                  
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
              <Card className='dark:bg-zinc-900'>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For professional researchers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$24.99</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">per month</div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited Projects
                    </li>
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced LLM Features
                    </li>
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Team Collaboration
                    </li>
                  </ul>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>
              <Card className='dark:bg-zinc-900'>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For large organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">Custom</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">Contact us for pricing</div>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className=" w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Custom Integration
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Dedicated Support
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced Security
                    </li>
                  </ul>
                  <Button className="w-full">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Viet. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
      <SignInForm isOpen={isOpenSignIn} closeForm={handleToggleSignIn}/>
    </div>
  )
}