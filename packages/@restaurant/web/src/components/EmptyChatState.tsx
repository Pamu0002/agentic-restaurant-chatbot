import { motion } from 'framer-motion'
import { Calendar, Flame, Leaf, Lightbulb, Search } from 'lucide-react'

interface EmptyChatStateProps {
  onSuggestionClick: (text: string) => void
  userName?: string
}

export default function EmptyChatState({
  onSuggestionClick,
  userName = 'Guest',
}: EmptyChatStateProps) {
  const cards = [
    {
      icon: <Search size={24} className="text-white" />,
      title: 'Find Italian Restaurants',
      description: 'Search by cuisine & location',
      query: 'Find Italian restaurants near me',
    },
    {
      icon: <Calendar size={24} className="text-white" />,
      title: 'Book a Table',
      description: 'Reserve your spot',
      query: 'I want to book a table for 2 tonight',
    },
    {
      icon: <Leaf size={24} className="text-white" />,
      title: 'Vegan Options',
      description: 'Find plant-based dining',
      query: 'Show me the best vegan restaurants',
    },
    {
      icon: <Flame size={24} className="text-white" />,
      title: 'Trending Now',
      description: 'Popular restaurants',
      query: 'What are the trending restaurants right now?',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto py-10 px-4 md:px-8">
      {/* Avatar & Greeting */}
      <div className="flex flex-col items-center text-center mb-10">
        <motion.div
          className="w-20 h-20 rounded-full bg-teal-500/15 border-2 border-teal-500 flex items-center justify-center text-4xl mb-6 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: 1,
            ease: 'easeInOut',
          }}
        >
          👨‍🍳
        </motion.div>

        <h2 className="text-3xl font-bold text-white mb-2">
          Hi {userName}! 👋
        </h2>
        <p className="text-lg text-slate-400 mb-1">
          I'm your personal restaurant assistant.
        </p>
        <p className="text-base text-slate-300 max-w-lg">
          Know the best dining spots, book your favorite tables, and discover
          new cuisine. I'm here to make dining easy!
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-10">
        {cards.map((card, idx) => (
          <motion.button
            key={idx}
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.5,
              delay: idx * 0.1,
            }}
            onClick={() => onSuggestionClick(card.query)}
            className="flex flex-col items-start text-left bg-teal-500/10 border border-teal-500/20 p-6 rounded-xl hover:bg-teal-500/20 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(20,184,166,0.15)] transition-all duration-200 group"
          >
            <div className="mb-3 p-2 bg-teal-500/20 rounded-lg group-hover:bg-teal-500/30 transition-colors">
              {card.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {card.title}
            </h3>
            <p className="text-sm text-slate-400">{card.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Helpful Tip */}
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
          delay: 0.6,
        }}
        className="flex items-start gap-3 bg-blue-500/10 border border-blue-500/20 border-l-[3px] border-l-blue-500 p-4 rounded-lg w-full"
      >
        <Lightbulb size={20} className="text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="font-semibold text-blue-300">Tip:</span> Tell me what
          kind of food you're craving and I'll suggest the best restaurants!
        </p>
      </motion.div>
    </div>
  )
}
