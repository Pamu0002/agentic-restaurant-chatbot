import { motion } from 'framer-motion'
import { Calendar, Flame, Leaf, Lightbulb, Search } from 'lucide-react'

interface EmptyChatStateProps {
  onQuickStart: (text: string) => void
  userName?: string
}

export default function EmptyChatState({
  onQuickStart,
  userName = 'Guest',
}: EmptyChatStateProps) {
  const cards = [
    {
      icon: <Search size={28} className="text-white" />,
      title: 'Find Italian Restaurants',
      description: 'Search by cuisine & location',
      query: 'Find Italian restaurants near me',
    },
    {
      icon: <Calendar size={28} className="text-white" />,
      title: 'Book a Table',
      description: 'Reserve your spot',
      query: 'I want to book a table for 2 tonight',
    },
    {
      icon: <Leaf size={28} className="text-white" />,
      title: 'Vegan Options',
      description: 'Find plant-based dining',
      query: 'Show me the best vegan restaurants',
    },
    {
      icon: <Flame size={28} className="text-white" />,
      title: 'Trending Now',
      description: 'Popular restaurants',
      query: 'What are the trending restaurants right now?',
    },
  ]

  return (
    <div className="empty-chat-state-cards">
      {/* Avatar & Greeting */}
      <div className="empty-chat-greeting-cards">
        <motion.div
          className="empty-chat-avatar-cards"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          👨‍🍳
        </motion.div>

        <h2 className="empty-chat-title-cards">
          Hi {userName}! 👋
        </h2>
        <p className="empty-chat-subtitle-cards">
          I'm your personal restaurant assistant.
        </p>
        <p className="empty-chat-description-cards">
          Know the best dining spots, book your favorite tables, and discover
          new cuisine. I'm here to make dining easy!
        </p>
      </div>

      {/* Grid Cards */}
      <div className="empty-chat-cards-grid">
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
            onClick={() => onQuickStart(card.query)}
            className="empty-chat-card-item"
          >
            <div className="card-icon-box">
              {card.icon}
            </div>
            <h3 className="card-title">
              {card.title}
            </h3>
            <p className="card-description">{card.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Tip Box */}
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
          delay: 0.5,
        }}
        className="empty-chat-tip-box-cards"
      >
        <Lightbulb size={20} className="tip-icon-cards" />
        <p className="tip-text-cards">
          Tip: Tell me what kind of food you're craving and I'll suggest the best restaurants!
        </p>
      </motion.div>
    </div>
  )
}
