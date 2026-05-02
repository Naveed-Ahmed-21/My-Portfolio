import React, { useState, useEffect, useRef } from 'react';
import {
  LuGithub as Github,
  LuLinkedin as Linkedin,
  LuMail as Mail,
  LuPhone as Phone,
  LuMessageCircle as MessageCircle,
  LuExternalLink as ExternalLink,
  LuCode as Code,
  LuDatabase as Database,
  LuServer as Server,
  LuSmartphone as Smartphone,
  LuWrench as Wrench,
  LuChevronUp as ChevronUp,
  LuChevronLeft as ChevronLeft,
  LuMenu as Menu,
  LuX as X,
  LuDownload as Download,
  LuTerminal as Terminal,
  LuCircleCheck as CheckCircle2,
  LuBriefcase as Briefcase,
  LuGraduationCap as GraduationCap,
  LuLayers as Layers,
  LuBot as Bot,
  LuSend as Send,
  LuSparkles as Sparkles,
  LuLayoutGrid as LayoutGrid,
  LuCircleUser as UserCircle
} from 'react-icons/lu';
import { ImSpinner8 as Loader2 } from 'react-icons/im';

const useScrollReveal = () => {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0', 'scale-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10', 'scale-95');
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return ref;
};

const useTypingEffect = (words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          timer = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration]);

  return text;
};
const RevealWrapper = ({ children, className = '', delay = 0 }) => {
  const ref = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out opacity-0 translate-y-10 scale-95 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Hi! I'm Naveed's AI assistant. Ask me anything about his skills, experience, or projects!" }
  ]);
  const chatScrollRef = useRef(null);

  const typedText = useTypingEffect(['Flutter Developer', 'Full Stack Engineer', 'Software Engineer']);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);

      const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
      let current = 'home';

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mousePosition = useMousePosition();
  const parallaxX = typeof window !== 'undefined' ? (mousePosition.x - window.innerWidth / 2) * 0.03 : 0;
  const parallaxY = typeof window !== 'undefined' ? (mousePosition.y - window.innerHeight / 2) * 0.03 : 0;

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    const subject = encodeURIComponent(`Portfolio Contact: ${name || 'New Inquiry'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:naveedsha269@gmail.com?subject=${subject}&body=${body}`;
    e.currentTarget.reset();
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    const newHistory = [...chatHistory, { role: 'user', text: userMessage }];
    setChatHistory(newHistory);
    setIsAiTyping(true);

    try {
      const apiKey = '';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const systemPrompt = `You are an AI assistant representing Naveed Ahmed K, a highly skilled Flutter and Full Stack Developer.
      Your goal is to answer questions from recruiters and enthusiastically encourage them to hire him.
      Here is Naveed's info:
      - Location: Tirupattur, Tamil Nadu, India.
      - Skills: Flutter, Dart, React.js, Node.js, Express.js, MongoDB, Firebase Firestore, JWT, Git.
      - Projects: Smart Canteen System (Flutter, Firebase), Campus Placement System (React, Node, MongoDB), Dual Tap Game (Flutter), Full Stack To-Do App.
      - Education: B.Tech IT at Govt College of Engineering, Erode (CGPA: 7.63, 2023-2027), 12th Grade at RamaKrishna Hr Sec School (82.6%).
      - Experience: Team Lead at Niral Thiruviza (built SkillSyncAi web/mobile app), Expo Head at Hackxpo'26.
      - Contact: naveedsha269@gmail.com, Phone/WhatsApp: +91 7708325976.
      Be professional, concise, and helpful. Keep responses to 1-2 short paragraphs max.`;

      const payload = {
        contents: newHistory.map((msg) => ({
          role: msg.role === 'ai' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        })),
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        }
      };

      const fetchWithBackoff = async (retries = 5, delay = 1000) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
        } catch (error) {
          if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return fetchWithBackoff(retries - 1, delay * 2);
          }
          return "Sorry, I'm having trouble connecting right now. Please try again later or contact Naveed directly at naveedsha269@gmail.com!";
        }
      };

      const aiResponse = await fetchWithBackoff();
      setChatHistory((prev) => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { role: 'ai', text: 'An error occurred while reaching the AI. Please try again.' }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatHistory, isAiTyping]);

  return (
    <div className="min-h-screen bg-[#071317] text-slate-300 font-sans selection:bg-cyan-400/30 overflow-x-hidden relative">
      <style>{`
        @keyframes float-phone {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
        }
        @keyframes float-node {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-phone { animation: float-phone 8s ease-in-out infinite; }
        .animate-float-node-1 { animation: float-node 5s ease-in-out infinite; }
        .animate-float-node-2 { animation: float-node 7s ease-in-out infinite 1s; }
        .animate-float-node-3 { animation: float-node 6s ease-in-out infinite 2s; }
      `}</style>

      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px] animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-amber-400/12 blur-[120px] animate-[pulse_5s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}></div>
      </div>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-[#071317]/85 backdrop-blur-xl border-b border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.24)]' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            className="text-2xl font-extrabold tracking-tighter text-white group flex items-center gap-1"
          >
            Naveed<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 group-hover:from-amber-300 group-hover:to-cyan-300 transition-all duration-500">.dev</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`relative text-sm font-medium transition-colors hover:text-white group py-1 ${
                  activeSection === link.id ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {link.name}
                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-300 to-emerald-300 transform origin-left transition-transform duration-300 ${
                  activeSection === link.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </button>
            ))}
            <button
              onClick={() => scrollTo('contact')}
              className="relative overflow-hidden px-6 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-cyan-400/50 text-white text-sm font-medium transition-all group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Hire Me</span>
            </button>
          </nav>

          <button
            className="md:hidden text-slate-300 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-nav-enter md:hidden absolute top-full left-0 w-full bg-[#071317]/95 backdrop-blur-xl border-b border-white/10 py-6 px-6 flex flex-col gap-6 shadow-2xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left text-lg font-medium py-2 transition-colors ${
                  activeSection === link.id ? 'text-cyan-300' : 'text-slate-400'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative min-h-[100svh] flex flex-col justify-between pt-24 px-6 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 hidden md:block"
            style={{
              background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34,211,238,0.12), transparent 40%)`
            }}
          />

          <div
            className="absolute inset-0 z-0 pointer-events-none transition-transform duration-200 ease-out hidden md:block"
            style={{ transform: `translate(${parallaxX}px, ${parallaxY}px)` }}
          >
            <Code className="absolute top-[20%] left-[10%] text-cyan-400/20 animate-[bounce_4s_infinite_alternate] blur-[1px]" size={64} />
            <Smartphone className="absolute bottom-[20%] right-[10%] text-amber-400/20 animate-[bounce_5s_infinite_alternate-reverse] blur-[1px]" size={80} />
            <Database className="absolute top-[30%] right-[20%] text-emerald-400/20 animate-[bounce_6s_infinite_alternate] blur-[1px]" size={48} />
            <Server className="absolute bottom-[30%] left-[20%] text-teal-300/20 animate-[bounce_7s_infinite_alternate-reverse] blur-[1px]" size={56} />
          </div>

          <div className="container mx-auto max-w-6xl relative z-10 w-full mt-auto mb-auto grid lg:grid-cols-2 gap-12 items-center flex-1 py-12">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left z-20">
              <RevealWrapper className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-sm font-medium mb-8 hover:bg-cyan-400/20 transition-colors cursor-default shadow-[0_0_18px_rgba(34,211,238,0.16)] backdrop-blur-sm lg:self-start">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
                </span>
                Available for Internships & Entry-level Roles
              </RevealWrapper>

              <RevealWrapper delay={100}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
                  Hi, I&apos;m <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-emerald-300 to-amber-300 bg-[length:200%_auto] hover:bg-right transition-all duration-1000 cursor-default drop-shadow-sm">Naveed Ahmed K</span>
                </h1>
              </RevealWrapper>

              <RevealWrapper delay={200} className="h-14 md:h-20 mb-6 w-full">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-300 drop-shadow-md">
                  <span className="text-slate-500 font-medium">I am a </span>
                  {typedText}
                  <span className="animate-[pulse_1s_infinite] text-cyan-300">|</span>
                </h2>
              </RevealWrapper>

              <RevealWrapper delay={300} className="w-full mb-12">
                <p className="text-xl md:text-2xl font-medium text-white mb-6 leading-tight drop-shadow-sm">
                  &quot;Building scalable mobile applications with real backend systems — not just UI demos.&quot;
                </p>
                <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                  I design and develop end-to-end applications using Flutter, Node.js, and MongoDB, focusing on performance, usability, and real-world problem solving.
                </p>
              </RevealWrapper>

              <RevealWrapper delay={400} className="flex flex-col items-center lg:items-start gap-6 w-full max-w-2xl mx-auto lg:mx-0">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <button
                    onClick={() => scrollTo('projects')}
                    className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold shadow-[0_0_24px_rgba(34,211,238,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_0_34px_rgba(16,185,129,0.35)]"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 skew-x-[-45deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
                    <span className="relative flex items-center justify-center gap-2 text-base">View Projects <Layers size={18} /></span>
                  </button>

                  <a
                    href="/resume.pdf"
                    className="relative group overflow-hidden w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-300/30 text-white font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    download="Naveed_Ahmed_K_Resume.pdf"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-white/10 skew-x-[-45deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
                    <span className="relative flex items-center gap-2 text-base"><Download size={18} /> Download Resume</span>
                  </a>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="relative group overflow-hidden w-full sm:w-auto px-8 py-3.5 rounded-full border border-amber-400/40 bg-amber-400/10 backdrop-blur-sm hover:bg-amber-400/20 text-amber-200 font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.18)]"
                  >
                    <span className="absolute top-0 left-0 w-full h-full bg-amber-400/20 skew-x-[-45deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
                    <span className="relative flex items-center gap-2 text-sm"><Sparkles size={16} /> Ask AI About Me</span>
                  </button>

                  <div className="flex items-center justify-center gap-4">
                    <a href="https://github.com/Naveed-Ahmed-21" target="_blank" rel="noreferrer" className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-white transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                      <Github size={20} />
                    </a>
                    <a href="https://linkedin.com/in/naveedahmedk" target="_blank" rel="noreferrer" className="p-3.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-emerald-400/50 text-slate-300 hover:text-white transition-all hover:-translate-y-1 shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </RevealWrapper>
            </div>

            <div className="hidden lg:flex justify-center items-center relative w-full h-full min-h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-emerald-400/16 to-amber-300/18 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative w-[280px] h-[580px] rounded-[3rem] border-[10px] border-slate-800 bg-[#0a1a20] shadow-[0_0_50px_rgba(34,211,238,0.16)] animate-[float-phone_6s_ease-in-out_infinite] z-20 overflow-hidden group">
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30">
                  <div className="w-24 h-full bg-slate-800 rounded-b-2xl"></div>
                </div>

                <div className="absolute inset-0 pt-12 px-5 pb-6 flex flex-col gap-5 bg-gradient-to-b from-slate-900 via-cyan-900/10 to-[#081218]">
                  <div className="flex items-center gap-3">
                    <UserCircle className="text-slate-400" size={36} />
                    <div className="flex-1">
                      <div className="w-20 h-2.5 bg-slate-600 rounded-full mb-1.5"></div>
                      <div className="w-12 h-2 bg-slate-700 rounded-full"></div>
                    </div>
                  </div>

                  <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 p-4 flex flex-col justify-end shadow-lg border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>
                    <div className="w-3/4 h-3 bg-white/80 rounded-full mb-2 z-10"></div>
                    <div className="w-1/2 h-2 bg-white/50 rounded-full z-10"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-24 rounded-2xl bg-white/[0.03] border border-white/5 p-3 flex flex-col justify-between">
                      <LayoutGrid className="text-cyan-300" size={20} />
                      <div className="w-full h-1.5 bg-cyan-400/30 rounded-full"></div>
                    </div>
                    <div className="h-24 rounded-2xl bg-white/[0.03] border border-white/5 p-3 flex flex-col justify-between">
                      <Code className="text-amber-300" size={20} />
                      <div className="w-full h-1.5 bg-amber-400/30 rounded-full"></div>
                    </div>
                  </div>

                  <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 p-4 flex flex-col gap-2.5">
                    <div className="w-2/3 h-2 bg-cyan-300/50 rounded-full"></div>
                    <div className="w-1/2 h-2 bg-amber-300/50 rounded-full"></div>
                    <div className="w-full h-2 bg-slate-500/50 rounded-full mt-2"></div>
                    <div className="w-5/6 h-2 bg-slate-500/50 rounded-full"></div>
                    <div className="w-4/6 h-2 bg-emerald-500/50 rounded-full mt-2"></div>
                  </div>

                  <div className="h-12 w-full rounded-2xl bg-white/5 border border-white/10 flex justify-around items-center px-2">
                    <div className="w-6 h-6 rounded-md bg-cyan-400/50"></div>
                    <div className="w-6 h-6 rounded-md bg-slate-600"></div>
                    <div className="w-6 h-6 rounded-md bg-slate-600"></div>
                    <div className="w-6 h-6 rounded-md bg-slate-600"></div>
                  </div>
                </div>
              </div>

              <div
                className="absolute top-[10%] left-[5%] p-4 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 text-emerald-400 animate-float-node-1 shadow-[0_0_30px_rgba(16,185,129,0.2)] z-30 transition-transform duration-200 ease-out"
                style={{ transform: `translate(${parallaxX * -1.5}px, ${parallaxY * -1.5}px)` }}
              >
                <Database size={32} />
              </div>
              <div
                className="absolute bottom-[20%] right-[5%] p-4 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 text-amber-300 animate-float-node-2 shadow-[0_0_30px_rgba(245,158,11,0.18)] z-30 transition-transform duration-200 ease-out"
                style={{ transform: `translate(${parallaxX * 1.2}px, ${parallaxY * 1.2}px)` }}
              >
                <Server size={32} />
              </div>
              <div
                className="absolute top-[40%] -right-[5%] p-4 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 text-cyan-300 animate-float-node-3 shadow-[0_0_30px_rgba(34,211,238,0.18)] z-10 transition-transform duration-200 ease-out"
                style={{ transform: `translate(${parallaxX * 0.8}px, ${parallaxY * 0.8}px)` }}
              >
                <Code size={32} />
              </div>
            </div>
          </div>

          <div className="relative w-full flex justify-center pb-8 pt-4 z-20 shrink-0">
            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => scrollTo('about')}>
              <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase group-hover:text-cyan-300 transition-colors">Scroll</span>
              <div className="w-6 h-10 border-2 border-slate-500/50 group-hover:border-cyan-300/50 rounded-full flex justify-center p-1.5 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-[#071317]/50 backdrop-blur-sm">
                <div className="w-1 h-2 bg-slate-400 group-hover:bg-cyan-300 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-24 px-6 bg-[#08191d] relative border-t border-white/5">
          <div className="container mx-auto max-w-5xl">
            <RevealWrapper>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 flex items-center gap-4">
                <span className="w-12 h-[3px] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"></span>
                About Me
              </h2>
            </RevealWrapper>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealWrapper delay={100} className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed">
                  I&apos;m a Flutter-focused full stack developer who builds complete applications—from frontend interfaces to backend systems and database design.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed mb-4">
                  I focus on solving real problems by implementing authentication systems, REST APIs, and structured data flows.
                </p>

                <div className="rounded-2xl bg-[#060c18] border border-white/10 overflow-hidden shadow-2xl group hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500">
                  <div className="bg-white/[0.02] border-b border-white/10 px-4 py-2.5 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                    <span className="ml-3 text-[11px] font-mono text-slate-500 font-medium tracking-widest">naveed@dev-macbook:~</span>
                  </div>
                  <div className="p-5 font-mono text-sm md:text-base">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <span className="text-emerald-400">➜</span>
                      <span className="text-cyan-400 font-bold">~</span>
                      <span className="text-white font-semibold tracking-wide">./execute_mission.sh</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed pl-4 border-l-2 border-slate-700/50">
                      &quot;My work goes beyond static UI — I build applications that simulate production-level workflows.&quot;
                      <span className="inline-block w-2 h-4 md:h-5 ml-1.5 bg-cyan-400 animate-[pulse_1s_infinite] align-middle"></span>
                    </p>
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={200} className="relative lg:h-full">
                <div
                  className="transition-transform duration-300 ease-out h-full flex items-center"
                  style={{ transform: `translate(${parallaxX * -0.2}px, ${parallaxY * -0.2}px)` }}
                >
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-[3rem] blur-2xl opacity-10 animate-[pulse_4s_infinite]"></div>

                  <div className="relative w-full rounded-[2.5rem] bg-[#071317]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 grid grid-cols-2 gap-4 md:gap-6 shadow-2xl overflow-hidden group/container">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.05] via-transparent to-transparent opacity-0 group-hover/container:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                    <div className="relative overflow-hidden space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all duration-500 cursor-default group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-4xl font-extrabold text-cyan-300 group-hover:scale-110 origin-left transition-transform duration-300">2+</h3>
                        <Code size={20} className="text-cyan-400/20 group-hover:text-cyan-300/50 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 group-hover:text-cyan-200/80 transition-colors">Years Coding</p>
                    </div>

                    <div className="relative overflow-hidden space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-400/30 transition-all duration-500 cursor-default group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-4xl font-extrabold text-amber-300 group-hover:scale-110 origin-left transition-transform duration-300">6+</h3>
                        <Layers size={20} className="text-amber-400/20 group-hover:text-amber-300/50 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 group-hover:text-amber-200/80 transition-colors">Projects Built</p>
                    </div>

                    <div className="relative overflow-hidden space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 cursor-default group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-4xl font-extrabold text-emerald-400 group-hover:scale-110 origin-left transition-transform duration-300">3</h3>
                        <LayoutGrid size={20} className="text-emerald-500/20 group-hover:text-emerald-400/50 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 group-hover:text-emerald-300/80 transition-colors">Full Stack Apps</p>
                    </div>

                    <div className="relative overflow-hidden space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-500 cursor-default group">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-4xl font-extrabold text-amber-400 group-hover:scale-110 origin-left transition-transform duration-300">7.6</h3>
                        <GraduationCap size={20} className="text-amber-500/20 group-hover:text-amber-400/50 transition-colors" />
                      </div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2 group-hover:text-amber-300/80 transition-colors">CGPA</p>
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        <section id="skills" className="py-24 px-6 relative border-t border-white/5 bg-[#071317]">
          <div className="container mx-auto max-w-5xl">
            <RevealWrapper>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 flex items-center gap-4">
                <span className="w-12 h-[3px] bg-gradient-to-r from-emerald-400 to-amber-300 rounded-full"></span>
                Technical Arsenal
              </h2>
            </RevealWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RevealWrapper delay={100}>
                <div className="h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(34,211,238,0.25)] group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 blur-[50px] -z-10 group-hover:bg-cyan-400/20 transition-colors"></div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-400/20 to-teal-400/20 border border-cyan-400/20 text-cyan-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Smartphone size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-5">Frontend Development</h3>
                  <ul className="space-y-3.5">
                    {['Flutter', 'Dart', 'React.js', 'Tailwind CSS'].map((skill) => (
                      <li key={skill} className="flex items-center gap-3 text-slate-300 font-medium group/item hover:text-cyan-200 transition-colors">
                        <CheckCircle2 size={18} className="text-cyan-400/50 group-hover/item:text-cyan-300 transition-colors" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={200}>
                <div className="h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-amber-400/50 hover:bg-amber-400/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(245,158,11,0.22)] group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 blur-[50px] -z-10 group-hover:bg-amber-400/20 transition-colors"></div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 border border-amber-400/20 text-amber-300 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                    <Server size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-5">Backend Architecture</h3>
                  <ul className="space-y-3.5">
                    {['Node.js', 'Express.js', 'REST APIs', 'System Design'].map((skill) => (
                      <li key={skill} className="flex items-center gap-3 text-slate-300 font-medium group/item hover:text-amber-200 transition-colors">
                        <CheckCircle2 size={18} className="text-amber-400/50 group-hover/item:text-amber-300 transition-colors" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={300}>
                <div className="h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.3)] group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -z-10 group-hover:bg-emerald-500/20 transition-colors"></div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Database size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-5">Data & Security</h3>
                  <ul className="space-y-3.5">
                    {['MongoDB', 'Firebase Firestore', 'JWT Authentication', 'Firebase Auth'].map((skill) => (
                      <li key={skill} className="flex items-center gap-3 text-slate-300 font-medium group/item hover:text-emerald-300 transition-colors">
                        <CheckCircle2 size={18} className="text-emerald-500/50 group-hover/item:text-emerald-400 transition-colors" /> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={400} className="md:col-span-2 lg:col-span-3">
                <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/10 hover:border-white/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_15px_30px_-10px_rgba(255,255,255,0.1)] flex flex-col md:flex-row items-start md:items-center gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/20 border border-slate-500/20 text-slate-300 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform duration-500">
                    <Wrench size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-4">Development Tools & Version Control</h3>
                    <div className="flex flex-wrap gap-3">
                      {['Git', 'GitHub', 'Postman', 'VS Code', 'Android Studio'].map((tool) => (
                        <span key={tool} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        <section id="projects" className="py-24 px-6 bg-[#08191d] border-t border-white/5">
          <div className="container mx-auto max-w-5xl">
            <RevealWrapper>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-4">
                <span className="w-12 h-[3px] bg-gradient-to-r from-cyan-400 to-amber-300 rounded-full"></span>
                Featured Projects
              </h2>
              <p className="text-slate-400 mb-12 max-w-2xl text-lg">
                A selection of systems I&apos;ve built, demonstrating my ability to handle complex state, database schema design, and seamless user experiences.
              </p>
            </RevealWrapper>

            <div className="grid md:grid-cols-2 gap-8">
              <RevealWrapper delay={100}>
                <div className="group relative h-full rounded-3xl bg-[#071317] border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.18)] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="p-8 flex-1 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 border border-cyan-400/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform duration-300">
                        <Smartphone size={28} />
                      </div>
                      <a href="https://github.com/Naveed-Ahmed-21/canteen-app-with-admin-dashboard" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all hover:scale-110">
                        <Github size={22} />
                      </a>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">Smart Canteen System</h3>
                    <p className="text-slate-400 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                      Built a real-time food ordering system designed to streamline canteen operations and reduce manual inefficiencies. Includes a dedicated admin dashboard.
                    </p>
                    <div className="mb-8 space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Key Contributions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-cyan-400" /> Designed full ordering workflow for users and admins</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-cyan-400" /> Implemented Firebase-based authentication system</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-cyan-400" /> Structured Firestore database for real-time updates</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-xs font-bold tracking-wide">Flutter</span>
                      <span className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold tracking-wide">Firebase</span>
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide">Firestore</span>
                    </div>
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={200}>
                <div className="group relative h-full rounded-3xl bg-[#071317] border border-white/10 overflow-hidden hover:border-amber-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-10px_rgba(245,158,11,0.16)] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="p-8 flex-1 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-300/20 border border-amber-400/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform duration-300">
                        <Server size={28} />
                      </div>
                      <a href="https://github.com/Naveed-Ahmed-21/campus-placement-management-system" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all hover:scale-110">
                        <Github size={22} />
                      </a>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">Campus Placement System</h3>
                    <p className="text-slate-400 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                      Developed a full stack platform to manage student placement workflows, registrations, and application tracking for the university.
                    </p>
                    <div className="mb-8 space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-widest">Key Contributions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-amber-400" /> Built REST APIs for user &amp; application management</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-amber-400" /> Designed MongoDB schema for structured data storage</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-amber-400" /> Implemented role-based data handling &amp; auth</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-200 text-xs font-bold tracking-wide">React.js</span>
                      <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold tracking-wide">Node.js</span>
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide">MongoDB</span>
                    </div>
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={300}>
                <div className="group relative h-full rounded-3xl bg-[#071317] border border-white/10 overflow-hidden hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-10px_rgba(52,211,153,0.16)] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-300 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="p-8 flex-1 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-300/20 border border-emerald-400/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform duration-300">
                        <Code size={28} />
                      </div>
                      <div className="flex items-center gap-3">
                        <a href="https://github.com/Naveed-Ahmed-21/Dual-Tap-Game/releases/tag/v1.0.0" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold hover:bg-emerald-400/20 hover:-translate-y-0.5 transition-all shadow-sm">
                          <Download size={14} />
                          APK Release
                        </a>
                        <a href="https://github.com/Naveed-Ahmed-21/Dual-Tap-Game" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/30 transition-all hover:scale-110">
                          <Github size={22} />
                        </a>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-200 transition-colors">Dual Tap Game</h3>
                    <p className="text-slate-400 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                      Created an interactive two-player mobile game focused on responsiveness, dynamic rendering, and high performance gameplay.
                    </p>
                    <div className="mb-8 space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Key Contributions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-400" /> Built responsive UI with smooth interaction</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-400" /> Optimized rendering and touch response</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-400" /> Designed engaging multi-touch gameplay mechanics</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-emerald-200 text-xs font-bold tracking-wide">Flutter</span>
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wide">Dart</span>
                      <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-bold tracking-wide">Game Logic</span>
                    </div>
                  </div>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={400}>
                <div className="group relative h-full rounded-3xl bg-[#071317] border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.16)] flex flex-col">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="absolute top-8 right-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-md text-emerald-400 text-xs font-bold px-5 py-2 rounded-l-full border-y border-l border-emerald-500/30 shadow-lg z-20">
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      IN PROGRESS
                    </span>
                  </div>
                  <div className="p-8 flex-1 flex flex-col z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        <Database size={28} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 pr-32 group-hover:text-emerald-300 transition-colors">Full Stack To-Do App</h3>
                    <p className="text-slate-400 mb-6 flex-1 text-sm md:text-base leading-relaxed">
                      Developing a highly scalable task management system with a custom backend architecture designed for production-level loads.
                    </p>
                    <div className="mb-8 space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Key Contributions</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-500" /> Implementing robust JWT authentication</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-500" /> Designing modular &amp; scalable backend APIs</li>
                        <li className="flex items-start gap-2 text-sm text-slate-300 font-medium"><Terminal size={16} className="mt-0.5 shrink-0 text-emerald-500" /> Integrating Flutter frontend with Node backend</li>
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      <span className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-200 text-xs font-bold tracking-wide">Flutter</span>
                      <span className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold tracking-wide">Node.js</span>
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide">MongoDB</span>
                    </div>
                  </div>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>

        <section id="experience" className="py-24 px-6 bg-[#071317] border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-400/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-amber-400/5 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-16">
              <div>
                <RevealWrapper>
                  <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-cyan-400/20 text-cyan-300">
                      <GraduationCap size={28} />
                    </span>
                    Education
                  </h2>
                </RevealWrapper>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-cyan-400/50 before:to-transparent">
                  <RevealWrapper delay={100} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#071317] bg-cyan-400 text-[#071317] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-cyan-400/50 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                      <span className="text-cyan-300 text-sm font-bold tracking-wider uppercase mb-2 block">2023 — 2027</span>
                      <h3 className="text-xl font-bold text-white mb-2">B.Tech Information Technology</h3>
                      <p className="text-slate-400 mb-5 font-medium">Government College of Engineering, Erode</p>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-sm font-bold text-cyan-200 shadow-sm">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        CGPA: 7.63
                      </div>
                    </div>
                  </RevealWrapper>

                  <RevealWrapper delay={200} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mt-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#071317] bg-slate-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300 group-hover:bg-cyan-400"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-cyan-400/30 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                      <span className="text-cyan-300/80 text-sm font-bold tracking-wider uppercase mb-2 block">12th Grade</span>
                      <h3 className="text-xl font-bold text-white mb-2">Higher Secondary</h3>
                      <p className="text-slate-400 mb-5 font-medium">RamaKrishna Higher Secondary School, Tirupattur</p>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-slate-300 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        Percentage: 82.6%
                      </div>
                    </div>
                  </RevealWrapper>
                </div>
              </div>

              <div>
                <RevealWrapper>
                  <h2 className="text-3xl font-bold text-white mb-10 flex items-center gap-3">
                    <span className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
                      <Briefcase size={28} />
                    </span>
                    Leadership &amp; Experience
                  </h2>
                </RevealWrapper>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-amber-400/50 before:to-transparent">
                  <RevealWrapper delay={100} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#071317] bg-amber-400 text-[#071317] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-amber-400/50 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.14)]">
                      <span className="text-amber-300 text-sm font-bold tracking-wider uppercase mb-2 block">Niral Thiruviza</span>
                      <h3 className="text-xl font-bold text-white mb-1">Team Lead</h3>
                      <p className="text-slate-400 mb-5 font-medium border-b border-white/10 pb-4">Software Development (SkillSyncAi)</p>
                      <ul className="space-y-3 text-sm text-slate-300 font-medium">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Led a 4-member team to architect and build a cross-platform application
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Spearheaded the development of SkillSyncAi as both a Web and Mobile App
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Coordinated task delegation and seamless integration across frontend and backend
                        </li>
                      </ul>
                    </div>
                  </RevealWrapper>

                  <RevealWrapper delay={200} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mt-8">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#071317] bg-amber-400/60 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-125 transition-transform duration-300 group-hover:bg-amber-300"></div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/[0.02] border border-white/10 group-hover:border-amber-400/30 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.1)]">
                      <span className="text-amber-300/80 text-sm font-bold tracking-wider uppercase mb-2 block">Hackxpo&apos;26</span>
                      <h3 className="text-xl font-bold text-white mb-1">Expo Head</h3>
                      <p className="text-slate-400 mb-5 font-medium border-b border-white/10 pb-4">Event Coordination &amp; Management</p>
                      <ul className="space-y-3 text-sm text-slate-300 font-medium">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Led a dedicated team of 4 members
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Coordinated end-to-end project execution and strategic planning
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-300" />
                          Ensured timely completion of deliverables and event success
                        </li>
                      </ul>
                    </div>
                  </RevealWrapper>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-24 px-6 bg-[#08191d] border-t border-white/5 relative overflow-hidden">
          <div className="container mx-auto max-w-6xl relative z-10">
            <RevealWrapper>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Let&apos;s Build Something Together</h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                  Whether you&apos;re looking for a dedicated developer to join your team or need help bringing an idea to life from backend to frontend, I&apos;m ready to contribute.
                </p>
              </div>
            </RevealWrapper>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <RevealWrapper delay={100}>
                  <div
                    className="transition-transform duration-200 ease-out"
                    style={{ transform: `translate(${parallaxX * 0.4}px, ${parallaxY * 0.4}px)` }}
                  >
                    <a href="mailto:naveedsha269@gmail.com" className="relative group block p-6 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 flex items-center gap-5 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_15px_30px_rgba(34,211,238,0.18)] cursor-pointer overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-teal-400/20 border border-cyan-400/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-[inset_0_0_15px_rgba(34,211,238,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(34,211,238,0.35)]">
                        <Mail size={24} className="group-hover:fill-cyan-400/20 transition-all duration-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-bold mb-1 uppercase tracking-widest group-hover:text-cyan-200 transition-colors">Email</p>
                        <p className="text-white font-medium break-all group-hover:text-cyan-300 transition-colors">
                          naveedsha269@gmail.com
                        </p>
                      </div>
                    </a>
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={200}>
                  <div
                    className="transition-transform duration-200 ease-out"
                    style={{ transform: `translate(${parallaxX * -0.3}px, ${parallaxY * -0.3}px)` }}
                  >
                    <a href="tel:+917708325976" className="relative group block p-6 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 flex items-center gap-5 transition-all duration-500 hover:-translate-y-2 hover:border-amber-400/50 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_15px_30px_rgba(245,158,11,0.16)] cursor-pointer overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-300/20 border border-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(245,158,11,0.35)]">
                        <Phone size={24} className="group-hover:fill-amber-400/20 transition-all duration-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-bold mb-1 uppercase tracking-widest group-hover:text-amber-200 transition-colors">Phone</p>
                        <p className="text-white font-medium group-hover:text-amber-300 transition-colors">
                          +91 7708325976
                        </p>
                      </div>
                    </a>
                  </div>
                </RevealWrapper>

                <RevealWrapper delay={300}>
                  <div
                    className="transition-transform duration-200 ease-out"
                    style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * -0.2}px)` }}
                  >
                    <a href="https://wa.me/917708325976" target="_blank" rel="noreferrer" className="relative group block p-6 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 flex items-center gap-5 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_15px_30px_rgba(52,211,153,0.18)] cursor-pointer overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-teal-300/20 border border-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-[15deg] transition-all duration-300 shadow-[inset_0_0_15px_rgba(52,211,153,0.1)] group-hover:shadow-[inset_0_0_25px_rgba(52,211,153,0.35)]">
                        <MessageCircle size={24} className="group-hover:fill-emerald-400/20 transition-all duration-300" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-bold mb-1 uppercase tracking-widest group-hover:text-emerald-200 transition-colors">WhatsApp</p>
                        <p className="text-white font-medium group-hover:text-emerald-300 transition-colors">
                          +91 7708325976
                        </p>
                      </div>
                    </a>
                  </div>
                </RevealWrapper>

                <div className="flex gap-4 pt-4">
                  <RevealWrapper delay={400} className="flex-1">
                    <a href="https://github.com/Naveed-Ahmed-21" target="_blank" rel="noreferrer" className="relative group block p-6 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/35 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_15px_30px_rgba(34,211,238,0.08)] text-center overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>

                      <Github className="mx-auto mb-3 text-slate-400 group-hover:text-white group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" size={32} />
                      <span className="text-sm font-bold tracking-wider text-slate-400 uppercase group-hover:text-white transition-colors">GitHub</span>
                    </a>
                  </RevealWrapper>
                  <RevealWrapper delay={500} className="flex-1">
                    <a href="https://linkedin.com/in/naveedahmedk" target="_blank" rel="noreferrer" className="relative group block p-6 rounded-2xl bg-[#071317]/80 backdrop-blur-md border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 active:scale-95 touch-manipulation shadow-lg hover:shadow-[0_15px_30px_rgba(52,211,153,0.18)] text-center overflow-hidden z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out -z-10"></div>

                      <Linkedin className="mx-auto mb-3 text-slate-400 group-hover:text-emerald-300 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300" size={32} />
                      <span className="text-sm font-bold tracking-wider text-slate-400 uppercase group-hover:text-emerald-200 transition-colors">LinkedIn</span>
                    </a>
                  </RevealWrapper>
                </div>
              </div>

              <RevealWrapper delay={300} className="flex justify-center relative lg:justify-end">
                <div className="relative w-full max-w-[360px] h-[700px] rounded-[3.5rem] border-[12px] border-slate-800 bg-[#060c18] shadow-[0_0_50px_rgba(34,211,238,0.14)] animate-[float-phone_8s_ease-in-out_infinite] overflow-hidden group hover:shadow-[0_0_80px_rgba(34,211,238,0.24)] transition-shadow duration-500 flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/10 to-cyan-400/10 pointer-events-none"></div>

                  <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-30">
                    <div className="w-32 h-full bg-slate-800 rounded-b-3xl flex items-center justify-center gap-2 px-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_5px_#10b981]"></div>
                      <div className="w-12 h-1.5 rounded-full bg-[#08191d]"></div>
                    </div>
                  </div>

                  <div className="pt-12 pb-4 px-6 bg-[#071317]/90 backdrop-blur-md border-b border-white/5 flex items-center gap-4 relative z-20">
                    <button className="p-1 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 transition-all">
                      <ChevronLeft size={22} className="text-slate-300" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 p-[2px]">
                        <div className="w-full h-full bg-[#071317] rounded-full flex items-center justify-center">
                          <UserCircle size={28} className="text-white/80" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm leading-tight">Naveed Ahmed</h3>
                        <p className="text-emerald-400 text-[10px] font-semibold tracking-wide uppercase flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Available
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    className="flex-1 p-5 space-y-4 flex flex-col relative z-20 overflow-y-auto overflow-x-hidden no-scrollbar"
                    onSubmit={handleContactSubmit}
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 shadow-sm w-[90%] mb-2">
                      👋 Hi! Drop your details below and let&apos;s discuss how I can help your team.
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20 transition-all text-sm"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Message</label>
                      <textarea
                        name="message"
                        required
                        className="w-full flex-1 min-h-[100px] px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20 transition-all resize-none text-sm"
                        placeholder="Type your message here..."
                      ></textarea>
                    </div>

                    <div className="pt-2 pb-4">
                      <button
                        type="submit"
                        className="relative group overflow-hidden w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-[#041014] font-bold tracking-wide transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.28)] active:scale-95 touch-manipulation flex justify-center items-center"
                      >
                        <span className="absolute top-0 left-0 w-full h-full bg-white/20 skew-x-[-45deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-out"></span>
                        <span className="relative flex items-center gap-2">Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" /></span>
                      </button>
                    </div>

                    <div className="w-1/3 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1"></div>
                  </form>
                </div>
              </RevealWrapper>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#040d10] py-8 text-center relative z-10">
        <div className="container mx-auto px-6">
          <p className="text-slate-500 text-sm font-medium hover:text-white transition-colors duration-300">
            © {new Date().getFullYear()} Naveed Ahmed K. All rights reserved.
          </p>
        </div>
      </footer>

      <div className={`fixed bottom-24 right-6 md:right-8 w-[calc(100vw-3rem)] sm:w-96 bg-[#071317]/95 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl z-50 transition-all duration-500 origin-bottom-right flex flex-col ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-cyan-500/20 to-emerald-400/20 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-300">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Naveed&apos;s AI Assistant</h3>
              <p className="text-[10px] text-emerald-200">Powered by Gemini ✨</p>
            </div>
          </div>
          <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div ref={chatScrollRef} className="h-80 overflow-y-auto p-4 space-y-4 flex-1 scroll-smooth">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-[#041014] rounded-br-sm' : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isAiTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-bl-sm flex gap-2 items-center">
                <Loader2 size={16} className="animate-spin text-cyan-300" />
                <span className="text-xs text-slate-400">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#071317] rounded-b-3xl">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me about his skills..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all"
            />
            <button
              type="submit"
              disabled={isAiTyping || !chatInput.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 text-[#041014] hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cyan-500/20 flex items-center justify-center w-11"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => scrollTo('home')}
        className={`fixed bottom-8 right-8 p-4 rounded-full bg-emerald-400 text-[#041014] shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all duration-300 hover:bg-cyan-400 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] z-50 ${
          showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
        }`}
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
}
