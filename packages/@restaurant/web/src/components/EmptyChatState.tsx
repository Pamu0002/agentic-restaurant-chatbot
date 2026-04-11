import { motion } from 'framer-motion'
import { Calendar, Flame, Leaf, Search } from 'lucide-react'

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

  const quickReplies = [
    { text: 'Find Restaurants', icon: '🔍' },
    { text: 'Book a Table', icon: '📅' },
    { text: 'View Map', icon: '🗺️' },
    { text: 'Top Rated', icon: '⭐' },
  ]

  return (
    <div className="empty-chat-state">
      {/* Avatar & Greeting */}
      <div className="empty-chat-greeting">
        <motion.div
          className="empty-chat-avatar"
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

        <h2 className="empty-chat-title">
          Hi {userName}! 👋
        </h2>
        <p className="empty-chat-subtitle">
          I'm your personal restaurant assistant.
        </p>
        <p className="empty-chat-description">
          Know the best dining spots, book your favorite tables, and discover
          new cuisine. I'm here to make dining easy!
        </p>
      </div>

      {/* Quick Start Cards */}
      <div className="empty-chat-cards">
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
            className="empty-chat-card"
          >
            <div className="empty-chat-card-icon">
              {card.icon}
            </div>
            <h3 className="empty-chat-card-title">
              {card.title}
            </h3>
            <p className="empty-chat-card-description">{card.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Quick Replies at bottom */}
      <div className="empty-chat-quick-replies">
        {quickReplies.map((reply, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => onQuickStart(reply.text)}
            className="quick-reply-chip"
          >
            <span className="quick-reply-icon">{reply.icon}</span>
            {reply.text}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
