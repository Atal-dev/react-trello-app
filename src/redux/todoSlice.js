import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lists: {
    'list-1': { id: 'list-1', title: 'To Do', cards: ['card-1', 'card-2'] },
    'list-2': { id: 'list-2', title: 'In Progress', cards: [] },
    'list-3': { id: 'list-3', title: 'Done', cards: [] },
  },
  cards: {
    'card-1': { id: 'card-1', content: 'Buy groceries' },
    'card-2': { id: 'card-2', content: 'Clean room' },
  },
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addCard: (state, action) => {
      const { listId, content } = action.payload;
      const newCardId = `card-${Date.now()}`;
      state.cards[newCardId] = { id: newCardId, content };
      state.lists[listId].cards.push(newCardId);
    },
    moveCard: (state, action) => {
      const { source, destination, cardId } = action.payload;

      const sourceList = state.lists[source.droppableId];
      const destinationList = state.lists[destination.droppableId];

      // Remove from source list
      sourceList.cards.splice(source.index, 1);

      // Add to destination list
      destinationList.cards.splice(destination.index, 0, cardId);
    },
    deleteCard: (state, action) => {
      const { listId, cardId } = action.payload;
      state.lists[listId].cards = state.lists[listId].cards.filter(id => id !== cardId);
      delete state.cards[cardId];
    },
  },
});

export const { addCard, moveCard, deleteCard } = todoSlice.actions;
export default todoSlice.reducer;
