import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

/**
 * Game model: simplified core loop to support UI.
 * Team size 5, shop offers pets and food. Provides roll, freeze, buy, sell,
 * drag-rearrange, merge/level, and simulated battle with basic log.
 */

const defaultPets = [
  { id: 'ant', name: 'Ant', emoji: '🐜', atk: 2, hp: 1 },
  { id: 'fish', name: 'Fish', emoji: '🐟', atk: 2, hp: 3 },
  { id: 'beaver', name: 'Beaver', emoji: '🦫', atk: 3, hp: 2 },
  { id: 'cricket', name: 'Cricket', emoji: '🦗', atk: 1, hp: 2 },
  { id: 'otter', name: 'Otter', emoji: '🦦', atk: 2, hp: 2 },
  { id: 'horse', name: 'Horse', emoji: '🐴', atk: 2, hp: 1 },
];

const foods = [
  { id: 'apple', name: 'Apple', emoji: '🍎', effect: { hp: +1, atk: +1 }, cost: 3 },
  { id: 'meat', name: 'Meat Bone', emoji: '🍖', effect: { atk: +3 }, cost: 3 },
  { id: 'honey', name: 'Honey', emoji: '🍯', effect: { perk: 'bee' }, cost: 3 },
];

const initialUser = { id: 'guest', username: 'Guest' };
const initialTeam = [null, null, null, null, null];

const GameContext = createContext(null);

// PUBLIC_INTERFACE
export function useGame() {
  /** Access game context */
  return useContext(GameContext);
}

// PUBLIC_INTERFACE
export function GameProvider({ children }) {
  /** Provides game state and actions to the app. */
  const [user, setUser] = useState(initialUser);
  const [gold, setGold] = useState(10);
  const [turn, setTurn] = useState(1);
  const [lives, setLives] = useState(10);
  const [trophies, setTrophies] = useState(0);

  const [team, setTeam] = useState(initialTeam);
  const [shop, setShop] = useState({ items: [], frozen: {} });
  const [battleLog, setBattleLog] = useState([]);

  const maxTeam = 5;

  const rollShop = useCallback(() => {
    if (gold < 1) return;
    setGold(g => g - 1);
    setShop(prev => {
      const newItems = prev.items.map((it, idx) => prev.frozen[idx] ? it : null);
      const available = [...defaultPets, ...foods];
      const rolled = newItems.map(it => it ?? randomPick(available));
      return { ...prev, items: rolled };
    });
  }, [gold]);

  const freezeItem = useCallback((index) => {
    setShop(prev => ({ ...prev, frozen: { ...prev.frozen, [index]: !prev.frozen[index] } }));
  }, []);

  const nextTurn = useCallback(() => {
    setTurn(t => t + 1);
    setGold(10);
    setShop(prev => ({ items: prev.items.map((_, idx) => prev.frozen[idx] ? prev.items[idx] : randomPick([...defaultPets, ...foods])), frozen: {} }));
  }, []);

  const resetRun = useCallback(() => {
    setGold(10); setTurn(1); setLives(10); setTrophies(0);
    setTeam(initialTeam); setShop({ items: [], frozen: {} });
    setBattleLog([]);
  }, []);

  const startRun = useCallback(() => {
    // Initialize shop first time
    setShop({ items: Array.from({ length: 6 }, () => randomPick([...defaultPets, ...foods])), frozen: {} });
    setGold(10);
  }, []);

  const buyFromShop = useCallback((index, targetSlot = null) => {
    const item = shop.items[index];
    if (!item) return;
    const isFood = foods.find(f => f.id === item.id);
    const cost = isFood ? item.cost : 3;
    if (gold < cost) return;

    if (isFood) {
      // Food must target an occupied slot
      if (targetSlot == null || !team[targetSlot]) return;
      const t = team.slice();
      const target = { ...t[targetSlot] };
      if (item.effect.atk) target.atk += item.effect.atk;
      if (item.effect.hp) target.hp += item.effect.hp;
      if (item.effect.perk) target.perk = item.effect.perk;
      t[targetSlot] = target;
      setTeam(t);
    } else {
      // Pet purchase: place in first empty slot or specified slot
      const t = team.slice();
      let slot = targetSlot != null ? targetSlot : t.findIndex(s => s === null);
      if (slot === -1) return; // team full
      // Merge if same pet exists in slot
      if (t[slot] && t[slot].id === item.id) {
        const merged = { ...t[slot], atk: t[slot].atk + 1, hp: t[slot].hp + 1, level: (t[slot].level || 1) + 0.5 };
        if (merged.level >= 3) merged.level = 3;
        t[slot] = merged;
      } else {
        t[slot] = { ...item, level: 1 };
      }
      setTeam(t);
    }
    // consume shop item and pay
    setGold(g => g - cost);
    setShop(prev => {
      const items = prev.items.slice();
      items[index] = null;
      return { ...prev, items };
    });
  }, [gold, shop.items, team]);

  const sellPet = useCallback((slotIndex) => {
    const t = team.slice();
    const pet = t[slotIndex];
    if (!pet) return;
    const refund = Math.max(1, Math.floor((pet.level || 1)));
    t[slotIndex] = null;
    setTeam(t);
    setGold(g => g + refund);
  }, [team]);

  const movePet = useCallback((from, to) => {
    if (from === to) return;
    const t = team.slice();
    const a = t[from]; const b = t[to];
    t[to] = a;
    t[from] = b || null;
    setTeam(t);
  }, [team]);

  const mergePets = useCallback((from, to) => {
    const t = team.slice();
    const a = t[from]; const b = t[to];
    if (!a || !b || a.id !== b.id) return;
    const merged = { ...b, atk: b.atk + a.atk, hp: b.hp + a.hp, level: Math.min(3, (b.level || 1) + (a.level || 1)) };
    t[to] = merged;
    t[from] = null;
    setTeam(t);
  }, [team]);

  const startBattle = useCallback(() => {
    // Basic mirror battle for demo: fight against copy of team
    const left = team.filter(Boolean).map(p => ({ ...p }));
    if (!left.length) return;
    const right = left.map(p => ({ ...p })); // mirror opponent
    const log = [];
    let i = 0, j = 0;
    log.push('Battle begins!');
    while (i < left.length && j < right.length && log.length < 200) {
      const L = left[i], R = right[j];
      log.push(`${L.name} (${L.atk}/${L.hp}) vs ${R.name} (${R.atk}/${R.hp})`);
      R.hp -= L.atk;
      L.hp -= R.atk;
      if (R.hp <= 0) { log.push(`❌ ${R.name} faints`); j++; }
      if (L.hp <= 0) { log.push(`❌ ${L.name} faints`); i++; }
    }
    const win = j >= right.length && i < left.length;
    const lose = i >= left.length && j < right.length;
    const draw = i >= left.length && j >= right.length;
    if (win) { log.push('🎉 Victory!'); setTrophies(t => t + 1); }
    else if (lose) { log.push('💥 Defeat'); setLives(l => Math.max(0, l - 1)); }
    else { log.push('🤝 Draw'); }
    setBattleLog(log);
    // Refresh shop for next turn and reset gold
    setGold(10);
  }, [team]);

  const value = useMemo(() => ({
    user, setUser,
    gold, turn, lives, trophies,
    team, shop, battleLog,
    startRun, nextTurn, resetRun,
    rollShop, freezeItem, buyFromShop, sellPet,
    movePet, mergePets, startBattle,
    maxTeam,
  }), [user, gold, turn, lives, trophies, team, shop, battleLog, startRun, nextTurn, resetRun, rollShop, freezeItem, buyFromShop, sellPet, movePet, mergePets, startBattle]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
