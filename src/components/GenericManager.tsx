import { useState } from 'react';
import { Plus, Trash2, Tag, Check, Edit2, X, Save } from 'lucide-react';

interface GenericItem {
    id: string;
    name: string;
    slug?: string;
    color?: string;
}

interface GenericManagerProps {
    items: GenericItem[];
    onAdd: (item: any) => void;
    onUpdate: (item: any) => void;
    onDelete: (id: string) => void;
    title: string;
    placeholder: string;
    type?: 'simple' | 'status';
}

export const GenericManager = ({ items, onAdd, onUpdate, onDelete, title, placeholder, type = 'simple' }: GenericManagerProps) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemColor, setNewItemColor] = useState('blue');

    // Edit State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editColor, setEditColor] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName) return;

        const newItem = {
            id: Date.now().toString(),
            name: newItemName,
            slug: newItemName.toLowerCase().replace(/ /g, '_'),
            ...(type === 'status' && { color: newItemColor })
        };

        onAdd(newItem);
        setNewItemName('');
    };

    const startEdit = (item: GenericItem) => {
        setEditingId(item.id);
        setEditName(item.name);
        if (item.color) setEditColor(item.color);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
        setEditColor('');
    };

    const saveEdit = (originalItem: GenericItem) => {
        const updatedItem = {
            ...originalItem,
            name: editName,
            slug: editName.toLowerCase().replace(/ /g, '_'), // Auto-update slug
            ...(type === 'status' && { color: editColor })
        };
        onUpdate(updatedItem);
        setEditingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-4">Adicionar {title}</h3>
                <form onSubmit={handleAdd} className="flex gap-4">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="input-field flex-1"
                    />
                    {type === 'status' && (
                        <select
                            value={newItemColor}
                            onChange={(e) => setNewItemColor(e.target.value)}
                            className="input-field w-32 bg-surface"
                        >
                            <option value="blue">Azul</option>
                            <option value="green">Verde</option>
                            <option value="red">Vermelho</option>
                            <option value="gray">Cinza</option>
                            <option value="yellow">Amarelo</option>
                        </select>
                    )}
                    <button type="submit" className="btn-primary whitespace-nowrap">
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <div key={item.id} className="glass-card p-4 rounded-xl flex justify-between items-center group">
                        {editingId === item.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                                <input
                                    className="input-field py-1 px-2 text-sm flex-1"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                                {type === 'status' && (
                                    <select
                                        value={editColor}
                                        onChange={(e) => setEditColor(e.target.value)}
                                        className="input-field py-1 px-2 text-sm w-24 bg-surface"
                                    >
                                        <option value="blue">Azul</option>
                                        <option value="green">Verde</option>
                                        <option value="red">Vermelho</option>
                                        <option value="gray">Cinza</option>
                                        <option value="yellow">Amarelo</option>
                                    </select>
                                )}
                                <button onClick={() => saveEdit(item)} className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-lg">
                                    <Save className="w-4 h-4" />
                                </button>
                                <button onClick={cancelEdit} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${type === 'status' ? `bg-${item.color}-500/10 text-${item.color}-500` : 'bg-blue-600/10 text-blue-400'}`}>
                                        {type === 'status' ? <Check className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <span className="font-bold text-white block">{item.name}</span>
                                        {type === 'status' && <span className="text-xs text-gray-400">Slug: {item.slug}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => startEdit(item)}
                                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(item.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
