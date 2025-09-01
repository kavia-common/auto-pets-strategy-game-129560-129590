import React from 'react';

// PUBLIC_INTERFACE
export default function PetCard({ pet }) {
  /** Render a pet card with stats and level. */
  if (!pet) return null;
  return (
    <div className="pet" aria-label={`${pet.name} attack ${pet.atk}, health ${pet.hp}`}>
      <div className="name"><span className="emoji" role="img" aria-label={pet.name}>{pet.emoji}</span> {pet.name}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {pet.perk && <span className="badge">🧰 {pet.perk}</span>}
      </div>
      <div className="stats">
        <span className="stat atk">⚔️ {pet.atk}</span>
        <span className="stat hp">🛡️ {pet.hp}</span>
      </div>
      <span className="level" aria-label={`Level ${pet.level || 1}`}>Lv {pet.level || 1}</span>
    </div>
  );
}
