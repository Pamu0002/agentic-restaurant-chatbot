import { motion } from 'framer-motion'
import {
    Calendar,
    Clock,
    DollarSign,
    Eye,
    MapPin,
    Navigation,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface RestaurantCardProps {
  restaurant: {
    id: string
    name: string
    cuisine: string
    rating: number
    reviews: number
    address: string
    distance: string
    isOpen: boolean
    closingTime?: string
    priceLevel: string
    availability: string
    features: string[]
    description: string
    emoji: string
  }
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate()

  return (
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
        duration: 0.3,
      }}
      className="w-full max-w-[350px] bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] my-2"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-4 flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-[60px] h-[60px] bg-white/15 rounded-lg flex items-center justify-center text-3xl shrink-0">
            {restaurant.emoji}
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight mb-1">
              {restaurant.name}
            </h3>
            <p className="text-[11px] text-white/70 leading-tight">
              {restaurant.cuisine}
            </p>
          </div>
        </div>
        <div className="bg-black/20 px-2 py-1 rounded-md flex flex-col items-center shrink-0">
          <span className="text-xs font-bold text-white">
            ⭐ {restaurant.rating}
          </span>
          <span className="text-[10px] text-white/70">
            ({restaurant.reviews})
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 bg-transparent">
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{restaurant.address}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Navigation size={14} className="shrink-0" />
            <span>{restaurant.distance} away</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Clock
              size={14}
              className={restaurant.isOpen ? 'text-teal-400' : 'text-red-400'}
              shrink-0
            />
            <span
              className={restaurant.isOpen ? 'text-teal-400' : 'text-red-400'}
            >
              {restaurant.isOpen
                ? `Open until ${restaurant.closingTime}`
                : 'Closed'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <DollarSign size={14} className="text-slate-400 shrink-0" />
            <span className="text-slate-300 mr-2">{restaurant.priceLevel}</span>
            <span
              className={`text-[11px] px-1.5 py-0.5 rounded ${restaurant.availability.includes('available') ? 'bg-teal-500/10 text-teal-400' : 'bg-red-500/10 text-red-400'}`}
            >
              {restaurant.availability}
            </span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {restaurant.features.map((feature, idx) => (
            <span
              key={idx}
              className="text-[9px] bg-teal-500/20 border border-teal-500/30 text-teal-300 rounded px-1.5 py-1"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-300 line-clamp-2 mb-1">
          {restaurant.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-3 bg-white/[0.02] border-t border-white/5 grid grid-cols-2 gap-2">
        <button
          onClick={() => navigate('/reserve')}
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold py-2.5 rounded-md hover:brightness-110 hover:shadow-md transition-all duration-150"
        >
          <Calendar size={14} />
          Book Table
        </button>
        <button className="flex items-center justify-center gap-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium py-2.5 rounded-md hover:bg-teal-500 hover:text-white transition-all duration-150">
          <Eye size={14} />
          Details
        </button>
      </div>
    </motion.div>
  )
}
