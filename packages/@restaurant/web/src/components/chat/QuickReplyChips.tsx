/**
 * QUICK REPLY CHIPS COMPONENT
 * 
 * Displays contextual suggestion chips/pills that appear after bot messages
 * allowing users to quickly respond with pre-defined options
 */

interface QuickReplyChip {
  id: string;
  text: string;
  icon?: string;
}

interface QuickReplyChipsProps {
  chips: QuickReplyChip[];
  onChipClick: (text: string) => void;
  isVisible?: boolean;
}

export default function QuickReplyChips({
  chips,
  onChipClick,
  isVisible = true
}: QuickReplyChipsProps) {
  if (!isVisible || chips.length === 0) {
    return null;
  }

  return (
    <div className="quick-reply-chips-container">
      <div className="quick-reply-chips-scroll">
        {chips.map((chip, index) => (
          <button
            key={chip.id || index}
            className="quick-reply-chip"
            onClick={() => onChipClick(chip.text)}
            title={chip.text}
          >
            {chip.icon && <span className="chip-icon">{chip.icon}</span>}
            <span className="chip-text">{chip.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
