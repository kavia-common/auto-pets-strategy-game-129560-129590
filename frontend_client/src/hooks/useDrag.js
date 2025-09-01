import { useCallback, useRef, useState } from 'react';

/**
 * Simple drag hook for keyboard and mouse.
 * Returns props to spread on draggable elements and drop targets.
 */

// PUBLIC_INTERFACE
export function useDragDrop() {
  const [dragIndex, setDragIndex] = useState(null);
  const [isKeyboard, setIsKeyboard] = useState(false);

  const onDragStart = useCallback((index) => setDragIndex(index), []);
  const onDragEnd = useCallback(() => setDragIndex(null), []);

  const draggableProps = (index) => ({
    draggable: true,
    onDragStart: (e) => { e.dataTransfer.setData('text/plain', String(index)); onDragStart(index); },
    onDragEnd,
    onKeyDown: (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsKeyboard(true);
        setDragIndex(d => (d === index ? null : index));
      }
    },
    tabIndex: 0,
    'aria-grabbed': dragIndex === index ? 'true' : 'false',
    role: 'button',
  });

  const droppableProps = (index, onDrop) => ({
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData('text/plain'));
      onDrop(from, index);
      onDragEnd();
    },
    onKeyDown: (e) => {
      if ((e.key === ' ' || e.key === 'Enter') && isKeyboard && dragIndex != null) {
        onDrop(dragIndex, index);
        onDragEnd();
        setIsKeyboard(false);
      }
    },
    'aria-dropeffect': 'move',
  });

  return { dragIndex, draggableProps, droppableProps };
}
