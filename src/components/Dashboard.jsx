import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { moveCard, addCard, deleteCard } from '../redux/todoSlice';

const Dashboard = () => {
  const lists = useSelector((state) => state.todo.lists);
  const cards = useSelector((state) => state.todo.cards);
  const dispatch = useDispatch();

  // State for keeping track of the card content for each list
  const [newCardContent, setNewCardContent] = useState({});

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    dispatch(
      moveCard({
        source,
        destination,
        cardId: draggableId,
      })
    );
  };

  // Handle card content input change
  const handleInputChange = (listId, event) => {
    setNewCardContent({
      ...newCardContent,
      [listId]: event.target.value,
    });
  };

  // Handle adding new card
  const handleAddCard = (listId) => {
    const content = newCardContent[listId];
    if (content && content.trim() !== '') {
      dispatch(addCard({ listId, content }));
      setNewCardContent({
        ...newCardContent,
        [listId]: '', // Clear input after adding
      });
    }
  };

  const handleDeleteCard = (listId, cardId) => {
    dispatch(deleteCard({ listId, cardId }));
  };

  return (
    <div className="dashboard">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.keys(lists).map((listId) => (
          <Droppable droppableId={listId} key={listId}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="list">
                <h3>{lists[listId].title}</h3>
                {lists[listId].cards.map((cardId, index) => (
                  <Draggable key={cardId} draggableId={cardId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="card"
                      >
                        <p>{cards[cardId].content}</p>
                        <button onClick={() => handleDeleteCard(listId, cardId)}>Delete</button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Input for adding new cards */}
                <input
                  type="text"
                  placeholder="Add a new card"
                  value={newCardContent[listId] || ''}
                  onChange={(e) => handleInputChange(listId, e)}
                  className="add-card-input"
                />
                <button onClick={() => handleAddCard(listId)}>Add Card</button>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
