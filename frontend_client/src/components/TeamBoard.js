import React from 'react';
import PetCard from './PetCard';
import { useDragDrop } from '../hooks/useDrag';
import { useGame } from '../context/GameContext';

// PUBLIC_INTERFACE
export default function TeamBoard() {
  /** Player team board with 5 slots, supports drag to rearrange and merge. */
  const { team, movePet, mergePets, sellPet, maxTeam } = useGame();
  const { dragIndex, draggableProps, droppableProps } = useDragDrop();

  const handleDrop = (from, to) => {
    const a = team[from], b = team[to];
    if (a && b && a.id === b.id) mergePets(from, to);
    else movePet(from, to);
  };

  return (
    <div className="team-row" role="list" aria-label="Your Team">
      {Array.from({ length: maxTeam }).map((_, idx) => {
        const occupied = !!team[idx];
        return (
          <div
            key={idx}
            className={`slot ${occupied ? 'occupied' : ''} ${dragIndex === idx ? 'drop-target' : ''}`}
            role="listitem"
            {...droppableProps(idx, handleDrop)}
          >
            {occupied ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }} {...draggableProps(idx)}>
                <PetCard pet={team[idx]} />
                <button
                  className="btn btn-ghost"
                  style={{ position: 'absolute', bottom: 6, right: 6, fontSize: 12 }}
                  onClick={() => sellPet(idx)}
                  aria-label={`Sell ${team[idx].name}`}
                >
                  Sell (+🪙)
                </button>
              </div>
            ) : (
              <span aria-hidden="true" style={{ color: '#9ca3af', fontSize: 12 }}>Empty</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
