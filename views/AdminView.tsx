import React, { useState, useEffect } from 'react';
import { Guest, Vendor, BudgetItem, EventDetails, Photo, Table as TableType, SongRequest } from '../types';
import { Users, DollarSign, Gift, LayoutGrid, Settings, Trash2, Download, CheckSquare, Search, Plus, X, UserPlus, Edit3, Save, User, Baby, Gamepad2, Music, Check } from 'lucide-react';
import { db } from '../firebase'; // Assuming we have access to db for updates in real implementation
import { doc, updateDoc, addDoc, collection, deleteDoc } from 'firebase/firestore';

interface AdminViewProps {
  guests: Guest[];
  budgetItems: BudgetItem[];
  vendors: Vendor[];
  eventDetails: EventDetails;
  photos: Photo[];
  songRequests?: SongRequest[];
  onUpdateEventDetails: (details: EventDetails) => void;
  onDeletePhoto: (id: string) => void;
  onDeleteSongRequest?: (id: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ guests, budgetItems, eventDetails, photos, songRequests = [], onUpdateEventDetails, onDeletePhoto, onDeleteSongRequest }) => {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'guests' | 'seating' | 'budget' | 'music'>('dashboard');
  const [settingsForm, setSettingsForm] = useState<EventDetails>(eventDetails);
  
  // --- Guest List State ---
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestInvitedCount, setNewGuestInvitedCount] = useState(1);
  const [guestSearch, setGuestSearch] = useState('');

  // --- Budget State ---
  const [newBudgetItem, setNewBudgetItem] = useState({ category: '', estimated: 0 });

  // --- Seating State ---
  const [tables, setTables] = useState<TableType[]>([
    { id: 't1', name: 'משפחה 1', type: 'round', capacity: 10 },
    { id: 't2', name: 'חברות של נועה', type: 'long', capacity: 20 },
  ]); // Mock initial tables, in real app fetch from DB
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [newTableType, setNewTableType] = useState<'round' | 'long'>('round');
  const [draggedGuestId, setDraggedGuestId] = useState<string | null>(null);

  // --- Table Editing State ---
  const [editingTableId, setEditingTableId] = useState<string | null>(null);
  const [editTableForm, setEditTableForm] = useState<TableType | null>(null);

  useEffect(() => { setSettingsForm(eventDetails); }, [eventDetails]);

  // --- Stats Calculations ---
  const confirmedGuests = guests.filter(g => g.attending).reduce((acc, curr) => acc + curr.guestsCount, 0);
  const totalInvited = guests.reduce((acc, curr) => acc + curr.invitedCount, 0); // Real invited count
  const confirmedCount = guests.filter(g => g.attending).length;
  const percent = totalInvited > 0 ? Math.round((confirmedGuests / totalInvited) * 100) : 0;
  
  const totalBudgetEst = budgetItems.reduce((acc, c) => acc + c.estimated, 0);
  const totalBudgetAct = budgetItems.reduce((acc, c) => acc + c.actual, 0);

  // --- Handlers ---

  const handleAddGuest = async () => {
    if (!newGuestName) return;
    const newGuest: Guest = {
      id: '', // Will be set by Firebase
      name: newGuestName,
      email: '',
      attending: null,
      guestsCount: 0,
      adultsCount: 0,
      childrenCount: 0,
      babiesCount: 0,
      invitedCount: newGuestInvitedCount,
      dietaryRestrictions: ''
    };
    try {
      await addDoc(collection(db, 'guests'), newGuest);
      setNewGuestName('');
      setNewGuestInvitedCount(1);
    } catch (e) { console.log("Demo: Guest added locally only"); }
  };

  const handleDeleteGuest = async (id: string) => {
    if(window.confirm('למחוק את האורח?')) {
        try { await deleteDoc(doc(db, 'guests', id)); } catch(e) {}
    }
  }

  const handleAddBudgetItem = async () => {
    if (!newBudgetItem.category) return;
    try {
      await addDoc(collection(db, 'budget'), {
        category: newBudgetItem.category,
        estimated: Number(newBudgetItem.estimated),
        actual: 0,
        paid: false
      });
      setNewBudgetItem({ category: '', estimated: 0 });
    } catch(e) {}
  };

  const handleDeleteBudgetItem = async (id: string) => {
      try { await deleteDoc(doc(db, 'budget', id)); } catch(e) {}
  };

  const handleUpdateBudget = async (id: string, field: string, value: any) => {
      try { await updateDoc(doc(db, 'budget', id), { [field]: value }); } catch(e) {}
  };

  const handleAddTable = () => {
    if(!newTableName) return;
    const newTable: TableType = {
        id: `t-${Date.now()}`,
        name: newTableName,
        type: newTableType,
        capacity: newTableType === 'round' ? 10 : 20
    };
    setTables([...tables, newTable]);
    setIsAddingTable(false);
    setNewTableName('');
  };

  const handleStartEditTable = (table: TableType) => {
    setEditingTableId(table.id);
    setEditTableForm({ ...table });
  };

  const handleSaveTable = () => {
    if (!editTableForm) return;
    setTables(prev => prev.map(t => t.id === editTableForm.id ? editTableForm : t));
    setEditingTableId(null);
    setEditTableForm(null);
  };

  const handleDeleteTable = (id: string) => {
    if(window.confirm('למחוק את השולחן?')) {
        // Unassign guests locally/optimistically
        guests.filter(g => g.tableId === id).forEach(g => handleAssignGuest(g.id, undefined));
        setTables(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAssignGuest = async (guestId: string, tableId: string | undefined) => {
     // In a real app, update Firebase
     try { await updateDoc(doc(db, 'guests', guestId), { tableId: tableId }); } catch(e) {}
  };

  const handleExportWA = () => {
    let text = "*רשימת מוזמנים - בת מצווה נועה*\n\n";
    guests.forEach(g => {
      const status = g.attending === true ? '✅ מגיע' : g.attending === false ? '❌ לא מגיע' : '❓ טרם השיב';
      text += `${g.name} (${g.invitedCount}): ${status}\n`;
    });
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const menuItems = [
    { id: 'dashboard', label: 'לוח בקרה' },
    { id: 'guests', label: 'מוזמנים' },
    { id: 'seating', label: 'הושבה' },
    { id: 'budget', label: 'תקציב' },
    { id: 'music', label: 'פלייליסט' }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans text-cyber-silver selection:bg-cyber-accent selection:text-white pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 glass-panel p-6 rounded-3xl gap-4">
        <div className="text-center md:text-right">
          <h1 className="text-3xl font-black text-white tracking-tight">ניהול <span className="text-cyber-accent">האירוע</span></h1>
          <p className="text-gray-400 text-sm mt-1 tracking-wide">{eventDetails.name} • {eventDetails.eventType}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {menuItems.map(m => (
            <button key={m.id} onClick={() => setActiveModule(m.id as any)} className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${activeModule === m.id ? 'bg-cyber-accent text-white shadow-lg shadow-cyber-accent/30 scale-105' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* --- DASHBOARD --- */}
      {activeModule === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6">
          {/* Main Counter */}
          <div className="md:col-span-2 md:row-span-2 glass-panel rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-cyber-base to-cyber-dark hover:scale-[1.01] hover:shadow-2xl transition-all duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-accent/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-3 mb-2 text-cyber-accent">
                <Users size={24} />
                <span className="font-bold tracking-widest uppercase text-xs">סטטוס אישורים</span>
              </div>
              <div className="flex items-end gap-2">
                <h2 className="text-7xl font-black text-white">{confirmedGuests}</h2>
                <span className="text-xl text-gray-400 mb-2">אורחים אישרו</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">מתוך {totalInvited} מוזמנים ברשימה ({confirmedCount} בתי אב)</p>
            </div>
            
            <div className="space-y-4 mt-8">
              <div className="flex justify-between text-sm font-bold">
                 <span>יעד תפוסה</span>
                 <span className="text-cyber-accent">{percent}%</span>
              </div>
              <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-cyber-accent to-cyber-neon transition-all duration-1000 shadow-[0_0_10px_rgba(167,139,250,0.5)]" style={{width: `${percent}%`}}></div>
              </div>
            </div>
          </div>

          {/* Budget Widget */}
          <div className="md:col-span-1 md:row-span-1 glass-panel rounded-[2rem] p-6 flex flex-col justify-center border-l-4 border-green-400 hover:scale-[1.02] hover:bg-white/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400"><DollarSign size={20} /></div>
               <span className="text-xs text-gray-500 font-bold uppercase">שולם</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">₪{totalBudgetAct.toLocaleString()}</h3>
            <p className="text-xs text-gray-400">צפי: ₪{totalBudgetEst.toLocaleString()}</p>
          </div>

           {/* Songs Widget (New) */}
           <div className="md:col-span-1 md:row-span-1 glass-panel rounded-[2rem] p-6 flex flex-col justify-center border-l-4 border-pink-400 cursor-pointer hover:bg-white/10 hover:scale-[1.02] transition-all duration-300" onClick={() => setActiveModule('music')}>
            <div className="flex items-center justify-between mb-4">
               <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center text-pink-400"><Music size={20} /></div>
               <span className="text-xs text-gray-500 font-bold uppercase">בקשות שירים</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{songRequests.length}</h3>
            <p className="text-xs text-gray-400">שירים ברשימה</p>
          </div>

          {/* Actions */}
          <div className="md:col-span-2 md:row-span-1 glass-panel rounded-[2rem] p-6 flex items-center gap-4">
             <button onClick={handleExportWA} className="flex-1 h-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors group">
               <Download className="text-[#25D366] group-hover:scale-110 transition-transform" />
               <span className="text-sm font-bold text-[#25D366]">דוח לוואטסאפ</span>
             </button>
             
             <div className="flex-1 h-full bg-white/5 rounded-2xl p-4 overflow-y-auto custom-scrollbar">
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">עריכה מהירה</h4>
                <div className="space-y-2">
                  <input value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full bg-black/20 p-2 rounded text-xs text-white border border-white/10 focus:border-cyber-accent outline-none" placeholder="שם החוגג/ת" />
                  <button onClick={(e) => { e.preventDefault(); onUpdateEventDetails(settingsForm); alert('נשמר'); }} className="w-full bg-cyber-accent text-white text-xs py-2 rounded font-bold hover:bg-cyber-neon">שמור שם אירוע</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- GUESTS MODULE --- */}
      {activeModule === 'guests' && (
        <div className="glass-panel rounded-[2rem] p-6 min-h-[600px]">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">רשימת מוזמנים</h2>
              <p className="text-gray-400 text-sm">ניהול כל המוזמנים והסטטוס שלהם</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1">
                 <Search className="absolute left-3 top-3 text-gray-500" size={16} />
                 <input 
                   type="text" 
                   value={guestSearch}
                   onChange={e => setGuestSearch(e.target.value)}
                   placeholder="חיפוש אורח..." 
                   className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-cyber-accent outline-none" 
                 />
               </div>
            </div>
          </div>

          {/* Add Guest Form */}
          <div className="bg-white/5 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-3 items-end border border-white/10">
             <div className="flex-1 w-full">
               <label className="text-xs text-gray-400 mb-1 block">שם המשפחה/אורח</label>
               <input 
                 type="text" 
                 value={newGuestName}
                 onChange={e => setNewGuestName(e.target.value)}
                 className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyber-accent"
                 placeholder="למשל: משפחת כהן"
               />
             </div>
             <div className="w-full md:w-32">
               <label className="text-xs text-gray-400 mb-1 block">כמות מוזמנים</label>
               <input 
                 type="number" 
                 value={newGuestInvitedCount}
                 onChange={e => setNewGuestInvitedCount(Number(e.target.value))}
                 className="w-full bg-black/30 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyber-accent"
                 min="1" max="15"
               />
             </div>
             <button onClick={handleAddGuest} className="w-full md:w-auto bg-cyber-accent hover:bg-cyber-neon text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2">
               <Plus size={18} /> הוסף לרשימה
             </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="text-gray-500 text-xs uppercase font-bold border-b border-white/10 bg-white/5">
                <tr>
                  <th className="p-4 rounded-tr-xl">שם</th>
                  <th className="p-4">הוזמנו</th>
                  <th className="p-4">הרכב אורחים</th>
                  <th className="p-4">סטטוס</th>
                  <th className="p-4 rounded-tl-xl">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {guests.filter(g => g.name.includes(guestSearch)).map(g => (
                  <tr key={g.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-white">{g.name}</td>
                    <td className="p-4">{g.invitedCount}</td>
                    <td className="p-4">
                      {g.guestsCount > 0 ? (
                        <div className="flex gap-3 text-xs">
                          {g.adultsCount > 0 && <span className="flex items-center gap-1 text-gray-300"><User size={12}/> {g.adultsCount}</span>}
                          {g.childrenCount > 0 && <span className="flex items-center gap-1 text-gray-300"><Gamepad2 size={12}/> {g.childrenCount}</span>}
                          {g.babiesCount > 0 && <span className="flex items-center gap-1 text-gray-300"><Baby size={12}/> {g.babiesCount}</span>}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      {g.attending === true && <span className="text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">מגיע ({g.guestsCount})</span>}
                      {g.attending === false && <span className="text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20">לא מגיע</span>}
                      {g.attending === null && <span className="text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10">טרם השיב</span>}
                    </td>
                    <td className="p-4">
                       <button onClick={() => handleDeleteGuest(g.id)} className="text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
                {guests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">עדיין אין מוזמנים. הוסף את האורח הראשון!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SEATING MODULE --- */}
      {activeModule === 'seating' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[700px]">
          {/* Sidebar: Unassigned Guests */}
          <div className="lg:col-span-1 glass-panel rounded-[2rem] p-5 flex flex-col max-h-[700px]">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <UserPlus size={18} className="text-cyber-accent" />
              אורחים לשיבוץ
            </h3>
            <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
              {guests.filter(g => g.attending && !g.tableId).length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">אין אורחים מאושרים שממתינים לשיבוץ</div>
              )}
              {guests.filter(g => g.attending && !g.tableId).map(g => (
                <div 
                  key={g.id} 
                  draggable
                  onDragStart={() => setDraggedGuestId(g.id)}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 text-sm flex justify-between items-center cursor-grab active:cursor-grabbing hover:bg-white/10 hover:border-cyber-accent/50 transition-all"
                >
                  <span className="font-medium text-white">{g.name}</span>
                  <span className="bg-cyber-accent text-white px-2 py-0.5 rounded-full text-xs font-bold">{g.guestsCount}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10">
               {!isAddingTable ? (
                 <button onClick={() => setIsAddingTable(true)} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 flex items-center justify-center gap-2 text-sm font-bold">
                   <Plus size={16} /> הוסף שולחן חדש
                 </button>
               ) : (
                 <div className="bg-white/5 p-3 rounded-xl border border-white/10 animate-in fade-in zoom-in duration-200">
                    <input autoFocus value={newTableName} onChange={e => setNewTableName(e.target.value)} placeholder="שם השולחן (למשל: חברים)" className="w-full bg-black/30 p-2 rounded text-sm text-white border border-white/10 mb-2" />
                    <div className="flex gap-2 mb-2">
                      <button onClick={() => setNewTableType('round')} className={`flex-1 py-1 text-xs rounded border ${newTableType === 'round' ? 'bg-cyber-accent border-cyber-accent text-white' : 'border-white/10 text-gray-400'}`}>עגול (משפחה)</button>
                      <button onClick={() => setNewTableType('long')} className={`flex-1 py-1 text-xs rounded border ${newTableType === 'long' ? 'bg-cyber-accent border-cyber-accent text-white' : 'border-white/10 text-gray-400'}`}>אביר (חברים)</button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setIsAddingTable(false)} className="flex-1 py-1 text-xs bg-red-500/20 text-red-300 rounded hover:bg-red-500/30">ביטול</button>
                      <button onClick={handleAddTable} className="flex-1 py-1 text-xs bg-green-500/20 text-green-300 rounded hover:bg-green-500/30">שמור</button>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Main Layout Area */}
          <div className="lg:col-span-3 glass-panel rounded-[2rem] p-6 relative bg-[#1a1a2e] border-2 border-white/5 overflow-y-auto">
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
             <h2 className="text-xl font-bold text-white mb-6 relative z-10 flex items-center gap-2"><LayoutGrid /> מפת האולם</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {tables.map(table => {
                  const assignedGuests = guests.filter(g => g.tableId === table.id);
                  const currentCount = assignedGuests.reduce((acc, g) => acc + g.guestsCount, 0);
                  const isFull = currentCount >= table.capacity;
                  const isEditing = editingTableId === table.id && editTableForm;

                  return (
                    <div 
                      key={table.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => draggedGuestId && handleAssignGuest(draggedGuestId, table.id)}
                      className={`relative group transition-all duration-300 ${table.type === 'round' ? 'rounded-full aspect-square flex flex-col items-center justify-center p-4' : 'rounded-xl aspect-[2/1] p-4'} 
                      ${isFull ? 'bg-red-900/20 border-red-500/30' : 'bg-white/5 border-white/10 hover:border-cyber-accent/50'} border-2`}
                    >
                       {isEditing ? (
                           <div className="flex flex-col gap-2 w-full h-full justify-center items-center z-20 relative p-2" onClick={e => e.stopPropagation()}>
                               <input 
                                 value={editTableForm.name} 
                                 onChange={e => setEditTableForm({...editTableForm, name: e.target.value})}
                                 className="bg-black/40 border border-white/20 rounded px-2 py-1 text-white text-center w-full text-sm outline-none focus:border-cyber-accent"
                                 autoFocus
                               />
                               <div className="flex gap-2 w-full">
                                   <div className="flex-1">
                                       <input 
                                         type="number"
                                         value={editTableForm.capacity}
                                         onChange={e => setEditTableForm({...editTableForm, capacity: Number(e.target.value)})}
                                         className="bg-black/40 border border-white/20 rounded px-1 py-1 text-white text-center w-full text-xs outline-none focus:border-cyber-accent"
                                       />
                                   </div>
                                   <div className="flex-1">
                                       <select 
                                         value={editTableForm.type}
                                         onChange={e => setEditTableForm({...editTableForm, type: e.target.value as any})}
                                         className="bg-black/40 border border-white/20 rounded px-1 py-1 text-white text-center w-full text-xs outline-none focus:border-cyber-accent appearance-none"
                                       >
                                           <option value="round" className="text-black">עגול</option>
                                           <option value="long" className="text-black">אביר</option>
                                       </select>
                                   </div>
                               </div>
                               <div className="flex gap-2 mt-1 w-full">
                                   <button onClick={handleSaveTable} className="flex-1 bg-green-500/20 text-green-400 py-1 rounded hover:bg-green-500/30 flex justify-center"><Check size={14}/></button>
                                   <button onClick={() => setEditingTableId(null)} className="flex-1 bg-red-500/20 text-red-400 py-1 rounded hover:bg-red-500/30 flex justify-center"><X size={14}/></button>
                               </div>
                           </div>
                       ) : (
                           <>
                               <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                                   <button onClick={(e) => { e.stopPropagation(); handleStartEditTable(table); }} className="p-1.5 bg-black/40 hover:bg-cyber-accent rounded-lg text-white backdrop-blur-md border border-white/10 transition-colors"><Edit3 size={12}/></button>
                                   <button onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.id); }} className="p-1.5 bg-black/40 hover:bg-red-500 rounded-lg text-white backdrop-blur-md border border-white/10 transition-colors"><Trash2 size={12}/></button>
                               </div>

                               <div className="text-center mb-2">
                                 <h3 className="font-bold text-white text-lg">{table.name}</h3>
                                 <p className="text-xs text-gray-400">{currentCount}/{table.capacity} מקומות</p>
                               </div>
                               
                               {/* Guests in table */}
                               <div className="flex flex-wrap gap-1 justify-center max-h-[60%] overflow-y-auto custom-scrollbar w-full">
                                 {assignedGuests.map(g => (
                                   <div key={g.id} className="text-[10px] bg-cyber-accent/20 text-cyber-accent px-2 py-0.5 rounded-full border border-cyber-accent/20 flex items-center gap-1 group/guest cursor-pointer" title={g.name}>
                                     {g.name.split(' ')[0]} 
                                     <button onClick={(e) => {e.stopPropagation(); handleAssignGuest(g.id, undefined);}} className="hover:text-white hidden group-hover/guest:inline"><X size={8}/></button>
                                   </div>
                                 ))}
                                 {assignedGuests.length === 0 && <span className="text-xs text-gray-600 italic">גרור אורחים לכאן</span>}
                               </div>
                           </>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      )}

      {/* --- BUDGET MODULE --- */}
      {activeModule === 'budget' && (
        <div className="max-w-4xl mx-auto">
           {/* Summary Cards */}
           <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:bg-white/10 transition-all duration-300">
                 <div>
                   <p className="text-gray-400 text-xs font-bold uppercase">סה"כ תקציב משוער</p>
                   <p className="text-2xl font-bold text-white">₪{totalBudgetEst.toLocaleString()}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><DollarSign /></div>
              </div>
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between hover:scale-[1.02] hover:bg-white/10 transition-all duration-300">
                 <div>
                   <p className="text-gray-400 text-xs font-bold uppercase">סה"כ שולם בפועל</p>
                   <p className="text-2xl font-bold text-white">₪{totalBudgetAct.toLocaleString()}</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><CheckSquare /></div>
              </div>
           </div>

           {/* Add Item */}
           <div className="glass-panel p-4 rounded-2xl mb-6 flex gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs text-gray-400 block mb-1">שם ההוצאה</label>
                <input value={newBudgetItem.category} onChange={e => setNewBudgetItem({...newBudgetItem, category: e.target.value})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none" placeholder="צלם, דיג'יי..." />
              </div>
              <div className="w-32">
                <label className="text-xs text-gray-400 block mb-1">סכום משוער</label>
                <input type="number" value={newBudgetItem.estimated || ''} onChange={e => setNewBudgetItem({...newBudgetItem, estimated: Number(e.target.value)})} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none" placeholder="0" />
              </div>
              <button onClick={handleAddBudgetItem} className="bg-cyber-accent text-white p-3 rounded-xl hover:bg-cyber-neon"><Plus /></button>
           </div>

           {/* Budget List */}
           <div className="space-y-4">
             {budgetItems.map(item => (
               <div key={item.id} className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-4 group hover:border-cyber-accent/30 hover:bg-white/5 hover:scale-[1.01] transition-all duration-300">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.paid ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                    {item.paid ? <CheckSquare size={20} /> : <DollarSign size={20} />}
                  </div>
                  
                  <div className="flex-1 w-full text-center md:text-right">
                    <h4 className="font-bold text-white text-lg">{item.category}</h4>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">משוער</span>
                        <span className="text-gray-300">₪{item.estimated.toLocaleString()}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-bold">בפועל</span>
                        <input 
                           type="number" 
                           value={item.actual} 
                           onChange={(e) => handleUpdateBudget(item.id, 'actual', Number(e.target.value))}
                           className="w-24 bg-black/20 border border-white/10 rounded p-1 text-white text-sm focus:border-cyber-accent outline-none"
                        />
                     </div>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto justify-end">
                    <button onClick={() => handleUpdateBudget(item.id, 'paid', !item.paid)} className={`p-2 rounded-lg text-xs font-bold border ${item.paid ? 'border-green-500/50 text-green-400' : 'border-white/10 text-gray-400 hover:text-white'}`}>
                      {item.paid ? 'שולם' : 'סמן כשולם'}
                    </button>
                    <button onClick={() => handleDeleteBudgetItem(item.id)} className="p-2 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={18} /></button>
                  </div>
               </div>
             ))}
             {budgetItems.length === 0 && <div className="text-center py-10 text-gray-500">רשימת התקציב ריקה.</div>}
           </div>
        </div>
      )}

      {/* --- MUSIC MODULE --- */}
      {activeModule === 'music' && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">בקשות שירים</h2>
              <p className="text-gray-400 text-sm">פלייליסט שנבנה ע"י האורחים בזמן אמת</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songRequests.map((song) => (
              <div key={song.id} className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 hover:scale-[1.01] transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    <Music size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight">{song.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">ביקש/ה: <span className="text-cyber-accent">{song.requestedBy}</span></p>
                  </div>
                </div>
                <button 
                  onClick={() => onDeleteSongRequest && onDeleteSongRequest(song.id)}
                  className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="מחק שיר"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {songRequests.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 glass-panel rounded-2xl border-dashed">
                <Music size={48} className="mx-auto mb-4 opacity-20" />
                <p>עדיין לא נשלחו בקשות שירים.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminView;