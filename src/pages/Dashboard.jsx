import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Participants from '../components/Participants';
import Cart from '../components/Cart';
import ActivityLog from '../components/ActivityLog';
import Receipt from '../components/Receipt';
import { getRoom, saveRoom, addLogEntry } from '../utils/storageUtils';

/**
 * Dashboard page coordinating child components: Cart, Participants,
 * ActivityLog, and Receipt. It contains the central state and 
 * listens to window storage events to support multi-tab sync.
 */
export default function Dashboard({ username, roomCode, onLeaveRoom, isDarkMode, toggleDarkMode }) {
  const [roomData, setRoomData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Sync state and establish storage event listeners
  useEffect(() => {
    if (!roomCode || !username) return;

    const syncRoomData = () => {
      const room = getRoom(roomCode);
      if (room) {
        // Double check if participant is in the list
        const userExists = room.participants.some(p => p.name.toLowerCase() === username.toLowerCase());
        let updatedRoom = room;

        if (!userExists) {
          const newParticipant = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: username,
            joinedAt: new Date().toISOString()
          };
          updatedRoom = {
            ...room,
            participants: [...room.participants, newParticipant]
          };
          saveRoom(roomCode, updatedRoom);
          
          // Log joining event
          const loggedRoom = addLogEntry(roomCode, username, 'joined', 'the room');
          setRoomData(loggedRoom || updatedRoom);
          return;
        }
        setRoomData(updatedRoom);
      }
    };

    // Load initial room
    syncRoomData();

    // Listen to changes from other tabs
    const handleStorageChange = (e) => {
      // Key format: cartshare_room_<ROOMCODE>
      if (e.key === `cartshare_room_${roomCode.toUpperCase()}`) {
        if (e.newValue) {
          setRoomData(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [roomCode, username]);

  if (!roomData) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-slate-500">Loading collaborative room session...</p>
      </div>
    );
  }

  // State update wrapper to automate saving and logging
  const triggerStateUpdate = (updatedRoom, action, itemName) => {
    saveRoom(roomCode, updatedRoom);
    const finalRoom = addLogEntry(roomCode, username, action, itemName);
    setRoomData(finalRoom || updatedRoom);
  };

  const handleAddItem = (itemDetails) => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: itemDetails.name,
      quantity: itemDetails.quantity,
      price: itemDetails.price,
      addedBy: username,
      createdAt: new Date().toISOString()
    };

    const updatedRoom = {
      ...roomData,
      items: [...roomData.items, newItem]
    };

    triggerStateUpdate(updatedRoom, 'added', itemDetails.name);
  };

  const handleEditItem = (itemId, updatedDetails) => {
    const targetItem = roomData.items.find(i => i.id === itemId);
    if (!targetItem) return;

    let actionLabel = 'updated';
    if (targetItem.quantity !== updatedDetails.quantity && targetItem.name === updatedDetails.name) {
      actionLabel = 'updated quantity of';
    } else if (targetItem.price !== updatedDetails.price && targetItem.name === updatedDetails.name) {
      actionLabel = 'updated price of';
    }

    const updatedItems = roomData.items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          name: updatedDetails.name,
          quantity: updatedDetails.quantity,
          price: updatedDetails.price,
          updatedBy: username
        };
      }
      return item;
    });

    const updatedRoom = {
      ...roomData,
      items: updatedItems
    };

    triggerStateUpdate(updatedRoom, actionLabel, updatedDetails.name);
  };

  const handleDeleteItem = (itemId) => {
    const targetItem = roomData.items.find(i => i.id === itemId);
    if (!targetItem) return;

    const updatedItems = roomData.items.filter(item => item.id !== itemId);
    const updatedRoom = {
      ...roomData,
      items: updatedItems
    };

    triggerStateUpdate(updatedRoom, 'removed', targetItem.name);
  };

  const handleClearCart = () => {
    if (roomData.items.length === 0) return;
    
    const updatedRoom = {
      ...roomData,
      items: []
    };

    triggerStateUpdate(updatedRoom, 'cleared', 'the cart');
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Navigation Header */}
      <Navbar
        roomCode={roomCode}
        username={username}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Main Responsive Grid Layout */}
      <main className="mx-auto mt-6 max-w-7xl px-4">
        <div className="grid gap-6 lg:grid-cols-4">
          
          {/* Main Dashboard Section: Cart & Totals (Left Columns) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Cart
              items={roomData.items}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onClearCart={handleClearCart}
              onOpenReceipt={() => setIsReceiptOpen(true)}
              currentUsername={username}
            />
          </div>

          {/* Sidebar Section: Participants & Logs (Right Column) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Participants
              participants={roomData.participants}
              currentUsername={username}
            />
            <ActivityLog
              logs={roomData.activityLog}
            />
          </div>

        </div>
      </main>

      {/* Modal Receipt */}
      <Receipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        roomCode={roomCode}
        items={roomData.items}
        logs={roomData.activityLog}
      />

    </div>
  );
}
