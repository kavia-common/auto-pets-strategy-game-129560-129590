import React from 'react';
import { useGame } from '../context/GameContext';

// PUBLIC_INTERFACE
export default function Shop() {
  /** Shop with 6 items. Supports buy, freeze, roll. */
  const { shop, rollShop, freezeItem, buyFromShop, team } = useGame();

  const buy = (index) => {
    // If food, require a target: pick first occupied by default for now
    buyFromShop(index, team.findIndex(Boolean) !== -1 ? team.findIndex(Boolean) : 0);
  };

  return (
    <div className="shop" role="region" aria-label="Shop">
      <div className="section-title">
        <span>Shop Phase</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={rollShop} aria-label="Roll shop">Roll (1)</button>
        </div>
      </div>
      <div className="shop-items">
        {shop.items.map((item, idx) => (
          <div key={idx} className={`shop-card ${shop.frozen[idx] ? 'frozen' : ''}`} role="group" aria-label={`Shop slot ${idx + 1}`}>
            {item ? (
              <>
                <button className="freeze" onClick={() => freezeItem(idx)} aria-pressed={!!shop.frozen[idx]} aria-label={`Toggle freeze ${item.name}`}>
                  {shop.frozen[idx] ? 'Frozen ❄️' : 'Freeze'}
                </button>
                <div className="name">{item.emoji} {item.name}</div>
                <div className="cost">Cost: 🪙 {item.cost || 3}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {'atk' in item ? <span className="badge">ATK {item.atk}</span> : null}
                  {'hp' in item ? <span className="badge">HP {item.hp}</span> : null}
                  {item.effect && item.effect.perk ? <span className="badge">Perk {item.effect.perk}</span> : null}
                </div>
                <button className="btn btn-accent" onClick={() => buy(idx)} aria-label={`Buy ${item.name}`}>Buy</button>
              </>
            ) : (
              <div className="name" style={{ color: '#9ca3af' }}>Empty</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
